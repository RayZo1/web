import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { AdminPanel } from './components/AdminPanel';

function AppContent() {
  const { license, canManageContent, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-sm">Loading...</div>
      </div>
    );
  }

  if (!license) {
    return <LoginPage />;
  }

  return (
    <>
      <Header />
      {canManageContent ? <AdminPanel /> : <LandingPage />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
