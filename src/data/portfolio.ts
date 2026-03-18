export interface PortfolioItem {
  name: string;
  description: string;
  category: string;
  url: string;
  logo: string;
}

// Data extracted from the Ten31 website portfolio
export const portfolioData: PortfolioItem[] = [
  {
    name: "AnchorWatch",
    description: "Regulated bitcoin insurance and enterprise-grade multi-institutional custody",
    category: "Insurance, financial services",
    url: "https://www.anchorwatch.com",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532d337415f981d85dcf172/1697829687808/Anchor+Watch.png"
  },
  {
    name: "Battery",
    description: "Project finance vehicle integrating bitcoin as collateral",
    category: "Credit products",
    url: "https://www.batteryfinance.io/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532e8243bad63385aa04bb9/1697835044072/battery+copy.png"
  },
  {
    name: "Bitnob",
    description: "Africa-based bitcoin and lightning financial services platform",
    category: "Financial services",
    url: "https://bitnob.com/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532e83542342e6b342f8d88/1697835061325/bitnob.png"
  },
  {
    name: "Cathedra",
    description: "Miner focused on off-grid, stranded, and waste gas opportunities",
    category: "Bitcoin mining",
    url: "https://cathedra.com/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532d338953c0c2277ba88a9/1697829688159/Cathedra_Horizontal_DarkPeriwinkle.png"
  },
  {
    name: "Coinkite",
    description: "Premier manufacturer of consumer tools for custody and security",
    category: "Bitcoin, nostr, & freedom tech hardware",
    url: "https://www.coinkite.com",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532c401ecf115136360ede1/1697825793314/coinkite-logo.png"
  },
  {
    name: "debifi",
    description: "Non-custodial P2P lending platform focused on institutions",
    category: "Credit products",
    url: "https://debifi.com/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532e36c56ab0f0bd630172a/1697833836842/debifi.png"
  },
  {
    name: "Fedi",
    description: "Platform enhancing the ease and privacy of bitcoin custody",
    category: "Lightning, financial services",
    url: "https://www.fedi.xyz/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532e3ad8f393f7e42dc22e6/1697833906696/fedi+black-fedi-logo%402x.png"
  },
  {
    name: "Fold",
    description: "Bitcoin-linked consumer rewards",
    category: "Consumer products",
    url: "https://foldapp.com/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6537ccb47f092c2cbf0b4e23/1698155700295/fold.png"
  },
  {
    name: "Giga Energy",
    description: "Texas-based natural gas bitcoin mining infrastructure provider",
    category: "Bitcoin mining",
    url: "https://www.gigaenergy.com/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532e7ba0255fb32e1ad8ef0/1697834938683/giga.png"
  },
  {
    name: "GRIID",
    description: "Miner focused on vertical integration with nuclear / hydro power assets",
    category: "Bitcoin mining",
    url: "https://www.griid.com/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532e36c7c3fa705fab9259b/1697833836843/griid.png"
  },
  {
    name: "Hodl Hodl",
    description: "Non-custodial P2P bitcoin lending and trading platform",
    category: "Trading and credit products",
    url: "https://hodlhodl.com/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532e46e587bc764c7327f88/1697834094126/hodl+hodl+logo+transparent.png"
  },
  {
    name: "Mutiny",
    description: "Unique privacy-focused lightning platform with web-first design",
    category: "Bitcoin, nostr, freedom tech tools",
    url: "https://www.mutinywallet.com/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532e36c4cddb24b8700edc0/1697833836828/mutiny.png"
  },
  {
    name: "Primal",
    description: "Open source nostr client and caching provider",
    category: "Nostr and freedom tech",
    url: "https://primal.net/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532e35e53b1a17a90fe17f3/1697833822590/primal.png"
  },
  {
    name: "River",
    description: "Bitcoin exchange and financial services provider",
    category: "Trading and financial services",
    url: "https://river.com/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6537cb8e93d2e66aedd808fd/1698155406979/river.png"
  },
  {
    name: "Standard Bitcoin",
    description: "Hosted bitcoin mining operator providing on- and off-grid solutions",
    category: "Bitcoin mining",
    url: "https://standardbitcoin.com/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532e4a0ef14523acf6a68ab/1697834144466/standard+bitcoin.png"
  },
  {
    name: "Start9",
    description: "Developer of OS and personal server for self-hosting software",
    category: "Freedom tech and AI",
    url: "https://start9.com/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532e5f834300834519d64dc/1697834488673/start9_+logo_dark_transparent.png"
  },
  {
    name: "Strike",
    description: "Leading bitcoin and lightning financial services platform",
    category: "Financial services, lightning",
    url: "https://strike.me/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6537d7e4b94f4d71b8251fbd/1698158564272/strike+new.png"
  },
  {
    name: "Unchained",
    description: "Collaborative custody platform offering suite of financial services",
    category: "Financial services and credit",
    url: "https://unchained.com/",
    logo: "https://static1.squarespace.com/static/5fff4fd74fb00c62da2c61cf/t/6532e9b7f4c2752f838a3fce/1697835447206/unchained.png"
  }
];
