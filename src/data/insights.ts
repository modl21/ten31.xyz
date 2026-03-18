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
    title: "The Global Capital Circuit: Bitcoin to Stablecoins, and Back Again",
    slug: "global-capital-circuit",
    date: "Mar 12, 2024",
    author: "Jonathan Kirkwood",
    excerpt: "Capital has always operated within a stack of claims. In the digital era, a once static ladder becomes a high-velocity circuit where capital migrates from sovereign equity to neutral reserves and back.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/b604fd76-6941-4344-8e22-44a61e44b5fc/The+Global+Capital+Circuit.jpg",
    content: `
      <p>Capital has always operated within a stack of claims. A layered hierarchy where senior obligations enjoy contractual priority and junior layers bear the residual risk. In the digital era, a once more static ladder becomes a high-velocity circuit. Capital can now migrate from sovereign equity to neutral reserves and back again, driven by real-time market discipline. Historically, sovereign discipline relied on external anchors that evolved from a physical limit (gold) to a relative tether (U.S. Treasuries). Bitcoin breaks from this pattern. Its protocol-fixed finite supply operates within a decentralized, permissionless settlement network, creating the first truly digital neutral reserve asset. Bitcoin serves as a true hard cap on the global capital stack immune to alteration by any single authority as an asset without an issuer or superior claim.</p>
      
      <p>Market participants frequently dismiss bitcoin as speculation today because they are still calibrating to an asset whose core role is not to supplant fiat currencies, but to serve as the immutable benchmark against which all claims are measured in real time. And at this same moment, digital dollar mechanisms like stablecoins extend fiat liquidity into programmable, borderless networks, enabling participation in sovereign currency systems while maintaining a seamless, neutral exit into bitcoin. The mere existence of this new circuit fundamentally shifts incentives across the entire system.</p>

      <p>We can dive into this perspective using some fundamental principles of accounting. Every public company operates within a capital structure that markets assess with precision. Equity forms the junior-most layer, bearing the highest risk as the residual interest that absorbs uncertainty and embodies management’s credibility. Debt sits above, as senior claims defined by contractual obligations, enjoying priority in repayment. A company’s equity functions as its currency. When executives over-leverage or dilute shares irresponsibly, the market does not lodge formal objections. The market simply adjusts prices. Capital flows toward more competently managed opportunities. This is not theoretical abstraction but the essential operation of markets, where credibility is hard-won and price discovery acts as the impartial regulator.</p>

      <p>Applying this framework to nation-states reveals profound implications. A government’s capital structure mirrors the hierarchy already defined but with currency functioning as the junior-most equity tranche. This tranche absorbs the sovereign’s variable claims on fiscal responsibility, growth, and security, all of which are ultimately reflected in the market’s adjustment of purchasing power in the nominal unit. The government’s bonds are senior debt above, secured by its creditworthiness (order and taxing ability). But an inherent distortion persists in plain sight: sovereign debt is settled in sovereign currency. This flaw is essentially a Payment-In-Kind (PIK) system, whereby senior creditors can be serviced through the dilution of junior equity holders. When debt accumulation exceeds productivity gains, the facade of seniority crumbles. Creditors obtain full nominal repayment, but the real value of that repayment (purchasing power) erodes. Inflation is a byproduct serving as the veil for fundamental economic vulnerabilities.</p>

      <p>History abounds with efforts to address this flaw. A golden path was paved as a durable safeguard providing a physical, auditable restraint on sovereign overreach. However, its very materiality proved its undoing: too cumbersome to handle and verify at scale, it demanded centralized custodians and thereby laid itself open to appropriation. When gold’s limitations clashed with state imperatives, authorities intervened decisively. The enduring lesson is that any constraint vulnerable to suspension in crises is illusory.</p>

      <p>Bitcoin could impose accountability on sovereign mismanagement by functioning as a relentless real-time market enforcer, disciplining irresponsibility by allowing for instantaneous, global capital reallocation. Unlike traditional assets susceptible to regulatory capture or confiscation, bitcoin’s decentralized protocol remains impervious to unilateral intervention. Thereby ensuring poor governance triggers immediate and measurable consequences.</p>

      <p>Complementing bitcoin’s role as the capped neutral layer, stablecoins have emerged as novel digital mechanisms for onshoring eurodollars by digitizing and repatriating the vast offshore dollar liquidity that has long existed beyond the U.S.’s borders. They accelerate global economic integration, and can reinforce U.S. dollar hegemony natively in a digital era.</p>

      <p>In this adjusted framework we see bitcoin completing the transformation from static electricity to electrical current. Bitcoin serves as the ultimate adjudicator of trust and scarce value, while stablecoins operate as the scalable pipelines for sovereign currency distribution. Together they form a single, self-correcting system.</p>
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
      <p>Oil was the industrial age’s stored sunlight as buried work, compressed by time and geology, waiting to be unleashed. Compute is the digital age’s stored competence as humanity’s accumulated experience, encoded in language and images, compressed onto silicon, and ready to be leveraged. Yet, an ocean of oil did not create wealth by simply existing. The economic surplus of oil emerged only when energy was refined, transported, priced, and sold to consumers in the form of goods and services. Production itself alone was never sufficient. Economic surplus was born only where producers answered the market’s <strong>“why”</strong> correctly.</p>
      
      <p>AI-assisted competence is forming a similar reserve today, not energy in barrels, but capability in tokens: a reservoir of “how” that can be summoned in seconds. Like energy, competence alone does not determine outcomes. Competence enables more execution, but it is human judgment at the edge that governs choice allowing for coherence to be established. Judgement is required for the answer to <strong>“why”</strong>. Why this product, why this market, why now rather than later. And when the cost of execution collapses, the penalty for choosing the wrong “why” rises. Therefore, internal judgement which ultimately leads to coherence must be protected.</p>

      <p>In competitive markets, surplus is created in the spread between what it costs producers to deliver value and what consumers are willing to pay for it. As competence equalizes, that spread compresses: when stored expertise floods the market, the marginal cost of being “good” collapses with it. Baseline competence becomes abundant and widely accessible. The distance between good and great does not just narrow, it becomes more contested. When everyone draws from the same pool of competence, outcomes converge, and convergent outcomes cannot generate economic surplus.</p>

      <p>This is where secure and private coherence emerges as a critical differentiator. Coherence carries two intertwined meanings: the quality of being logical and consistent, and the quality of forming a unified whole. It is therefore not mere consistency, rigid uniformity that can homogenize, but the deeper internal refinement of models (mental, operational, and strategic) that aligns actions across time and through uncertainties into a resilient, proprietary system. Without secure and private coherence, reliance on commoditized AI models leads to homogenized strategies.</p>

      <p>Thus, AI introduces a multiplier that cuts both ways. AI accelerates trajectories already chosen both positively and negatively. Focus compounds faster, but incoherence leaks value faster too. Judgment outsourced to AI-generated competence without internal curation produces homogenized decisions where margins collapse under competitive pressure. To counter this, protected internal refinement becomes essential. Iteratively honing proprietary human insights, filtering noise, and building coherent frameworks that diverge from the crowd needs to be secured.</p>

      <p>The contrarian refusal to follow the crowd becomes a strategic necessity. Ten31 exists to underwrite judgment in an era that is systematically trying to eliminate it. We are optimizing to operate in a landscape flooded with output, where output itself is not scarce. We invest and help to mold the systems that preserve the integrity of economic decisions, align producers with consumers, settle value without permission, and refuse to dilute consequences. <em>Credible Finance</em> is not about efficiency for its own sake, but about ensuring correct judgments are able to compound.</p>
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
  }
];
