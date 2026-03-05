"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Calendar, User, ShieldCheck, Box, RefreshCw, LogOut } from "lucide-react";
import Link from "next/link";
import { validateLicense } from "@/lib/api";

function DashboardContent() {
    const searchParams = useSearchParams();
    const key = searchParams.get("key");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (key) {
            validateLicense(key).then(res => {
                if (res.status === "success") {
                    setData(res);
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [key]);

    if (loading) return <div className="flex h-screen items-center justify-center font-black text-2xl animate-pulse">AUTHORIZING ACCESS...</div>;

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen">
            <nav className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                    <ShieldCheck className="text-accent-color" />
                    DASHBOARD
                </h2>
                <Link href="/">
                    <button className="btn btn-secondary"><LogOut size={18} /> Sign Out</button>
                </Link>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="glass p-8 col-span-1">
                    <div className="w-20 h-20 bg-accent-color rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,136,0.3)]">
                        <User size={40} color="#000" />
                    </div>
                    <h3 className="text-2xl font-black mb-1">{data.username}</h3>
                    <p className="text-text-secondary text-sm mb-6">Verified Customer</p>

                    <div className="space-y-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <label className="text-[10px] font-bold uppercase text-text-secondary">License Type</label>
                            <p className="text-accent-color font-bold">Lifetime Access</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs font-mono break-all">
                            <label className="text-[10px] font-bold uppercase text-text-secondary block mb-1">Fingerprint</label>
                            {data.hwid}
                        </div>
                    </div>
                </div>

                {/* Main Actions */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass p-8 flex flex-col justify-between hover:border-accent-secondary transition-all">
                            <div>
                                <Calendar className="text-accent-secondary mb-4" />
                                <h4 className="text-lg font-bold">Subscription</h4>
                                <p className="text-3xl font-black mt-2">7 Days <span className="text-sm font-normal text-text-secondary">remaining</span></p>
                            </div>
                            <button className="btn btn-secondary mt-6 w-full">Renew Access</button>
                        </div>
                        <div className="glass p-8 flex flex-col justify-between hover:border-accent-color transition-all">
                            <div>
                                <Box className="text-accent-color mb-4" />
                                <h4 className="text-lg font-bold">Current Build</h4>
                                <p className="text-3xl font-black mt-2">v{data.version}</p>
                            </div>
                            <button className="btn btn-primary mt-6 w-full">
                                <Download size={18} /> DOWNLOAD LATEST
                            </button>
                        </div>
                    </div>

                    {/* System Notifications */}
                    <div className="glass p-8">
                        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <RefreshCw size={18} className="text-text-secondary" />
                            Recent Updates
                        </h4>
                        <div className="space-y-4">
                            <UpdateItem version="1.1" date="Today" desc="Integrated cloud versioning system and improved injection stability." />
                            <UpdateItem version="1.0" date="2 Days ago" desc="Initial production release with HWID enforcement." />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UserDashboard() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center font-black text-2xl animate-pulse">LOADING VAULT...</div>}>
            <DashboardContent />
        </Suspense>
    );
}

function UpdateItem({ version, date, desc }: { version: string, date: string, desc: string }) {
    return (
        <div className="border-l-2 border-white/10 pl-4 py-2">
            <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-accent-color">v{version}</span>
                <span className="text-[10px] text-text-secondary uppercase">{date}</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
        </div>
    );
}
