export interface Insight {
  title: string;
  slug: string;
  date: string;
  author: string;
  excerpt: string;
  content: string; // Basic HTML or Markdown string for the post
  image?: string;
}

export const INSIGHTS: Insight[] = [
  {
    title: "Quantum Leap?",
    slug: "quantum-computing-bitcoin-security",
    date: "Jan 13, 2026",
    author: "John Arnold",
    excerpt: "Disentangling fact from fiction in bitcoin and quantum computing. Google's Willow chip shows impressive progress, but the journey toward a cryptanalytically relevant quantum computer remains in its infancy.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825349532-BTGUN12TAYOQS82YOD0B/Step_Two02.jpg",
    content: `
      <p>As the largest investment platform focused on bitcoin, we field questions about bitcoin every day, and there are a handful of concerns that are common to almost everyone exploring the space. Most of these have been pretty clearly addressed just by the natural course of history; for example, every year that bitcoin maintains its massive lead in network effects, resilience, and value accrual relative to the rest of “crypto,” it’s progressively clearer why bitcoin can’t be easily copied or outcompeted, and every failed government ban of bitcoin – or more recently, various governments’ pivots to <em>embracing</em> bitcoin – only further cement why “the government will ban it” isn’t a strong bear case. But one long-running concern we frequently hear that is harder to quickly dispel at this point in bitcoin’s history is the potential for advances in quantum computing to eventually compromise bitcoin security in some critical way.</p>
      
      <p>This concern has recently been in focus once again thanks to the announcement of <a href="https://blog.google/technology/research/google-willow-quantum-chip/">Willow</a>, Google’s newest quantum computing chip. The Willow chip represents a noteworthy step forward in the decades-long process of building a quantum computer that can eventually perform practical applications like compromising the public-key cryptography securing many systems including bitcoin, so its arrival has predictably inspired the latest round of <a href="https://99bitcoins.com/bitcoin-obituaries/">bitcoin obituaries</a>. However, while Willow shows impressive progress on some key dimensions, the journey toward a <a href="https://www.cisco.com/c/dam/en_us/about/doing_business/trust-center/docs/cisco-cryptography-in-a-post-quantum-world-overview.pdf">cryptanalytically relevant</a> quantum computer (<strong>“CRQC”</strong>) – that is, a quantum computer that can threaten modern cryptography – remains in its infancy with many massive hurdles still to overcome, and recent updates are unlikely to alter existing timelines for quantum computing development. Meanwhile, this issue is far from unknown to bitcoin developers, and a variety of potential mitigating solutions are already available today. All the same, the progress of quantum computing could certainly accelerate from here, so it’s worth developing a clear idea of how a sufficiently scaled quantum computer could ultimately affect bitcoin and how the network might be able to respond.</p>

      <h4>Some Very Brief Background</h4>
      <p>Before diving in, it may be helpful to briefly review some key premises built into most modern digital security systems, including (but not limited to) bitcoin. Modern cryptographic security relies on various forms of assumed “computational hardness” – that is, the assumption that certain math problems are complex enough to be effectively infeasible for conventional computers. One example is the <a href="https://en.wikipedia.org/wiki/Computational_hardness_assumption#Discrete_log_problem_(DLP)">discrete log problem</a>, which posits in simplest terms that it is extremely difficult to determine the solution to <em>logb(a)</em> when <em>a</em> and <em>b</em> are very large prime numbers. Application of this problem to an elliptic curve allows for <a href="https://github.com/bitcoinbook/bitcoinbook/blob/ebb0aa43fb7303505a993b9505f7867d9874ad69/ch04_keys.adoc#elliptic-curve-cryptography-explained">elliptic curve cryptography</a>, an iteration of which underpins the generation of bitcoin’s public/private key pairs and the signature algorithm used for most bitcoin transactions (Elliptic Curve Digital Signature Algorithm, or <a href="https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm">ECDSA</a>). This system rests on the fundamental asymmetry of “one-way functions”: it is trivial to produce and validate a signature for a public key (a particular point somewhere on the elliptic curve) if its private key (a randomly generated value) is known, but the discrete log problem makes it prohibitively difficult to reverse-engineer that same private key if only the public key is known.</p>

      <p>This problem is difficult enough that there is no better approach for classical computers than guessing and checking many potential solutions for the private key – also known as “brute forcing” – but this is still practically infeasible even for the most advanced conventional supercomputer. Since a bitcoin private key is a 256-bit number, there are 2^256 or approximately 1.1 x 10^77 possible alphanumeric combinations in bitcoin’s keyspace, a figure roughly comparable to the number of atoms in the entire observable universe. For the best known conventional algorithms, the difficulty of breaking a 256-bit key is the square root of the keyspace size (2^128 in this case), so if the world’s <a href="https://www.hpe.com/us/en/newsroom/blog-post/2024/11/hpe-built-direct-liquid-cooled-supercomputers-top-november-2024-lists-of-fastest-and-most-energy-efficient-systems-in-the-world.html">fastest conventional supercomputer</a> were to focus solely on cracking a single bitcoin private key, it would need roughly 2 x 10^20 seconds, or 6.2 trillion years. For those keeping score at home, that would amount to ~450x longer than even the estimated age of the universe (~13.8 billion years).</p>

      <p>There are some proposed solutions for solving the discrete log problem efficiently, the most notable of which is <a href="https://en.wikipedia.org/wiki/Shor%27s_algorithm">Shor’s algorithm</a>. However, all such approaches are untenable with conventional computers and explicitly rely on the development of a CRQC, whose basic computational units are known as “qubits.” In contrast to the binary “bits” familiar to users of conventional computers – which can only be in a 0 or 1 state at any given time – qubits can exist in a “superposition” of both states simultaneously and can be <a href="https://www.aliroquantum.com/blog/what-is-quantum-entanglement">“entangled,”</a> meaning the 0/1 state of different qubits can be directly linked regardless of their proximity to one another. Taken together, these properties could support greater processing power and more efficient parallel processing, potentially allowing a quantum computer to process many possibilities at once and (among other things) solve Shor’s algorithm exponentially faster than even the fastest classical supercomputer.</p>

      <h4>Bitcoin’s Potential Vulnerabilities</h4>
      <p>While practical quantum computing still has many hurdles ahead of it, bitcoin in its current form could be vulnerable to a CRQC attack in a few ways. At the highest level, bitcoin relies on two key cryptographic algorithms for most of its security: ECDSA and <a href="https://learnmeabitcoin.com/technical/cryptography/hash-function/">SHA-256</a>. The latter would be much more resilient against even a very advanced quantum computer since <a href="https://en.wikipedia.org/wiki/Grover%27s_algorithm">Grover’s algorithm</a>, the best known quantum approach for breaking SHA-256, only provides a quadratic advantage, meaning such an attack would still likely be computationally infeasible even for a quantum computer. Bitcoin mining also has other defenses including the sheer scale of network hashrate and the <a href="https://learnmeabitcoin.com/beginners/guide/difficulty/">difficulty adjustment</a>. As a result, ECDSA would most likely be the first or only target of quantum computing attacks.</p>

      <p>There are four potential quantum vulnerability scenarios for bitcoin’s ECDSA signatures, each of which in some way involves revealing a public key to the bitcoin network – without that critical information, no form of quantum attack on bitcoin private keys would be possible.</p>
      <ul>
        <li><strong>Obsolete addresses:</strong> Bitcoin’s very first address format was known as “Pay-to-Public-Key” or “P2PK.” These receive bitcoin directly to an exposed public key. Such addresses would be vulnerable to a CRQC because they give an attacker the starting point they would need to make an attempt at reverse-engineering the associated private key. These addresses have been effectively deprecated for more than a decade.</li>
        <li><strong>Taproot addresses:</strong> While most address formats introduced after P2PK encode the critical receiving information within a hash, Taproot (P2TR) also uses exposed public keys. However, Taproot could also offer one potential upgrade path for bitcoin users to transition to quantum-resistant addresses.</li>
        <li><strong>Re-used addresses:</strong> Spending from any address type requires revealing the public key for that address, so users concerned about quantum safety should be sure to not receive any bitcoin to addresses that have already sent a transaction (address reuse avoidance).</li>
        <li><strong>“In-flight” transactions:</strong> A sufficiently powerful CRQC could potentially scan <a href="https://learnmeabitcoin.com/technical/mining/memory-pool/">mempools</a> for valuable “in-flight” transactions and reverse-engineer private keys before transaction confirmation. However, this is incredibly difficult given bitcoin’s 10-minute blocktime.</li>
      </ul>

      <p>The key takeaway here is that any bitcoin stored in a single-use address employed by most modern wallets <strong>could not be compromised even by an advanced quantum computer</strong>, and anyone with bitcoin in a reused address can gain robust security against most conceivable quantum attacks with some fairly trivial <a href="https://strike.me/learn/how-to-manage-utxos/">UTXO management</a>.</p>

      <h4>Conclusion</h4>
      <p>Significant hurdles still facing quantum computing, likely timelines needed to reach practically relevant quantum computers, and various upgrade paths already available for the world’s digital infrastructure collectively suggest that progress toward a CRQC is not presently an existential bear case for bitcoin. Even if we apply extremely high probabilities to existential quantum risks, the probability-weighted upside to bitcoin’s current price would still imply significant appreciation from here.</p>
    `
  },
  {
    title: "Bitcoin Is Eating the World",
    slug: "bitcoin-eating-the-world",
    date: "Jan 12, 2026",
    author: "John Arnold",
    excerpt: "An investor's case for the biggest total addressable market on earth. Bitcoin has dematerialized money itself, opening up step-function improvements across all industries.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825349691-7DTNTS19HQGHX0LB9TQP/TAM_Analysis.png",
    content: `
      <p>In the few centuries since the inception of the joint-stock company, equity investors have developed a toolbox of intermittently useful frameworks and heuristics for evaluating potential investments. One theme that unites virtually all investors is the search for large total addressable markets (or “TAM”). Explicitly or implicitly underpinning all discussions of valuation, competitive analysis, and projected run-rate profitability is this basic question of TAM: at the end of the day, how big is the prize?</p>
      
      <p>A few decades ago, internet-enabled software began, in the memorable phrasing of Marc Andreessen, “eating the world.” Its TAM exploded because its dematerialization of previously physical products and services collapsed the marginal cost of information storage and transfer, opening up new ways of producing and consuming that would eventually impact every business and consumer in the world. This became the foundation for arguably the most successful investing theme of all time: riding the software wave up.</p>

      <p>By now, this is a decidedly consensus view among investors, but what remains highly underappreciated by virtually all market participants is that we currently stand on the precipice of another even more disruptive theme: <strong>today, bitcoin is eating the world.</strong> Just as software and the internet dematerialized information and communication, bitcoin has dematerialized the most fundamental primitive of economic interaction – money itself – and consequently opened up step-function improvements and entirely new applications across industries. And since money is half of every transaction and commerce at virtually every scale is dependent on and downstream from it, bitcoin’s addressable user base will ultimately extend, like the internet before it, to <strong>every person on the planet.</strong></p>

      <p>As software ate the world, the greatest economic beneficiaries were the companies that carved out durable market positions as providers of software infrastructure and software-powered services. As bitcoin eats the world, the same will be true of innovative startups and forward-thinking blue chips that embrace bitcoin and leverage its unique capabilities. Internet-enabled software’s TAM is massive, but if bitcoin follows a similar adoption curve, then bitcoin infrastructure will become <strong>the biggest TAM on earth</strong>, and equity in the ecosystem’s bellwether companies will become the next generational investing theme.</p>

      <h4>Why is bitcoin eating the world?</h4>
      <p>Most simply, bitcoin is superior monetary technology, and as knowledge of it distributes over time, there is no self-interested economic actor in the world that will be able to ignore it. As global debt necessitates debasement of fiat currencies and price inflation marches higher, the value of bitcoin's properties will become clear to billions. Economic actors will always prefer to store more rather than less wealth over time and will <a href="https://unchained.com/blog/bitcoin-obsoletes-all-other-money/">converge on</a> the currency that best facilitates that goal.</p>

      <p>Bitcoin today is in a similar phase of its life cycle as the internet in the early 1990s. If its superior monetary properties continue to drive growing adoption, then demand for acquiring, securing, and using bitcoin will support demand for tooling, applications, and infrastructure to make all of that easy and practical. This is the classic “picks and shovels” play, whereby investment in the enabling technologies supporting a major secular shift can provide levered returns on the underlying theme.</p>

      <h4>Incumbents Must Adapt</h4>
      <p>Just as every company effectively had to become an “internet company” over the past few decades, so too will every business have to become a “bitcoin company” in some way to remain relevant. This will drive trillions of dollars of disruption to existing business models:</p>
      <ul>
        <li><strong>Payments infrastructure:</strong> Bitcoin over lightning eliminates the need for credit transfers and delayed settlement.</li>
        <li><strong>International remittances and FX:</strong> Bitcoin's borderless network offers an unprecedented settlement rail, facilitating cross-border payments for a fraction of the traditional cost.</li>
        <li><strong>Asset management and custody:</strong> Digital, cryptographically secured properties allow for distributed and permissionless custody.</li>
        <li><strong>Credit and lending:</strong> Bitcoin's global 24/7 liquidity and instant settlement make it pristine collateral.</li>
      </ul>

      <p>Taken together, bitcoin’s “picks and shovel” opportunities, its inevitable permeation into virtually all existing businesses, and the totally new industries its unique properties can enable will make bitcoin infrastructure the biggest TAM on earth over the coming decades.</p>
    `
  },
  {
    title: "Bitcoin Treasury - The Fourth Lever to Equity Value Growth",
    slug: "bitcoin-treasury-equity-value-growth",
    date: "Jan 11, 2026",
    author: "Grant Gilliam",
    excerpt: "Why most companies do not hold enough bitcoin and how a strategic allocation to bitcoin in corporate treasury serves as a powerful lever for equity value growth.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825349699-ZP1UMGXE4NJK5F8JRNMP/4th+lever.png",
    content: `
      <p>There is a saying you often hear in bitcoin circles that “you can never have enough bitcoin.” Once one develops conviction in the long term prospects of bitcoin, one also realizes that most people still do not yet understand or appreciate the value of bitcoin. There is still tremendous informational asymmetry, and that is why knowledge of bitcoin has not yet been widely distributed.</p>
      
      <p>Despite this belief, many of the same bitcoiners who cannot get enough personally often do not apply that strategy to their corporate balance sheets. Most bitcoin companies do not hold much bitcoin. I would argue not being positioned to capture equity value appreciation from bitcoin on the balance sheet is actually taking on increased corporate risk of leaving value on the table. It is therefore every company’s fiduciary duty to consider a meaningful bitcoin position for their corporate balance sheet.</p>

      <h4>The Fiduciary Case</h4>
      <p>If bitcoin companies are building products and services for holders of bitcoin based on expected secular growth, then they have already come to the view that the benefits justify the resource commitments. From a fiduciary perspective, if companies have already gotten comfortable with this “bitcoin risk,” why are they not as comfortable with that same risk on their balance sheet?</p>

      <p>A company’s equity value appreciation can traditionally be thought of as being driven by three primary factors: (I) company growth, (II) cash flow generation, and (III) change in valuation multiple. I believe the incorporation of bitcoin in the corporate treasury allows companies to capitalize on a “fourth lever” of equity growth: the appreciation of value in the company’s balance sheet assets.</p>

      <h4>Strategy for Adoption</h4>
      <p>How should companies size bitcoin as a treasury asset? Our advice includes three key buckets:</p>
      <ul>
        <li><strong>Near term working capital (first priority):</strong> Maintain minimum of 3 months of working capital in bitcoin as a fallback option in case of banking disruption.</li>
        <li><strong>Medium term liquidity reserves (first priority):</strong> Maintain enough reserves to sustainably reach the next capital injection, with additional cushion to account for bitcoin's near-term volatility.</li>
        <li><strong>Long term balance sheet position (secondary/stretch):</strong> Accumulate a position meaningful enough to positively influence equity value trajectory—targeting roughly 10% of total equity value.</li>
      </ul>

      <p>Successful implementation of this strategy can extend a company’s runway as bitcoin appreciates, minimize potential future dilution, and deliver a strengthened balance sheet over time. Accumulating a meaningful bitcoin position early allows challenger companies to establish a solid foundation relative to incumbent legacy companies who may wait too long to adapt.</p>
    `
  },
  {
    title: "The Global Capital Circuit: Bitcoin to Stablecoins, and Back Again",
    slug: "global-capital-circuit",
    date: "Mar 12, 2026",
    author: "Jonathan Kirkwood",
    excerpt: "Capital has always operated within a stack of claims. In the digital era, a once static ladder becomes a high-velocity circuit where capital migrates from sovereign equity to neutral reserves and back.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/b604fd76-6941-4344-8e22-44a61e44b5fc/The+Global+Capital+Circuit.jpg",
    content: `
      <p>Capital has always operated within a stack of claims. A layered hierarchy where senior obligations enjoy contractual priority and junior layers bear the residual risk. In the digital era, a once more static ladder becomes a high-velocity circuit. Capital can now migrate from sovereign equity to neutral reserves and back again, driven by real-time market discipline. Historically, sovereign discipline relied on external anchors that evolved from a physical limit (gold) to a relative tether (U.S. Treasuries). Bitcoin breaks from this pattern. Its protocol-fixed finite supply operates within a decentralized, permissionless settlement network, creating the first truly digital neutral reserve asset. Bitcoin serves as a true hard cap on the global capital stack immune to alteration by any single authority as an asset without an issuer or superior claim.</p>
      
      <p>Market participants frequently dismiss bitcoin as speculation today because they are still calibrating to an asset whose core role is not to supplant fiat currencies, but to serve as the immutable benchmark against which all claims are measured in real time. And at this same moment, digital dollar mechanisms like stablecoins extend fiat liquidity into programmable, borderless networks, enabling participation in sovereign currency systems while maintaining a seamless, neutral exit into bitcoin. The mere existence of this new circuit fundamentally shifts incentives across the entire system.</p>

      <p>Every public company operates within a capital structure that markets assess with precision. Equity forms the junior-most layer, bearing the highest risk. Debt sits above as senior claims. A company’s equity functions as its currency. When executives over-leverage or dilute shares irresponsibly, the market adjusts prices. This is the essential operation of markets, where price discovery acts as the impartial regulator.</p>

      <p>Applying this framework to nation-states reveals profound implications. A government’s capital structure mirrors this hierarchy, but with currency functioning as the junior-most equity tranche. This tranche absorbs variable claims on fiscal responsibility. Sovereign debt is senior, but an inherent distortion exists: sovereign debt is settled in sovereign currency. This Payment-In-Kind (PIK) system allows dilution of junior equity holders to service senior creditors. When debt accumulation exceeds productivity, the facade crumbles and purchasing power erodes. Inflation is the byproduct.</p>

      <p>Bitcoin completes the transformation from static electricity to electrical current. Bitcoin serves as the ultimate adjudicator of trust and scarce value, while stablecoins operate as scalable pipelines for sovereign currency distribution. Together they form a single, self-correcting system.</p>
    `
  },
  {
    title: "Sats Flow: z16a Killer",
    slug: "satsflow",
    date: "Nov 27, 2025",
    author: "Grant Gilliam",
    excerpt: "How sats flows will totally reshape investing at all scales. A shift from cash flow to sats flow marks the return to a focus on profitability and sustainable business models.",
    content: `
      <p>Ten31 Co-Founder and Managing Partner Grant Gilliam gave a keynote talk at the August 2024 Baltic Honeybadger Conference on how sats flows will totally reshape investing at all scales.</p>
      
      <p>The single biggest contrast between Ten31's approach and traditional venture capital is our focus on investing in sustainable business models we believe can generate “sats flow,” or the accumulation of profits which over time will increasingly be denominated in bitcoin. Traditional Silicon Valley VC has become synonymous with growth at all costs, burning cash, and relying on a money printer world. As the world shifts to bitcoin as a fundamental barometer of value and the future world reserve asset, we understand the days of easy money are over. With it, all economic actors will increasingly gravitate towards a focus on generating (bitcoin) profits in a sustainable way.</p>

      <p>This is the underlying philosophy for our investment selection. Every meaningful investment we make must have a strong prospect of generating profits and sats flows in the near term. This is a high bar because bitcoin itself is the opportunity cost. We have to believe an investment can outperform bitcoin, otherwise we would be better off just holding bitcoin instead. At its most basic level, there are only three ways to outperform bitcoin: financial leverage, multiple arbitrage, and sats flow.</p>

      <p>Bitcoin technology companies could be viewed as synthetic bitcoin miners, with the prospect of producing an ongoing stream of bitcoin income but often with much less capital intensity and competitive pressure than traditional miners. Successful implementation of a sats flow strategy extension a company's runway as bitcoin appreciates, delivers a strengthened balance sheet, and positions companies for long-term survival and value creation.</p>
    `
  },
  {
    title: "Credible Finance",
    slug: "credible-finance",
    date: "Nov 13, 2025",
    author: "Jonathan Kirkwood",
    excerpt: "Credibility is the invisible balance sheet of economies. Ten31 was founded to build finance on proof-of-work rather than promise, where credibility again defines capital.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/b179fcf0-01b9-41c0-9bb0-532c11f882a4/Ten31+Credible+Finance.png",
    content: `
      <p>Credibility is the invisible balance sheet of economies, and reputation is its market price. Every enterprise, from kingdoms to corporations, has been built on the alignment between what is promised and what is performed. Finance arose to preserve that fragile alignment, yet over time, ledgers drifted from proof to promise. Ten31 was founded out of the restoration of alignment to build finance on proof-of-work rather than promise, where credibility, not convenience, again defines capital.</p>
      
      <p>Equity built the modern world because it rewarded credible reputations and punished false promises. However, the same mechanisms revealed their limits when paper claims multiplied faster than proof and speculation hollowed out trust. Bitcoin reunites reputation and credibility because it ties identity to proof-of-work and ownership to verifiable truth as shared equity in an open permissionless monetary system.</p>

      <p>In bitcoin, reputation only follows credibility: it cannot precede it. Ten31 takes this philosophy further by institutionalizing it. We finance builders the way bitcoin finances the world through shared equity in proof-of-work. Our model begins with bitcoin-aligned equity: patient capital structured for long-term and durable outperformance, rewarding stewardship over loose speculation.</p>

      <p>Ten31 institutionalizes equity investing around bitcoin as we build the commerce base atop the digitization of value itself. The companies we've backed form an economically dense core that gives Ten31 leveraged network effects. Each reinforces the others: custody enabling transfer and payments, payments driving commerce, commerce producing transparency, and transparency strengthening connectivity. This foundation radiates outward, enabling established enterprises to operate on harder rails utilizing the Ten31 network to accelerate their transition into the bitcoin economy.</p>
    `
  },
  {
    title: "Ten31: An Investment Platform for Bitcoin Adoption",
    slug: "platform",
    date: "Oct 31, 2025",
    author: "Grant Gilliam",
    excerpt: "Ten31 is not a typical VC fund; it's an investment platform dedicated to building the infrastructure for bitcoin adoption through an ecosystem approach and a focus on sats flow.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/8963728b-11a6-4190-bfaf-1f22ea00fb17/trackrecord.png",
    content: `
      <p>October 31st is a special day for bitcoin: the anniversary of the whitepaper's publication. Ten31 is a direct reference to this date, signifying an unwavering dedication to bitcoin. From day one, we have identified ourselves as an “investment platform,” not just a VC fund. Our goal was to become an investment platform dedicated to building the ecosystem for bitcoin adoption.</p>
      
      <p>Traditional VC funds are typically focused on a particular stage of a company's life cycle, a dynamic evolved under a fiat standard and driven by a 'growth at all costs' mindset. We believe bitcoin is changing how companies are built and funded. Profit generation is sought earlier, and the need for venture capital fundraising stage specialization is less powerful than bringing bitcoin expertise and alignment to the full spectrum of a company's lifecycle.</p>

      <p>Ten31 takes a holistic \"ecosystem approach,\" similar to Sequoia's early days. We've invested in the essential, interconnected layers of the bitcoin ecosystem—exchange, custody, lending, node infrastructure, energy, and security. These categories are interdependent and multiply each other's value through open, interoperable network effects.</p>

      <p>The single biggest contrast in our approach is our focus on sustainable business models that generate “sats flow.” Every meaningful investment must have a strong prospect of generating profits in the near term, as bitcoin itself is the opportunity cost. We are in the bitcoin adoption business, partnering with industry-defining companies to drive a new wave of technology adoption centered on bitcoin.</p>
    `
  },
  {
    title: "Digital Industrialization: Land, Labor & Capital",
    slug: "digital-land-labor-capital",
    date: "Oct 29, 2025",
    author: "Jonathan Kirkwood",
    excerpt: "Each digital industrialization decentralizes one domain and centralizes another. Distribution became digital land, competence becomes digital labor, and credibility becomes digital capital.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/71a713c2-53bf-4403-a65b-98d7aab08c3a/Digital+Capital+B.png",
    content: `
      <p>Each digital industrialization decentralizes one domain and centralizes another. The internet transformed distribution but concentrated value in platforms. AI will transform access to competence but consolidate value in the physics that make it possible. Bitcoin affords everyone access to capital but concentrates credibility in those who steward it wisely.</p>
      
      <p><strong>Land:</strong> Historically, land meant physical distribution. The internet transformed digital land and expanded businesses from somewhere in particular to everywhere at once. Barriers to entry fell, but value migrated to those who enabled the digitization of compute, attention, and discovery (AWS, Facebook, Google). Scale accrued to those who industrialized reliability and delivery.</p>

      <p><strong>Labor:</strong> Large language models are digitizing competence. The cost of knowing how to do something will converge towards the marginal cost of electricity. As access to competence becomes abundant, value consolidates in the systems that make digital labor real: semiconductors, energy generation, and data centers. Firms that master these constraints (NVIDIA) will define the infrastructure of the embodied economy.</p>

      <p><strong>Capital:</strong> If digital land lowered distribution costs and digital labor lowers competence costs, then digital capital lowers the cost required for trust. Bitcoin solidifies credibility at its core, introducing true scarcity hardened into a global protocol. Bitcoin restores time to money and anchors growth in credibility rather than limitless credit. It collapses the cost of trust towards zero, enabling an era of credible finance.</p>

      <p>Ten31 invests where bitcoin meets production—where energy, storage, compute, and security intersect with the neutrality of digital capital. The next wave will not just use bitcoin but operate on it, treating bitcoin as both capital and operating infrastructure. The future belongs to those who preserve rather than print, whose assets appreciate in credibility as their operations scale.</p>
    `
  },
  {
    title: "Bitcoin: Because We’re Right",
    slug: "bitcoin-because-were-right",
    date: "Oct 21, 2025",
    author: "Jonathan Kirkwood",
    excerpt: "To be right early is not a victory, it is a sentence. A conviction to the fidelity of reality before consensus forms. Bitcoiners arrive at truth: money is a public rule set, not a government promise.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/4104b8f7-afc8-4012-8b23-9cab1e1a8cee/Because+We%27re+Right+%28wide%29.png",
    content: `
      <p>To be right early is not a victory, it is a sentence. A conviction to the fidelity of reality before consensus forms, and the consequence of being right is exile until the world catches up. Bitcoiners know this solitude. We arrived at truth: money is a public rule set, not a government promise. Time preference disciplines civilizations, and credibility grows where issuance by decree cannot.</p>
      
      <p>Individual clarity precedes social consent, and the ledger of reality eventually closes the debate. Bitcoiners accept that ridicule is a lagging indicator of reality’s return. We accept that patience without work is mere posture. So we build: nodes, networks, wallet tooling, mining infrastructure, and education. A scaffolding for a future that will call it obvious.</p>

      <p>In a world addicted to “because I said so,” bitcoin replies, “because it was done.” The protocol waits without complaint, indifferent to narrative cycles and immune to editorial mood. Bitcoiners withstand volatility because we understand it is transferring value from the impatient to the patient. We lengthen time horizons and builders make sovereignty usable.</p>

      <p>Vindication, when it arrives, arrives as function, not applause. Reduced counterparty risk, transparency, and finality that doesn't ask permission are measurable. Property anchored in work rather than favor restores the link between effort and outcome. Bitcoiners did not predict the future so much as refuse to pretend about the present. We build not to win arguments, but to enable a world worth inheriting.</p>
    `
  },
  {
    title: "United States of Bitcoin",
    slug: "united-states-of-bitcoin",
    date: "Sep 2, 2025",
    author: "Jonathan Kirkwood",
    excerpt: "Bitcoin is a constitutional order written in code and sustained by consent. One protocol, many software states. Federalism without a map, creating a space for open auditability.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/efb66799-c107-4125-9fca-ccb5845cf4c4/Bitcoin+Flag.png",
    content: `
      <p>States begin as stories. America's story hardened with consent into a written charter, and only then did visible structures coalesce into institutions. Bitcoin is a constitutional order written in code and sustained by consent. State represents both government and software: in government, a constitution; in software, the live version of a program. Basic definitions decide whether effort compounds or is diluted.</p>
      
      <p>Bitcoin shifts incentives so good behavior scales and rent-seeking flames out. Every release of Bitcoin Core and compatible implementations is a software state. the federation holds because the constitutional core is a shared set of rules. Upgrades are proposed in public and adopted voluntarily. No single authority decides for the rest.</p>

      <p>Companies like Mempool.Space show how radical transparency becomes a civic utility, creating a space for open auditability that safeguards the fairness of the rules. Strike is building a network of cyber-roads, a global bridge to bitcoin financial services where citizens earn and borrow in local currency while curbing middlemen. Fold meets households where they live, converting rewards into savings that don't wither with policy drift.</p>

      <p>The United States of Bitcoin channel disagreement into voluntary coordination. They guarantee clearly defined rules and access points for those to freely enter. Ten31 backs builders who make the software state legible, accessible, and livable. Bitcoin moves relentlessly forward every 10 minutes: tick-tock next block. Between those motions is a freedom sturdy enough for us all.</p>
    `
  },
  {
    title: "Today’s Great Northern: Architecting the Commercialization of Bitcoin",
    slug: "commercializing-bitcoin",
    date: "Jan 15, 2024",
    author: "Jonathan Kirkwood",
    excerpt: "Examining the parallels between the 19th-century railway expansion and today's buildout of critical bitcoin infrastructure.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/692cdfc7-81e3-4be0-bead-5440fd25bde1/Today%27s+Great+Northern.jpeg",
    content: `
      <p>Ten31 draws inspiration from the great networks that turned empty corridors into economic mainlines: railroads, telegraph wires, payment rails, and the early internet. Each began as a skeletal infrastructure and only became indispensable once the hard work of commercializing the opportunity was completed. Among those early networks, the story of James J. Hill and the Great Northern stands out as a blueprint for today’s bitcoin industrialization.</p>
      
      <p>Hill did not build the most track. He built the most <em>used</em> track. While subsidized lines chased financial engineering in stock schemes, land grants, and leverage that masqueraded as progress, Hill treated his railroad as a commercial organism. To Hill, rails and spikes were not the end state. He viewed empty railcars as the raw capacity that remained a liability until the trains reliably moved grain, timber, cattle, people, and capital. Hill’s low time preference approach to seeding towns, teaching soil science, importing livestock, and manufacturing demand along the route, transformed industrial hardware into a functioning economic network.</p>

      <h3>Structure is Important, but Usage Matters More</h3>
      <p>The same distinction that separated Hill from his subsidy-fed competitors now separates meaningful bitcoin development from the noise of the past decade. Much of the early cryptocurrency landscape mistook industrialization for victory (building rails when there was no organic demand for the freight itself) and the market confused <em>financial engineering</em> for <em>commercial utility</em>. Blockchains proliferated, protocols multiplied, and speculative assets ballooned, yet little of it translated into durable commerce. The shiny distractions of NFTs, meme coins, and ICOs harvested speculative fervor but not economic substance.</p>
      
      <p>Bitcoin’s next chapter requires a return to proper sequencing. Its infrastructure, the shared monetary equity programmable with global settlement finality, forms the industrial scaffold. However, the true economic destiny lies in commercialization: transforming these primitives into systems that merchants use, institutions depend on, and consumers rely upon without noticing.</p>

      <h3>Commercialization is a Deliberate Endeavor</h3>
      <p>Bridging this gap between industrialization and commercialization has never been a passive process. It requires deliberate architecture from decision-makers who understand that networks do not commercialize themselves. That work is slow, iterative, and deeply operational. It requires long-term vision for cultivating new behaviors, building trust, educating markets, and orchestrating complementary industries around the core infrastructure. Commercialization is the evolving coordination of deliberate choices of the present which compound into the economic patterns of the future.</p>
      
      <p>The companies that will commercialize bitcoin are not those that “use bitcoin” as a novelty, but those whose economics fundamentally improve when built around it. Companies like Start9 give businesses the digital homestead. AnchorWatch isolates the operational risk of holding and settling in bitcoin. Giga Energy and Upstream Data transform stranded and wasted energy into productive bitcoin-denominated revenue.</p>

      <h3>Revitalization of Productive Businesses</h3>
      <p>An inflection point arrives when legacy businesses that are often unloved, undercapitalized, and trading at compressed multiples recognize their economics fundamentally improve when rearchitected toward the bitcoin network. A regional logistics operator suffering from thin margins can eliminate settlement lags and FX friction by settling invoices on digital rails, while insulating its treasury from inflationary decay with bitcoin. A specialty manufacturing firm with volatile working-capital needs can extend its operating runway by holding a portion of treasury in appreciating monetary equity.</p>
      
      <p>Every industrial revolution arrives at a threshold where potential hardens into permanence. While legacy accountants and auditors remain cautious due to novelty and volatility, industrial visionaries build out the future one block at a time. Bitcoin now crosses that threshold. The rails are down, the spikes are driven, and the first engines of real commerce are beginning to move.</p>
    `
  },
  {
    title: "Bitcoin on the Ballot",
    slug: "bitcoin-and-trump",
    date: "Nov 8, 2024",
    author: "John Arnold",
    excerpt: "Selected potential impacts of the 2024 US Presidential election on the bitcoin ecosystem, including the proposed Strategic Bitcoin Reserve and reduction of regulatory risk.",
    content: `
      <p>The 2024 US Presidential election marks a potentially significant geopolitical turning point for bitcoin that all capital allocators should study closely.</p>
      
      <p>President-elect Donald Trump has aggressively courted the support of bitcoin-aligned voters with a variety of proposals friendly to the ecosystem. While campaign promises often diverge from policy implementation, the combination of factors could drive substantial tailwinds if the incoming administration follows through. The optimistic case for bitcoin in President Trump’s second term merits the serious attention of individual investors and institutional allocators.</p>

      <h4>Strategic Bitcoin Reserve</h4>
      <p>Wyoming Senator Cynthia Lummis proposed a bill directing the US Treasury to build a “strategic bitcoin reserve” of 1 million bitcoin. President-elect Trump endorsed the idea. This initiative would add a net new bid from a price-inelastic buyer with an infinite budget. Other large nations would likely be incentivized to make similar moves, opening a powerful new demand spigot for bitcoin.</p>

      <h4>Reduction of Regulatory Risk</h4>
      <p>Given bitcoin’s framework as a commodity and the launch of spot bitcoin ETFs, the left-tail risk of bitcoin being “banned” was already low. The election further reduces the risk of adversarial action against self-custody and mining. Appointments for key administrative positions are likely to be more friendly to technology companies, creating a clearer regulatory environment and solidifying access to legacy banking rails.</p>

      <h4>Reduction of Career Risk</h4>
      <p>In a scenario where the world’s most powerful government acquires bitcoin, institutional investors and corporate treasurers will have the air cover they need to leg into positions. If foreign treasuries begin aggressive acquisition, capital allocators will be required to develop a strategy to avoid becoming laggards. Career risk will come from ignoring bitcoin rather than embracing it.</p>

      <h4>Continuing Fiscal Deficits</h4>
      <p>The US has spent years running unprecedented peacetime fiscal deficits. An acceleration of this trend under the new administration would likely be stimulative and inflationary, driving exposure to hard assets like bitcoin or gold that have historically performed well in such environments. Growing federal interest expense will only get heavier, potentially driving flows toward assets that best resist dilution.</p>

      <h4>Integration into Traditional Financial Services</h4>
      <p>Traditional banks and asset managers will likely have more leeway to provide bitcoin-native financial services. Bitcoin has proven itself to be uniquely pristine collateral. A bitcoin-friendly administration will likely allow for the repeal of SAB-121, help clearing the way for broader participation among a wide base of custodians and driving incremental institutional demand.</p>
    `
  },
  {
    title: "Bitcoin Technology is the New Network Effect",
    slug: "bitcoin-network-effects",
    date: "Jul 8, 2024",
    author: "Grant Gilliam",
    excerpt: "Investing in bitcoin technology drives industry-wide network effects. The open and interoperable nature of the protocol allows for cross-portfolio synergies and increasing returns.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825349639-D3L93OM7K2KG0Y8RMZFU/portfolio.png",
    content: `
      <p>Investing in bitcoin infrastructure improves the network and makes it more valuable, creating increased demand and leading to further investment. If understanding this flywheel is <em>Industry Network Effects</em>, then understanding how interoperability drives collaboration is <em>Portfolio Network Effects</em>.</p>
      
      <p>Traditionally, network effects were assumed to have diminishing returns, but Arthur saw evidence of increasing returns in technology. Early examples include Microsoft and IBM; more recent include Amazon and Uber. However, traditional marketplaces often present issues like participant lock-in, bootstrapping challenges, and crowded trades.</p>

      <p>One of the most underappreciated aspects of the bitcoin ecosystem is its open and interoperable nature. Building interesting companies is not zero sum; success doesn't have to be detrimental to another. Interoperability allows for significant opportunities for collaboration that are infeasible in traditional industry. An environment where collaboration occurs in Conventional and unconventional ways fortifies the network.</p>

      <p>As Ten31's portfolio grew, we saw interconnectivity increase dramatically. This level of cross-portfolio synergy is unparalleled in traditional VC. The value of the portfolio demonstrates increasing returns as it becomes more interconnected. Increased investment density increases opportunities for collaboration, allowing for better company performance. Bitcoin technology is the new network effect.</p>
    `
  },
  {
    title: "Bitcoin: Medium o̶f̶ for Exchange",
    slug: "bitcoin-medium-for-exchange",
    date: "Jul 10, 2024",
    author: "Jonathan Kirkwood",
    excerpt: "Bitcoin is the end state digital transformation of money from a shared physical environment to a shared digital environment. A medium for exchange natively embedded with superior characteristics.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825349612-JVVVEB1D0YCMAXKVWJE0/Image.png",
    content: `
      <p>Trying to explain bitcoin to those unfamiliar with finance and computer science is difficult. Money facilitates exchange when definitions are clear. Today's money can be thought of as a medium <em>for</em> exchange—an environment for exchange to occur. Bitcoin is the end state digital transformation of money into a shared digital environment without barriers to entry.</p>
      
      <p>A medium is a substance that transfers energy. Money has been understood through functions like store of value and medium of exchange. But as an environment, it imbues alternative frameworks. Money has been in a transition phase from physical to digital since the numeric representation of money was first written. This transition leads towards bitcoin, embedded with superior characteristics: inclusive, auditable, and finite.</p>

      <p>This new digital money creates kaleidoscope visualizations. Mempool.Space affords the ability to see pending and confirmed transactions in each block. For the first time, money's past, present, and future is readily viewable. Global access through Strike provide users with the ability to trade local currencies for bitcoin, witnessing Gresham's Law as users exchange debasing currency for fixed supply assets.</p>

      <p>Ten31 has partnered with companies operating in the transition state between different mediums. These businesses accrue value from the transfer between legacy and end state mediums. Familiarity with digital assets is shaping cyberspace native generations that view bitcoin as integral. As they mature, their comfort with and reliance on bitcoin will drive integration into the mainstream economy.</p>
    `
  },
  {
    title: "Outperforming Bitcoin",
    slug: "outperforming-bitcoin",
    date: "Aug 20, 2024",
    author: "John Arnold",
    excerpt: "Reckoning with the new cost of capital. How Ten31’s investments can possibly outperform the huge upside of bitcoin over the coming decades.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825349561-3LHB3Y0PZU5AG6TO0K5I/WTI_Tools.png",
    content: `
      <p>Ten31's central thesis is that bitcoin is superior monetary technology. As understanding distributes, self-interested actors across industries will have to adopt it, driving demand for infrastructure. Communicating this to capital allocators has hurdles, but each year brings this view closer to mainstream. The question remains: how can investments outperform bitcoin's hurdle? Bitcoin's performance is our cost of capital.</p>
      
      <p>Ongoing and sustained price growth necessarily implies growth of adoption, which implies demand for technologies enabling that adoption. If you're bullish on bitcoin, you should be bullish on infrastructure. Bitcoin-levered equity is the only strategy with a durable opportunity to outperform bitcoin in the coming decades.</p>

      <p>One way to outperform is through expedited dollar-denominated returns—driving higher IRRs through acquisitions and IPOs. Strategic acquirers pull forward bitcoin's expected future performance by paying the discounted present value of a target's future cash flows. Early stage investors capture price appreciation faster than holding the asset alone. Markups occur as mature players seek out expertise and network effects.</p>

      <p>Equity also provides downside mitigation. Bitcoin adoption moves consistently up and to the right regardless of price volatility. Businesses solving underlying problems (remittances, escaping hyperinflation) remain relevant across cycles. A final driver is \"sats flows\"—the ability of efficient, profitable companies to generate bitcoin-denominated cash flows, becoming synthetic bitcoin miners producing ongoing bitcoin income.</p>
    `
  },
  {
    title: "Contrarian Investing in Bitcoin: Finding Value Where Others Don’t",
    slug: "contrarian-investing-in-bitcoin",
    date: "Feb 9, 2024",
    author: "Jonathan Kirkwood",
    excerpt: "Going against the grain, looking at things differently, and supporting unique companies ready to explode alongside the adoption cycle of bitcoin.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825349654-QRTAR2MSI6P9604OJLE0/Ten31+Investment+Coldcard.jpg",
    content: `
      <p>Knowledge of bitcoin is cultivated through rigorous analysis. Our confidence is a contrarian conviction, as most allocators still ignore this opportunity. Ten31's first investment in Unchained in early 2020 was counterintuitive to traditional approaches like Blockfi or FTX. But Unchained's differentiated approach focused on collaborative custody proved correct while others collapsed.</p>
      
      <p>Our thesis is anchored in two beliefs: accelerated adoption reaching the untapped 99%, and innovative technologies catalyzing to meet diverse needs. We look for unique companies like Coinkite, the industry standard for hardware security. While most VC dismisses hardware, we see value in devices protecting private keys. When money moves to digital, security moves to the physical.</p>

      <p>Breadth of involvement allows us to identify companies that might not make sense to outsiders. Investing in Mempool.Space's view on the scarcity of blockspace was anything but obvious a few years ago. Today they provide analytics and accelerators aligned with miners and exchanges. We embrace investing in companies building open-source software that interacts with open protocols.</p>

      <p>Synergies exist across our portfolio due to open properties and proximity. True cross-pollination leading to unlocking new markets can only occur when companies contribute to open protocols. Ten31 initiatives are about sharing insights and building synergies that drive growth. We focus on the best founders building long-lasting technologies ready to scale to the next billion people.</p>
    `
  },
  {
    title: "Ten31 Marks First Public Listing for a Bitcoin Focused Venture Fund",
    slug: "griid",
    date: "Jan 30, 2024",
    author: "Grant Gilliam",
    excerpt: "Portfolio company GRIID Infrastructure completes listing on Nasdaq, representing the first public listing for any bitcoin-focused investment fund.",
    content: `
      <p>Ten31 announced that its portfolio company GRIID Infrastructure has completed its listing on the Nasdaq Global Market, representing the first public listing for any bitcoin-focused investment fund's portfolio company. Ten31 served as exclusive institutional capital partner ahead of its debut. Ten31 has deployed over $100 million into 36 companies focused on freedom technology.</p>
      
      <p>GRIID's listing is a notable milestone for mining companies. Nasdaq listing represents the first significant liquidity event for any bitcoin-focused venture investor and the first major equity liquidity event in several years for the greater crypto venture landscape. GRIID is a vertically integrated operator, purpose-built for mining from day one.</p>

      <p>Harry Sudock, Chief Strategy Officer at GRIID, will join Ten31 as an Advisor. The milestone coincides with the launch of Ten31's third institutional fund, Low Time Preference Fund III, which establishes an initial portfolio. Ten31 has unmatched reach across all verticals and funding stages in the ecosystem.</p>

      <p>Ten31 has renewed its commitment to supporting open source development by providing a grant to independent developer calle for work on Chaumian ecash. Ten31 is the most active investor in open source businesses and contributes a portion of fees to development. Ten31 was a founding contributor to OpenSats and supports a variety of efforts on a no-strings-attached basis.</p>
    `
  },
  {
    title: "Our response to FinCEN on proposed surveillance rules for bitcoin",
    slug: "bitcoin-fincen-letter",
    date: "Jan 23, 2024",
    author: "Ten31 Team",
    excerpt: "Ten31 and 26 bitcoin companies submit a legal response to FinCEN’s proposed rules that would seriously harm financial privacy and standard security practices.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825349668-SWL5BP8XW230K4B273RE/signatories.png",
    content: `
      <p>We submitted a legal response to the U.S. Department of the Treasury and FinCEN’s proposed rules that would seriously harm privacy by effectively prohibiting basic bitcoin best practices such as address reuse avoidance and collaborative transactions. 26 bitcoin companies signed this letter in agreement with this position.</p>
      
      <p>The Mixing Transaction NPRM targets an overly broad range of technical approaches used as best practices for ensuring security. It unreasonably infringes upon legitimate financial privacy interests and applies to digital techniques that are not \"mixing\" at all, but simply represent good cybersecurity practices. The Proposed Special Measures are unnecessary to achieve FinCEN's aim.</p>

      <p>Defining \"mixing\" broadly targets lightning transactions, single-use wallets, atomic swaps, and multi-signature wallets. These tools enhance digital privacy and offer basic cybersecurity. Standard practice among users is to change addresses with every transaction. FinCEN's proposal represents an improper and overbroad application of Section 311 powers.</p>

      <p>Ensuring CVC transactions enjoy the same level of privacy as traditional finance reduces potential danger of personal harm and enables users to avoid waiving constitutional rights. Software tools that enhance financial privacy provide a true electronic equivalent to cash. We urge FinCEN to withdraw the NPRM altogether and instead pursue targeted enforcement against specific bad actors.</p>
    `
  },
  {
    title: "Coherence in an Age of Abundance",
    slug: "coherence",
    date: "Feb 23, 2024",
    author: "Jonathan Kirkwood",
    excerpt: "The economic surplus isn't acquired through hoarding competence, but by cultivating secure and private coherence that public models cannot access or replicate.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/639d6600-e511-4df7-9285-05b1dd3c4ef8/coherence.png",
    content: `
      <p>Oil was the industrial age’s stored sunlight. Compute is the digital age’s stored competence. Production itself alone was never sufficient; economic surplus was born only where producers answered the market’s <strong>“why”</strong> correctly. AI-assisted competence is forming a reservoir of “how” that can be summoned in seconds. Competence enables more execution, but it is human judgment at the edge that governs choice allowing for coherence to be established.</p>
      
      <p>In competitive markets, surplus is created in the spread between what it costs producers to deliver value and what consumers are willing to pay for it. As competence equalizes, that spread compresses. Baseline competence becomes abundant and widely accessible. When everyone draws from the same pool of competence, outcomes converge, and convergent outcomes cannot generate economic surplus.</p>

      <p>This is where secure and private coherence emerges as a critical differentiator. Coherence is the quality of forming a unified whole—the deeper internal refinement of models that aligns actions into a resilient, proprietary system. reliance on commoditized AI models leads to homogenized strategies. AI accelerates trajectories already chosen; focus compounds faster, but incoherence leaks value faster too.</p>

      <p>The contrarian refusal to follow the crowd becomes a strategic necessity. Ten31 exists to underwrite judgment in an era trying to eliminate it. We mold systems that preserve the integrity of economic decisions and refuse to dilute consequences. <em>Credible Finance</em> is not about efficiency for its own sake, but about ensuring correct judgments are able to compound.</p>
    `
  },
  {
    title: "Investing Under a Bitcoin Standard",
    slug: "bitcoin-standard-investing",
    date: "Apr 30, 2024",
    author: "Grant Gilliam",
    excerpt: "A presentation at the 2024 SXSW Bitcoin Takeover event on Ten31’s unique approach to investing in the building blocks of the bitcoin ecosystem.",
    content: `
      <p>Ten31 Co-Founder and Managing Partner Grant Gilliam delivered a presentation at the 2024 SXSW Bitcoin Takeover event on our fund’s approach to investing in the bitcoin ecosystem.</p>
      
      <p>Just as Sequoia made their name early on by supporting a wave of technology adoption and backing many of the companies which became the technology leaders of today, we think there’s a similar opportunity for Ten31 to back and support this new wave of bitcoin adoption, and back many of the bitcoin companies which will become the technology leaders of tomorrow.</p>

      <p>We’ve invested in the essential, interconnected layers of the bitcoin ecosystem, the areas we believe are the building blocks to a new financial and economic system with bitcoin as the foundational reserve asset. This includes bitcoin exchange/brokerage, custody, lending, node infrastructure, energy and mining infrastructure, applications, and security. We believe the size of the opportunity and the potential impact on the world is comparable to what we’ve seen Sequoia accomplish.</p>
    `
  }
];
