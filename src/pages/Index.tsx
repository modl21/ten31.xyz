import { useMemo, useState, useEffect, type CSSProperties } from 'react';
import { useSeoMeta } from '@unhead/react';
import {
  ArrowRight,
  BadgeDollarSign,
  BrainCircuit,
  Building2,
  Flame,
  Gauge,
  Handshake,
  Orbit,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Users,
  DollarSign,
  Target,
} from 'lucide-react';

import {
  COMPANIES,
  MARKET_EVENTS,
  RAISE_EVENTS,
  INVESTOR_PITCHES,
  sectorAccent,
  type Sector,
  type Tone,
  type Company,
  type MarketEvent,
  type Investment,
  type Decision,
  type Momentum,
  type RaiseEvent,
  type InvestorPitch,
  type RaiseResult,
} from '@/lib/gameData';

const GAME_BACKGROUND = 'https://blossom.ditto.pub/73fd8d04b15e0bbf4e90058ddd375f00ba57c61ef815fd4cb92b0eb7c8e1b1ce.jpeg';
const INITIAL_CAPITAL = 120;
const INITIAL_FUND_SIZE = 120;
const TOTAL_ROUNDS = 64;
const PHASE_LENGTH = 8;
const INVESTMENT_OPTIONS = [5, 10, 20] as const;
const RAISE_OPTIONS = [10, 25, 50] as const;

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
  if (score >= 1180) {
    return {
      title: 'Generational Allocator',
      description: 'LPs are calling. You found signal before the market could price it in.',
      accent: 'from-amber-300 via-orange-400 to-rose-500',
    };
  }

  if (score >= 980) {
    return {
      title: 'Elite Investor',
      description: 'You built a sharp book, stayed disciplined, and let the winners carry the fund.',
      accent: 'from-cyan-300 via-sky-400 to-blue-500',
    };
  }

  if (score >= 760) {
    return {
      title: 'Disciplined Operator',
      description: 'Solid instincts. Not every bet hit, but your portfolio still looks investable.',
      accent: 'from-emerald-300 via-teal-400 to-cyan-500',
    };
  }

  if (score >= 560) {
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

  return clamp(0.35 + holdingBoost + qualityBoost + fitBoost - riskPenalty + sectorLift + macroLift + reputationLift + volatilitySwing, 0.25, 8.5);
};

const metricWidth = (value: number): CSSProperties => ({ width: `${clamp(value, 0, 100)}%` });

const StatBlock = ({ label, value, hint }: { label: string; value: string; hint: string }) => (
  <div className="game-panel px-4 py-4">
    <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">{label}</p>
    <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    <p className="mt-1 text-sm text-white/55">{hint}</p>
  </div>
);

const MetricBar = ({ label, value, tone = 'good' }: { label: string; value: number; tone?: 'good' | 'warn' | 'hot' }) => {
  const barClass =
    tone === 'warn'
      ? 'from-amber-300 via-orange-400 to-rose-500'
      : tone === 'hot'
        ? 'from-fuchsia-300 via-violet-400 to-cyan-400'
        : 'from-emerald-300 via-cyan-400 to-sky-500';

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-white/70">
        <span>{label}</span>
        <span className="font-medium text-white">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/8">
        <div className={`h-full rounded-full bg-gradient-to-r ${barClass}`} style={metricWidth(value)} />
      </div>
    </div>
  );
};

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
  const [reputation, setReputation] = useState(56);
  const [portfolio, setPortfolio] = useState<Investment[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [eventLog, setEventLog] = useState<MarketEvent[]>([]);
  const [raiseAttempts, setRaiseAttempts] = useState<RaiseAttempt[]>([]);
  const [momentum, setMomentum] = useState<Momentum>(createInitialMomentum);

  // Calculate current phase info
  const currentPhase = Math.floor(round / PHASE_LENGTH);
  const currentPhaseRound = round % PHASE_LENGTH;
  const isAllocatingPhase = currentPhase % 2 === 0;
  const currentGamePhase: GamePhase = isAllocatingPhase ? 'allocating' : 'raising';
  const gameOver = round >= TOTAL_ROUNDS;

  // Deal flow for allocating phases (reuse deck, different slices per phase)
  const dealFlow = useMemo(() => shuffle(COMPANIES), [seed]);
  const companyMap = useMemo(() => {
    const companies: Company[] = [];
    for (let i = 0; i < TOTAL_ROUNDS / PHASE_LENGTH; i++) {
      companies.push(...shuffle(COMPANIES).slice(0, PHASE_LENGTH));
    }
    return buildCompanyMap(companies);
  }, [seed]);

  const marketEvents = useMemo(() => shuffle(MARKET_EVENTS), [seed]);
  const raiseEvents = useMemo(() => shuffle(RAISE_EVENTS), [seed]);
  const investorPitches = useMemo(() => shuffle(INVESTOR_PITCHES), [seed]);

  // Get current company based on allocating phase
  const currentCompany = useMemo(() => {
    if (!isAllocatingPhase || gameOver) return null;
    const allocatingPhaseIndex = Math.floor(currentPhase / 2);
    const allocatingPhaseRound = round - (allocatingPhaseIndex * PHASE_LENGTH);
    if (allocatingPhaseRound < 0 || allocatingPhaseRound >= PHASE_LENGTH) return null;
    return dealFlow[allocatingPhaseRound % dealFlow.length];
  }, [round, isAllocatingPhase, currentPhase, gameOver, dealFlow]);

  // Get current raise event
  const currentRaiseEvent = useMemo(() => {
    if (isAllocatingPhase || gameOver) return null;
    const raisingPhaseIndex = Math.floor(currentPhase / 2);
    return raiseEvents[raisingPhaseIndex % raiseEvents.length];
  }, [currentPhase, isAllocatingPhase, gameOver, raiseEvents]);

  // Get available investor pitches
  const availablePitches = useMemo(() => {
    const usedPitches = raiseAttempts.map(r => r.pitchId);
    return investorPitches.filter(p => !usedPitches.includes(p.id)).slice(0, 4);
  }, [raiseAttempts, investorPitches]);

  const latestEvent = eventLog[0];
  const totalRaised = useMemo(() => raiseAttempts.reduce((sum, r) => sum + (r.success ? r.amount : 0), 0), [raiseAttempts]);

  const portfolioMarks = useMemo(() => {
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
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((left, right) => right.currentValue - left.currentValue);
  }, [companyMap, momentum, portfolio, reputation, round]);

  const totalValue = useMemo(() => {
    const portfolioValue = portfolioMarks.reduce((sum, investment) => sum + investment.currentValue, 0);
    return cash + portfolioValue;
  }, [cash, portfolioMarks]);

  const winners = portfolioMarks.filter((investment) => investment.multiple >= 2).length;
  const alphaScore = Math.round((totalValue - INITIAL_CAPITAL) * 11 + winners * 35 + reputation * 5 + totalRaised * 3);
  const rankedOutcome = getRankedOutcome(alphaScore);
  const bestDeal = portfolioMarks[0];

  const biggestMiss = useMemo(() => {
    return decisions
      .filter((decision) => decision.choice === 'pass')
      .map((decision) => companyMap[decision.companyId])
      .filter((company): company is Company => Boolean(company))
      .sort((left, right) => right.hiddenQuality - left.hiddenQuality)[0];
  }, [companyMap, decisions]);

  const resetGame = () => {
    setSeed(Date.now());
    setMode('intro');
    setRound(0);
    setCash(INITIAL_CAPITAL);
    setFundSize(INITIAL_FUND_SIZE);
    setReputation(56);
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
    setReputation(56);
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

      nextCash -= amount;
      const repDelta = fitScore >= 80 ? 4 : fitScore >= 68 ? 2 : fitScore >= 58 ? 0 : -3;
      nextReputation += repDelta - (currentCompany.risk >= 72 && amount >= 20 ? 2 : 0);
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
        fitScore >= 80
          ? `You led the round with ${formatMoney(amount)}. The partnership thinks this could be a flagship position.`
          : fitScore >= 64
            ? `You wrote a ${formatMoney(amount)} check into a credible bet with real upside.`
            : `You chased the story with ${formatMoney(amount)}. LPs are watching this one carefully.`;
    } else {
      nextReputation += currentCompany.hiddenQuality >= 90 ? -2 : currentCompany.hiddenQuality <= 68 ? 2 : 1;
      note =
        currentCompany.hiddenQuality >= 90
          ? 'You passed on a company that felt expensive. Time will decide whether that caution was discipline or fear.'
          : 'You passed and preserved capital. Sometimes not losing is the edge.';
    }

    const allocatingPhaseIndex = Math.floor(round / PHASE_LENGTH / 2);
    const allocatingPhaseRound = round - (allocatingPhaseIndex * PHASE_LENGTH);
    const nextEvent = marketEvents[allocatingPhaseRound % marketEvents.length];
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

    const convictionScore = reputation + convictionLevel * 8 + (currentRaiseEvent.tone === 'bull' ? 15 : currentRaiseEvent.tone === 'bear' ? -10 : 0);
    const difficultyThreshold = pitch.convictionRequired + currentRaiseEvent.difficulty * 3;
    const success = convictionScore >= difficultyThreshold;

    let amount = 0;
    let note = '';

    if (success) {
      amount = pitch.potentialRaise + Math.floor(Math.random() * (pitch.potentialRaise * 0.4));
      setFundSize((prev) => prev + amount);
      note =
        convictionScore >= difficultyThreshold + 20
          ? `Exceptional pitch. ${pitch.title} committed ${formatMoney(amount)}. They want to increase allocation.`
          : convictionScore >= difficultyThreshold + 10
            ? `Solid pitch. ${pitch.title} wrote a ${formatMoney(amount)} check. Impressed by the conviction.`
            : `Close call. ${pitch.title} wrote ${formatMoney(amount)}. Not their best quarter but enough.`;
    } else {
      note =
        convictionScore < difficultyThreshold - 15
          ? `${pitch.title} passed entirely. The conviction gap was too wide. They will remember this.`
          : `${pitch.title} deferred. They need to see more before committing. Try a different angle.`;
    }

    setReputation((prev) => clamp(prev + (success ? 3 : -2), 20, 99));
    setRaiseAttempts((current) => [
      {
        pitchId: pitch.id,
        amount,
        success,
        quarter: round,
        note,
      },
      ...current,
    ]);
    setRound((current) => current + 1);
  };

  const currentFit = currentCompany ? getFitScore(currentCompany) : 0;

  // Detect game over
  useEffect(() => {
    if (round >= TOTAL_ROUNDS && mode === 'playing') {
      setMode('gameover');
    }
  }, [round, mode]);

  const renderIntro = () => (
    <main className="flex flex-1 flex-col justify-between gap-10">
      <section className="grid flex-1 items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-cyan-100">
            <Sparkles className="h-4 w-4" />
            TEN31 // Investor Mode
          </div>

          <div className="space-y-5">
            <p className="max-w-xl text-sm uppercase tracking-[0.35em] text-white/45">Back the future. Dodge the hype. Compound conviction.</p>
            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] text-white sm:text-6xl lg:text-8xl">
              Build a venture fund
              <span className="bg-gradient-to-r from-cyan-200 via-white to-orange-300 bg-clip-text text-transparent"> cycle by cycle.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white/68 sm:text-xl">
              You run a $120M fund. 64 quarters. Eight allocation phases, eight fundraising phases. 
              The market does not wait. LPs do not forgive.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
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
              Shuffle Deck
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <StatBlock label="Fund size" value="$120M" hint="Deploy capital. Compound returns." />
            <StatBlock label="Time horizon" value="64 Quarters" hint="Eight 8-quarter cycles." />
            <StatBlock label="Two modes" value="Invest/Raise" hint="Allocate then raise. Repeat." />
            <StatBlock label="Goal" value="Compound" hint="Build a generational fund." />
          </div>
        </div>

        <div className="game-panel relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/40">The cycle</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Allocate. Raise. Repeat.</h2>
            </div>
            <div className="rounded-full border border-orange-300/30 bg-orange-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-orange-100">
              High stakes
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">Allocation Phase</p>
                  <h3 className="mt-2 text-3xl font-semibold text-white">Back founders. Size wisely.</h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">
                    Eight quarters to build a portfolio. Every check sizes your exposure. Market events reshuffle the board.
                  </p>
                </div>
                <Radar className="hidden h-10 w-10 text-cyan-200/80 sm:block" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-orange-100/70">Fundraising Phase</p>
                  <h3 className="mt-2 text-3xl font-semibold text-white">Convince LPs. Grow the fund.</h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">
                    Eight quarters to raise more capital. Pitch investors. Your reputation and track record determine outcomes.
                  </p>
                </div>
                <Handshake className="hidden h-10 w-10 text-orange-200/80 sm:block" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-4 flex items-center gap-3 text-orange-100">
                  <Flame className="h-5 w-5" />
                  <p className="text-sm font-medium uppercase tracking-[0.2em]">Track record</p>
                </div>
                <p className="text-sm leading-relaxed text-white/60">Your portfolio performance determines LP conviction. Winners open doors.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-4 flex items-center gap-3 text-cyan-100">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="text-sm font-medium uppercase tracking-[0.2em]">Reputation edge</p>
                </div>
                <p className="text-sm leading-relaxed text-white/60">A strong reputation lets you raise at better terms. Weak reputation means weak access.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-3 border-t border-white/10 px-1 pt-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <p>Investor simulator for TEN31 Capital. Build a generational fund across market cycles.</p>
        <a href="https://shakespeare.diy" target="_blank" rel="noreferrer" className="transition hover:text-white/70">
          Vibed with Shakespeare
        </a>
      </footer>
    </main>
  );

  const renderAllocatingPhase = () => (
    <>
      <header className="mb-4 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="game-panel flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-100/70">Phase {currentPhase + 1} // Allocating</p>
            <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Back the best companies before the market catches up.</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Quarter</p>
              <p className="mt-1 text-lg font-semibold text-white">{round + 1} / {TOTAL_ROUNDS}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Dry powder</p>
              <p className="mt-1 text-lg font-semibold text-white">{formatMoney(cash)}</p>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.25em] text-cyan-100/70">Fund size</p>
              <p className="mt-1 text-lg font-semibold text-cyan-100">{formatMoney(fundSize)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Reputation</p>
              <p className="mt-1 text-lg font-semibold text-white">{reputation}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={resetGame}
          className="inline-flex h-full items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-medium uppercase tracking-[0.22em] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
        >
          New Run
        </button>
      </header>

      <main className="grid flex-1 gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="space-y-4">
          {!gameOver && currentCompany ? (
            <div className="game-panel overflow-hidden p-6 sm:p-8">
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

              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-6">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-100/70">Founder memo</p>
                    <p className="mt-4 text-base leading-relaxed text-white/68">{currentCompany.summary}</p>
                  </div>

                  <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
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
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
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

                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="mb-4 flex items-center gap-2 text-orange-100">
                        <Gauge className="h-5 w-5" />
                        <p className="text-sm font-medium uppercase tracking-[0.2em]">Conviction</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">Thesis fit</p>
                        <p className="mt-2 text-4xl font-semibold text-white">{currentFit}</p>
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

                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
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
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleDecision(null)}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left transition hover:bg-white/[0.08]"
                      >
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Decision</p>
                        <p className="mt-2 text-2xl font-semibold text-white">Pass</p>
                      </button>
                    </div>
                    <p className="mt-4 text-sm text-white/50">Tip: a great fund is not just about picking winners. It is about sizing them correctly while preserving capital for obvious monsters.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="game-panel overflow-hidden p-6 sm:p-8">
              <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.34em] text-cyan-100/65">Allocation complete</p>
                  <h2 className="mt-3 text-4xl font-semibold text-white sm:text-6xl">Preparing to raise</h2>
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/68">The next phase begins. Time to convince LPs that your portfolio deserves more capital.</p>
                </div>
                <div className="rounded-full bg-gradient-to-r from-cyan-400/20 to-orange-400/20 px-5 py-2 text-sm font-medium text-cyan-100">
                  Next: Fundraising Phase
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatBlock label="Capital deployed" value={formatMoney(INITIAL_CAPITAL - cash)} hint="Checks written in this phase." />
                <StatBlock label="Positions" value={String(portfolio.filter(p => p.investedRound >= (currentPhase) * PHASE_LENGTH).length)} hint="New investments this phase." />
                <StatBlock label="Reputation" value={String(reputation)} hint="Your standing with LPs." />
                <StatBlock label="Fund size" value={formatMoney(fundSize)} hint="Current fund size." />
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="game-panel p-5">
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
                <>
                  <div className="flex items-center gap-3">
                    <Orbit className="h-5 w-5 text-cyan-100" />
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-white">Market waiting for your first move</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">The board will start reacting the moment you deploy or pass on your first company.</p>
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
                    <div className={`h-full rounded-full bg-gradient-to-r ${sectorAccent[sector].split(' ').find((token) => token.startsWith('from-')) ?? 'from-cyan-300'} via-white/80 to-transparent`} style={{ width: `${clamp((momentum[sector] + 1.5) / 3 * 100, 5, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="game-panel p-5">
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
                      <div className={`rounded-full px-3 py-1 text-xs font-medium ${investment.multiple >= 1.6 ? 'bg-emerald-400/15 text-emerald-100' : investment.multiple >= 1 ? 'bg-cyan-400/15 text-cyan-100' : 'bg-rose-400/15 text-rose-100'}`}>
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
        </aside>
      </main>

      <footer className="mt-4 flex flex-col gap-3 border-t border-white/10 px-1 pt-5 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <p>Goal: leave the run with the highest marked fund value, real winners in the book, and enough discipline to earn another vehicle.</p>
        <a href="https://shakespeare.diy" target="_blank" rel="noreferrer" className="transition hover:text-white/70">
          Vibed with Shakespeare
        </a>
      </footer>
    </>
  );

  const renderRaisingPhase = () => (
    <>
      <header className="mb-4 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="game-panel flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-orange-100/70">Phase {currentPhase + 1} // Fundraising</p>
            <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Convince LPs that your portfolio deserves more capital.</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Quarter</p>
              <p className="mt-1 text-lg font-semibold text-white">{round + 1} / {TOTAL_ROUNDS}</p>
            </div>
            <div className="rounded-2xl border border-orange-300/20 bg-orange-300/10 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.25em] text-orange-100/70">Fund size</p>
              <p className="mt-1 text-lg font-semibold text-orange-100">{formatMoney(fundSize)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Raised</p>
              <p className="mt-1 text-lg font-semibold text-white">{formatMoney(totalRaised)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Reputation</p>
              <p className="mt-1 text-lg font-semibold text-white">{reputation}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={resetGame}
          className="inline-flex h-full items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-medium uppercase tracking-[0.22em] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
        >
          New Run
        </button>
      </header>

      <main className="grid flex-1 gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="space-y-4">
          {currentRaiseEvent && (
            <div className="game-panel overflow-hidden p-6 sm:p-8">
              <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] ${currentRaiseEvent.tone === 'bull' ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100' : currentRaiseEvent.tone === 'bear' ? 'border-rose-400/30 bg-rose-400/10 text-rose-100' : 'border-white/20 bg-white/5 text-white/70'}`}>
                    <Users className="h-4 w-4" />
                    {currentRaiseEvent.tone === 'bull' ? 'LP Friendly' : currentRaiseEvent.tone === 'bear' ? 'LP Challenging' : 'Neutral Market'}
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-white/35">Quarter {currentPhaseRound + 1} of {PHASE_LENGTH}</p>
                    <h2 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">{currentRaiseEvent.title}</h2>
                    <p className="mt-3 max-w-3xl text-lg leading-relaxed text-white/72">{currentRaiseEvent.description}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[280px]">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Investor pool</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{currentRaiseEvent.investorPool} prospects</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Difficulty</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{currentRaiseEvent.difficulty}/10</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-orange-300/20 bg-orange-300/10 p-5">
                  <div className="mb-4 flex items-center gap-2 text-orange-100">
                    <Target className="h-5 w-5" />
                    <p className="text-sm font-medium uppercase tracking-[0.2em]">Available Investors</p>
                  </div>
                  <p className="text-sm text-white/60">Approach investors with conviction. Your reputation and pitch determine success.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {availablePitches.map((pitch) => (
                    <div key={pitch.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
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
                      <p className="mt-2 text-sm text-white/60 line-clamp-2">{pitch.description}</p>
                      <div className="mt-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Conviction needed: {pitch.convictionRequired + currentRaiseEvent.difficulty * 3}</p>
                        <p className="text-sm text-white/50 mt-1">Your conviction: {reputation}</p>
                      </div>
                      <div className="mt-4 grid gap-2">
                        <button
                          type="button"
                          onClick={() => handleRaiseAttempt(pitch, 1)}
                          className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-medium text-cyan-50 transition hover:bg-cyan-300/18"
                        >
                          Convince (Low pitch)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRaiseAttempt(pitch, 2)}
                          disabled={reputation < 50}
                          className="rounded-2xl border border-orange-300/25 bg-orange-300/10 px-4 py-3 text-sm font-medium text-orange-50 transition hover:bg-orange-300/18 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                        >
                          Persuade (Medium pitch)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRaiseAttempt(pitch, 3)}
                          disabled={reputation < 70}
                          className="rounded-2xl border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm font-medium text-rose-50 transition hover:bg-rose-300/18 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                        >
                          Dominate (High pitch)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!currentRaiseEvent && (
            <div className="game-panel overflow-hidden p-6 sm:p-8">
              <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.34em] text-orange-100/65">Fundraising complete</p>
                  <h2 className="mt-3 text-4xl font-semibold text-white sm:text-6xl">Ready to deploy</h2>
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/68">The next allocation phase begins. Your fund has grown. Time to back the next generation of founders.</p>
                </div>
                <div className="rounded-full bg-gradient-to-r from-orange-400/20 to-cyan-400/20 px-5 py-2 text-sm font-medium text-orange-100">
                  Next: Allocation Phase
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatBlock label="Total raised" value={formatMoney(totalRaised)} hint="Capital raised this phase." />
                <StatBlock label="Successful pitches" value={String(raiseAttempts.filter(r => r.success).length)} hint="LP commitments closed." />
                <StatBlock label="Reputation" value={String(reputation)} hint="Your standing with LPs." />
                <StatBlock label="Fund size" value={formatMoney(fundSize)} hint="Current fund size." />
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="game-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/40">Track record</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Your pedigree</h3>
              </div>
              <div className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${reputation >= 70 ? 'bg-emerald-400/15 text-emerald-100' : reputation >= 50 ? 'bg-cyan-400/15 text-cyan-100' : 'bg-rose-400/15 text-rose-100'}`}>
                {reputation >= 70 ? 'Elite' : reputation >= 50 ? 'Solid' : 'Developing'}
              </div>
            </div>

            <div className="space-y-4">
              <MetricBar label="Portfolio value" value={Math.min((totalValue / INITIAL_CAPITAL) * 50, 100)} />
              <MetricBar label="Reputation" value={reputation} />
              <MetricBar label="Win rate" value={portfolioMarks.filter(p => p.multiple >= 1.5).length * 10 + 20} />
              <MetricBar label="Fund growth" value={Math.min((fundSize / INITIAL_FUND_SIZE) * 50, 100)} />
            </div>
          </div>

          <div className="game-panel p-5">
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
                {raiseAttempts.slice(0, 5).map((attempt, index) => {
                  const pitch = investorPitches.find(p => p.id === attempt.pitchId);
                  return (
                    <div key={`${attempt.pitchId}-${attempt.quarter}-${index}`} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-white">{pitch?.title ?? 'Unknown Investor'}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/40">Quarter {attempt.quarter + 1}</p>
                        </div>
                        <div className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${attempt.success ? 'bg-emerald-400/15 text-emerald-100' : 'bg-rose-400/15 text-rose-100'}`}>
                          {attempt.success ? `+${formatMoney(attempt.amount)}` : 'Passed'}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-white/58">{attempt.note}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="game-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/40">Portfolio</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Holdings</h3>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/55">
                {portfolioMarks.length} positions
              </div>
            </div>

            {portfolioMarks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-white/50">
                No positions yet. Build your portfolio in allocation phases.
              </div>
            ) : (
              <div className="space-y-3">
                {portfolioMarks.slice(0, 4).map((investment) => (
                  <div key={investment.company.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{investment.company.name}</p>
                      <div className={`rounded-full px-2 py-0.5 text-xs font-medium ${investment.multiple >= 1.6 ? 'bg-emerald-400/15 text-emerald-100' : investment.multiple >= 1 ? 'bg-cyan-400/15 text-cyan-100' : 'bg-rose-400/15 text-rose-100'}`}>
                        {investment.multiple.toFixed(2)}x
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </main>

      <footer className="mt-4 flex flex-col gap-3 border-t border-white/10 px-1 pt-5 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <p>Goal: build a generational fund. Strong returns attract capital. Weak returns close doors.</p>
        <a href="https://shakespeare.diy" target="_blank" rel="noreferrer" className="transition hover:text-white/70">
          Vibed with Shakespeare
        </a>
      </footer>
    </>
  );

  const renderGameOver = () => (
    <>
      <header className="mb-4">
        <div className="game-panel overflow-hidden p-8">
          <div className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.34em] text-cyan-100/65">Fund marked to market</p>
              <h2 className="mt-3 text-4xl font-semibold text-white sm:text-6xl">{rankedOutcome.title}</h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/68">{rankedOutcome.description}</p>
            </div>

            <div className={`inline-flex rounded-full bg-gradient-to-r px-5 py-2 text-sm font-medium text-slate-950 ${rankedOutcome.accent}`}>
              Alpha score: {alphaScore}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatBlock label="Final fund value" value={formatMoney(totalValue)} hint="Cash plus marked portfolio value." />
            <StatBlock label="Capital deployed" value={formatMoney(INITIAL_CAPITAL - cash)} hint="Checks written across the whole run." />
            <StatBlock label="Total raised" value={formatMoney(totalRaised)} hint="Capital raised across fundraising phases." />
            <StatBlock label="Reputation" value={String(reputation)} hint="Your final market reputation." />
          </div>
        </div>
      </header>

      <main className="grid flex-1 gap-4 xl:grid-cols-2">
        <div className="game-panel p-6">
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

        <div className="game-panel p-6">
          <div className="mb-6 flex items-center gap-2 text-orange-100">
            <TriangleAlert className="h-5 w-5" />
            <p className="text-sm font-medium uppercase tracking-[0.2em]">Biggest miss</p>
          </div>
          {biggestMiss ? (
            <>
              <h3 className="text-2xl font-semibold text-white">{biggestMiss.name}</h3>
              <p className="mt-2 text-sm text-white/60">{biggestMiss.headline}</p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/60">
                You passed on one of the strongest hidden businesses in the deck. That restraint might have protected downside, but it also left serious upside on the table.
              </div>
            </>
          ) : (
            <p className="text-sm text-white/55">No obvious miss. Either you invested boldly or the deck never made you blink.</p>
          )}
        </div>
      </main>

      <footer className="mt-4 flex flex-col gap-3 border-t border-white/10 px-1 pt-5 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <p>Goal: leave the run with the highest marked fund value, real winners in the book, and enough discipline to earn another vehicle.</p>
        <a href="https://shakespeare.diy" target="_blank" rel="noreferrer" className="transition hover:text-white/70">
          Vibed with Shakespeare
        </a>
      </footer>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={resetGame}
          className="inline-flex items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/12 px-6 py-4 text-sm font-medium uppercase tracking-[0.24em] text-cyan-50 transition hover:bg-cyan-300/18"
        >
          Run it back
        </button>
        <button
          type="button"
          onClick={() => {
            resetGame();
            startGame();
          }}
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-4 text-sm font-medium uppercase tracking-[0.24em] text-white/72 transition hover:bg-white/[0.08] hover:text-white"
        >
          Instant rematch
        </button>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${GAME_BACKGROUND})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(251,146,60,0.16),transparent_26%),linear-gradient(180deg,rgba(6,10,18,0.2),rgba(6,10,18,0.92))]" />
      <div className="game-grid absolute inset-0 opacity-70" />

      <div className="relative isolate mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        {mode === 'intro' ? renderIntro() : mode === 'gameover' ? renderGameOver() : isAllocatingPhase ? renderAllocatingPhase() : renderRaisingPhase()}
      </div>
    </div>
  );
};

export default Index;
