import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckCircle, AlertCircle, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleSignIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            await googleSignIn();
            navigate('/');
        } catch (err) {
            setError('Failed to sign in with Google.');
            console.error(err);
        }
    };

    return (
        <AuthLayout title="Welcome Back" subtitle="Log in to your Student AI Dashboard">
            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-widest">Email Identity</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all dark:text-slate-100 font-medium placeholder-slate-400"
                            placeholder="name@university.edu"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-widest">Secret Access</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all dark:text-slate-100 font-medium placeholder-slate-400"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                >
                    {loading ? 'Decrypting...' : 'Initiate Session'}
                </button>
            </form>

            <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-white dark:bg-slate-900 text-slate-400 font-bold uppercase tracking-widest">Or Bridge With</span>
                </div>
            </div>

            <button
                onClick={handleGoogleSignIn}
                type="button"
                className="w-full py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-slate-100 dark:hover:bg-slate-900 active:scale-95 shadow-sm"
            >
                <Chrome className="w-5 h-5 text-red-500" />
                GOOGLE UNIVERSE
            </button>

            <p className="mt-10 text-center text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">
                New Prospect?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-black decoration-2 underline-offset-4 hover:underline">
                    Create New ID
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Login;
