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
    description: 'Meet the team behind Ten31, experts in private equity and venture capital dedicated to bitcoin and freedom tech.',
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />
      
      <main className="pt-32 pb-24 border-b border-white/10 relative overflow-hidden">
         {/* Subtle background abstract */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full scale-150 transform translate-x-1/2 -translate-y-1/4 mix-blend-screen pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mb-24">
            <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">LEADERS IN<br />FREEDOM.</h1>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-medium">
              A collective of veterans with decades of experience in global private equity, venture capital, and deep roots in the bitcoin ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
            {TEAM.map((member, i) => (
              <div key={i} className="group relative">
                {/* Image container with extreme styling */}
                <div className="relative aspect-[3/4] overflow-hidden mb-6 filter grayscale contrast-125 group-hover:filter-none transition-all duration-700 block bg-white/5 border border-white/10">
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent z-10 transition-colors duration-500"></div>
                   <img 
                     src={member.image} 
                     alt={member.name}
                     className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
                     loading="lazy"
                   />
                   {/* Decorative corner accent */}
                   <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/0 group-hover:border-white z-20 m-4 transition-colors duration-300"></div>
                </div>

                <div>
                  <h3 className="text-3xl font-heading font-bold mb-2 tracking-tight group-hover:text-white transition-colors">{member.name}</h3>
                  <p className="text-sm font-bold tracking-[0.1em] uppercase text-white/50 mb-4">{member.role}</p>
                  <p className="text-white/60 leading-relaxed font-medium line-clamp-4 group-hover:line-clamp-none transition-all duration-300 relative z-20 bg-black/90 md:bg-transparent p-4 md:p-0 -mx-4 md:mx-0 rounded-md md:rounded-none">
                    {member.bio}
                  </p>
                </div>
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
