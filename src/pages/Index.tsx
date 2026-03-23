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
  Handshake,
  Orbit,
  Radar,
  Rocket,
  Sparkles,
  Target,
  TimerReset,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Users,
} from 'lucide-react';

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

const GAME_BACKGROUND = 'https://blossom.ditto.pub/73fd8d04b15e0bbf4e90058ddd375f00ba57c61ef815fd4cb92b0eb7c8e1b1ce.jpeg';
const INITIAL_CAPITAL = 120;
const INITIAL_FUND_SIZE = 120;
const INITIAL_REPUTATION = 56;
const TOTAL_ROUNDS = 64;
const PHASE_LENGTH = 8;
const INVESTMENT_OPTIONS = [5, 10, 20] as const;
const DEPLOYABLE_RAISE_SHARE = 0.55;

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
  const weighted = company.team * 0.34 + company.product * 0.33 + company.market * 0.33 - company.risk * 0.16;
  return Math.round(clamp(weighted + company.thesis.length * 4 - 8, 0, 100));
};

const getMomentumLabel = (value: number) => {
  if (value >= 0.8) return 'Overheated';
  if (value >= 0.35) return 'Ripping';
  if (value <= -0.8) return 'Frozen';
  if (value <= -0.35) return 'Under pressure';
  return 'Balanced';
};

const getRankedOutcome = (score: number): RankedOutcome => {
  if (score >= 1250) {
    return {
      title: 'Generational Allocator',
      description: 'LPs are calling. You found signal before the market could price it in.',
      accent: 'from-amber-300 via-orange-400 to-rose-500',
    };
  }

  if (score >= 1020) {
    return {
      title: 'Elite Investor',
      description: 'You built a sharp book, stayed disciplined, and let the winners carry the fund.',
      accent: 'from-cyan-300 via-sky-400 to-blue-500',
    };
  }

  if (score >= 780) {
    return {
      title: 'Disciplined Operator',
      description: 'Solid instincts. Not every bet hit, but your portfolio still looks investable.',
      accent: 'from-emerald-300 via-teal-400 to-cyan-500',
    };
  }

  if (score >= 580) {
    return {
      title: 'Promising Associate',
      description: 'You saw some truth, chased some hype, and learned a few expensive lessons.',
      accent: 'from-violet-300 via-fuchsia-400 to-rose-500',
    };
  }

  return {
    title: 'Tourist Capital',
    description: 'Too much heat, not enough edge. The market took your lunch money.',
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
  const holdingBoost = holdingPeriods * 0.18;
  const qualityBoost = (company.hiddenQuality - 70) / 17;
  const fitBoost = (investment.fitScore - 55) / 52;
  const riskPenalty = (company.risk - 45) / 40;
  const sectorLift = momentum[company.sector] * 0.8;
  const macroLift = momentum.global * 0.65;
  const reputationLift = (reputation - 50) / 110;
  const volatilitySwing = company.volatility * (momentum[company.sector] * 0.08 + momentum.global * 0.06);

  return clamp(
    0.35 + holdingBoost + qualityBoost + fitBoost - riskPenalty + sectorLift + macroLift + reputationLift + volatilitySwing,
    0.25,
    8.5,
  );
};

const StatBlock = ({ label, value, hint, className = '' }: { label: string; value: string; hint: string; className?: string }) => (
  <div className={`game-panel game-card-hover px-4 py-4 ${className}`}>
    <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">{label}</p>
    <p className="mt-3 text-2xl font-semibold text-white anim-count-up">{value}</p>
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
      const picks = shuffle(COMPANIES).slice(0, PHASE_LENGTH);
      timeline.push(...picks);
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
    const currentPhaseStart = currentPhase * PHASE_LENGTH;
    const usedThisPhase = new Set(
      raiseAttempts
        .filter((attempt) => attempt.quarter >= currentPhaseStart && attempt.quarter < currentPhaseStart + PHASE_LENGTH)
        .map((attempt) => attempt.pitchId),
    );

    const pitchCount = clamp(Math.round(currentRaiseEvent.investorPool / 4), 2, 4);

    return investorPitches.filter((pitch) => !usedThisPhase.has(pitch.id)).slice(0, pitchCount);
  }, [currentPhase, currentRaiseEvent, investorPitches, raiseAttempts]);

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

  const scoreBreakdown = useMemo<ScoreBreakdown>(() => {
    const valueComponent = Math.round((totalValue - INITIAL_CAPITAL) * 11);
    const winnerComponent = winners * 35;
    const reputationComponent = reputation * 5;
    const raiseComponent = Math.round(totalRaised * 3);
    const disciplineComponent = decisionInsights.disciplinedPasses * 12 - decisionInsights.expensiveMisses * 16;
    const riskComponent = Math.max(0, 40 - decisionInsights.overheatedBets * 8);

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
  };

  const startGame = () => {
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
  };

  const handleDecision = (amount: number | null) => {
    if (!currentCompany || gameOver || !isAllocatingPhase) return;

    const fitScore = getFitScore(currentCompany);
    let nextCash = cash;
    let nextReputation = reputation;
    let note = 'You stayed patient and protected dry powder for a better setup.';

    if (amount !== null) {
      if (amount > cash) return;

      const sectorCount = portfolio.filter((position) => companyMap[position.companyId]?.sector === currentCompany.sector).length;
      const concentrationPenalty = sectorCount >= 2 ? 2 : sectorCount >= 1 ? 1 : 0;
      const stagePenalty = currentCompany.stage === 'Pre-seed' && amount >= 20 ? 1 : 0;

      nextCash -= amount;
      const repDelta = fitScore >= 84 ? 4 : fitScore >= 72 ? 2 : fitScore >= 60 ? 0 : -3;
      nextReputation += repDelta - concentrationPenalty - stagePenalty;

      setPortfolio((current) => [
        ...current,
        {
          companyId: currentCompany.id,
          amount,
          investedRound: round,
          fitScore,
        },
      ]);

      note =
        fitScore >= 84
          ? `You led the round with ${formatMoney(amount)}. The partnership sees flagship potential.`
          : fitScore >= 68
            ? `You wrote a ${formatMoney(amount)} check into a credible bet with real upside.`
            : `You chased the story with ${formatMoney(amount)}. LPs will want to see this decision age well.`;
    } else {
      nextReputation += currentCompany.hiddenQuality >= 90 ? -3 : currentCompany.hiddenQuality <= 68 ? 2 : 1;
      note =
        currentCompany.hiddenQuality >= 90
          ? 'You passed on a company that looked expensive. Time will decide whether that was discipline or fear.'
          : 'You passed and preserved capital. Sometimes not losing is the edge.';
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

    setCash(nextCash);
    setReputation(clamp(nextReputation + nextEvent.reputationShift, 20, 99));
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
    setRound((current) => current + 1);
  };

  const handleRaiseAttempt = (pitch: InvestorPitch, convictionLevel: number) => {
    if (!currentRaiseEvent || gameOver || isAllocatingPhase) return;

    const trackRecordBoost = clamp(Math.round((totalValue - INITIAL_CAPITAL) / 6), -10, 18);
    const convictionScore =
      reputation +
      convictionLevel * 9 +
      (currentRaiseEvent.tone === 'bull' ? 12 : currentRaiseEvent.tone === 'bear' ? -9 : 0) +
      trackRecordBoost;

    const riskPremium = pitch.riskLevel === 'aggressive' ? 6 : pitch.riskLevel === 'balanced' ? 2 : 0;
    const difficultyThreshold = pitch.convictionRequired + currentRaiseEvent.difficulty * 3 + riskPremium;
    const success = convictionScore >= difficultyThreshold;

    let amount = 0;
    let note = '';

    if (success) {
      const qualityMultiplier = 0.76 + convictionLevel * 0.13 + Math.random() * 0.34 + (reputation - 50) / 220;
      amount = Math.max(6, Math.round(pitch.potentialRaise * qualityMultiplier));

      const deployableCash = Math.round(amount * DEPLOYABLE_RAISE_SHARE);
      setFundSize((prev) => prev + amount);
      setCash((prev) => prev + deployableCash);

      note =
        convictionScore >= difficultyThreshold + 18
          ? `Exceptional pitch. ${pitch.title} committed ${formatMoney(amount)}. ${formatMoney(deployableCash)} is now deployable.`
          : convictionScore >= difficultyThreshold + 8
            ? `Solid close. ${pitch.title} committed ${formatMoney(amount)}. You unlock ${formatMoney(deployableCash)} in fresh dry powder.`
            : `Narrow win. ${pitch.title} committed ${formatMoney(amount)}. You gained ${formatMoney(deployableCash)} deployable this quarter.`;
    } else {
      note =
        convictionScore < difficultyThreshold - 15
          ? `${pitch.title} passed. The conviction gap was too wide.`
          : `${pitch.title} deferred. They need a stronger quarter before committing.`;
    }

    const repDelta = success ? (convictionLevel >= 3 ? 4 : 3) : convictionLevel >= 3 ? -4 : -2;

    setReputation((prev) => clamp(prev + repDelta, 20, 99));
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
    setRound((current) => current + 1);
  };

  useEffect(() => {
    if (round >= TOTAL_ROUNDS && mode === 'playing') {
      setMode('gameover');
    }
  }, [round, mode]);

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
  }, [availablePitches, currentGamePhase, mode, handleDecision, handleRaiseAttempt]);

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
              <div
                key={`${decision.companyId}-${decision.round}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 anim-fade-in"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-white">{company?.name ?? 'Unknown company'}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/40">Quarter {decision.round + 1}</p>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${
                      decision.choice === 'invest' ? 'bg-cyan-400/15 text-cyan-100' : 'bg-white/10 text-white/70'
                    }`}
                  >
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
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
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
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/45">
              <span>Global run progress</span>
              <span>{Math.round(globalProgress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-orange-300 progress-pulse"
                style={metricWidth(globalProgress)}
              />
            </div>

            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/45">
              <span>Current phase progress</span>
              <span>{Math.round(phaseProgress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${
                  currentGamePhase === 'allocating'
                    ? 'from-cyan-300 via-sky-300 to-blue-300'
                    : 'from-orange-300 via-amber-300 to-rose-300'
                } progress-pulse`}
                style={metricWidth(phaseProgress)}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {Array.from({ length: totalPhases }).map((_, index) => {
              const done = index < currentPhase;
              const active = index === currentPhase;
              const phaseType = index % 2 === 0 ? 'Alloc' : 'Raise';
              return (
                <div
                  key={`phase-${index}`}
                  className={`rounded-xl border px-3 py-2 text-center text-xs uppercase tracking-[0.2em] ${
                    done
                      ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100'
                      : active
                        ? 'border-cyan-300/35 bg-cyan-300/10 text-cyan-100'
                        : 'border-white/10 bg-white/[0.03] text-white/50'
                  }`}
                >
                  <p className="text-[10px] opacity-70">P{index + 1}</p>
                  <p className="mt-1">{phaseType}</p>
                </div>
              );
            })}
          </div>
        </div>
      </header>
    );
  };

  const renderIntro = () => (
    <main className="flex flex-1 flex-col justify-between gap-10">
      <section className="grid flex-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-cyan-100 anim-fade-in">
            <Sparkles className="h-4 w-4" />
            TEN31 // Investor Mode
          </div>

          <div className="space-y-5">
            <p className="max-w-xl text-sm uppercase tracking-[0.35em] text-white/45 anim-fade-in anim-delay-1">
              Back the future. Dodge the hype. Compound conviction.
            </p>
            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] text-white sm:text-6xl lg:text-8xl anim-fade-in anim-delay-2">
              Build a fund
              <span className="bg-gradient-to-r from-cyan-200 via-white to-orange-300 bg-clip-text text-transparent"> quarter by quarter.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/68 sm:text-xl anim-fade-in anim-delay-3">
              You run a $120M fund. 64 quarters across allocation and fundraising cycles. Signal quality, sizing, and discipline determine whether you
              become a generational allocator or a cautionary tale.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row anim-fade-in anim-delay-4">
            <button
              type="button"
              onClick={startGame}
              className="group inline-flex items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/15 px-7 py-4 text-sm font-medium uppercase tracking-[0.25em] text-cyan-50 transition hover:bg-cyan-300/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)]"
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

          <div className="grid gap-4 sm:grid-cols-4">
            <StatBlock label="Starting fund" value="$120M" hint="Deploy capital with intent." className="anim-fade-in anim-delay-5" />
            <StatBlock label="Time horizon" value="64 Quarters" hint="Eight strategic phases." className="anim-fade-in anim-delay-6" />
            <StatBlock label="Modes" value="Invest / Raise" hint="Allocate then convince LPs." className="anim-fade-in anim-delay-7" />
            <StatBlock label="Objective" value="Compound" hint="Max alpha with discipline." className="anim-fade-in anim-delay-8" />
          </div>
        </div>

        <div className="game-panel relative overflow-hidden p-6 sm:p-8 anim-scale-in">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/40">What changed</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Sharper simulation loop</h2>
            </div>
            <div className="rounded-full border border-orange-300/30 bg-orange-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-orange-100 anim-pulse-glow">
              Full pass
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 game-card-hover">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">Allocation upgrades</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Better deal flow and decision clarity</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Distinct allocation timeline, improved concentration penalties, stronger event reactions, and cleaner memo-style context for every deal.
                  </p>
                </div>
                <Radar className="hidden h-10 w-10 text-cyan-200/80 sm:block anim-float" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 game-card-hover">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-orange-100/70">Fundraising upgrades</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Dynamic LP market + deployable capital</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Raise events now rotate during the phase and successful closes unlock fresh deployable dry powder next cycle.
                  </p>
                </div>
                <Handshake className="hidden h-10 w-10 text-orange-200/80 sm:block anim-float" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 game-card-hover">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-100/70">Run intelligence</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Decision feed + score breakdown</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Richer telemetry across phase progress, risk quality, sector outcomes, and alpha score components.
                  </p>
                </div>
                <BarChart3 className="hidden h-10 w-10 text-emerald-200/80 sm:block anim-float" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {renderGlobalFooter('Investor simulator for TEN31 Capital. Build a generational fund across market cycles.')}
    </main>
  );

  const renderAllocatingPhase = () => (
    <main className="grid flex-1 gap-4 xl:grid-cols-[1.3fr_0.7fr] phase-enter">
      <section className="space-y-4">
        {currentCompany ? (
          <div className="game-panel overflow-hidden p-6 sm:p-8 game-card-hover">
            <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-4 py-2 text-xs uppercase tracking-[0.24em] ${sectorAccent[currentCompany.sector]}`}>
                  <Building2 className="h-4 w-4" />
                  {currentCompany.sector}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/35">
                    Deal {currentPhaseRound + 1} of {PHASE_LENGTH}
                  </p>
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
                      <p className="mt-2 text-4xl font-semibold text-white anim-number-pop">{currentFit}</p>
                      <p className="mt-2 text-sm text-white/55">
                        {currentFit >= 80
                          ? 'Rare alignment. The visible signal is unusually strong.'
                          : currentFit >= 65
                            ? 'Promising deal. You still need discipline on price and risk.'
                            : 'Tempting, but the story may be better than the business.'}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {currentCompany.thesis.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/65">
                          {tag}
                        </span>
                      ))}
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
                  <p className="mt-4 text-sm text-white/50">
                    Tip: great funds are not just about picking winners. They are about sizing winners while preserving capital for obvious monsters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="game-panel overflow-hidden p-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">Allocation complete</p>
            <h2 className="mt-3 text-4xl font-semibold text-white">Preparing next setup</h2>
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
            <div
              className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                momentum.global >= 0 ? 'bg-emerald-400/15 text-emerald-100' : 'bg-rose-400/15 text-rose-100'
              }`}
            >
              {getMomentumLabel(momentum.global)}
            </div>
          </div>

          <div
            className={`rounded-3xl border p-5 ${
              latestEvent
                ? latestEvent.tone === 'bull'
                  ? 'border-emerald-300/20 bg-emerald-300/10'
                  : latestEvent.tone === 'bear'
                    ? 'border-rose-300/20 bg-rose-300/10'
                    : 'border-white/10 bg-white/[0.04]'
                : 'border-white/10 bg-white/[0.04]'
            }`}
          >
            {latestEvent ? (
              <>
                <div className="flex items-center gap-3">
                  {latestEvent.tone === 'bull' ? (
                    <TrendingUp className="h-5 w-5 text-emerald-100" />
                  ) : latestEvent.tone === 'bear' ? (
                    <TrendingDown className="h-5 w-5 text-rose-100" />
                  ) : (
                    <Orbit className="h-5 w-5 text-white" />
                  )}
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-white">{latestEvent.title}</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/68">{latestEvent.description}</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <Orbit className="h-5 w-5 text-cyan-100" />
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-white">Market waiting for your first move</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  The board starts reacting the moment you deploy or pass on your first company.
                </p>
              </>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(['AI', 'Infrastructure', 'Energy', 'Security', 'Fintech', 'Robotics', 'Climate', 'Biotech'] as Sector[]).map((sector) => (
              <div key={sector} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="mb-2 flex items-center justify-between text-sm text-white/65">
                  <span>{sector}</span>
                  <span>{getMomentumLabel(momentum[sector])}</span>
                </div>
                <div className="h-2 rounded-full bg-white/8">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r anim-bar-fill ${sectorAccent[sector].split(' ').find((token) => token.startsWith('from-')) ?? 'from-cyan-300'} via-white/80 to-transparent`}
                    style={{ width: `${clamp(((momentum[sector] + 1.5) / 3) * 100, 5, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="game-panel p-5 game-card-hover anim-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/40">Portfolio</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Live marks</h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/55">
              {portfolioMarks.length} positions
            </div>
          </div>

          {portfolioMarks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm leading-relaxed text-white/50">
              No checks written yet. The game begins when you back your first founder.
            </div>
          ) : (
            <div className="space-y-3">
              {portfolioMarks.slice(0, 6).map((investment) => (
                <div key={investment.company.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{investment.company.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/40">{investment.company.sector}</p>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        investment.multiple >= 1.6
                          ? 'bg-emerald-400/15 text-emerald-100'
                          : investment.multiple >= 1
                            ? 'bg-cyan-400/15 text-cyan-100'
                            : 'bg-rose-400/15 text-rose-100'
                      }`}
                    >
                      {investment.multiple.toFixed(2)}x
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-white/40">Check</p>
                      <p className="mt-1 text-white">{formatMoney(investment.amount)}</p>
                    </div>
                    <div>
                      <p className="text-white/40">Current value</p>
                      <p className="mt-1 text-white">{formatMoney(investment.currentValue)}</p>
                    </div>
                    <div>
                      <p className="text-white/40">Fit</p>
                      <p className="mt-1 text-white">{investment.fitScore}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {renderDecisionFeed()}
      </aside>

      {renderGlobalFooter('Goal: leave the run with the highest marked fund value, real winners in the book, and enough discipline to earn another vehicle.')}
    </main>
  );

  const renderRaisingPhase = () => (
    <main className="grid flex-1 gap-4 xl:grid-cols-[1.3fr_0.7fr] phase-enter">
      <section className="space-y-4">
        {currentRaiseEvent ? (
          <div className="game-panel overflow-hidden p-6 sm:p-8 game-card-hover">
            <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] ${
                    currentRaiseEvent.tone === 'bull'
                      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
                      : currentRaiseEvent.tone === 'bear'
                        ? 'border-rose-400/30 bg-rose-400/10 text-rose-100'
                        : 'border-white/20 bg-white/5 text-white/70'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  {currentRaiseEvent.tone === 'bull' ? 'LP Friendly' : currentRaiseEvent.tone === 'bear' ? 'LP Challenging' : 'Neutral Market'}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/35">
                    Fundraising quarter {currentPhaseRound + 1} of {PHASE_LENGTH}
                  </p>
                  <h2 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">{currentRaiseEvent.title}</h2>
                  <p className="mt-3 max-w-3xl text-lg leading-relaxed text-white/72">{currentRaiseEvent.description}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[300px]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Investor pool</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{currentRaiseEvent.investorPool}</p>
                  <p className="mt-1 text-xs text-white/50">active prospects</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Difficulty</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{currentRaiseEvent.difficulty}/10</p>
                  <p className="mt-1 text-xs text-white/50">higher means tougher closes</p>
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
                  Raised capital is split into committed fund value and deployable dry powder. You currently unlock {Math.round(DEPLOYABLE_RAISE_SHARE * 100)}% of each successful close as immediate investing power.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {availablePitches.map((pitch) => {
                  const riskPremium = pitch.riskLevel === 'aggressive' ? 6 : pitch.riskLevel === 'balanced' ? 2 : 0;
                  const threshold = pitch.convictionRequired + currentRaiseEvent.difficulty * 3 + riskPremium;

                  return (
                    <div key={pitch.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 game-card-hover">
                      <div className="mb-3 flex items-center justify-between">
                        <div
                          className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] ${
                            pitch.riskLevel === 'safe'
                              ? 'bg-emerald-400/15 text-emerald-100'
                              : pitch.riskLevel === 'balanced'
                                ? 'bg-cyan-400/15 text-cyan-100'
                                : 'bg-orange-400/15 text-orange-100'
                          }`}
                        >
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
                        <button
                          type="button"
                          onClick={() => handleRaiseAttempt(pitch, 1)}
                          className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-medium text-cyan-50 transition hover:bg-cyan-300/18"
                        >
                          Convince (Low)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRaiseAttempt(pitch, 2)}
                          disabled={reputation < 48}
                          className="rounded-2xl border border-orange-300/25 bg-orange-300/10 px-4 py-3 text-sm font-medium text-orange-50 transition hover:bg-orange-300/18 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                        >
                          Persuade (Medium)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRaiseAttempt(pitch, 3)}
                          disabled={reputation < 66}
                          className="rounded-2xl border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm font-medium text-rose-50 transition hover:bg-rose-300/18 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                        >
                          Dominate (High)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {availablePitches.length === 0 && (
                <div className="rounded-3xl border border-dashed border-white/12 bg-white/[0.03] px-6 py-10 text-center text-sm text-white/55">
                  No investors left this quarter. Advance to get a fresh slate next quarter.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="game-panel overflow-hidden p-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-100/70">Fundraising complete</p>
            <h2 className="mt-3 text-4xl font-semibold text-white">Preparing next allocation cycle</h2>
          </div>
        )}
      </section>

      <aside className="space-y-4">
        <div className="game-panel p-5 game-card-hover anim-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/40">Track record</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Your pedigree</h3>
            </div>
            <div
              className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                reputation >= 70 ? 'bg-emerald-400/15 text-emerald-100' : reputation >= 50 ? 'bg-cyan-400/15 text-cyan-100' : 'bg-rose-400/15 text-rose-100'
              }`}
            >
              {reputation >= 70 ? 'Elite' : reputation >= 50 ? 'Solid' : 'Developing'}
            </div>
          </div>

          <div className="space-y-4">
            <MetricBar label="Portfolio value" value={Math.min((totalValue / INITIAL_CAPITAL) * 50, 100)} />
            <MetricBar label="Reputation" value={reputation} />
            <MetricBar label="Win rate" value={portfolioMarks.length ? (portfolioMarks.filter((p) => p.multiple >= 1.5).length / portfolioMarks.length) * 100 : 0} showPercent />
            <MetricBar label="Fund growth" value={Math.min((fundSize / INITIAL_FUND_SIZE) * 50, 100)} />
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
            <p className="font-medium text-white">Deployable cash unlocked by fundraising:</p>
            <p className="mt-2 text-cyan-100">{formatMoney(totalRaised * DEPLOYABLE_RAISE_SHARE)}</p>
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
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${
                          attempt.success ? 'bg-emerald-400/15 text-emerald-100' : 'bg-rose-400/15 text-rose-100'
                        }`}
                      >
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

        {renderDecisionFeed()}
      </aside>

      {renderGlobalFooter('Goal: build a generational fund. Strong returns attract capital. Weak returns close doors.')}
    </main>
  );

  const renderGameOver = () => (
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
            <StatBlock label="Capital deployed" value={formatMoney(INITIAL_CAPITAL - cash)} hint="Checks written in this run." />
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
            <MetricBar label="Reputation" value={clamp(scoreBreakdown.reputationComponent / 5, 0, 100)} />
            <MetricBar label="Fundraising" value={clamp(scoreBreakdown.raiseComponent / 4, 0, 100)} />
            <MetricBar label="Discipline" value={clamp(scoreBreakdown.disciplineComponent + 50, 0, 100)} tone="warn" />
            <MetricBar label="Risk management" value={clamp(scoreBreakdown.riskComponent * 2.5, 0, 100)} />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
            <p className="font-medium text-white">Decision quality stats</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.18em]">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-white/45">Disciplined passes</p>
                <p className="mt-1 text-lg text-emerald-100">{decisionInsights.disciplinedPasses}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-white/45">Expensive misses</p>
                <p className="mt-1 text-lg text-rose-100">{decisionInsights.expensiveMisses}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-white/45">High-conviction hits</p>
                <p className="mt-1 text-lg text-cyan-100">{decisionInsights.highConvictionHits}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-white/45">Overheated bets</p>
                <p className="mt-1 text-lg text-orange-100">{decisionInsights.overheatedBets}</p>
              </div>
            </div>
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
                  You passed on one of the strongest hidden businesses in the deck. That restraint may have protected downside, but it also left serious
                  upside on the table.
                </div>
              </>
            ) : (
              <p className="text-sm text-white/55">No obvious miss. Either you invested boldly or the deck never made you blink.</p>
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
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        entry.gain >= 0 ? 'bg-emerald-400/15 text-emerald-100' : 'bg-rose-400/15 text-rose-100'
                      }`}
                    >
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
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">Portfolio ledger</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Final marks</h3>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/55">
            {portfolioMarks.length} positions
          </div>
        </div>

        {portfolioMarks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-white/50">
            No positions to show.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-xs uppercase tracking-[0.2em] text-white/45">
                  <th className="px-3 py-2">Company</th>
                  <th className="px-3 py-2">Sector</th>
                  <th className="px-3 py-2">Check</th>
                  <th className="px-3 py-2">Value</th>
                  <th className="px-3 py-2">MOIC</th>
                  <th className="px-3 py-2">Gain</th>
                </tr>
              </thead>
              <tbody>
                {portfolioMarks.map((mark) => (
                  <tr key={`${mark.company.id}-${mark.investedRound}-${mark.amount}`} className="rounded-2xl bg-white/[0.03] text-sm text-white/80">
                    <td className="rounded-l-2xl border border-r-0 border-white/10 px-3 py-3 font-medium text-white">{mark.company.name}</td>
                    <td className="border border-x-0 border-white/10 px-3 py-3">{mark.company.sector}</td>
                    <td className="border border-x-0 border-white/10 px-3 py-3">{formatMoney(mark.amount)}</td>
                    <td className="border border-x-0 border-white/10 px-3 py-3">{formatMoney(mark.currentValue)}</td>
                    <td className="border border-x-0 border-white/10 px-3 py-3">{mark.multiple.toFixed(2)}x</td>
                    <td
                      className={`rounded-r-2xl border border-l-0 border-white/10 px-3 py-3 font-medium ${
                        mark.gain >= 0 ? 'text-emerald-100' : 'text-rose-100'
                      }`}
                    >
                      {mark.gain >= 0 ? '+' : ''}
                      {formatMoney(mark.gain)}
                    </td>
                  </tr>
                ))}
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
            startGame();
          }}
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-4 text-sm font-medium uppercase tracking-[0.24em] text-white/72 transition hover:bg-white/[0.08] hover:text-white"
        >
          <Rocket className="mr-2 h-4 w-4" />
          Instant rematch
        </button>
      </div>

      {renderGlobalFooter('Goal: leave the run with the highest marked fund value, real winners in the book, and enough discipline to earn another vehicle.')}
    </main>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${GAME_BACKGROUND})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(251,146,60,0.16),transparent_26%),linear-gradient(180deg,rgba(6,10,18,0.2),rgba(6,10,18,0.92))]" />
      <div className="game-grid absolute inset-0 opacity-70" />

      <div className="relative isolate mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        {renderGlobalHud()}

        {mode === 'intro' ? (
          renderIntro()
        ) : mode === 'gameover' ? (
          renderGameOver()
        ) : isAllocatingPhase ? (
          renderAllocatingPhase()
        ) : (
          renderRaisingPhase()
        )}

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
      </div>
    </div>
  );
};

export default Index;
