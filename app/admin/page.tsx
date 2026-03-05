"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Users, Ban, Globe, Save, Trash2, Edit3, X, Check, Lock } from "lucide-react";

export default function AdminPanel() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [adminKey, setAdminKey] = useState("");
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Mock Admin Auth Logic
    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminKey === "owner-master-key-2026") {
            setIsAuthorized(true);
            fetchMockData();
        }
    };

    const fetchMockData = () => {
        setStats({ total: 42, active: 38, banned: 4, version: "1.1" });
        setUsers([
            { id: "1008398902644441239", username: "Admin_RayZo", hwid: "5cc09e...5fe6", status: "active", expiry: "20291231" },
            { id: "987654321012345678", username: "Test_User_2", hwid: "9f8e7d...1a2b", status: "suspended", expiry: "20260310" },
        ]);
    };

    if (!isAuthorized) {
        return (
            <main className="flex h-screen items-center justify-center p-6 bg-[#000]">
                <form onSubmit={handleAuth} className="glass p-10 w-full max-w-md text-center">
                    <Lock className="mx-auto mb-6 text-accent-color" size={48} />
                    <h2 className="text-2xl font-black mb-2 uppercase italic">Admin Vault</h2>
                    <p className="text-text-secondary text-sm mb-8 tracking-tight">System authentication required.</p>
                    <input
                        type="password"
                        value={adminKey}
                        onChange={(e) => setAdminKey(e.target.value)}
                        placeholder="MASTER_KEY"
                        className="input-glass mb-4 text-center tracking-[0.5em]"
                    />
                    <button type="submit" className="btn btn-primary w-full justify-center">UNSEAL ACCESS</button>
                </form>
            </main>
        );
    }

    return (
        <div className="p-6 md:p-12 max-w-[1600px] mx-auto min-h-screen">
            <header className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-black flex items-center gap-2">
                    <ShieldAlert className="text-red-500" />
                    CMD_CENTER
                </h2>
                <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">Secure Link</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard title="Total Users" val={stats.total} icon={<Users className="text-accent-color" />} />
                <StatCard title="Active Seats" val={stats.active} icon={<Check className="text-blue-500" />} />
                <StatCard title="Blacklist" val={stats.banned} icon={<Ban className="text-red-500" />} />
                <StatCard title="Core Engine" val={`v${stats.version}`} icon={<Globe className="text-accent-secondary" />} />
            </div>

            {/* User Table */}
            <div className="glass overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">Database Records</h3>
                    <button className="btn btn-secondary text-xs">Export JSON</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-bold uppercase text-text-secondary">
                                <th className="px-6 py-4">Discord User</th>
                                <th className="px-6 py-4">Machine HWID</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Expiration</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors text-sm">
                                    <td className="px-6 py-4 font-semibold">{u.username} <span className="block text-[10px] font-normal text-text-secondary">{u.id}</span></td>
                                    <td className="px-6 py-4 font-mono text-xs">{u.hwid}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${u.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">{u.expiry}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-text-secondary"><Edit3 size={16} /></button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-red-500"><Ban size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, val, icon }: { title: string, val: any, icon: any }) {
    return (
        <div className="glass p-6">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{title}</span>
                {icon}
            </div>
            <p className="text-3xl font-black tracking-tighter">{val}</p>
        </div>
    );
}
