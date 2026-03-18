import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const TEAM = [
  {
    name: "Grant Gilliam",
    role: "Co-founder and Managing Partner",
    bio: "20 years investing professionally in private equity and venture capital. Expertise in sourcing, evaluating, executing and managing investments. Board member: Strike. Previously: CVC Capital Partners.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825361982-MXMYYNORE8XHK9IV0ZWR/GRANTGILLIAM.jpg"
  },
  {
    name: "Jonathan Kirkwood",
    role: "Co-founder and Managing Partner",
    bio: "MD MBA. Expertise in business development, business and capital formation, and investment/fund management. Board member: Start9 Labs, Battery.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825361986-3MNRVV6VBYXV86ROFRQR/19+Kirkwood-2022+B%26W+8x10.jpg"
  },
  {
    name: "Matt Odell",
    role: "Managing Partner",
    bio: "Managing Partner at Ten31. CoFounder: OpenSats, Bitcoin Park. Founding Board: Bitcoin Policy Institute Host: Citadel Dispatch, Rabbit Hole Recap.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825361989-4DU0RYHF58C7QG4JFOJJ/odellprofile.jpg"
  },
  {
    name: "Marty Bent",
    role: "Managing Partner",
    bio: "Founder of TFTC.io, a media company focused on Bitcoin and Freedom in the Digital Age. Board member, Cathedra Bitcoin (TSX-V:CBIT), a Bitcoin mining operator. Previously: Director of Business Development at Great American Mining.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825361992-MEIBY3YKBFRJ1BO8I2OQ/Marty-Bent-.jpg"
  },
  {
    name: "John Arnold",
    role: "Principal",
    bio: "Investor with 7+ years of experience analyzing businesses and evaluating transactions. Previously: Goldman Sachs, Citadel, Crestline.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825361995-ML5APMVO779KC6QOTWC8/JA.jpg"
  },
  {
    name: "Parker Lewis",
    role: "Advisor",
    bio: "Head of Business Development, Unchained Capital. Author: Gradually, Then Suddenly series. Previously: Hayman Capital, FTI Consulting, Deutsche Bank.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825361998-RFB6EEPA4FV991MXH155/Parker-Lewis.jpg"
  },
  {
    name: "Elaine Ou",
    role: "Advisor",
    bio: "Consultant at Global Financial Access. Editor at BTC Times. Columnist at Bloomberg. Previously: Sand Hill Exchange, Abra.",
    image: "https://images.squarespace-cdn.com/content/v1/67e16781f37fad2f91936c8d/1742825362018-LUHO9KCA0SYX79TFKD9F/elaine.jpg"
  }
];

export const Team = () => {
  useSeoMeta({
    title: 'Team | TEN31',
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />

      <main className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mb-20">
            <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight mb-6">Team</h1>
            <p className="text-lg text-white/50 leading-relaxed">
              A collective of veterans with decades of experience in global private equity, venture capital, and deep roots in the bitcoin ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
            {TEAM.map((member, i) => (
              <div key={i} className="group">
                <div className="aspect-[3/4] overflow-hidden mb-6 bg-white/5 grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-heading font-bold mb-1">{member.name}</h3>
                <p className="text-xs tracking-widest uppercase text-white/40 mb-3">{member.role}</p>
                <p className="text-sm text-white/50 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Team;
