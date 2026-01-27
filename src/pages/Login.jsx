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

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all dark:text-gray-100"
                            placeholder="your@email.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all dark:text-gray-100"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-900 text-gray-400">Or continue with</span>
                </div>
            </div>

            <button
                onClick={handleGoogleSignIn}
                type="button"
                className="w-full py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95"
            >
                <Chrome className="w-5 h-5 text-red-500" />
                Google
            </button>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
                    Sign up for free
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Login;
