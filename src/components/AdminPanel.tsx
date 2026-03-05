import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchAdminStats, fetchAdminUsers, updateUserData, publishVersion } from '../lib/api';
import { Key, Ban, Plus, Download, Globe, Users, ShieldAlert, RefreshCw } from 'lucide-react';

export function AdminPanel() {
  const { licenseKey: adminKey } = useAuth();
  const [stats, setStats] = useState({ total_users: 0, active_users: 0, banned_users: 0, version: '0.0' });
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [publishVer, setPublishVer] = useState('');

  useEffect(() => {
    if (adminKey) {
      fetchLiveStats();
      // Poll for updates every 30s
      const interval = setInterval(fetchLiveStats, 30000);
      return () => clearInterval(interval);
    }
  }, [adminKey]);

  const fetchLiveStats = async () => {
    setIsLoading(true);
    try {
      if (!adminKey) return;
      const [s, u] = await Promise.all([
        fetchAdminStats(adminKey),
        fetchAdminUsers(adminKey)
      ]);
      if (s) setStats(s);
      if (u) setUsers(u);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBan = async (userId: string, currentStatus: string) => {
    if (!adminKey) return;
    const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
    await updateUserData(adminKey, userId, { status: newStatus });
    fetchLiveStats();
  };

  const handleResetHWID = async (userId: string) => {
    if (!adminKey) return;
    await updateUserData(adminKey, userId, { hwid: null });
    fetchLiveStats();
  };

  const handlePublish = async () => {
    if (!adminKey || !publishVer) return;
    await publishVersion(adminKey, publishVer);
    setPublishVer('');
    fetchLiveStats();
  };

  return (
    <div className="min-h-screen bg-bg-dark pt-24 pb-12">
      <div className="gradient-bg" />

      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-fade-in flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-black italic uppercase italic">Control Center</h1>
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Administrative Access Granted</p>
            </div>
            <button onClick={fetchLiveStats} className="btn btn-secondary text-[10px] py-2 px-4 italic">
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              REFRESH
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatCard title="Total Users" val={stats.total_users} icon={<Users className="text-accent-color" />} />
            <StatCard title="Active Subs" val={stats.active_users} icon={<ShieldAlert className="text-green-500" />} />
            <StatCard title="Banned" val={stats.banned_users} icon={<Ban className="text-red-500" />} />
            <StatCard title="Global Build" val={`v${stats.version}`} icon={<Globe className="text-accent-secondary" />} />
          </div>

          {/* Controls Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="glass p-8 animate-fade-in">
              <h2 className="text-xl font-black italic uppercase mb-6">Publish Update</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={publishVer}
                  onChange={(e) => setPublishVer(e.target.value)}
                  placeholder="e.g. 1.2"
                  className="input-glass text-sm italic"
                />
                <button onClick={handlePublish} className="btn btn-primary whitespace-nowrap">
                  PUSH VERSION
                </button>
              </div>
              <p className="text-[10px] text-text-secondary mt-4 font-bold uppercase">This updates the 'Latest Version' for all clients.</p>
            </div>

            <div className="glass p-8 animate-fade-in [animation-delay:200ms]">
              <h2 className="text-xl font-black italic uppercase mb-6">System Alert</h2>
              <div className="flex gap-4">
                <input placeholder="Maintenance incoming..." className="input-glass text-sm italic" />
                <button className="btn btn-secondary whitespace-nowrap">BROADCAST</button>
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="glass animate-fade-in [animation-delay:400ms]">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-black italic uppercase">License Database</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-text-secondary">
                    <th className="px-8 py-5">Identities</th>
                    <th className="px-8 py-5">Fingerprint</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-sm">{u.username}</div>
                        <div className="text-[10px] font-mono text-text-secondary mt-1 uppercase opacity-60">ID: {u.id}</div>
                      </td>
                      <td className="px-8 py-6 font-mono text-[10px] italic text-text-secondary">
                        {u.hwid || 'RECOVERY_MODE'}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${u.status === 'active'
                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                          {u.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleResetHWID(u.id)}
                            title="Reset HWID"
                            className="p-2 hover:bg-white/5 rounded-xl text-text-secondary hover:text-accent-secondary"
                          >
                            <RefreshCw size={16} />
                          </button>
                          <button
                            onClick={() => handleBan(u.id, u.status)}
                            title={u.status === 'banned' ? 'Unban' : 'Ban'}
                            className={`p-2 hover:bg-white/5 rounded-xl ${u.status === 'banned' ? 'text-green-500' : 'text-red-500'}`}
                          >
                            <Ban size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, val, icon }: { title: string, val: any, icon: any }) {
  return (
    <div className="glass p-6 animate-fade-in group">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary group-hover:text-white transition-colors">{title}</span>
        {icon}
      </div>
      <p className="text-3xl font-black tracking-tighter italic">{val}</p>
    </div>
  );
}
