import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { acceptFriendInvite } from '../services/firestoreService';
import { Loader2, UserPlus } from 'lucide-react';

const InviteHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const inviterId = searchParams.get('uid');

    useEffect(() => {
        if (!currentUser || !inviterId) {
            if (!inviterId) navigate('/');
            return;
        }

        const processInvite = async () => {
            try {
                if (currentUser.uid !== inviterId) {
                    await acceptFriendInvite(currentUser.uid, inviterId);
                }
                navigate('/team?invited=true');
            } catch (error) {
                console.error("Invite processing failed:", error);
                navigate('/team');
            }
        };

        processInvite();
    }, [currentUser, inviterId, navigate]);

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
            <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl flex items-center justify-center mb-8 animate-bounce-subtle">
                <UserPlus className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Connecting you...</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Establishing your mutual friendship. One moment please.</p>
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
    );
};

export default InviteHandler;
