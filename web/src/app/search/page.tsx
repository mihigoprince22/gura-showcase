import Link from "next/link";

// Mock data for Search Results UI
const MOCK_RESULTS = [
  { id: '1', title: 'MacBook Pro M2 2023', price: 1850000, condition: 'Like New', category: 'Electronics', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800' },
  { id: '2', title: 'Nike Air Max 270', price: 45000, condition: 'New', category: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
  { id: '3', title: 'Sony A7III Camera', price: 1200000, condition: 'Good', category: 'Electronics', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800' },
  { id: '4', title: 'Toyota RAV4 2018', price: 22000000, condition: 'Used', category: 'Vehicles', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=800' },
  { id: '5', title: 'Dell XPS 15', price: 1400000, condition: 'Like New', category: 'Electronics', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800' },
  { id: '6', title: 'Samsung S23 Ultra', price: 1100000, condition: 'New', category: 'Electronics', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800' },
];

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || 'All listings';
  return {
    title: `${query} - Search | Gura`,
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';

  return (
    <div className="px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-midnight-ink mb-4">
          {query ? `Search results for "${query}"` : 'Explore Listings'}
        </h1>
        <div className="relative max-w-2xl">
          <input 
            type="text" 
            defaultValue={query}
            placeholder="Search for cars, phones, clothes..." 
            className="w-full h-14 pl-6 pr-14 rounded-xl border border-slate-tint bg-white shadow-sm font-body text-midnight-ink focus:outline-none focus:border-gura-orange focus:ring-1 focus:ring-gura-orange transition-all"
          />
          <button className="absolute right-2 top-2 bottom-2 px-6 bg-midnight-ink text-white font-heading font-bold rounded-lg hover:bg-gura-orange transition-colors">
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-tint sticky top-24">
            <h2 className="font-heading font-bold text-lg text-midnight-ink mb-6 pb-2 border-b border-slate-tint">Filters</h2>
            
            <div className="mb-6">
              <h3 className="font-heading font-bold text-midnight-ink mb-3">Categories</h3>
              <ul className="space-y-2">
                {['All Categories', 'Electronics', 'Vehicles', 'Fashion', 'Home'].map(cat => (
                  <li key={cat}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-tint text-gura-orange focus:ring-gura-orange" defaultChecked={cat === 'All Categories'} />
                      <span className="font-body text-slate group-hover:text-midnight-ink transition-colors">{cat}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-heading font-bold text-midnight-ink mb-3">Condition</h3>
              <ul className="space-y-2">
                {['New', 'Like New', 'Good', 'Used'].map(cond => (
                  <li key={cond}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-tint text-gura-orange focus:ring-gura-orange" />
                      <span className="font-body text-slate group-hover:text-midnight-ink transition-colors">{cond}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-bold text-midnight-ink mb-3">Price Range (RWF)</h3>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder="Min" className="w-full p-2 rounded-lg border border-slate-tint font-body text-sm" />
                <span className="text-slate">-</span>
                <input type="number" placeholder="Max" className="w-full p-2 rounded-lg border border-slate-tint font-body text-sm" />
              </div>
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="font-body text-slate">{MOCK_RESULTS.length} results found</span>
            <select className="p-2 border border-slate-tint rounded-lg font-body text-midnight-ink bg-white outline-none focus:border-gura-orange">
              <option>Sort by: Newest</option>
              <option>Sort by: Price (Low to High)</option>
              <option>Sort by: Price (High to Low)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_RESULTS.map(listing => (
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
        </div>
      </div>
    </div>
  );
}
