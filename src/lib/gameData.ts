export type Sector = 'AI' | 'Infrastructure' | 'Energy' | 'Security' | 'Fintech' | 'Robotics' | 'Climate' | 'Biotech';
export type Tone = 'bull' | 'bear' | 'neutral';

export type Company = {
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

export type MarketEvent = {
  id: string;
  title: string;
  description: string;
  tone: Tone;
  globalShift: number;
  reputationShift: number;
  sectorShift: Partial<Record<Sector, number>>;
};

export type Investment = {
  companyId: string;
  amount: number;
  investedRound: number;
  fitScore: number;
};

export type Decision = {
  companyId: string;
  choice: 'invest' | 'pass';
  amount?: number;
  round: number;
  note: string;
};

export type Momentum = Record<Sector, number> & {
  global: number;
};

export const COMPANIES: Company[] = [
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

export const MARKET_EVENTS: MarketEvent[] = [
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

export const sectorAccent: Record<Sector, string> = {
  AI: 'from-fuchsia-500/25 via-violet-500/20 to-transparent text-fuchsia-200 border-fuchsia-400/30',
  Infrastructure: 'from-cyan-500/25 via-sky-500/20 to-transparent text-cyan-100 border-cyan-400/30',
  Energy: 'from-amber-500/25 via-orange-500/20 to-transparent text-amber-100 border-amber-400/30',
  Security: 'from-emerald-500/25 via-teal-500/20 to-transparent text-emerald-100 border-emerald-400/30',
  Fintech: 'from-indigo-500/25 via-blue-500/20 to-transparent text-indigo-100 border-indigo-400/30',
  Robotics: 'from-rose-500/25 via-orange-500/20 to-transparent text-rose-100 border-rose-400/30',
  Climate: 'from-lime-500/25 via-green-500/20 to-transparent text-lime-100 border-lime-400/30',
  Biotech: 'from-pink-500/25 via-purple-500/20 to-transparent text-pink-100 border-pink-400/30',
};

// Fundraising event types
export type RaiseEvent = {
  id: string;
  title: string;
  description: string;
  tone: 'bull' | 'bear' | 'neutral';
  difficulty: number; // 1-10, affects investor persuasion threshold
  investorPool: number; // Base number of potential investors this quarter
  convictionBonus: number; // Reputation bonus if you exceed the target
};

export type RaiseResult = {
  success: boolean;
  amount: number;
  note: string;
  investorSatisfaction: number;
};

export const RAISE_EVENTS: RaiseEvent[] = [
  {
    id: 'lp-summit',
    title: 'LP Summit Season',
    description: 'Major LPs gather in a mountain resort. The conversations happen over whiskey and golf. Your reputation opens doors—or closes them.',
    tone: 'neutral',
    difficulty: 3,
    investorPool: 8,
    convictionBonus: 3,
  },
  {
    id: 'portfolio-showcase',
    title: 'Portfolio Showcase',
    description: 'Portfolio companies present at ademo day. Winners get second checks. The duds get quietly dropped from future invites.',
    tone: 'bull',
    difficulty: 4,
    investorPool: 12,
    convictionBonus: 5,
  },
  {
    id: 'market-turbulence',
    title: 'Market Turbulence',
    description: 'Public markets are volatile. LPs are nervous. The ones with conviction write checks. The rest go dark until things stabilize.',
    tone: 'bear',
    difficulty: 7,
    investorPool: 5,
    convictionBonus: 2,
  },
  {
    id: 'conference-circuit',
    title: 'Conference Circuit',
    description: 'A packed week of panels, coffees, and awkward introductions. Everyone is pitching everyone. Filter for signal.',
    tone: 'neutral',
    difficulty: 5,
    investorPool: 15,
    convictionBonus: 4,
  },
  {
    id: 'term-sheet-war',
    title: 'Term Sheet War',
    description: 'Multiple funds circling the same LP base. It is a competition for conviction. Only the sharpest pitches close.',
    tone: 'bear',
    difficulty: 8,
    investorPool: 6,
    convictionBonus: 6,
  },
  {
    id: 'portfolio-appreciation',
    title: 'Portfolio Appreciation',
    description: 'Your best companies are hitting milestones. Press mentions pile up. LPs who passed last time are suddenly available.',
    tone: 'bull',
    difficulty: 2,
    investorPool: 10,
    convictionBonus: 4,
  },
  {
    id: 'regulatory-shift',
    title: 'Regulatory Shift',
    description: 'New rules are reshaping the industry. Some LPs are paralyzed. Others see opportunity. Navigate the noise.',
    tone: 'neutral',
    difficulty: 6,
    investorPool: 7,
    convictionBonus: 3,
  },
  {
    id: 'breakthrough-announcement',
    title: 'Portfolio Breakthrough',
    description: 'A portfolio company announces a major breakthrough. The press cycle is brutal. LPs are watching how you handle the spotlight.',
    tone: 'bull',
    difficulty: 3,
    investorPool: 14,
    convictionBonus: 7,
  },
  {
    id: 'founder-referrals',
    title: 'Founder Referral Network',
    description: 'Founders you backed are now vouching for you. Warm intros flow like water. The quality of your portfolio is showing.',
    tone: 'bull',
    difficulty: 2,
    investorPool: 18,
    convictionBonus: 5,
  },
  {
    id: 'fund-cycle-fatigue',
    title: 'Fund Cycle Fatigue',
    description: 'LPs have been pitched 40 times this quarter. Attention is scarce. You need something memorable to break through.',
    tone: 'bear',
    difficulty: 9,
    investorPool: 4,
    convictionBonus: 4,
  },
  {
    id: 'cohort-analysis',
    title: 'Cohort Analysis Season',
    description: 'LP teams are running the numbers on their portfolios. The data speaks. Either you are in the top quartile or you are fighting for survival.',
    tone: 'neutral',
    difficulty: 5,
    investorPool: 9,
    convictionBonus: 6,
  },
  {
    id: 'emerging-manager-wave',
    title: 'Emerging Manager Wave',
    description: 'A new generation of LPs is looking for the next Sequoia. Bet on the underdog or bet on track record. Choose wisely.',
    tone: 'bull',
    difficulty: 4,
    investorPool: 20,
    convictionBonus: 5,
  },
];

export type InvestorPitch = {
  id: string;
  title: string;
  description: string;
  riskLevel: 'safe' | 'balanced' | 'aggressive';
  potentialRaise: number;
  convictionRequired: number;
};

export const INVESTOR_PITCHES: InvestorPitch[] = [
  {
    id: 'anchor-lp',
    title: 'Anchor LP Commitment',
    description: 'A family office wants to anchor your fund at a favorable valuation. They need a personal meeting and references.',
    riskLevel: 'safe',
    potentialRaise: 25,
    convictionRequired: 40,
  },
  {
    id: 'sovereign-wealth',
    title: 'Sovereign Wealth Interest',
    description: 'A state fund is exploring alternatives. Bureaucracy is brutal but the check could be transformative.',
    riskLevel: 'balanced',
    potentialRaise: 40,
    convictionRequired: 60,
  },
  {
    id: 'tech-executive',
    title: 'Tech Executive Angels',
    description: 'A group of successful founders pooling capital. They want access and board observer seats.',
    riskLevel: 'safe',
    potentialRaise: 15,
    convictionRequired: 30,
  },
  {
    id: 'institutional-hedge',
    title: 'Institutional Allocation',
    description: 'A university endowment considering a small check. Two years of relationship building before they write.',
    riskLevel: 'balanced',
    potentialRaise: 30,
    convictionRequired: 55,
  },
  {
    id: 'crypto-native',
    title: 'Crypto-Native Capital',
    description: 'On-chain money looking for alpha. Fast decisions but volatile relationships. Terms can be unusual.',
    riskLevel: 'aggressive',
    potentialRaise: 35,
    convictionRequired: 45,
  },
  {
    id: 'strategic-corporate',
    title: 'Strategic Corporate',
    description: 'A public company exploring venture exposure. They want co-investment rights and deal flow.',
    riskLevel: 'balanced',
    potentialRaise: 45,
    convictionRequired: 65,
  },
  {
    id: 'diaspora-network',
    title: 'Diaspora Network',
    description: 'A tight-knit community of entrepreneurs backing each other. High trust, moderate checks.',
    riskLevel: 'safe',
    potentialRaise: 20,
    convictionRequired: 35,
  },
  {
    id: 'celebrity-adjacent',
    title: 'Entertainment Capital',
    description: 'Someone famous wants brand association with venture returns. Flashy but complicated to manage.',
    riskLevel: 'aggressive',
    potentialRaise: 50,
    convictionRequired: 70,
  },
  {
    id: 'pension-fund',
    title: 'Pension Fund Allocation',
    description: 'A municipal pension allocating to alternatives. Multi-year commitment but glacial due diligence.',
    riskLevel: 'safe',
    potentialRaise: 60,
    convictionRequired: 80,
  },
  {
    id: 'family-office-circle',
    title: 'Multi-Family Office',
    description: 'A network of UHNW families pooling research and co-investing. Sophisticated and demanding.',
    riskLevel: 'balanced',
    potentialRaise: 35,
    convictionRequired: 50,
  },
  {
    id: 'growth-equity',
    title: 'Growth Equity Crossover',
    description: 'A PE fund exploring VC allocation. They want leverage and board control provisions.',
    riskLevel: 'aggressive',
    potentialRaise: 55,
    convictionRequired: 75,
  },
  {
    id: 'research-fund',
    title: 'Academic Endowment',
    description: 'University capital looking for innovation exposure. Long-term thinking but rigid processes.',
    riskLevel: 'safe',
    potentialRaise: 25,
    convictionRequired: 45,
  },
];
