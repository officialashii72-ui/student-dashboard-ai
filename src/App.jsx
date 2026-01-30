
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Team from './pages/Team';
import Messages from './pages/Messages';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/Settings';
import InviteHandler from './components/InviteHandler';
import AIChat from './pages/AIChat';
import { AuthProvider } from './context/AuthContext';
import GuestOrAuthenticatedRoute from './components/auth/GuestOrAuthenticatedRoute';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors expand={false} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <GuestOrAuthenticatedRoute>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/invite" element={<InviteHandler />} />
                  <Route path="/ai-tutor" element={<AIChat />} />
                </Routes>
              </GuestOrAuthenticatedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
