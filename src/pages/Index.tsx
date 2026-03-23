import { useMemo, useState, useEffect, type CSSProperties } from 'react';
import { useSeoMeta } from '@unhead/react';
import {
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  BrainCircuit,
  Building2,
  Crown,
  Flame,
  Gauge,
  Orbit,
  Rocket,
  Sparkles,
  Target,
  TimerReset,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Users,
} from 'lucide-react';
import { generateSecretKey, getPublicKey, nip19 } from 'nostr-tools';

import {
  COMPANIES,
  MARKET_EVENTS,
  RAISE_EVENTS,
  INVESTOR_PITCHES,
  sectorAccent,
  type Sector,
  type Company,
  type MarketEvent,
  type Investment,
  type Decision,
  type Momentum,
  type InvestorPitch,
} from '@/lib/gameData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const GAME_BACKGROUND = 'https://blossom.ditto.pub/73fd8d04b15e0bbf4e90058ddd375f00ba57c61ef815fd4cb92b0eb7c8e1b1ce.jpeg';
const INITIAL_CAPITAL = 95;
const INITIAL_FUND_SIZE = 95;
const INITIAL_REPUTATION = 50;
const TOTAL_ROUNDS = 64;
const PHASE_LENGTH = 8;
const INVESTMENT_OPTIONS = [5, 10, 20] as const;
const DEPLOYABLE_RAISE_SHARE = 0.4;
const BASE_QUARTERLY_BURN = 2.2;

const NIP5_REGEX = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

type RankedOutcome = {
  title: string;
  description: string;
  accent: string;
};

type GamePhase = 'allocating' | 'raising';
type GameMode = 'intro' | 'playing' | 'gameover';

type RaiseAttempt = {
  pitchId: string;
  amount: number;
  success: boolean;
  quarter: number;
  note: string;
  conviction: number;
};

type PortfolioMark = Investment & {
  company: Company;
  multiple: number;
  currentValue: number;
  gain: number;
};

type ScoreBreakdown = {
  alphaScore: number;
  valueComponent: number;
  winnerComponent: number;
  reputationComponent: number;
  raiseComponent: number;
  disciplineComponent: number;
  riskComponent: number;
};

type SectorPerformance = {
  sector: Sector;
  checks: number;
  invested: number;
  currentValue: number;
  gain: number;
};

type PopupTone = 'good' | 'bad' | 'neutral' | 'report';

type GamePopup = {
  id: string;
  tone: PopupTone;
  title: string;
  description: string;
};

type PlayerIdentity = {
  kind: 'nip5' | 'npub';
  value: string;
  label: string;
};

type LeaderboardEntry = {
  runId: string;
  playerLabel: string;
  identity: string;
  alphaScore: number;
  fundValue: number;
  winners: number;
  reputation: number;
  createdAt: number;
  outcome: string;
};

const createInitialMomentum = (): Momentum => ({
  AI: 0,
  Infrastructure: 0,
  Energy: 0,
  Security: 0,
  Fintech: 0,
  Robotics: 0,
  Climate: 0,
  Biotech: 0,
  global: 0,
});

const shuffle = <T,>(items: readonly T[]): T[] => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const formatMoney = (value: number) => `$${value.toFixed(value >= 100 ? 0 : 1)}M`;
const metricWidth = (value: number): CSSProperties => ({ width: `${clamp(value, 0, 100)}%` });

const getFitScore = (company: Company): number => {
  const weighted = company.team * 0.33 + company.product * 0.32 + company.market * 0.31 - company.risk * 0.2;
  return Math.round(clamp(weighted + company.thesis.length * 3.4 - 10, 0, 100));
};

const getMomentumLabel = (value: number) => {
  if (value >= 0.8) return 'Overheated';
  if (value >= 0.35) return 'Ripping';
  if (value <= -0.8) return 'Frozen';
  if (value <= -0.35) return 'Under pressure';
  return 'Balanced';
};

const getRankedOutcome = (score: number): RankedOutcome => {
  if (score >= 1200) {
    return {
      title: 'Generational Allocator',
      description: 'You found signal before the market could price it in.',
      accent: 'from-amber-300 via-orange-400 to-rose-500',
    };
  }

  if (score >= 980) {
    return {
      title: 'Elite Investor',
      description: 'You built a sharp book and let winners carry the fund.',
      accent: 'from-cyan-300 via-sky-400 to-blue-500',
    };
  }

  if (score >= 760) {
    return {
      title: 'Disciplined Operator',
      description: 'Not every bet hit, but your process held up.',
      accent: 'from-emerald-300 via-teal-400 to-cyan-500',
    };
  }

  if (score >= 560) {
    return {
      title: 'Promising Associate',
      description: 'You saw some truth and chased some noise.',
      accent: 'from-violet-300 via-fuchsia-400 to-rose-500',
    };
  }

  return {
    title: 'Tourist Capital',
    description: 'You got punished for loose sizing and weak selectivity.',
    accent: 'from-slate-300 via-slate-400 to-slate-500',
  };
};

const buildCompanyMap = (deck: Company[]) =>
  deck.reduce<Record<string, Company>>((accumulator, company) => {
    accumulator[company.id] = company;
    return accumulator;
  }, {});

const getCurrentMultiple = (investment: Investment, company: Company, momentum: Momentum, currentRound: number, reputation: number) => {
  const holdingPeriods = currentRound - investment.investedRound + 1;
  const holdingBoost = holdingPeriods * 0.13;
  const qualityBoost = (company.hiddenQuality - 70) / 21;
  const fitBoost = (investment.fitScore - 58) / 68;
  const riskPenalty = (company.risk - 42) / 29;
  const sectorLift = momentum[company.sector] * 0.55;
  const macroLift = momentum.global * 0.42;
  const reputationLift = (reputation - 50) / 170;
  const volatilitySwing = company.volatility * (momentum[company.sector] * 0.06 + momentum.global * 0.05);

  return clamp(
    0.22 + holdingBoost + qualityBoost + fitBoost - riskPenalty + sectorLift + macroLift + reputationLift + volatilitySwing,
    0.12,
    5.4,
  );
};

const isValidNip5 = (value: string) => NIP5_REGEX.test(value.trim());

const generateNpub = () => {
  const secret = generateSecretKey();
  const pubkey = getPublicKey(secret);
  return nip19.npubEncode(pubkey);
};

const StatBlock = ({ label, value, hint, className = '' }: { label: string; value: string; hint: string; className?: string }) => (
  <div className={`game-panel game-card-hover px-4 py-4 ${className}`}>
    <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">{label}</p>
    <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    <p className="mt-1 text-sm text-white/55">{hint}</p>
  </div>
);

const MetricBar = ({
  label,
  value,
  tone = 'good',
  showPercent = false,
}: {
  label: string;
  value: number;
  tone?: 'good' | 'warn' | 'hot';
  showPercent?: boolean;
}) => {
  const barClass =
    tone === 'warn'
      ? 'from-amber-300 via-orange-400 to-rose-500'
      : tone === 'hot'
        ? 'from-fuchsia-300 via-violet-400 to-cyan-400'
        : 'from-emerald-300 via-cyan-400 to-sky-500';

  const clamped = clamp(value, 0, 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-white/70">
        <span>{label}</span>
        <span className="font-medium text-white">{showPercent ? `${Math.round(clamped)}%` : Math.round(clamped)}</span>
      </div>
      <div className="h-2 rounded-full bg-white/8">
        <div className={`h-full rounded-full bg-gradient-to-r anim-bar-fill ${barClass}`} style={metricWidth(clamped)} />
      </div>
    </div>
  );
};

const renderGlobalFooter = (copy: string) => (
  <footer className="mt-4 flex flex-col gap-3 border-t border-white/10 px-1 pt-5 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
    <p>{copy}</p>
    <a href="https://shakespeare.diy" target="_blank" rel="noreferrer" className="transition hover:text-white/70">
      Vibed with Shakespeare
    </a>
  </footer>
);

const Index = () => {
  useSeoMeta({
    title: 'TEN31 | THE GAME',
    description: 'A playable investor simulation where you build a portfolio of the next great companies.',
  });

  const [seed, setSeed] = useState(() => Date.now());
  const [mode, setMode] = useState<GameMode>('intro');
  const [round, setRound] = useState(0);
  const [cash, setCash] = useState(INITIAL_CAPITAL);
  const [fundSize, setFundSize] = useState(INITIAL_FUND_SIZE);
  const [reputation, setReputation] = useState(INITIAL_REPUTATION);
  const [portfolio, setPortfolio] = useState<Investment[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [eventLog, setEventLog] = useState<MarketEvent[]>([]);
  const [raiseAttempts, setRaiseAttempts] = useState<RaiseAttempt[]>([]);
  const [momentum, setMomentum] = useState<Momentum>(createInitialMomentum);

  const [playerIdentity, setPlayerIdentity] = useLocalStorage<PlayerIdentity | null>('ten31:player-identity', null);
  const [leaderboard, setLeaderboard] = useLocalStorage<LeaderboardEntry[]>('ten31:game-leaderboard', []);
  const [identityInput, setIdentityInput] = useState('');
  const [identityError, setIdentityError] = useState('');

  const [activePopup, setActivePopup] = useState<GamePopup | null>(null);
  const [runId, setRunId] = useState(() => `run-${Date.now()}`);
  const [scoreLogged, setScoreLogged] = useState(false);

  const totalPhases = TOTAL_ROUNDS / PHASE_LENGTH;
  const currentPhase = Math.floor(round / PHASE_LENGTH);
  const currentPhaseRound = round % PHASE_LENGTH;
  const isAllocatingPhase = currentPhase % 2 === 0;
  const currentGamePhase: GamePhase = isAllocatingPhase ? 'allocating' : 'raising';
  const gameOver = round >= TOTAL_ROUNDS;

  const allocationTimeline = useMemo(() => {
    const allocationPhases = TOTAL_ROUNDS / (PHASE_LENGTH * 2);
    const timeline: Company[] = [];
    for (let phase = 0; phase < allocationPhases; phase += 1) {
      timeline.push(...shuffle(COMPANIES).slice(0, PHASE_LENGTH));
    }
    return timeline;
  }, [seed]);

  const companyMap = useMemo(() => buildCompanyMap(COMPANIES), []);
  const marketEvents = useMemo(() => shuffle(MARKET_EVENTS), [seed]);
  const raiseEvents = useMemo(() => shuffle(RAISE_EVENTS), [seed]);
  const investorPitches = useMemo(() => shuffle(INVESTOR_PITCHES), [seed]);

  const allocationRoundIndex = useMemo(() => {
    if (!isAllocatingPhase || gameOver) return -1;
    const completedAllocationPhases = Math.floor(currentPhase / 2);
    return completedAllocationPhases * PHASE_LENGTH + currentPhaseRound;
  }, [currentPhase, currentPhaseRound, gameOver, isAllocatingPhase]);

  const currentCompany = useMemo(() => {
    if (allocationRoundIndex < 0) return null;
    return allocationTimeline[allocationRoundIndex % allocationTimeline.length] ?? null;
  }, [allocationRoundIndex, allocationTimeline]);

  const raisingRoundIndex = useMemo(() => {
    if (isAllocatingPhase || gameOver) return -1;
    const completedRaisingPhases = Math.floor(currentPhase / 2);
    return completedRaisingPhases * PHASE_LENGTH + currentPhaseRound;
  }, [currentPhase, currentPhaseRound, gameOver, isAllocatingPhase]);

  const currentRaiseEvent = useMemo(() => {
    if (raisingRoundIndex < 0) return null;
    const eventIndex = Math.floor(raisingRoundIndex / 2);
    return raiseEvents[eventIndex % raiseEvents.length] ?? null;
  }, [raisingRoundIndex, raiseEvents]);

  const availablePitches = useMemo(() => {
    if (!currentRaiseEvent) return [];

    const phaseStart = currentPhase * PHASE_LENGTH;
    const usedThisPhase = new Set(
      raiseAttempts
        .filter((attempt) => attempt.quarter >= phaseStart && attempt.quarter < phaseStart + PHASE_LENGTH)
        .map((attempt) => attempt.pitchId),
    );

    const pitchCount = clamp(Math.round(currentRaiseEvent.investorPool / 4), 2, 4);
    return investorPitches.filter((pitch) => !usedThisPhase.has(pitch.id)).slice(0, pitchCount);
  }, [currentRaiseEvent, currentPhase, raiseAttempts, investorPitches]);

  const latestEvent = eventLog[0];
  const latestDecision = decisions[0];

  const totalRaised = useMemo(
    () => raiseAttempts.reduce((sum, attempt) => sum + (attempt.success ? attempt.amount : 0), 0),
    [raiseAttempts],
  );

  const portfolioMarks = useMemo<PortfolioMark[]>(() => {
    return portfolio
      .map((investment) => {
        const company = companyMap[investment.companyId];
        if (!company) return null;

        const multiple = getCurrentMultiple(investment, company, momentum, Math.max(round, 1), reputation);
        const currentValue = investment.amount * multiple;

        return {
          ...investment,
          company,
          multiple,
          currentValue,
          gain: currentValue - investment.amount,
        };
      })
      .filter((item): item is PortfolioMark => item !== null)
      .sort((left, right) => right.currentValue - left.currentValue);
  }, [companyMap, momentum, portfolio, reputation, round]);

  const totalValue = useMemo(() => {
    const portfolioValue = portfolioMarks.reduce((sum, investment) => sum + investment.currentValue, 0);
    return cash + portfolioValue;
  }, [cash, portfolioMarks]);

  const winners = portfolioMarks.filter((investment) => investment.multiple >= 2).length;

  const decisionInsights = useMemo(() => {
    const invested = decisions.filter((decision) => decision.choice === 'invest');
    const passed = decisions.filter((decision) => decision.choice === 'pass');

    let disciplinedPasses = 0;
    let expensiveMisses = 0;
    let overheatedBets = 0;

    for (const decision of passed) {
      const company = companyMap[decision.companyId];
      if (!company) continue;
      if (company.hiddenQuality <= 72) disciplinedPasses += 1;
      if (company.hiddenQuality >= 88) expensiveMisses += 1;
    }

    for (const decision of invested) {
      const company = companyMap[decision.companyId];
      if (!company) continue;
      if ((decision.amount ?? 0) >= 20 && company.risk >= 70) overheatedBets += 1;
    }

    const highConvictionHits = portfolioMarks.filter((investment) => investment.fitScore >= 80 && investment.multiple >= 1.5).length;

    return {
      invested: invested.length,
      passed: passed.length,
      disciplinedPasses,
      expensiveMisses,
      overheatedBets,
      highConvictionHits,
    };
  }, [companyMap, decisions, portfolioMarks]);

  const scoreBreakdown = useMemo<ScoreBreakdown>(() => {
    const valueComponent = Math.round((totalValue - INITIAL_CAPITAL) * 10);
    const winnerComponent = winners * 30;
    const reputationComponent = reputation * 4;
    const raiseComponent = Math.round(totalRaised * 2);
    const disciplineComponent = decisionInsights.disciplinedPasses * 10 - decisionInsights.expensiveMisses * 20;
    const riskComponent = Math.max(0, 35 - decisionInsights.overheatedBets * 10);

    return {
      alphaScore: valueComponent + winnerComponent + reputationComponent + raiseComponent + disciplineComponent + riskComponent,
      valueComponent,
      winnerComponent,
      reputationComponent,
      raiseComponent,
      disciplineComponent,
      riskComponent,
    };
  }, [decisionInsights, reputation, totalRaised, totalValue, winners]);

  const rankedOutcome = getRankedOutcome(scoreBreakdown.alphaScore);

  const sectorPerformance = useMemo<SectorPerformance[]>(() => {
    const base: Record<Sector, SectorPerformance> = {
      AI: { sector: 'AI', checks: 0, invested: 0, currentValue: 0, gain: 0 },
      Infrastructure: { sector: 'Infrastructure', checks: 0, invested: 0, currentValue: 0, gain: 0 },
      Energy: { sector: 'Energy', checks: 0, invested: 0, currentValue: 0, gain: 0 },
      Security: { sector: 'Security', checks: 0, invested: 0, currentValue: 0, gain: 0 },
      Fintech: { sector: 'Fintech', checks: 0, invested: 0, currentValue: 0, gain: 0 },
      Robotics: { sector: 'Robotics', checks: 0, invested: 0, currentValue: 0, gain: 0 },
      Climate: { sector: 'Climate', checks: 0, invested: 0, currentValue: 0, gain: 0 },
      Biotech: { sector: 'Biotech', checks: 0, invested: 0, currentValue: 0, gain: 0 },
    };

    for (const mark of portfolioMarks) {
      const bucket = base[mark.company.sector];
      bucket.checks += 1;
      bucket.invested += mark.amount;
      bucket.currentValue += mark.currentValue;
      bucket.gain += mark.gain;
    }

    return Object.values(base)
      .filter((entry) => entry.checks > 0)
      .sort((left, right) => right.currentValue - left.currentValue);
  }, [portfolioMarks]);

  const bestDeal = portfolioMarks[0];

  const biggestMiss = useMemo(() => {
    return decisions
      .filter((decision) => decision.choice === 'pass')
      .map((decision) => companyMap[decision.companyId])
      .filter((company): company is Company => Boolean(company))
      .sort((left, right) => right.hiddenQuality - left.hiddenQuality)[0];
  }, [companyMap, decisions]);

  const globalProgress = clamp((round / TOTAL_ROUNDS) * 100, 0, 100);
  const phaseProgress = clamp(((currentPhaseRound + (mode === 'playing' ? 1 : 0)) / PHASE_LENGTH) * 100, 0, 100);
  const currentFit = currentCompany ? getFitScore(currentCompany) : 0;

  const expectedValue = INITIAL_CAPITAL + round * 1.25;
  const reportDelta = totalValue - expectedValue;
  const reportStatus = reportDelta >= 12 ? 'Ahead of plan' : reportDelta >= -4 ? 'On plan' : 'Behind plan';

  const openPopup = (tone: PopupTone, title: string, description: string) => {
    setActivePopup({
      id: `${Date.now()}-${Math.random()}`,
      tone,
      title,
      description,
    });
  };

  const applyQuarterlyDrag = (cashBefore: number, reputationBefore: number) => {
    const phaseTax = round >= 48 ? 1.2 : round >= 32 ? 0.8 : round >= 16 ? 0.4 : 0;
    const burn = BASE_QUARTERLY_BURN + phaseTax;
    const cashAfterBurn = clamp(cashBefore - burn, 0, 9999);
    const repPenalty = cashBefore < burn ? 2 : 0;
    const reputationAfterBurn = clamp(reputationBefore - repPenalty, 20, 99);

    return {
      burn,
      cashAfterBurn,
      reputationAfterBurn,
    };
  };

  const resetGame = () => {
    setSeed(Date.now());
    setMode('intro');
    setRound(0);
    setCash(INITIAL_CAPITAL);
    setFundSize(INITIAL_FUND_SIZE);
    setReputation(INITIAL_REPUTATION);
    setPortfolio([]);
    setDecisions([]);
    setEventLog([]);
    setRaiseAttempts([]);
    setMomentum(createInitialMomentum());
    setRunId(`run-${Date.now()}`);
    setScoreLogged(false);
    setActivePopup(null);
  };

  const startGame = () => {
    if (!playerIdentity) {
      setIdentityError('Add your Nostr identity first (NIP-05 or generated npub).');
      return;
    }

    setIdentityError('');
    setSeed(Date.now());
    setMode('playing');
    setRound(0);
    setCash(INITIAL_CAPITAL);
    setFundSize(INITIAL_FUND_SIZE);
    setReputation(INITIAL_REPUTATION);
    setPortfolio([]);
    setDecisions([]);
    setEventLog([]);
    setRaiseAttempts([]);
    setMomentum(createInitialMomentum());
    setRunId(`run-${Date.now()}`);
    setScoreLogged(false);
    setActivePopup({
      id: `welcome-${Date.now()}`,
      tone: 'neutral',
      title: 'Run started',
      description: `Good luck ${playerIdentity.label}. This build is tuned harder: tighter margins, heavier penalties, tougher LP closes.`,
    });
  };

  const handleUseNip5 = () => {
    const value = identityInput.trim();
    if (!isValidNip5(value)) {
      setIdentityError('Enter a valid NIP-05, like name@domain.com');
      return;
    }

    setPlayerIdentity({
      kind: 'nip5',
      value,
      label: value,
    });

    setIdentityError('');
    setIdentityInput('');
  };

  const handleGenerateNpub = () => {
    const npub = generateNpub();
    const short = `${npub.slice(0, 12)}...${npub.slice(-8)}`;

    setPlayerIdentity({
      kind: 'npub',
      value: npub,
      label: short,
    });

    setIdentityError('');
  };

  const clearIdentity = () => {
    setPlayerIdentity(null);
    setIdentityError('');
  };

  const handleDecision = (amount: number | null) => {
    if (!currentCompany || gameOver || !isAllocatingPhase) return;

    const fitScore = getFitScore(currentCompany);
    let nextCash = cash;
    let nextReputation = reputation;
    let note = 'You stayed patient and protected dry powder for a better setup.';
    let popupTone: PopupTone = 'neutral';
    let popupTitle = 'Decision logged';

    if (amount !== null) {
      if (amount > cash) return;

      const sectorCount = portfolio.filter((position) => companyMap[position.companyId]?.sector === currentCompany.sector).length;
      const concentrationPenalty = sectorCount >= 2 ? 4 : sectorCount >= 1 ? 2 : 0;
      const stagePenalty = currentCompany.stage === 'Pre-seed' && amount >= 10 ? 2 : 0;
      const riskPenalty = currentCompany.risk >= 70 && amount >= 10 ? 2 : 0;

      nextCash -= amount;
      const repDelta = fitScore >= 88 ? 3 : fitScore >= 76 ? 1 : fitScore >= 64 ? -1 : -4;
      nextReputation += repDelta - concentrationPenalty - stagePenalty - riskPenalty;

      setPortfolio((current) => [
        ...current,
        {
          companyId: currentCompany.id,
          amount,
          investedRound: round,
          fitScore,
        },
      ]);

      if (fitScore >= 84) {
        note = `You wrote ${formatMoney(amount)} into a high-conviction position with strong signal integrity.`;
        popupTone = 'good';
        popupTitle = 'Great allocation';
      } else if (fitScore >= 68) {
        note = `You sized at ${formatMoney(amount)} with mixed signal. This position needs execution to justify the risk.`;
        popupTone = 'neutral';
        popupTitle = 'Calculated bet';
      } else {
        note = `You deployed ${formatMoney(amount)} into weak-fit risk. This could become an expensive lesson.`;
        popupTone = 'bad';
        popupTitle = 'Risky allocation';
      }
    } else {
      nextReputation += currentCompany.hiddenQuality >= 90 ? -4 : currentCompany.hiddenQuality <= 68 ? 2 : 0;

      if (currentCompany.hiddenQuality >= 90) {
        note = 'You passed on a potentially elite company. Caution may have cost major upside.';
        popupTone = 'bad';
        popupTitle = 'Painful miss risk';
      } else {
        note = 'You passed and kept discipline. Capital preservation can be alpha.';
        popupTone = 'good';
        popupTitle = 'Disciplined pass';
      }
    }

    const nextEvent = marketEvents[allocationRoundIndex % marketEvents.length];

    const updatedMomentum: Momentum = {
      ...momentum,
      global: clamp(momentum.global + nextEvent.globalShift, -1.5, 1.5),
      AI: clamp(momentum.AI + (nextEvent.sectorShift.AI ?? 0), -1.5, 1.5),
      Infrastructure: clamp(momentum.Infrastructure + (nextEvent.sectorShift.Infrastructure ?? 0), -1.5, 1.5),
      Energy: clamp(momentum.Energy + (nextEvent.sectorShift.Energy ?? 0), -1.5, 1.5),
      Security: clamp(momentum.Security + (nextEvent.sectorShift.Security ?? 0), -1.5, 1.5),
      Fintech: clamp(momentum.Fintech + (nextEvent.sectorShift.Fintech ?? 0), -1.5, 1.5),
      Robotics: clamp(momentum.Robotics + (nextEvent.sectorShift.Robotics ?? 0), -1.5, 1.5),
      Climate: clamp(momentum.Climate + (nextEvent.sectorShift.Climate ?? 0), -1.5, 1.5),
      Biotech: clamp(momentum.Biotech + (nextEvent.sectorShift.Biotech ?? 0), -1.5, 1.5),
    };

    const { burn, cashAfterBurn, reputationAfterBurn } = applyQuarterlyDrag(nextCash, nextReputation + nextEvent.reputationShift + (nextEvent.tone === 'bear' ? -1 : 0));

    setCash(cashAfterBurn);
    setReputation(reputationAfterBurn);

    setDecisions((current) => [
      {
        companyId: currentCompany.id,
        choice: amount === null ? 'pass' : 'invest',
        amount: amount ?? undefined,
        round,
        note,
      },
      ...current,
    ]);

    setEventLog((current) => [nextEvent, ...current]);
    setMomentum(updatedMomentum);

    openPopup(
      popupTone,
      popupTitle,
      `${note} Market event: ${nextEvent.title}. Quarterly burn: ${formatMoney(burn)}.`,
    );

    setRound((current) => current + 1);
  };

  const handleRaiseAttempt = (pitch: InvestorPitch, convictionLevel: number) => {
    if (!currentRaiseEvent || gameOver || isAllocatingPhase) return;

    const trackRecordBoost = clamp(Math.round((totalValue - INITIAL_CAPITAL) / 9), -12, 12);

    const convictionScore =
      reputation +
      convictionLevel * 7 +
      (currentRaiseEvent.tone === 'bull' ? 8 : currentRaiseEvent.tone === 'bear' ? -12 : 0) +
      trackRecordBoost;

    const riskPremium = pitch.riskLevel === 'aggressive' ? 8 : pitch.riskLevel === 'balanced' ? 4 : 0;
    const difficultyThreshold = pitch.convictionRequired + currentRaiseEvent.difficulty * 3 + riskPremium + 6;
    const success = convictionScore >= difficultyThreshold;

    let amount = 0;
    let note = '';
    let popupTone: PopupTone = success ? 'good' : 'bad';
    let popupTitle = success ? 'LP close' : 'LP rejection';
    let nextCash = cash;

    if (success) {
      const qualityMultiplier = 0.58 + convictionLevel * 0.1 + Math.random() * 0.24 + (reputation - 50) / 280;
      amount = Math.max(4, Math.round(pitch.potentialRaise * qualityMultiplier));

      const deployableCash = Math.round(amount * DEPLOYABLE_RAISE_SHARE);
      setFundSize((prev) => prev + amount);
      nextCash += deployableCash;

      note =
        convictionScore >= difficultyThreshold + 16
          ? `${pitch.title} committed ${formatMoney(amount)}. You unlocked ${formatMoney(deployableCash)} deployable.`
          : convictionScore >= difficultyThreshold + 7
            ? `${pitch.title} wrote ${formatMoney(amount)}. You gained ${formatMoney(deployableCash)} fresh dry powder.`
            : `${pitch.title} barely committed ${formatMoney(amount)}.`;
    } else {
      note = convictionScore < difficultyThreshold - 12 ? `${pitch.title} passed hard.` : `${pitch.title} deferred this quarter.`;
      popupTitle = 'Fundraising miss';
    }

    const repDelta = success ? (convictionLevel >= 3 ? 3 : 2) : convictionLevel >= 3 ? -5 : -3;
    const { burn, cashAfterBurn, reputationAfterBurn } = applyQuarterlyDrag(nextCash, reputation + repDelta);

    setCash(cashAfterBurn);
    setReputation(reputationAfterBurn);

    setRaiseAttempts((current) => [
      {
        pitchId: pitch.id,
        amount,
        success,
        quarter: round,
        note,
        conviction: convictionLevel,
      },
      ...current,
    ]);

    openPopup(
      popupTone,
      popupTitle,
      `${note} Quarterly burn: ${formatMoney(burn)}. Threshold ${difficultyThreshold} vs score ${convictionScore}.`,
    );

    setRound((current) => current + 1);
  };

  useEffect(() => {
    if (round >= TOTAL_ROUNDS && mode === 'playing') {
      setMode('gameover');
    }
  }, [round, mode]);

  useEffect(() => {
    if (!activePopup) return;

    const timeout = setTimeout(
      () => setActivePopup(null),
      activePopup.tone === 'report' ? 9000 : 6500,
    );

    return () => clearTimeout(timeout);
  }, [activePopup]);

  useEffect(() => {
    if (mode !== 'playing' || round === 0) return;

    if (round % 4 === 0) {
      openPopup(
        'report',
        `Quarterly report · Q${round}`,
        `Status: ${reportStatus}. Fund value ${formatMoney(totalValue)}, dry powder ${formatMoney(cash)}, winners ${winners}, reputation ${reputation}.`,
      );
    }
  }, [mode, round, reportStatus, totalValue, cash, winners, reputation]);

  useEffect(() => {
    if (mode !== 'playing') return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (currentGamePhase === 'allocating') {
        if (event.key === '1') {
          event.preventDefault();
          handleDecision(INVESTMENT_OPTIONS[0]);
        } else if (event.key === '2') {
          event.preventDefault();
          handleDecision(INVESTMENT_OPTIONS[1]);
        } else if (event.key === '3') {
          event.preventDefault();
          handleDecision(INVESTMENT_OPTIONS[2]);
        } else if (event.key.toLowerCase() === 'p' || event.key === '0') {
          event.preventDefault();
          handleDecision(null);
        }
      }

      if (currentGamePhase === 'raising' && availablePitches[0]) {
        if (event.key.toLowerCase() === 'q') {
          event.preventDefault();
          handleRaiseAttempt(availablePitches[0], 1);
        } else if (event.key.toLowerCase() === 'w') {
          event.preventDefault();
          handleRaiseAttempt(availablePitches[0], 2);
        } else if (event.key.toLowerCase() === 'e') {
          event.preventDefault();
          handleRaiseAttempt(availablePitches[0], 3);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, currentGamePhase, availablePitches, cash, reputation, round, totalValue]);

  useEffect(() => {
    if (mode !== 'gameover' || scoreLogged || !playerIdentity) return;

    const entry: LeaderboardEntry = {
      runId,
      playerLabel: playerIdentity.label,
      identity: playerIdentity.value,
      alphaScore: scoreBreakdown.alphaScore,
      fundValue: totalValue,
      winners,
      reputation,
      createdAt: Date.now(),
      outcome: rankedOutcome.title,
    };

    setLeaderboard((current) =>
      [...current, entry]
        .sort((left, right) => {
          if (right.alphaScore !== left.alphaScore) return right.alphaScore - left.alphaScore;
          return right.fundValue - left.fundValue;
        })
        .slice(0, 25),
    );

    setScoreLogged(true);
  }, [
    mode,
    scoreLogged,
    playerIdentity,
    runId,
    scoreBreakdown.alphaScore,
    totalValue,
    winners,
    reputation,
    rankedOutcome.title,
    setLeaderboard,
  ]);

  const renderDecisionFeed = () => (
    <div className="game-panel p-5 game-card-hover anim-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/40">Partnership log</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Recent decisions</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/55">
          {decisions.length} total
        </div>
      </div>

      {decisions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-white/50">
          No decisions yet. Your investment memo starts with the first move.
        </div>
      ) : (
        <div className="space-y-3">
          {decisions.slice(0, 5).map((decision, index) => {
            const company = companyMap[decision.companyId];
            return (
              <div key={`${decision.companyId}-${decision.round}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 anim-fade-in">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-white">{company?.name ?? 'Unknown company'}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/40">Quarter {decision.round + 1}</p>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${decision.choice === 'invest' ? 'bg-cyan-400/15 text-cyan-100' : 'bg-white/10 text-white/70'}`}>
                    {decision.choice === 'invest' ? `Invested ${formatMoney(decision.amount ?? 0)}` : 'Passed'}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/58">{decision.note}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderGlobalHud = () => {
    if (mode !== 'playing') return null;

    return (
      <header className="mb-4 phase-enter">
        <div className="game-panel overflow-hidden p-5 sm:p-6">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/70">TEN31 // Live run</p>
              <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {currentGamePhase === 'allocating' ? 'Allocation Phase' : 'Fundraising Phase'}
              </h1>
              <p className="mt-2 text-sm text-white/60">
                Quarter {round + 1} of {TOTAL_ROUNDS} · Phase {currentPhase + 1} of {totalPhases}
              </p>
              {playerIdentity && <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">Player: {playerIdentity.label}</p>}
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Fund value</p>
                <p className="mt-1 text-xl font-semibold text-white">{formatMoney(totalValue)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Dry powder</p>
                <p className="mt-1 text-xl font-semibold text-white">{formatMoney(cash)}</p>
              </div>
              <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/70">Reputation</p>
                <p className="mt-1 text-xl font-semibold text-cyan-100">{reputation}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Run report</p>
                <p className={`mt-1 text-xl font-semibold ${reportStatus === 'Ahead of plan' ? 'text-emerald-100' : reportStatus === 'On plan' ? 'text-cyan-100' : 'text-rose-100'}`}>
                  {reportStatus}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/45">
              <span>Global run progress</span>
              <span>{Math.round(globalProgress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-orange-300 progress-pulse" style={metricWidth(globalProgress)} />
            </div>

            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/45">
              <span>Current phase progress</span>
              <span>{Math.round(phaseProgress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${currentGamePhase === 'allocating' ? 'from-cyan-300 via-sky-300 to-blue-300' : 'from-orange-300 via-amber-300 to-rose-300'} progress-pulse`}
                style={metricWidth(phaseProgress)}
              />
            </div>
          </div>
        </div>
      </header>
    );
  };

  const renderIntro = () => (
    <main className="flex flex-1 flex-col justify-between gap-10">
      <section className="grid flex-1 items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-cyan-100 anim-fade-in">
            <Sparkles className="h-4 w-4" />
            TEN31 // THE GAME
          </div>

          <div className="space-y-5">
            <p className="max-w-xl text-sm uppercase tracking-[0.35em] text-white/45 anim-fade-in anim-delay-1">
              Hard mode economy. Thin margins. Expensive mistakes.
            </p>
            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] text-white sm:text-6xl lg:text-8xl anim-fade-in anim-delay-2">
              Build a fund
              <span className="bg-gradient-to-r from-cyan-200 via-white to-orange-300 bg-clip-text text-transparent"> quarter by quarter.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/68 sm:text-xl anim-fade-in anim-delay-3">
              This run is tougher: lower starting resources, higher operating drag, harder LP closes, and steeper penalties for weak-fit bets.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <StatBlock label="Starting fund" value={formatMoney(INITIAL_CAPITAL)} hint="Hard mode baseline." className="anim-fade-in anim-delay-4" />
            <StatBlock label="Quarterly drag" value={formatMoney(BASE_QUARTERLY_BURN)} hint="Burn rises over time." className="anim-fade-in anim-delay-5" />
            <StatBlock label="Raise unlock" value={`${Math.round(DEPLOYABLE_RAISE_SHARE * 100)}%`} hint="Deployable from LP closes." className="anim-fade-in anim-delay-6" />
            <StatBlock label="Objective" value="Top leaderboard" hint="Beat prior runs." className="anim-fade-in anim-delay-7" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="game-panel relative overflow-hidden p-6 sm:p-8 anim-scale-in">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-white/40">Identity required</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Link your Nostr identity</h2>
              </div>
              <Users className="h-8 w-8 text-cyan-200/70" />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Use existing NIP-05</p>
                <div className="mt-3 flex gap-2">
                  <input
                    value={identityInput}
                    onChange={(event) => setIdentityInput(event.target.value)}
                    placeholder="name@domain.com"
                    className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-cyan-300/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleUseNip5}
                    className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs uppercase tracking-[0.16em] text-cyan-100 transition hover:bg-cyan-300/20"
                  >
                    Use
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">No NIP-05? Generate an npub</p>
                <button
                  type="button"
                  onClick={handleGenerateNpub}
                  className="mt-3 w-full rounded-xl border border-orange-300/25 bg-orange-300/10 px-3 py-2 text-xs uppercase tracking-[0.16em] text-orange-100 transition hover:bg-orange-300/20"
                >
                  Generate npub
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Current identity</p>
                {playerIdentity ? (
                  <>
                    <p className="mt-2 break-all text-sm text-cyan-100">{playerIdentity.value}</p>
                    <div className="mt-3 flex gap-2">
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                        {playerIdentity.kind}
                      </span>
                      <button
                        type="button"
                        onClick={clearIdentity}
                        className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60 transition hover:bg-white/10"
                      >
                        Clear
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-white/55">No identity selected.</p>
                )}
              </div>

              {identityError && <p className="text-sm text-rose-200">{identityError}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={startGame}
              disabled={!playerIdentity}
              className="group inline-flex items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/15 px-7 py-4 text-sm font-medium uppercase tracking-[0.25em] text-cyan-50 transition hover:bg-cyan-300/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/35"
            >
              Start Fund I
              <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={resetGame}
              className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-7 py-4 text-sm font-medium uppercase tracking-[0.25em] text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Shuffle Scenario
            </button>
          </div>
        </div>
      </section>

      {renderGlobalFooter('Investor simulator for TEN31 Capital. Build a generational fund across market cycles.')}
    </main>
  );

  const renderAllocatingPhase = () => (
    <main className="grid flex-1 gap-4 xl:grid-cols-[1.3fr_0.7fr] phase-enter">
      <section className="space-y-4">
        {currentCompany && (
          <div className="game-panel overflow-hidden p-6 sm:p-8 game-card-hover">
            <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-4 py-2 text-xs uppercase tracking-[0.24em] ${sectorAccent[currentCompany.sector]}`}>
                  <Building2 className="h-4 w-4" />
                  {currentCompany.sector}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/35">Deal {currentPhaseRound + 1} of {PHASE_LENGTH}</p>
                  <h2 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">{currentCompany.name}</h2>
                  <p className="mt-3 max-w-3xl text-lg leading-relaxed text-white/72">{currentCompany.headline}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px] lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Round size</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{formatMoney(currentCompany.ask)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Entry valuation</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{formatMoney(currentCompany.valuation)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Stage</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{currentCompany.stage}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 game-card-hover">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">Founder memo</p>
                  <p className="mt-4 text-base leading-relaxed text-white/68">{currentCompany.summary}</p>
                </div>

                <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 game-card-hover">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-white/40">Traction</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/68">{currentCompany.traction}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-white/40">Edge</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/68">{currentCompany.edge}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-white/40">Watchout</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/68">{currentCompany.watchout}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 game-card-hover">
                    <div className="mb-4 flex items-center gap-2 text-cyan-100">
                      <BrainCircuit className="h-5 w-5" />
                      <p className="text-sm font-medium uppercase tracking-[0.2em]">Signal map</p>
                    </div>
                    <div className="space-y-4">
                      <MetricBar label="Team quality" value={currentCompany.team} />
                      <MetricBar label="Product depth" value={currentCompany.product} tone="hot" />
                      <MetricBar label="Market pull" value={currentCompany.market} />
                      <MetricBar label="Execution risk" value={currentCompany.risk} tone="warn" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 game-card-hover">
                    <div className="mb-4 flex items-center gap-2 text-orange-100">
                      <Gauge className="h-5 w-5" />
                      <p className="text-sm font-medium uppercase tracking-[0.2em]">Conviction</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">Thesis fit</p>
                      <p className="mt-2 text-4xl font-semibold text-white">{currentFit}</p>
                      <p className="mt-2 text-sm text-white/55">
                        {currentFit >= 84
                          ? 'Rare alignment. Strong signal and price discipline required.'
                          : currentFit >= 70
                            ? 'Playable setup, but sizing discipline is critical.'
                            : 'Weak fit. Treat this as capital at risk.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 game-card-hover">
                  <div className="mb-4 flex items-center gap-2 text-white">
                    <BadgeDollarSign className="h-5 w-5 text-emerald-200" />
                    <p className="text-sm font-medium uppercase tracking-[0.2em]">Make your move</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-4">
                    {INVESTMENT_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleDecision(option)}
                        disabled={cash < option}
                        className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-4 text-left transition hover:bg-cyan-300/18 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                      >
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Invest</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{formatMoney(option)}</p>
                        <p className="mt-2 text-xs text-cyan-100/70">Key {option === 5 ? '1' : option === 10 ? '2' : '3'}</p>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleDecision(null)}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left transition hover:bg-white/[0.08]"
                    >
                      <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Decision</p>
                      <p className="mt-2 text-2xl font-semibold text-white">Pass</p>
                      <p className="mt-2 text-xs text-white/55">Key P</p>
                    </button>
                  </div>
                  <p className="mt-4 text-sm text-white/50">This economy punishes sloppy sizing. Every quarter includes operating drag.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <aside className="space-y-4">
        <div className="game-panel p-5 game-card-hover anim-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/40">Live market</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Pulse board</h3>
            </div>
            <div className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${momentum.global >= 0 ? 'bg-emerald-400/15 text-emerald-100' : 'bg-rose-400/15 text-rose-100'}`}>
              {getMomentumLabel(momentum.global)}
            </div>
          </div>

          <div className={`rounded-3xl border p-5 ${latestEvent ? (latestEvent.tone === 'bull' ? 'border-emerald-300/20 bg-emerald-300/10' : latestEvent.tone === 'bear' ? 'border-rose-300/20 bg-rose-300/10' : 'border-white/10 bg-white/[0.04]') : 'border-white/10 bg-white/[0.04]'}`}>
            {latestEvent ? (
              <>
                <div className="flex items-center gap-3">
                  {latestEvent.tone === 'bull' ? <TrendingUp className="h-5 w-5 text-emerald-100" /> : latestEvent.tone === 'bear' ? <TrendingDown className="h-5 w-5 text-rose-100" /> : <Orbit className="h-5 w-5 text-white" />}
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-white">{latestEvent.title}</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/68">{latestEvent.description}</p>
              </>
            ) : (
              <p className="text-sm text-white/60">Market reaction appears after your first decision.</p>
            )}
          </div>
        </div>

        {renderDecisionFeed()}
      </aside>

      {renderGlobalFooter('Goal: leave the run with high marked value, real winners, and discipline strong enough to raise another vehicle.')}
    </main>
  );

  const renderRaisingPhase = () => (
    <main className="grid flex-1 gap-4 xl:grid-cols-[1.3fr_0.7fr] phase-enter">
      <section className="space-y-4">
        {currentRaiseEvent && (
          <div className="game-panel overflow-hidden p-6 sm:p-8 game-card-hover">
            <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] ${currentRaiseEvent.tone === 'bull' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100' : currentRaiseEvent.tone === 'bear' ? 'border-rose-400/30 bg-rose-400/10 text-rose-100' : 'border-white/20 bg-white/5 text-white/70'}`}>
                  <Users className="h-4 w-4" />
                  {currentRaiseEvent.tone === 'bull' ? 'LP Friendly' : currentRaiseEvent.tone === 'bear' ? 'LP Challenging' : 'Neutral Market'}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/35">Fundraising quarter {currentPhaseRound + 1} of {PHASE_LENGTH}</p>
                  <h2 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">{currentRaiseEvent.title}</h2>
                  <p className="mt-3 max-w-3xl text-lg leading-relaxed text-white/72">{currentRaiseEvent.description}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[300px]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Investor pool</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{currentRaiseEvent.investorPool}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Difficulty</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{currentRaiseEvent.difficulty}/10</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-orange-300/20 bg-orange-300/10 p-5">
                <div className="mb-3 flex items-center gap-2 text-orange-100">
                  <Target className="h-5 w-5" />
                  <p className="text-sm font-medium uppercase tracking-[0.2em]">Pitch execution</p>
                </div>
                <p className="text-sm text-white/65">
                  Tougher terms now apply. You only unlock {Math.round(DEPLOYABLE_RAISE_SHARE * 100)}% of raised capital as immediate dry powder.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {availablePitches.map((pitch) => {
                  const riskPremium = pitch.riskLevel === 'aggressive' ? 8 : pitch.riskLevel === 'balanced' ? 4 : 0;
                  const threshold = pitch.convictionRequired + currentRaiseEvent.difficulty * 3 + riskPremium + 6;

                  return (
                    <div key={pitch.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 game-card-hover">
                      <div className="mb-3 flex items-center justify-between">
                        <div className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] ${pitch.riskLevel === 'safe' ? 'bg-emerald-400/15 text-emerald-100' : pitch.riskLevel === 'balanced' ? 'bg-cyan-400/15 text-cyan-100' : 'bg-orange-400/15 text-orange-100'}`}>
                          {pitch.riskLevel}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-white">{formatMoney(pitch.potentialRaise)}</p>
                          <p className="text-xs text-white/40">potential</p>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-white">{pitch.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/62">{pitch.description}</p>

                      <div className="mt-4 space-y-2">
                        <MetricBar label="Threshold" value={clamp(threshold, 0, 100)} />
                        <MetricBar label="Your reputation" value={reputation} tone="hot" />
                      </div>

                      <div className="mt-4 grid gap-2">
                        <button type="button" onClick={() => handleRaiseAttempt(pitch, 1)} className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-medium text-cyan-50 transition hover:bg-cyan-300/18">
                          Convince (Low)
                        </button>
                        <button type="button" onClick={() => handleRaiseAttempt(pitch, 2)} disabled={reputation < 52} className="rounded-2xl border border-orange-300/25 bg-orange-300/10 px-4 py-3 text-sm font-medium text-orange-50 transition hover:bg-orange-300/18 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30">
                          Persuade (Medium)
                        </button>
                        <button type="button" onClick={() => handleRaiseAttempt(pitch, 3)} disabled={reputation < 70} className="rounded-2xl border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm font-medium text-rose-50 transition hover:bg-rose-300/18 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30">
                          Dominate (High)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      <aside className="space-y-4">
        <div className="game-panel p-5 game-card-hover anim-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/40">Track record</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Your report</h3>
            </div>
          </div>

          <div className="space-y-4">
            <MetricBar label="Portfolio value" value={Math.min((totalValue / INITIAL_CAPITAL) * 55, 100)} />
            <MetricBar label="Reputation" value={reputation} />
            <MetricBar label="Win rate" value={portfolioMarks.length ? (portfolioMarks.filter((p) => p.multiple >= 1.5).length / portfolioMarks.length) * 100 : 0} showPercent />
            <MetricBar label="Fund growth" value={Math.min((fundSize / INITIAL_FUND_SIZE) * 55, 100)} />
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
            <p className="font-medium text-white">Quarterly status:</p>
            <p className={`mt-2 ${reportStatus === 'Ahead of plan' ? 'text-emerald-100' : reportStatus === 'On plan' ? 'text-cyan-100' : 'text-rose-100'}`}>
              {reportStatus}
            </p>
          </div>
        </div>

        <div className="game-panel p-5 game-card-hover anim-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/40">Pitch history</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Recent attempts</h3>
            </div>
          </div>

          {raiseAttempts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm leading-relaxed text-white/50">
              No pitches yet. The fundraising phase is just beginning.
            </div>
          ) : (
            <div className="space-y-3">
              {raiseAttempts.slice(0, 6).map((attempt, index) => {
                const pitch = investorPitches.find((p) => p.id === attempt.pitchId);
                return (
                  <div key={`${attempt.pitchId}-${attempt.quarter}-${index}`} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-white">{pitch?.title ?? 'Unknown investor'}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/40">Quarter {attempt.quarter + 1}</p>
                      </div>
                      <div className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${attempt.success ? 'bg-emerald-400/15 text-emerald-100' : 'bg-rose-400/15 text-rose-100'}`}>
                        {attempt.success ? `+${formatMoney(attempt.amount)}` : 'Passed'}
                      </div>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/45">Conviction level {attempt.conviction}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/58">{attempt.note}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {renderGlobalFooter('Goal: build a generational fund. Strong returns attract capital. Weak returns close doors.')}
    </main>
  );

  const renderGameOver = () => {
    const rankedLeaderboard = [...leaderboard]
      .sort((left, right) => {
        if (right.alphaScore !== left.alphaScore) return right.alphaScore - left.alphaScore;
        return right.fundValue - left.fundValue;
      })
      .slice(0, 10);

    return (
      <main className="flex flex-1 flex-col gap-4 phase-enter">
        <header>
          <div className="game-panel overflow-hidden p-8">
            <div className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.34em] text-cyan-100/65">Fund marked to market</p>
                <h2 className="mt-3 text-4xl font-semibold text-white sm:text-6xl">{rankedOutcome.title}</h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/68">{rankedOutcome.description}</p>
              </div>

              <div className={`inline-flex rounded-full bg-gradient-to-r px-5 py-2 text-sm font-medium text-slate-950 ${rankedOutcome.accent}`}>
                Alpha score: {scoreBreakdown.alphaScore}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <StatBlock label="Final fund value" value={formatMoney(totalValue)} hint="Cash + marked portfolio." />
              <StatBlock label="Capital deployed" value={formatMoney(INITIAL_CAPITAL - cash)} hint="Checks written this run." />
              <StatBlock label="Total raised" value={formatMoney(totalRaised)} hint="LP commitments closed." />
              <StatBlock label="Reputation" value={String(reputation)} hint="Final market perception." />
              <StatBlock label="Winners" value={String(winners)} hint="Positions at 2x+ MOIC." />
            </div>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-3">
          <div className="game-panel p-6 game-card-hover">
            <div className="mb-5 flex items-center gap-2 text-cyan-100">
              <BarChart3 className="h-5 w-5" />
              <p className="text-sm font-medium uppercase tracking-[0.2em]">Alpha breakdown</p>
            </div>
            <div className="space-y-4">
              <MetricBar label="Fund value" value={clamp(scoreBreakdown.valueComponent / 8, 0, 100)} />
              <MetricBar label="Winner density" value={clamp(scoreBreakdown.winnerComponent, 0, 100)} tone="hot" />
              <MetricBar label="Reputation" value={clamp(scoreBreakdown.reputationComponent / 4, 0, 100)} />
              <MetricBar label="Fundraising" value={clamp(scoreBreakdown.raiseComponent / 2.6, 0, 100)} />
              <MetricBar label="Discipline" value={clamp(scoreBreakdown.disciplineComponent + 50, 0, 100)} tone="warn" />
              <MetricBar label="Risk management" value={clamp(scoreBreakdown.riskComponent * 2.8, 0, 100)} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="game-panel p-6 game-card-hover">
              <div className="mb-6 flex items-center gap-2 text-cyan-100">
                <Rocket className="h-5 w-5" />
                <p className="text-sm font-medium uppercase tracking-[0.2em]">Best deal</p>
              </div>
              {bestDeal ? (
                <>
                  <h3 className="text-2xl font-semibold text-white">{bestDeal.company.name}</h3>
                  <p className="mt-2 text-sm text-white/60">{bestDeal.company.headline}</p>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <p className="text-white/40">Check</p>
                      <p className="mt-1 font-semibold text-white">{formatMoney(bestDeal.amount)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <p className="text-white/40">MOIC</p>
                      <p className="mt-1 font-semibold text-emerald-200">{bestDeal.multiple.toFixed(2)}x</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <p className="text-white/40">Gain</p>
                      <p className="mt-1 font-semibold text-white">{formatMoney(bestDeal.gain)}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-white/55">No positions. You ran the fund like a bunker.</p>
              )}
            </div>

            <div className="game-panel p-6 game-card-hover">
              <div className="mb-6 flex items-center gap-2 text-orange-100">
                <TriangleAlert className="h-5 w-5" />
                <p className="text-sm font-medium uppercase tracking-[0.2em]">Biggest miss</p>
              </div>
              {biggestMiss ? (
                <>
                  <h3 className="text-2xl font-semibold text-white">{biggestMiss.name}</h3>
                  <p className="mt-2 text-sm text-white/60">{biggestMiss.headline}</p>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/60">
                    You passed on one of the strongest hidden businesses in the deck. Discipline protects downside, but over-caution can delete upside.
                  </div>
                </>
              ) : (
                <p className="text-sm text-white/55">No obvious miss this run.</p>
              )}
            </div>
          </div>

          <div className="game-panel p-6 game-card-hover">
            <div className="mb-5 flex items-center gap-2 text-emerald-100">
              <Crown className="h-5 w-5" />
              <p className="text-sm font-medium uppercase tracking-[0.2em]">Sector performance</p>
            </div>

            {sectorPerformance.length === 0 ? (
              <p className="text-sm text-white/55">No sector exposure tracked.</p>
            ) : (
              <div className="space-y-3">
                {sectorPerformance.map((entry) => (
                  <div key={entry.sector} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-base font-semibold text-white">{entry.sector}</p>
                      <div className={`rounded-full px-3 py-1 text-xs font-medium ${entry.gain >= 0 ? 'bg-emerald-400/15 text-emerald-100' : 'bg-rose-400/15 text-rose-100'}`}>
                        {entry.gain >= 0 ? '+' : ''}
                        {formatMoney(entry.gain)}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs uppercase tracking-[0.16em] text-white/55">
                      <div>
                        <p>Checks</p>
                        <p className="mt-1 text-sm font-medium text-white">{entry.checks}</p>
                      </div>
                      <div>
                        <p>Invested</p>
                        <p className="mt-1 text-sm font-medium text-white">{formatMoney(entry.invested)}</p>
                      </div>
                      <div>
                        <p>Value</p>
                        <p className="mt-1 text-sm font-medium text-white">{formatMoney(entry.currentValue)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="game-panel p-6 game-card-hover">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/40">Leaderboard</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Top allocators</h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/55">
              Stored locally
            </div>
          </div>

          {rankedLeaderboard.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-white/50">
              No leaderboard entries yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.2em] text-white/45">
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Player</th>
                    <th className="px-3 py-2">Alpha</th>
                    <th className="px-3 py-2">Fund value</th>
                    <th className="px-3 py-2">Winners</th>
                    <th className="px-3 py-2">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedLeaderboard.map((entry, index) => {
                    const isCurrentRun = entry.runId === runId;
                    return (
                      <tr key={`${entry.runId}-${entry.createdAt}`} className={`rounded-2xl text-sm ${isCurrentRun ? 'bg-cyan-400/12 text-cyan-50' : 'bg-white/[0.03] text-white/80'}`}>
                        <td className="rounded-l-2xl border border-r-0 border-white/10 px-3 py-3 font-semibold">{index + 1}</td>
                        <td className="border border-x-0 border-white/10 px-3 py-3">{entry.playerLabel}</td>
                        <td className="border border-x-0 border-white/10 px-3 py-3">{entry.alphaScore}</td>
                        <td className="border border-x-0 border-white/10 px-3 py-3">{formatMoney(entry.fundValue)}</td>
                        <td className="border border-x-0 border-white/10 px-3 py-3">{entry.winners}</td>
                        <td className="rounded-r-2xl border border-l-0 border-white/10 px-3 py-3">{entry.outcome}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={resetGame}
            className="inline-flex items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/12 px-6 py-4 text-sm font-medium uppercase tracking-[0.24em] text-cyan-50 transition hover:bg-cyan-300/18"
          >
            <TimerReset className="mr-2 h-4 w-4" />
            New run setup
          </button>
          <button
            type="button"
            onClick={() => {
              resetGame();
              setTimeout(() => startGame(), 0);
            }}
            disabled={!playerIdentity}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-4 text-sm font-medium uppercase tracking-[0.24em] text-white/72 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:text-white/35"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Instant rematch
          </button>
        </div>

        {renderGlobalFooter('Goal: leave the run with the highest marked fund value, real winners, and enough discipline to earn another vehicle.')}
      </main>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${GAME_BACKGROUND})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(251,146,60,0.16),transparent_26%),linear-gradient(180deg,rgba(6,10,18,0.2),rgba(6,10,18,0.92))]" />
      <div className="game-grid absolute inset-0 opacity-70" />

      <div className="relative isolate mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        {renderGlobalHud()}

        {mode === 'intro' ? renderIntro() : mode === 'gameover' ? renderGameOver() : isAllocatingPhase ? renderAllocatingPhase() : renderRaisingPhase()}

        {mode === 'playing' && latestDecision && (
          <div className="pointer-events-none fixed bottom-4 right-4 z-40 hidden max-w-sm rounded-2xl border border-white/15 bg-slate-950/85 p-4 text-sm backdrop-blur-xl lg:block">
            <div className="mb-2 flex items-center gap-2 text-cyan-100">
              <Flame className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.2em]">Last move</p>
            </div>
            <p className="text-white/75">{latestDecision.note}</p>
          </div>
        )}

        {mode === 'playing' && (
          <div className="pointer-events-none fixed bottom-4 left-4 z-40 hidden rounded-2xl border border-white/12 bg-slate-950/80 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/55 backdrop-blur-xl xl:block">
            {currentGamePhase === 'allocating' ? 'Shortcuts: 1/2/3 invest · P pass' : 'Shortcuts: Q/W/E pitch first investor'}
          </div>
        )}

        {mode === 'playing' && activePopup && (
          <div className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">
            <div
              className={`w-full max-w-2xl rounded-2xl border p-4 backdrop-blur-xl anim-scale-in ${
                activePopup.tone === 'good'
                  ? 'border-emerald-300/35 bg-emerald-500/12'
                  : activePopup.tone === 'bad'
                    ? 'border-rose-300/35 bg-rose-500/12'
                    : activePopup.tone === 'report'
                      ? 'border-cyan-300/35 bg-cyan-500/12'
                      : 'border-white/20 bg-slate-900/70'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/65">{activePopup.tone === 'report' ? 'Performance report' : 'Game update'}</p>
                  <h4 className="mt-1 text-lg font-semibold text-white">{activePopup.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{activePopup.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePopup(null)}
                  className="rounded-full border border-white/20 px-2 py-1 text-xs uppercase tracking-[0.18em] text-white/70 transition hover:bg-white/10"
                >
                  close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
