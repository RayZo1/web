"use client";

import { useState } from "react";
import { Terminal, ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { validateLicense } from "@/lib/api";

export default function LandingPage() {
    const [license, setLicense] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!license) return;

        setLoading(true);
        setError("");

        // Smart Redirect for Admin Key
        if (license === "owner-master-key-2026") {
            window.location.href = `/admin`;
            return;
        }

        try {
            const data = await validateLicense(license);
            if (data.status === "success") {
                window.location.href = `/dashboard?key=${license}`;
            } else {
                setError(data.status === "expired" ? "This license has expired." : "Invalid or unrecognized key.");
            }
        } catch (err) {
            setError("Authentication server unreachable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex h-screen flex-col items-center justify-center p-6 bg-[#050505] text-center overflow-hidden">
            <div className="gradient-bg" />

            <div className="animate-fade-in w-full max-w-md">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-accent-color rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(0,102,255,0.4)]">
                        <Terminal size={32} color="#000" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter italic uppercase">Underground Vault</h1>
                    <p className="text-text-secondary text-xs mt-2 font-bold uppercase tracking-[0.2em]">Secure Access Portal</p>
                </div>

                <form onSubmit={handleLogin} className="glass p-10 glow-on-hover relative">
                    <div className="flex flex-col gap-6">
                        <div className="text-left">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-3 block">Authorization Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                                <input
                                    type="text"
                                    value={license}
                                    onChange={(e) => setLicense(e.target.value)}
                                    placeholder="XXXX-XXXX-XXXX-XXXX"
                                    className="input-glass pl-12 text-center tracking-widest font-mono text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full justify-center group" disabled={loading}>
                            {loading ? "VERIFYING..." : (
                                <>
                                    ENTER SYSTEM
                                    <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
                                </>
                            )}
                        </button>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{error}</p>
                            </div>
                        )}
                    </div>
                </form>

                <p className="mt-8 text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-40">
                    © 2026 Underground System Logic
                </p>
            </div>
        </main>
    );
}
