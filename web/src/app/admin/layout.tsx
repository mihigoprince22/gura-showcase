import Link from "next/link";
import { LayoutDashboard, Users, ShieldCheck, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-tint/30">
      {/* Sidebar */}
      <aside className="w-64 bg-midnight-ink text-white flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-heading font-bold text-gura-orange tracking-tight">GURA <span className="text-white text-lg font-body font-normal">Admin</span></h1>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white font-heading transition-colors">
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 hover:text-white font-heading transition-colors">
            <Users size={20} />
            <span>Users & Listings</span>
          </Link>
          <Link href="/admin/verifications" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 hover:text-white font-heading transition-colors">
            <ShieldCheck size={20} />
            <span>Verification Queue</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/80 hover:text-white font-heading transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 font-heading transition-colors">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
