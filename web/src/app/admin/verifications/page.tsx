import { ShieldCheck, CheckCircle, XCircle } from "lucide-react";

const MOCK_QUEUE = [
  { id: '1', name: 'Alain Ndikumana', joined: 'Oct 2023', sales: 45, documents: 'National ID, Business Reg' },
  { id: '2', name: 'Sarah Teta', joined: 'Jan 2024', sales: 12, documents: 'Passport' },
  { id: '3', name: 'Kigali Motors Ltd', joined: 'Mar 2024', sales: 89, documents: 'Business Reg, Tax Clearance' },
];

export default function VerificationsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-midnight-ink mb-1 flex items-center gap-3">
          <ShieldCheck className="text-gura-orange" size={32} />
          Verification Queue
        </h1>
        <p className="text-slate font-body">Review and approve Gura Certified seller applications.</p>
      </header>

      <div className="bg-white rounded-2xl border border-slate-tint shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-tint/50 border-b border-slate-tint">
                <th className="p-4 font-heading text-sm text-slate uppercase tracking-wider">User</th>
                <th className="p-4 font-heading text-sm text-slate uppercase tracking-wider">Platform Stats</th>
                <th className="p-4 font-heading text-sm text-slate uppercase tracking-wider">Documents Provided</th>
                <th className="p-4 font-heading text-sm text-slate uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-tint">
              {MOCK_QUEUE.map((request) => (
                <tr key={request.id} className="hover:bg-slate-tint/20 transition-colors">
                  <td className="p-4">
                    <p className="font-heading font-bold text-midnight-ink">{request.name}</p>
                    <p className="font-body text-sm text-slate">Joined {request.joined}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-body text-midnight-ink">{request.sales} lifetime sales</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-3 py-1 bg-warm-linen border border-slate-tint rounded-md font-body text-sm text-midnight-ink">
                      {request.documents}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="flex items-center gap-1 px-4 py-2 bg-malachite/10 text-malachite hover:bg-malachite/20 font-heading text-sm font-bold rounded-lg transition-colors">
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button className="flex items-center gap-1 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 font-heading text-sm font-bold rounded-lg transition-colors">
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {MOCK_QUEUE.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate font-body">
                    No pending verification requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
