import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Terminal, ShieldCheck, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey) return;

    setError('');
    setIsLoading(true);

    const success = await login(licenseKey);

    if (!success) {
      setError('Invalid or expired license key.');
    }

    setIsLoading(false);
  };

  return (
    <main className="flex h-screen flex-col items-center justify-center p-6 bg-[#050505] text-center overflow-hidden relative">
      <div className="gradient-bg" />

      <div className="animate-fade-in w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-accent-color rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(0,102,255,0.4)]">
            <Terminal size={32} color="#000" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter italic uppercase text-white">Underground Vault</h1>
          <p className="text-text-secondary text-[10px] mt-2 font-bold uppercase tracking-[0.3em]">Secure Access Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-10 glow-on-hover relative">
          <div className="flex flex-col gap-6">
            <div className="text-left">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-3 block">Authorization Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="input-glass pl-12 text-center tracking-widest font-mono text-sm"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full justify-center group" disabled={isLoading}>
              {isLoading ? "VERIFYING..." : (
                <>
                  ENTER SYSTEM
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500" />
                <p className="text-red-500 text-[10px] font-black uppercase tracking-wider">{error}</p>
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
