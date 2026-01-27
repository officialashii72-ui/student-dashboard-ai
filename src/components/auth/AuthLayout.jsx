import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 transition-all duration-500">
            <div className="max-w-md w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800/50 p-8 sm:p-12 animate-fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 dark:bg-slate-800 rounded-2xl mb-8 shadow-xl transform hover:rotate-6 transition-transform">
                        <span className="text-white font-black text-3xl">S</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-gray-100 mb-2 tracking-tight">
                        {title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {subtitle}
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
