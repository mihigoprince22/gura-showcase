import Image from "next/image";

// Mock database fetch for SEO SSR
async function getListing(id: string) {
  return { 
    id, 
    title: 'MacBook Pro M2 2023', 
    price: 1850000, 
    condition: 'Like New', 
    description: 'Selling my MacBook Pro M2. Barely used, battery cycle count is under 50. Comes with original charger and box.',
    location: 'Kigali, Gasabo',
    seller: {
      name: 'John Mukunzi',
      isCertified: true,
      rating: 4.8,
      reviews: 12
    },
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200' 
  };
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const listing = await getListing(resolvedParams.id);
  return {
    title: `${listing.title} | Gura`,
    description: `Buy ${listing.title} for ${listing.price} RWF in ${listing.location} on Gura.`,
  };
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const listing = await getListing(resolvedParams.id);

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column - Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-tint border border-slate-tint">
            <img 
              src={listing.image} 
              alt={listing.title}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-20 h-20 rounded-lg bg-slate-tint border border-slate-tint flex-shrink-0 cursor-pointer hover:border-gura-orange transition-colors"></div>
            ))}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="inline-block bg-slate-tint text-midnight-ink font-heading text-xs px-3 py-1 rounded-full uppercase tracking-wide">
              {listing.condition}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-midnight-ink mb-6">
            {listing.title}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl font-mono font-bold text-gura-orange">
              {listing.price.toLocaleString()} RWF
            </span>
            {/* Price Intelligence Widget Web Version */}
            <span className="bg-green-100 text-malachite font-heading text-sm px-3 py-1 rounded-md border border-green-200">
              Great Price
            </span>
          </div>

          <div className="bg-warm-linen p-6 rounded-2xl border border-slate-tint mb-8">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-tint/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-tint flex items-center justify-center font-heading text-lg text-gura-orange">
                  {listing.seller.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-midnight-ink text-lg">{listing.seller.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-savanna-gold">★ {listing.seller.rating}</span>
                    <span className="text-slate text-sm">({listing.seller.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              {listing.seller.isCertified && (
                <div className="bg-savanna-gold px-3 py-1 rounded-full">
                  <span className="text-white font-heading text-xs font-bold">Verified</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <button className="flex-1 bg-white border-2 border-midnight-ink text-midnight-ink font-heading font-bold py-3 rounded-full hover:bg-slate-tint transition-colors">
                Message Seller
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-heading font-bold text-midnight-ink mb-4">Description</h3>
            <p className="font-body text-slate leading-relaxed">
              {listing.description}
            </p>
          </div>

          <div className="mt-auto pt-8 border-t border-slate-tint">
            <button className="w-full bg-gura-orange text-white font-heading font-bold text-lg py-4 rounded-full hover:bg-[#d94d00] hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Buy Now with Mobile Money
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
