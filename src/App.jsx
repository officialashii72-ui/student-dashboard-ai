
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestOrAuthenticatedRoute from './components/auth/GuestOrAuthenticatedRoute';
import { Toaster } from 'sonner';

/**
 * App Component
 * 
 * Main routing structure supporting:
 * - Public routes (Home, Login, Signup)
 * - Guest + Authenticated routes (Dashboard, AI Chat, Analytics)
 * - Protected routes (Messages, Team, Settings - authenticated only)
 * - Invite handling
 */
function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors expand={false} />
      <Router>
        <Routes>
          {/* Public routes - anyone can access */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Guest + Authenticated routes - both can access */}
          <Route
            path="/*"
            element={
              <GuestOrAuthenticatedRoute>
                <Layout>
                  <Routes>
                    {/* Dashboard accessible to guests and authenticated users */}
                    <Route path="/" element={<Dashboard />} />
                    
                    {/* AI Chat accessible to guests and authenticated users */}
                    <Route path="/ai-tutor" element={<AIChat />} />
                    
                    {/* Analytics accessible to guests and authenticated users */}
                    <Route path="/analytics" element={<Analytics />} />

                    {/* Protected routes - authenticated users only */}
                    <Route
                      path="/team"
                      element={
                        <ProtectedRoute>
                          <Team />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/messages"
                      element={
                        <ProtectedRoute>
                          <Messages />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <SettingsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/invite" element={<InviteHandler />} />
                  </Routes>
                </Layout>
              </GuestOrAuthenticatedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
