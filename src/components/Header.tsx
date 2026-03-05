import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { Logo } from './Logo';

export function Header() {
  const { license, logout } = useAuth();

  const getModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      owner: 'Owner',
      admin: 'Admin',
      user: 'User',
      media: 'Media',
    };
    return labels[mode] || 'User';
  };

  return (
    <header className="bg-black border-b border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo />
            <h1 className="text-xl font-bold">
              <span className="text-blue-600">under</span>
              <span className="text-white">ground</span>
            </h1>
          </div>

          {license && (
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Mode</p>
                <p className="text-sm text-white font-medium">
                  {getModeLabel(license.user_mode)}
                </p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white transition-colors duration-200 rounded"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
