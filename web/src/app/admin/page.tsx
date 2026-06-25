import { Activity, Users, ShoppingBag, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-midnight-ink mb-1">Admin Overview</h1>
          <p className="text-slate font-body">Platform metrics and system health.</p>
        </div>
        <div className="bg-white border border-slate-tint rounded-lg px-4 py-2 font-body text-sm text-slate">
          Last updated: Just now
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-tint shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-slate">Total Users</h3>
            <Users className="text-midnight-ink" size={24} />
          </div>
          <p className="text-3xl font-mono font-bold text-midnight-ink mb-2">12,405</p>
          <p className="text-sm font-body text-malachite flex items-center gap-1">
            <Activity size={14} /> +12% this month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-tint shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-slate">Active Listings</h3>
            <ShoppingBag className="text-midnight-ink" size={24} />
          </div>
          <p className="text-3xl font-mono font-bold text-midnight-ink mb-2">8,932</p>
          <p className="text-sm font-body text-malachite flex items-center gap-1">
            <Activity size={14} /> +5% this month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-tint shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-slate">Total Volume (RWF)</h3>
            <span className="font-mono text-midnight-ink text-xl">RWF</span>
          </div>
          <p className="text-3xl font-mono font-bold text-midnight-ink mb-2">45.2M</p>
          <p className="text-sm font-body text-malachite flex items-center gap-1">
            <Activity size={14} /> +22% this month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-tint shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-slate">Pending KYC</h3>
            <AlertTriangle className="text-gura-orange" size={24} />
          </div>
          <p className="text-3xl font-mono font-bold text-gura-orange mb-2">24</p>
          <p className="text-sm font-body text-slate flex items-center gap-1">
            Requires attention
          </p>
        </div>
      </div>

      {/* Recent Activity Mock */}
      <div className="bg-white rounded-2xl border border-slate-tint shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-tint">
          <h2 className="text-xl font-heading font-bold text-midnight-ink">Recent System Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New Listing Flagged', item: 'iPhone 15 Pro Max', time: '10 mins ago', status: 'pending' },
              { action: 'User Verified', item: 'John Mukunzi', time: '1 hr ago', status: 'resolved' },
              { action: 'Dispute Raised', item: 'Order #9281', time: '3 hrs ago', status: 'pending' },
              { action: 'Payout Processed', item: 'Jane Doe', time: '5 hrs ago', status: 'resolved' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-tint last:border-0">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${activity.status === 'pending' ? 'bg-gura-orange' : 'bg-malachite'}`} />
                  <div>
                    <p className="font-heading font-bold text-midnight-ink">{activity.action}</p>
                    <p className="font-body text-sm text-slate">{activity.item}</p>
                  </div>
                </div>
                <span className="font-body text-sm text-slate">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
