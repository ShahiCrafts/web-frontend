import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { socket } from '../services/socket';
import { useAuth } from './AuthProvider';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const queryClient = useQueryClient();
    const listenersAttachedRef = useRef(false);

    // --- General Socket Handlers (Unchanged) ---
    // These handlers are kept as they were, they correctly manage state/queries.
    const handleConnect = useCallback(() => {
        console.log('Socket Connected, ID:', socket.id);
        if (user?.id) {
            // NOTE: 'user:online' event will now be emitted by a new, more reliable useEffect
            // socket.emit('user:online', user.id); 
            console.log('The "connect" event fired, but room joining is now handled by a separate useEffect.');
        }
    }, [user]);

    const handleOnlineList = useCallback((list) => {
        setOnlineUsers(list);
    }, []);

    const handleDisconnect = useCallback(() => {
        console.log('Socket Disconnected!');
    }, []);

    const handleConnectError = useCallback((error) => {
        console.error('Socket connection error:', error.message);
        toast.error(`Socket connection error: ${error.message}`);
    }, []);

    const handleErrorMessage = useCallback((data) => {
        console.error('Socket error:', data);
        toast.error(`Socket Error: ${data.error || data.message || 'An unknown error occurred.'}`);
    }, []);
    
    const handleNewNotification = useCallback((data) => {
        console.log('New notification received:', data);
        toast(data.message || '🔔 New notification received!');
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }, [queryClient]);

    // --- Real-time Handlers (Unchanged) ---
    const handleNotificationCountUpdate = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['notificationCounts'] });
    }, [queryClient]);

    const handleCommunityApproved = useCallback((data) => {
        toast.success(data.message || `Your community "${data.communityName}" is now live!`);
        queryClient.invalidateQueries({ queryKey: ['userCommunities'] });
        queryClient.invalidateQueries({ queryKey: ['pendingCommunities'] });
    }, [queryClient]);

    const handleCommunityRejected = useCallback((data) => {
        toast.error(data.message || `Your community "${data.communityName}" was rejected: ${data.reason}`);
        queryClient.invalidateQueries({ queryKey: ['userCommunities'] });
        queryClient.invalidateQueries({ queryKey: ['pendingCommunities'] });
    }, [queryClient]);

    const handleMembershipRequestNew = useCallback((data) => {
        toast.info(data.message || `New membership request for ${data.communityName}`);
        queryClient.invalidateQueries({ queryKey: ['membershipRequests', data.communityId] });
    }, [queryClient]);

    const handleMembershipRequestApproved = useCallback((data) => {
        toast.success(data.message || `Your request to join "${data.communityName}" has been approved!`);
        queryClient.invalidateQueries({ queryKey: ['userCommunities'] });
        queryClient.invalidateQueries({ queryKey: ['membershipRequests', data.communityId] });
    }, [queryClient]);

    const handleMembershipRequestRejected = useCallback((data) => {
        toast.error(data.message || `Your request to join "${data.communityName}" was rejected: ${data.note}`);
        queryClient.invalidateQueries({ queryKey: ['userCommunities'] });
        queryClient.invalidateQueries({ queryKey: ['membershipRequests', data.communityId] });
    }, [queryClient]);

    const handleInvitationSent = useCallback((data) => {
        toast.info(data.message || `You've been invited to join the community "${data.communityName}"!`);
        queryClient.invalidateQueries({ queryKey: ['userInvitations'] });
    }, [queryClient]);

    const handleInvitationAccepted = useCallback((data) => {
        toast.success(data.message || `${data.acceptedByUserName} accepted your invitation to "${data.communityName}"!`);
        queryClient.invalidateQueries({ queryKey: ['communityMembers', data.communityId] });
        queryClient.invalidateQueries({ queryKey: ['communityInvitations', data.communityId] });
    }, [queryClient]);

    const handleInvitationDeclined = useCallback((data) => {
        toast.info(data.message || `${data.declinedByUserName} declined your invitation to "${data.communityName}".`);
        queryClient.invalidateQueries({ queryKey: ['communityInvitations', data.communityId] });
    }, [queryClient]);

    const handleModerationLogCreated = useCallback((data) => {
        toast.warn(`MOD LOG: ${data.message}`);
        queryClient.invalidateQueries({ queryKey: ['moderationLogs', data.communityId] });
        queryClient.invalidateQueries({ queryKey: ['moderationLogs', null] });
    }, [queryClient]);

    const handleNewPost = useCallback((newPost) => {
        toast.success(`New post created: ${newPost.title || newPost.question || newPost.issueTitle}`);
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['posts', newPost._id] });
        queryClient.invalidateQueries({ queryKey: ['communityPosts', newPost.communityId?._id] });
    }, [queryClient]);

    const handlePostUpdated = useCallback((updatedPost) => {
        toast(`Post updated: ${updatedPost.title || updatedPost.question || updatedPost.issueTitle}`, { type: 'info' });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['posts', updatedPost._id] });
        queryClient.invalidateQueries({ queryKey: ['communityPosts', updatedPost.communityId?._id] });
    }, [queryClient]);

    const handlePostDeleted = useCallback((data) => {
        toast.warn(data.message || 'A post was deleted.');
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.removeQueries({ queryKey: ['posts', data.postId] });
        queryClient.invalidateQueries({ queryKey: ['communityPosts', data.communityId] });
    }, [queryClient]);

    const handlePostReported = useCallback((data) => {
        toast.error(data.message || 'A post has been reported for review.');
        queryClient.invalidateQueries({ queryKey: ['posts', data.postId] });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
    }, [queryClient]);

    const handlePollVoteUpdated = useCallback((updatedPoll) => {
        queryClient.invalidateQueries({ queryKey: ['posts', updatedPoll._id] });
        queryClient.invalidateQueries({ queryKey: ['communityPosts', updatedPoll.communityId?._id] });
    }, [queryClient]);

    const handleUserNewFollower = useCallback((data) => {
        if (user && data.followingId === user.id) {
            toast.success(`🎉 ${data.followerFullName} started following you!`);
            queryClient.invalidateQueries({ queryKey: ['followerCount', user.id] });
        }
    }, [user, queryClient]);

    const handleUserUnfollowed = useCallback((data) => {
        if (user && data.followingId === user.id) {
            toast.info(`💔 ${data.followerFullName} unfollowed you.`);
            queryClient.invalidateQueries({ queryKey: ['followerCount', user.id] });
        }
    }, [user, queryClient]);

    const handleUserFollowingStatusUpdate = useCallback((data) => {
        queryClient.invalidateQueries({ queryKey: ['followingStatus', data.targetUserId] });
    }, [queryClient]);

    // --- REFACTORED CONNECTION LOGIC ---
    // This is the new, more reliable useEffect hook.
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (user) {
            // Check if the user's token has changed or if the socket is disconnected.
            if (socket.auth?.token !== token || !socket.connected) {
                console.log('User authenticated, but token changed or socket disconnected. Reconnecting...');
                socket.auth = { token };
                socket.disconnect(); // Ensure a clean state before reconnecting
                socket.connect();
            }

            // This block is now separate and handles joining the rooms.
            // It runs reliably every time the user state or socket connection changes.
            console.log('User and socket ready. Emitting join events.');
            socket.emit('user:online', user.id);
            socket.emit('joinGlobalFeedRoom');
            
        } else {
            // If no user, disconnect the socket.
            if (socket.connected) {
                console.log('User logged out. Disconnecting socket.');
                socket.emit('leaveGlobalFeedRoom');
                socket.disconnect();
                setOnlineUsers([]);
            }
        }

        // Cleanup function: Leave room and disconnect on component unmount
        return () => {
            if (socket.connected) {
                console.log('SocketProvider unmounting or user logging out. Leaving global feed room.');
                socket.emit('leaveGlobalFeedRoom');
                socket.disconnect();
            }
        };
    }, [user]); // The dependency is just the 'user' object from AuthProvider

    // --- Attach Listeners (Unchanged) ---
    // This part is fine as it is. It attaches the handlers just once.
    useEffect(() => {
        if (!listenersAttachedRef.current) {
            socket.on('connect', handleConnect);
            socket.on('user:onlineList', handleOnlineList);
            socket.on('disconnect', handleDisconnect);
            socket.on('connect_error', handleConnectError);
            socket.on('errorMessage', handleErrorMessage);

            socket.on('notification:count:update', handleNotificationCountUpdate);
            socket.on('community:approved', handleCommunityApproved);
            socket.on('community:rejected', handleCommunityRejected);
            socket.on('membership:request:new', handleMembershipRequestNew);
            socket.on('membership:request:approved', handleMembershipRequestApproved);
            socket.on('membership:request:rejected', handleMembershipRequestRejected);
            socket.on('invitation:sent', handleInvitationSent);
            socket.on('invitation:accepted', handleInvitationAccepted);
            socket.on('invitation:declined', handleInvitationDeclined);
            socket.on('moderation:log:created', handleModerationLogCreated);

            socket.on('newPost', handleNewPost);
            socket.on('postUpdated', handlePostUpdated);
            socket.on('postDeleted', handlePostDeleted);
            socket.on('postReported', handlePostReported);
            socket.on('newNotification', handleNewNotification);
            socket.on('pollVoteUpdated', handlePollVoteUpdated);
            socket.on('user:newFollower', handleUserNewFollower);
            socket.on('user:unfollowed', handleUserUnfollowed);
            socket.on('user:followingStatusUpdate', handleUserFollowingStatusUpdate);

            listenersAttachedRef.current = true;
        }

        return () => {
            if (listenersAttachedRef.current) {
                socket.off('connect', handleConnect);
                socket.off('user:onlineList', handleOnlineList);
                socket.off('disconnect', handleDisconnect);
                socket.off('connect_error', handleConnectError);
                socket.off('errorMessage', handleErrorMessage);
                
                socket.off('notification:count:update', handleNotificationCountUpdate);
                socket.off('community:approved', handleCommunityApproved);
                socket.off('community:rejected', handleCommunityRejected);
                socket.off('membership:request:new', handleMembershipRequestNew);
                socket.off('membership:request:approved', handleMembershipRequestApproved);
                socket.off('membership:request:rejected', handleMembershipRequestRejected);
                socket.off('invitation:sent', handleInvitationSent);
                socket.off('invitation:accepted', handleInvitationAccepted);
                socket.off('invitation:declined', handleInvitationDeclined);
                socket.off('moderation:log:created', handleModerationLogCreated);

                socket.off('newPost', handleNewPost);
                socket.off('postUpdated', handlePostUpdated);
                socket.off('postDeleted', handlePostDeleted);
                socket.off('postReported', handlePostReported);
                socket.off('newNotification', handleNewNotification);
                socket.off('pollVoteUpdated', handlePollVoteUpdated);
                socket.off('user:newFollower', handleUserNewFollower);
                socket.off('user:unfollowed', handleUserUnfollowed);
                socket.off('user:followingStatusUpdate', handleUserFollowingStatusUpdate);

                listenersAttachedRef.current = false;
            }
        };
    }, [
        handleConnect, handleOnlineList, handleDisconnect, handleConnectError, handleErrorMessage,
        handleNotificationCountUpdate, handleCommunityApproved, handleCommunityRejected,
        handleMembershipRequestNew, handleMembershipRequestApproved, handleMembershipRequestRejected,
        handleInvitationSent, handleInvitationAccepted, handleInvitationDeclined, handleModerationLogCreated,
        handleNewPost, handlePostUpdated, handlePostDeleted, handlePostReported, handleNewNotification,
        handlePollVoteUpdated, handleUserNewFollower, handleUserUnfollowed, handleUserFollowingStatusUpdate
    ]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);