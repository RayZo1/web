"use client";

import { useState } from "react";
import { Download, Shield, Zap, Lock, Terminal, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
    const [license, setLicense] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!license) return;

        setLoading(true);
        setError("");

        try {
            // Logic for license validation will go here
            window.location.href = `/dashboard?key=${license}`;
        } catch (err) {
            setError("Invalid license key.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
            <header className="fixed top-0 w-full p-6 flex justify-between items-center max-w-7xl">
                <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
                    <Terminal className="text-accent-color" />
                    UNDERGROUND
                </div>
                <Link href="/admin">
                    <button className="btn btn-secondary text-sm">Owner Access</button>
                </Link>
            </header>

            <section className="animate-fade-in max-w-3xl">
                <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
                    THE FUTURE OF <span className="text-accent-color">EXECUTION</span>.
                </h1>
                <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
                    Ultra-secure, feature-rich, and built for performance. Sign in with your license to download the latest build and manage your machine link.
                </p>

                <form onSubmit={handleLogin} className="glass p-8 max-w-lg mx-auto glow-on-hover">
                    <div className="flex flex-col gap-4">
                        <div className="text-left mb-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Enterprise License</label>
                            <input
                                type="text"
                                value={license}
                                onChange={(e) => setLicense(e.target.value)}
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                className="input-glass mt-2"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full justify-center" disabled={loading}>
                            {loading ? "Authorizing..." : "ENTER DASHBOARD"}
                        </button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                </form>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-7xl w-full">
                <FeatureCard
                    icon={<Shield className="text-accent-color" />}
                    title="Security"
                    desc="Multi-layered encryption and cloud-based verification ensures your tool is safe from analysis."
                />
                <FeatureCard
                    icon={<Zap className="text-accent-secondary" />}
                    title="Performance"
                    desc="Optimized C++ core and lightweight API ensures minimal impact on your system resources."
                />
                <FeatureCard
                    icon={<Lock className="text-purple-500" />}
                    title="Privacy"
                    desc="Hardware fingerprinting technology that only sees what you want it to see. No bloat."
                />
            </div>

            <footer className="mt-20 text-text-secondary text-sm">
                © 2026 Underground Systems. All rights reserved.
            </footer>
        </main>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="glass p-8 text-left hover:border-accent-color transition-colors">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
