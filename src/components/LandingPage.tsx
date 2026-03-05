import { useEffect, useState } from 'react';
import { Download, MessageCircle, Shield, Activity, User, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LandingPage() {
  const { license } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Mock news since backend doesn't have it yet, but design is Royal Blue
  const news = [
    { id: 1, title: "Royal Blue Update", content: "The new web suite is now live with real-time backend streams.", date: "Today" },
    { id: 2, title: "Engine Optimization", content: "Improved execution speed by 15% in the latest client build.", date: "Yesterday" }
  ];

  return (
    <div className="min-h-screen bg-bg-dark pt-24 pb-12">
      <div className="gradient-bg" />

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="animate-fade-in text-center mb-16">
            <h1 className="text-5xl font-black tracking-tighter italic uppercase mb-4">Dashboard</h1>
            <p className="text-text-secondary text-xs font-bold uppercase tracking-[0.3em]">Licensed to {license?.username}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <StatCard
              icon={<Shield className="text-accent-color" />}
              label="License Status"
              val={license?.status.toUpperCase() || "ACTIVE"}
              statusColor="text-green-500"
            />
            <StatCard
              icon={<Clock className="text-accent-secondary" />}
              label="Expiration"
              val={license?.expiry || "LIFETIME"}
            />
            <StatCard
              icon={<Activity className="text-purple-500" />}
              label="Hardware"
              val={license?.hwid ? "LINKED" : "NOT LINKED"}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Download Section */}
            <div className="glass p-8 animate-fade-in [animation-delay:200ms]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black italic uppercase">Latest Build</h2>
                <span className="bg-accent-color/10 text-accent-color text-[10px] font-black px-3 py-1 rounded-full border border-accent-color/20">
                  v{license?.version || "1.0"}
                </span>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <Download className="text-accent-secondary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Underground Client</h3>
                    <p className="text-text-secondary text-xs mt-1">Full feature set with premium execution bypasses.</p>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary w-full justify-center">
                <Download size={18} />
                DOWNLOAD NOW
              </button>
            </div>

            {/* News Section */}
            <div className="glass p-8 animate-fade-in [animation-delay:400ms]">
              <h2 className="text-xl font-black italic uppercase mb-8">System Intel</h2>
              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm group-hover:text-accent-color transition-colors">{item.title}</h3>
                      <span className="text-[10px] font-bold uppercase text-text-secondary">{item.date}</span>
                    </div>
                    <p className="text-text-secondary text-[11px] leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, val, statusColor = "text-white" }: { icon: any, label: string, val: string, statusColor?: string }) {
  return (
    <div className="glass p-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{label}</span>
      </div>
      <p className={`text-2xl font-black tracking-tighter ${statusColor}`}>{val}</p>
    </div>
  );
}
