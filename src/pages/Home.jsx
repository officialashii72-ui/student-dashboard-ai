import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Users, MessageSquare, TrendingUp, 
  CheckCircle2, BookOpen, LogIn, ArrowRight 
} from 'lucide-react';

/**
 * Home Component
 * 
 * Landing page that appears before authentication
 * Offers users the choice to:
 * 1. Try guest mode (explore without account)
 * 2. Sign up (create account)
 * 3. Log in (existing user)
 * 
 * Features showcase with modern design
 */
const Home = () => {
  const navigate = useNavigate();
  const { enterGuestMode } = useAuth();

  const handleGuestMode = () => {
    enterGuestMode();
    navigate('/');
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI Study Tutor',
      description: 'Get instant help with any subject using AI-powered explanations',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: CheckCircle2,
      title: 'Task Management',
      description: 'Organize assignments, track deadlines, and monitor progress',
      color: 'from-green-600 to-emerald-600'
    },
    {
      icon: BookOpen,
      title: 'Smart Notes',
      description: 'Capture and organize notes with color-coded subjects',
      color: 'from-purple-600 to-pink-600'
    },
    {
      icon: Users,
      title: 'Collaborate with Friends',
      description: 'Send messages, share resources, and study together',
      color: 'from-orange-600 to-red-600'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Connect with study group members instantly',
      color: 'from-indigo-600 to-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Progress',
      description: 'Track your learning journey with detailed insights',
      color: 'from-cyan-600 to-blue-600'
    },
  ];

  const pricingPlans = [
    {
      name: 'Guest Access',
      price: 'Free',
      description: 'Perfect for exploring',
      features: [
        'View sample dashboard',
        'Limited AI responses',
        'Sample tasks & notes',
        'No data persistence',
      ],
      button: {
        text: 'Try as Guest',
        onClick: handleGuestMode,
        variant: 'secondary'
      }
    },
    {
      name: 'Full Access',
      price: 'Free',
      description: 'For active learners',
      features: [
        'Unlimited AI assistance',
        'Save all tasks & notes',
        'Real-time messaging',
        'Friend connections',
        'Detailed analytics',
        'Data persistence',
      ],
      button: {
        text: 'Sign Up Now',
        onClick: () => navigate('/signup'),
        variant: 'primary'
      },
      highlighted: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-lg font-black">StudyHub</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-lg font-medium text-sm text-slate-300 hover:text-white transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-4 py-2 rounded-lg font-medium text-sm bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-black mb-6 leading-tight">
            Your AI-Powered <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Study Companion
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Manage tasks, take smart notes, chat with friends, and get instant AI help with your studies. All in one beautiful app.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-lg transition-all hover:shadow-2xl hover:shadow-blue-600/50 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleGuestMode}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-lg transition-all"
            >
              Try as Guest
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center gap-8 text-sm text-slate-400 mb-20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Privacy First</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-black text-center mb-16">
          Powerful Features for <span className="text-blue-400">Every Student</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:border-white/20 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-black text-center mb-16">
          Simple, <span className="text-blue-400">Affordable</span> Pricing
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border transition-all ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/50 ring-2 ring-blue-500/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              } p-8`}
            >
              {plan.highlighted && (
                <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                  Recommended
                </div>
              )}
              
              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <div className="text-3xl font-black mb-2">
                {plan.price}
                {plan.price !== 'Free' && <span className="text-sm text-slate-400">/month</span>}
              </div>
              <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.button.onClick}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  plan.button.variant === 'primary'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-600/50'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }`}
              >
                {plan.button.text}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>© 2026 StudyHub. Built for students, by educators.</p>
          <p className="mt-2">Privacy is our priority. Your data is always secure.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
