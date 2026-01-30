import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import {
    collection as fsCollection,
    query as fsQuery,
    where as fsWhere,
    onSnapshot as fsOnSnapshot,
    orderBy as fsOrderBy,
    limit as fsLimit
} from 'firebase/firestore';
import { toast } from 'sonner';

const NotificationListener = () => {
    const { currentUser } = useAuth();
    const lastMessageTime = useRef(Date.now());
    const lastGlobalTime = useRef(Date.now());

    useEffect(() => {
        if (!currentUser) return;

        // 1. Listen for new messages in all my chats
        const chatsQuery = fsQuery(
            fsCollection(db, "chats"),
            fsWhere("members", "array-contains", currentUser.uid)
        );

        const unsubChats = fsOnSnapshot(chatsQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "modified") {
                    const chatData = change.doc.data();
                    // Only notify if message is from OTHERS and new
                    if (chatData.lastMessageSenderId !== currentUser.uid &&
                        chatData.lastMessageAt?.seconds * 1000 > lastMessageTime.current) {

                        toast.message("New Direct Message", {
                            description: chatData.lastMessage,
                            action: {
                                label: "Reply",
                                onClick: () => window.location.href = '/messages'
                            }
                        });
                        lastMessageTime.current = Date.now();
                    }
                }
            });
        });

        // 2. Listen for Global Messages
        const globalQuery = fsQuery(
            fsCollection(db, "globalChat"),
            fsOrderBy("createdAt", "desc"),
            fsLimit(1)
        );

        const unsubGlobal = fsOnSnapshot(globalQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const msg = change.doc.data();
                    if (msg.senderId !== currentUser.uid &&
                        msg.createdAt?.seconds * 1000 > lastGlobalTime.current) {

                        toast.info(`Public Broadcast: ${msg.senderName}`, {
                            description: msg.text,
                        });
                        lastGlobalTime.current = Date.now();
                    }
                }
            });
        });

        // 3. Listen for Friend Requests
        const requestsQuery = fsQuery(
            fsCollection(db, "friendRequests"),
            fsWhere("receiverId", "==", currentUser.uid),
            fsWhere("status", "==", "pending")
        );

        const unsubRequests = fsOnSnapshot(requestsQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const req = change.doc.data();
                    // Check if it's very recent to avoid toast on initial load
                    if (req.createdAt?.seconds * 1000 > Date.now() - 10000) {
                        toast.info(`New friend request from ${req.senderName}`, {
                            description: "Head to the Social Hub to respond.",
                        });
                    }
                }
            });
        });

        return () => {
            unsubChats();
            unsubGlobal();
            unsubRequests();
        };
    }, [currentUser]);

    return null;
};

export default NotificationListener;
