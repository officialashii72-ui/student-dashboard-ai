import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 sm:p-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-200 dark:shadow-none">
                        <span className="text-white font-bold text-3xl">S</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                        {title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {subtitle}
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
