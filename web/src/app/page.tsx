import Image from "next/image";
import Link from "next/link";

// Mock data to ensure MVP visual excellence without needing the backend running locally yet
const MOCK_LISTINGS = [
  { id: '1', title: 'MacBook Pro M2 2023', price: 1850000, condition: 'Like New', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800' },
  { id: '2', title: 'Nike Air Max 270', price: 45000, condition: 'New', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
  { id: '3', title: 'Sony A7III Camera', price: 1200000, condition: 'Good', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800' },
  { id: '4', title: 'Toyota RAV4 2018', price: 22000000, condition: 'Used', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=800' },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gura-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
        
        <div className="max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-heading font-bold text-midnight-ink leading-tight mb-6">
            Find what you <span className="text-gura-orange">need</span>. <br/>
            Sell what you <span className="text-malachite">don't</span>.
          </h2>
          <p className="text-lg md:text-xl font-body text-slate mb-10 max-w-xl">
            Join East Africa's most trusted peer-to-peer marketplace. Zero hassle, guaranteed security, and instant connections.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search for cars, phones, clothes..." 
                className="w-full h-14 pl-6 pr-14 rounded-full border border-slate-tint bg-white/80 backdrop-blur-md shadow-sm font-body text-midnight-ink focus:outline-none focus:border-gura-orange focus:ring-1 focus:ring-gura-orange transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 w-10 bg-gura-orange text-white rounded-full flex items-center justify-center hover:bg-[#d94d00] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
            </div>
          </div>
          
          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {['Vehicles', 'Electronics', 'Fashion', 'Home', 'Real Estate'].map(cat => (
              <button key={cat} className="px-4 py-2 rounded-full bg-white border border-slate-tint font-heading text-sm text-midnight-ink hover:border-gura-orange hover:text-gura-orange transition-colors">
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Feed */}
      <section className="px-4">
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-3xl font-heading font-bold text-midnight-ink">Fresh on Gura</h3>
          <a href="#" className="font-heading text-gura-orange hover:underline">View all →</a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_LISTINGS.map(listing => (
            <Link href={`/listing/${listing.id}`} key={listing.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-tint hover:shadow-xl hover:shadow-slate/10 transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-slate-tint">
                <img 
                  src={listing.image} 
                  alt={listing.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md">
                  <span className="font-heading text-xs font-bold text-midnight-ink">{listing.condition}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h4 className="font-heading text-lg font-bold text-midnight-ink mb-2 line-clamp-1 group-hover:text-gura-orange transition-colors">{listing.title}</h4>
                <div className="mt-auto pt-4 border-t border-slate-tint">
                  <span className="font-mono text-xl font-bold text-midnight-ink">
                    {listing.price.toLocaleString()} RWF
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="mx-4 bg-midnight-ink rounded-3xl p-10 md:p-16 mt-10 relative overflow-hidden">
        <div className="absolute -right-20 -top-40 w-96 h-96 bg-gura-orange blur-3xl opacity-20 rounded-full" />
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-warm-linen mb-4">
            Gura Certified Trust
          </h3>
          <p className="text-lg font-body text-warm-linen/80 mb-8">
            Look for the Gold Star badge. Our certified sellers have passed rigorous KYC verification, ensuring your money and goods are perfectly safe.
          </p>
          <button className="bg-savanna-gold text-midnight-ink font-heading font-bold px-8 py-3 rounded-full hover:bg-yellow-400 transition-colors">
            Learn about Trust & Safety
          </button>
        </div>
      </section>

    </div>
  );
}
