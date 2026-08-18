import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import DashboardLayout from './components/DashboardLayout';
import ClubSelect from './pages/ClubSelect';
import ClubGate from './pages/ClubGate';
import ClubShowcase from './pages/ClubShowcase';
import ClubRegisterRequest from './pages/ClubRegisterRequest';
import PublicProfiles from './pages/PublicProfiles';
import HistoryFull from './pages/HistoryFull';
import Register from './pages/Register';
import Login from './pages/Login';
import PendingApproval from './pages/PendingApproval';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Contributions from './pages/Contributions';
import AdminPanel from './pages/AdminPanel';
import Leaderboard from './pages/Leaderboard';
import Tactics from './pages/Tactics';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function withLayout(children: React.ReactNode) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ClubSelect />} />
            <Route path="/clubs/inscription" element={<ClubRegisterRequest />} />
            <Route path="/profils-publics" element={<PublicProfiles />} />
            <Route path="/historique" element={<HistoryFull />} />
            <Route path="/clubs/:clubId/vitrine" element={<ClubShowcase />} />
            <Route path="/clubs/:clubId" element={<ClubGate />} />
            <Route path="/clubs/:clubId/register" element={<Register />} />
            <Route path="/pending" element={<PendingApproval />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={withLayout(<Dashboard />)} />
            <Route path="/matches" element={withLayout(<Matches />)} />
            <Route path="/leaderboard" element={withLayout(<Leaderboard />)} />
            <Route path="/profile" element={withLayout(<Profile />)} />
            <Route path="/contributions" element={withLayout(<Contributions />)} />
            <Route
              path="/admin"
              element={withLayout(<AdminRoute><AdminPanel /></AdminRoute>)}
            />

            <Route path="/tactics" element={withLayout(<Tactics />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
