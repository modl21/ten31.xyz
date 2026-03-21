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

const GAME_BACKGROUND = 'https://blossom.ditto.pub/73fd8d04b15e0bbf4e90058ddd375f00ba57c61ef815fd4cb92b0eb7c8e1b1ce.jpeg';
const INITIAL_CAPITAL = 120;
const TOTAL_ROUNDS = 8;
const INVESTMENT_OPTIONS = [5, 10, 20] as const;

type Sector = 'AI' | 'Infrastructure' | 'Energy' | 'Security' | 'Fintech' | 'Robotics' | 'Climate' | 'Biotech';
type Tone = 'bull' | 'bear' | 'neutral';

type Company = {
  id: string;
  name: string;
  sector: Sector;
  stage: 'Pre-seed' | 'Seed' | 'Series A';
  ask: number;
  valuation: number;
  headline: string;
  summary: string;
  traction: string;
  edge: string;
  watchout: string;
  thesis: string[];
  team: number;
  product: number;
  market: number;
  risk: number;
  hiddenQuality: number;
  volatility: number;
};

type MarketEvent = {
  id: string;
  title: string;
  description: string;
  tone: Tone;
  globalShift: number;
  reputationShift: number;
  sectorShift: Partial<Record<Sector, number>>;
};

type Investment = {
  companyId: string;
  amount: number;
  investedRound: number;
  fitScore: number;
};

type Decision = {
  companyId: string;
  choice: 'invest' | 'pass';
  amount?: number;
  round: number;
  note: string;
};

type Momentum = Record<Sector, number> & {
  global: number;
};

type RankedOutcome = {
  title: string;
  description: string;
  accent: string;
};

const COMPANIES: Company[] = [
  {
    id: 'atlas-forge',
    name: 'Atlas Forge',
    sector: 'Infrastructure',
    stage: 'Seed',
    ask: 10,
    valuation: 42,
    headline: 'Turns idle industrial fleets into modular compute foundries.',
    summary: 'A brutalist software + hardware play converting unused industrial power into rentable AI and bitcoin compute.',
    traction: '22 enterprise pilots, 178% QoQ revenue growth, 91% retention.',
    edge: 'Founders previously shipped at SpaceX and Stripe infrastructure teams.',
    watchout: 'Requires heavy deployment ops and disciplined capex sequencing.',
    thesis: ['Hard infrastructure', 'AI pickaxes', 'Energy efficiency'],
    team: 89,
    product: 84,
    market: 82,
    risk: 36,
    hiddenQuality: 93,
    volatility: 0.7,
  },
  {
    id: 'lattice-labs',
    name: 'Lattice Labs',
    sector: 'AI',
    stage: 'Series A',
    ask: 20,
    valuation: 115,
    headline: 'Inference routing layer for every frontier model in production.',
    summary: 'Sells an orchestration layer that reduces model cost while improving latency across regulated industries.',
    traction: 'ARR at $14M, signed 3 global insurers, 142% net revenue retention.',
    edge: 'Infra product with deep compliance moat and unusually low customer churn.',
    watchout: 'Category is crowded and buyers will pressure pricing every renewal cycle.',
    thesis: ['AI infrastructure', 'Enterprise software', 'Margin expansion'],
    team: 85,
    product: 88,
    market: 90,
    risk: 41,
    hiddenQuality: 90,
    volatility: 0.9,
  },
  {
    id: 'ember-grid',
    name: 'Ember Grid',
    sector: 'Energy',
    stage: 'Seed',
    ask: 10,
    valuation: 38,
    headline: 'Software that monetizes stranded energy with autonomous load balancing.',
    summary: 'Ember sells a control plane for energy operators that routes excess power into profitable compute workloads in seconds.',
    traction: '11 utility partners, 5 signed sites, gross margin already above 62%.',
    edge: 'Clear wedge into a supply-constrained market with regulatory tailwinds.',
    watchout: 'Hardware integrations create ugly implementation timelines.',
    thesis: ['Energy abundance', 'Compute infrastructure', 'Real-world moats'],
    team: 83,
    product: 79,
    market: 87,
    risk: 38,
    hiddenQuality: 91,
    volatility: 0.75,
  },
  {
    id: 'harbor-os',
    name: 'Harbor OS',
    sector: 'Security',
    stage: 'Pre-seed',
    ask: 5,
    valuation: 18,
    headline: 'Self-custody security layer for sovereign treasury teams.',
    summary: 'Builds policy engines, hardware attestations, and recovery workflows for companies holding strategic digital assets.',
    traction: 'Only $700k ARR today, but 9 design partners include public companies.',
    edge: 'Tiny now, but founder-market fit is elite and customer pain is visceral.',
    watchout: 'Long sales cycles could delay breakout if budget windows tighten.',
    thesis: ['Security', 'Digital asset rails', 'Category-defining trust layer'],
    team: 92,
    product: 81,
    market: 73,
    risk: 43,
    hiddenQuality: 89,
    volatility: 0.65,
  },
  {
    id: 'pulse-ledger',
    name: 'Pulse Ledger',
    sector: 'Fintech',
    stage: 'Series A',
    ask: 20,
    valuation: 145,
    headline: 'API stack for instant global treasury and treasury-backed cards.',
    summary: 'The deck is gorgeous and growth looks explosive, but the compliance burden keeps moving faster than the team.',
    traction: 'Volume up 310% YoY with 41 enterprise logos in the funnel.',
    edge: 'Exceptional design and massive market appetite from CFO teams.',
    watchout: 'High burn and regulatory exposure can crush a hot company overnight.',
    thesis: ['Financial infrastructure', 'Cross-border money movement', 'Enterprise fintech'],
    team: 74,
    product: 86,
    market: 92,
    risk: 71,
    hiddenQuality: 69,
    volatility: 1.2,
  },
  {
    id: 'helix-carbon',
    name: 'Helix Carbon',
    sector: 'Climate',
    stage: 'Series A',
    ask: 20,
    valuation: 160,
    headline: 'Carbon-negative compute campuses with synthetic fuel byproducts.',
    summary: 'Wildly ambitious climate-tech moonshot chasing massive outcomes with very expensive execution risk.',
    traction: 'Mega-brand partnerships announced, but revenue quality is still unproven.',
    edge: 'Narrative power is off the charts and top-tier funds already joined the cap table.',
    watchout: 'Capital intensity is brutal and the tech stack still needs a miracle.',
    thesis: ['Climate infrastructure', 'Industrial scale', 'Narrative momentum'],
    team: 77,
    product: 68,
    market: 88,
    risk: 79,
    hiddenQuality: 62,
    volatility: 1.25,
  },
  {
    id: 'sable-robotics',
    name: 'Sable Robotics',
    sector: 'Robotics',
    stage: 'Seed',
    ask: 10,
    valuation: 48,
    headline: 'Warehouse robots that learn workflows without retraining the fleet.',
    summary: 'Sable automates mid-market logistics operators using a model-native robotics stack with a clean payback period.',
    traction: '18 paid sites, churn near zero, backlog booked through next two quarters.',
    edge: 'A real wedge in a painful labor market with measurable ROI.',
    watchout: 'Hardware margins could compress if component costs spike again.',
    thesis: ['Automation', 'Embodied AI', 'Industrial productivity'],
    team: 81,
    product: 80,
    market: 78,
    risk: 47,
    hiddenQuality: 84,
    volatility: 0.85,
  },
  {
    id: 'nucleus-bio',
    name: 'Nucleus Bio',
    sector: 'Biotech',
    stage: 'Pre-seed',
    ask: 5,
    valuation: 25,
    headline: 'AI-guided genomic simulation engine for precision medicine.',
    summary: 'Huge upside if the science is real, but commercial timing is murky and validation cycles are slow.',
    traction: 'Two lab partnerships and astonishing early benchmark results.',
    edge: 'The science team is world-class and the TAM is giant if translation works.',
    watchout: 'Could easily become a science project instead of a business.',
    thesis: ['Bio + AI', 'Deep tech', 'Long-dated asymmetric upside'],
    team: 86,
    product: 73,
    market: 72,
    risk: 74,
    hiddenQuality: 72,
    volatility: 1.15,
  },
  {
    id: 'meridian-compute',
    name: 'Meridian Compute',
    sector: 'Infrastructure',
    stage: 'Series A',
    ask: 20,
    valuation: 110,
    headline: 'Private-market cloud for sovereign AI workloads and sensitive data.',
    summary: 'Sells secure workload clusters for governments and critical industries that cannot live on commodity hyperscalers.',
    traction: 'ARR at $19M, 134% net retention, profit-positive in the most recent quarter.',
    edge: 'Rare mix of revenue quality, high trust, and geopolitical tailwinds.',
    watchout: 'Government procurement cycles can freeze growth unexpectedly.',
    thesis: ['Infrastructure', 'Sovereign compute', 'Defensible margins'],
    team: 88,
    product: 90,
    market: 84,
    risk: 34,
    hiddenQuality: 95,
    volatility: 0.68,
  },
  {
    id: 'open-circuit',
    name: 'Open Circuit',
    sector: 'Security',
    stage: 'Seed',
    ask: 10,
    valuation: 36,
    headline: 'Open-source security observability for modern machine fleets.',
    summary: 'An elegant security layer for connected hardware that wins by being radically transparent and developer loved.',
    traction: 'Fastest-growing open-source repo in its category, 6 enterprise conversions already closed.',
    edge: 'Open-source distribution plus enterprise monetization is working earlier than expected.',
    watchout: 'Will need enterprise sales muscle to turn love into lasting ARR.',
    thesis: ['Open source', 'Security', 'Developer distribution'],
    team: 84,
    product: 87,
    market: 77,
    risk: 42,
    hiddenQuality: 88,
    volatility: 0.8,
  },
  {
    id: 'aurora-stack',
    name: 'Aurora Stack',
    sector: 'Fintech',
    stage: 'Seed',
    ask: 10,
    valuation: 40,
    headline: 'Programmable treasury stack for internet-native operators.',
    summary: 'Builds a modern CFO cockpit with embedded yield, liquidity intelligence, and instant treasury movement.',
    traction: 'Revenue still early, but pilots convert quickly and usage expands account-wide.',
    edge: 'Product quality is absurdly high and onboarding feels like consumer software.',
    watchout: 'Pricing power may not match the category hype.',
    thesis: ['Treasury software', 'Fintech infrastructure', 'Product-led adoption'],
    team: 80,
    product: 91,
    market: 76,
    risk: 52,
    hiddenQuality: 81,
    volatility: 0.95,
  },
  {
    id: 'quarry-ai',
    name: 'Quarry AI',
    sector: 'AI',
    stage: 'Pre-seed',
    ask: 5,
    valuation: 20,
    headline: 'Autonomous field-research agents that replace armies of analysts.',
    summary: 'Feels like magic in demos and the time savings are real, but product depth is still shallow under the hood.',
    traction: 'Usage exploding inside hedge funds and consulting teams on annual plans.',
    edge: 'Distribution through analysts and power users is spreading like a memetic virus.',
    watchout: 'Could get outcompeted if product moats do not harden fast.',
    thesis: ['AI application layer', 'Research automation', 'Viral product distribution'],
    team: 71,
    product: 76,
    market: 89,
    risk: 67,
    hiddenQuality: 70,
    volatility: 1.18,
  },
];

const MARKET_EVENTS: MarketEvent[] = [
  {
    id: 'open-source-wave',
    title: 'Open-source adoption wave',
    description: 'Enterprises embrace transparent infrastructure after a costly lock-in cycle. Security and infrastructure teams suddenly look underpriced.',
    tone: 'bull',
    globalShift: 0.18,
    reputationShift: 2,
    sectorShift: { Infrastructure: 0.55, Security: 0.45 },
  },
  {
    id: 'credit-freeze',
    title: 'Credit markets freeze',
    description: 'Capital gets expensive. Cash burn is punished immediately and flashy balance-sheet stories get repriced hard.',
    tone: 'bear',
    globalShift: -0.22,
    reputationShift: 1,
    sectorShift: { Fintech: -0.55, Climate: -0.35, Biotech: -0.2 },
  },
  {
    id: 'ai-cost-collapse',
    title: 'Inference costs collapse',
    description: 'Foundation model costs fall off a cliff. AI infrastructure and applications expand margins faster than anyone expected.',
    tone: 'bull',
    globalShift: 0.16,
    reputationShift: 1,
    sectorShift: { AI: 0.6, Infrastructure: 0.25, Robotics: 0.2 },
  },
  {
    id: 'grid-stress',
    title: 'Grid stress becomes front-page news',
    description: 'Energy resilience becomes strategic. Software that monetizes supply and balances load gets a massive narrative boost.',
    tone: 'bull',
    globalShift: 0.08,
    reputationShift: 1,
    sectorShift: { Energy: 0.7, Infrastructure: 0.2, Climate: 0.15 },
  },
  {
    id: 'regulatory-whiplash',
    title: 'Regulatory whiplash',
    description: 'Cross-border money products get dragged into a messy policy fight. Founders with weak compliance discipline take heavy damage.',
    tone: 'bear',
    globalShift: -0.12,
    reputationShift: 0,
    sectorShift: { Fintech: -0.65, Security: 0.12 },
  },
  {
    id: 'automation-boom',
    title: 'Automation boom',
    description: 'Labor shortages worsen. Operators stop debating robotics and start buying anything with a measurable payback window.',
    tone: 'bull',
    globalShift: 0.14,
    reputationShift: 1,
    sectorShift: { Robotics: 0.65, AI: 0.2 },
  },
  {
    id: 'deep-tech-fatigue',
    title: 'Deep-tech fatigue',
    description: 'Investors lose patience with grand narratives that are years from monetization. Expensive moonshots wobble.',
    tone: 'bear',
    globalShift: -0.16,
    reputationShift: 1,
    sectorShift: { Climate: -0.55, Biotech: -0.42, Robotics: -0.12 },
  },
  {
    id: 'defense-priority',
    title: 'Sovereign systems become a priority',
    description: 'Governments and large enterprises rush to secure sensitive workloads. Trusted infrastructure and security names rerate upward.',
    tone: 'bull',
    globalShift: 0.13,
    reputationShift: 2,
    sectorShift: { Security: 0.55, Infrastructure: 0.48 },
  },
  {
    id: 'liquidity-window',
    title: 'IPO window cracks open',
    description: 'Growth capital comes back. The best compounders get marked up fast and even middling stories catch a bid.',
    tone: 'bull',
    globalShift: 0.24,
    reputationShift: 2,
    sectorShift: { AI: 0.18, Fintech: 0.18, Infrastructure: 0.18, Energy: 0.18 },
  },
  {
    id: 'supply-shock',
    title: 'Hardware supply shock',
    description: 'Components spike in price. Teams with fragile hardware margins or long deployment cycles lose momentum.',
    tone: 'bear',
    globalShift: -0.14,
    reputationShift: 0,
    sectorShift: { Robotics: -0.3, Energy: -0.18, Infrastructure: -0.12 },
  },
];

const sectorAccent: Record<Sector, string> = {
  AI: 'from-fuchsia-500/25 via-violet-500/20 to-transparent text-fuchsia-200 border-fuchsia-400/30',
  Infrastructure: 'from-cyan-500/25 via-sky-500/20 to-transparent text-cyan-100 border-cyan-400/30',
  Energy: 'from-amber-500/25 via-orange-500/20 to-transparent text-amber-100 border-amber-400/30',
  Security: 'from-emerald-500/25 via-teal-500/20 to-transparent text-emerald-100 border-emerald-400/30',
  Fintech: 'from-indigo-500/25 via-blue-500/20 to-transparent text-indigo-100 border-indigo-400/30',
  Robotics: 'from-rose-500/25 via-orange-500/20 to-transparent text-rose-100 border-rose-400/30',
  Climate: 'from-lime-500/25 via-green-500/20 to-transparent text-lime-100 border-lime-400/30',
  Biotech: 'from-pink-500/25 via-purple-500/20 to-transparent text-pink-100 border-pink-400/30',
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
