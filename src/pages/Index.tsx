import { useMemo, useState, type CSSProperties } from 'react';
import { useSeoMeta } from '@unhead/react';
import {
  ArrowRight,
  BadgeDollarSign,
  BrainCircuit,
  Building2,
  Flame,
  Gauge,
  Orbit,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react';

import {
  COMPANIES,
  MARKET_EVENTS,
  sectorAccent,
  type Sector,
  type Tone,
  type Company,
  type MarketEvent,
  type Investment,
  type Decision,
  type Momentum,
} from '@/lib/gameData';

const GAME_BACKGROUND = 'https://blossom.ditto.pub/73fd8d04b15e0bbf4e90058ddd375f00ba57c61ef815fd4cb92b0eb7c8e1b1ce.jpeg';
const INITIAL_CAPITAL = 120;
const TOTAL_ROUNDS = 8;
const INVESTMENT_OPTIONS = [5, 10, 20] as const;

type RankedOutcome = {
  title: string;
  description: string;
  accent: string;
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
    title: 'TEN31 Investor Mode | Fund the Future',
    description: 'A playable investor simulation where you build a portfolio of the next great companies.',
  });

  const [seed, setSeed] = useState(() => Date.now());
  const [hasStarted, setHasStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [cash, setCash] = useState(INITIAL_CAPITAL);
  const [reputation, setReputation] = useState(56);
  const [portfolio, setPortfolio] = useState<Investment[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [eventLog, setEventLog] = useState<MarketEvent[]>([]);
  const [momentum, setMomentum] = useState<Momentum>(createInitialMomentum);

  const dealFlow = useMemo(() => shuffle(COMPANIES).slice(0, TOTAL_ROUNDS), [seed]);
  const eventDeck = useMemo(() => shuffle(MARKET_EVENTS).slice(0, TOTAL_ROUNDS), [seed]);
  const companyMap = useMemo(() => buildCompanyMap(dealFlow), [dealFlow]);

  const currentCompany = round < dealFlow.length ? dealFlow[round] : null;
  const latestEvent = eventLog[0];
  const gameOver = round >= dealFlow.length;

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
  const alphaScore = Math.round((totalValue - INITIAL_CAPITAL) * 11 + winners * 35 + reputation * 5);
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
    setHasStarted(false);
    setRound(0);
    setCash(INITIAL_CAPITAL);
    setReputation(56);
    setPortfolio([]);
    setDecisions([]);
    setEventLog([]);
    setMomentum(createInitialMomentum());
  };

  const handleDecision = (amount: number | null) => {
    if (!currentCompany || gameOver) return;

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

    const nextEvent = eventDeck[round];
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

  const currentFit = currentCompany ? getFitScore(currentCompany) : 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${GAME_BACKGROUND})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(251,146,60,0.16),transparent_26%),linear-gradient(180deg,rgba(6,10,18,0.2),rgba(6,10,18,0.92))]" />
      <div className="game-grid absolute inset-0 opacity-70" />

      <div className="relative isolate mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        {!hasStarted ? (
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
                    Build a venture portfolio
                    <span className="bg-gradient-to-r from-cyan-200 via-white to-orange-300 bg-clip-text text-transparent"> company by company.</span>
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-white/68 sm:text-xl">
                    You run a $120M fund. Eight quarters. Eight founder pitches. Some startups are generational and some are beautifully packaged disasters.
                    Your job is to find the best new companies before the market does.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setHasStarted(true)}
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
                    Shuffle Deal Flow
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <StatBlock label="Starting capital" value="$120M" hint="Every check changes the fate of the fund." />
                  <StatBlock label="Time horizon" value="8 Quarters" hint="Market events reshape the board every round." />
                  <StatBlock label="Win condition" value="Best portfolio" hint="Compound MOIC, reputation, and discipline." />
                </div>
              </div>

              <div className="game-panel relative overflow-hidden p-6 sm:p-8">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-white/40">Preview the board</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">What makes a winner?</h2>
                  </div>
                  <div className="rounded-full border border-orange-300/30 bg-orange-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-orange-100">
                    High stakes
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">Signal stack</p>
                        <h3 className="mt-2 text-3xl font-semibold text-white">Team, market, product, risk.</h3>
                        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">
                          Every company exposes enough signal to make a call, but not enough to make it easy. The best founders rarely look cheap.
                        </p>
                      </div>
                      <Radar className="hidden h-10 w-10 text-cyan-200/80 sm:block" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                      <div className="mb-4 flex items-center gap-3 text-orange-100">
                        <Flame className="h-5 w-5" />
                        <p className="text-sm font-medium uppercase tracking-[0.2em]">Narrative traps</p>
                      </div>
                      <p className="text-sm leading-relaxed text-white/60">Some companies look unstoppable on the surface and still vaporize capital once the market changes.</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                      <div className="mb-4 flex items-center gap-3 text-cyan-100">
                        <ShieldCheck className="h-5 w-5" />
                        <p className="text-sm font-medium uppercase tracking-[0.2em]">Asymmetric edge</p>
                      </div>
                      <p className="text-sm leading-relaxed text-white/60">The very best deals combine low obviousness with unusually durable product or distribution moats.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <footer className="flex flex-col gap-3 border-t border-white/10 px-1 pt-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
              <p>Investor simulator for TEN31 Capital. Pick the right founders and let the market rerate your convictions.</p>
              <a href="https://shakespeare.diy" target="_blank" rel="noreferrer" className="transition hover:text-white/70">
                Vibed with Shakespeare
              </a>
            </footer>
          </main>
        ) : (
          <>
            <header className="mb-4 grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="game-panel flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-100/70">TEN31 // Investor Mode</p>
                  <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Back the best companies before the market catches up.</h1>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Quarter</p>
                    <p className="mt-1 text-lg font-semibold text-white">{Math.min(round + 1, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Dry powder</p>
                    <p className="mt-1 text-lg font-semibold text-white">{formatMoney(cash)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Fund value</p>
                    <p className="mt-1 text-lg font-semibold text-white">{formatMoney(totalValue)}</p>
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
                          <p className="text-sm uppercase tracking-[0.35em] text-white/35">Deal {round + 1}</p>
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
                      <StatBlock label="2x+ winners" value={String(winners)} hint="Positions that meaningfully carried returns." />
                      <StatBlock label="Reputation" value={String(reputation)} hint="Your market reputation after the run." />
                    </div>

                    <div className="mt-8 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="mb-4 flex items-center gap-2 text-cyan-100">
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

                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="mb-4 flex items-center gap-2 text-orange-100">
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
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
                          setHasStarted(true);
                        }}
                        className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-4 text-sm font-medium uppercase tracking-[0.24em] text-white/72 transition hover:bg-white/[0.08] hover:text-white"
                      >
                        Instant rematch
                      </button>
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
                      {portfolioMarks.map((investment) => (
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

                <div className="game-panel p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-white/40">Decision log</p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">Your last moves</h3>
                    </div>
                  </div>

                  {decisions.length === 0 ? (
                    <p className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-sm text-white/50">
                      No decisions logged yet. Read the room, then deploy.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {decisions.slice(0, 4).map((decision) => {
                        const company = companyMap[decision.companyId];
                        if (!company) return null;

                        return (
                          <div key={`${decision.companyId}-${decision.round}`} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-base font-semibold text-white">{company.name}</p>
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
              </aside>
            </main>

            <footer className="mt-4 flex flex-col gap-3 border-t border-white/10 px-1 pt-5 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
              <p>Goal: leave the run with the highest marked fund value, real winners in the book, and enough discipline to earn another vehicle.</p>
              <a href="https://shakespeare.diy" target="_blank" rel="noreferrer" className="transition hover:text-white/70">
                Vibed with Shakespeare
              </a>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
