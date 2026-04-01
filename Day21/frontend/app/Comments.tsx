'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Comment, Notification as NotificationType } from '@/lib/types';
import { useSocket } from '@/lib/useSocket';
import { useAuth } from '@/lib/authContext';
import Notification from './Notification';
import axios from 'axios';
import { Heart, MessageCircle, Send, LogOut, User as UserIcon, Bell, Pencil, Trash2, X, Check, Search, Filter, Share2, Image as ImageIcon } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getBadge = (points = 0) => {
  if (points >= 100) return { label: 'Legend', color: 'bg-yellow-400 text-yellow-900 shadow-yellow-400/50 ring-1 ring-yellow-300', icon: '👑' };
  if (points >= 50) return { label: 'Pro', color: 'bg-purple-400 text-purple-900 shadow-purple-400/50 ring-1 ring-purple-300', icon: '✨' };
  if (points >= 20) return { label: 'Rising', color: 'bg-blue-400 text-blue-900 shadow-blue-400/50 ring-1 ring-blue-300', icon: '🚀' };
  return { label: 'Newbie', color: 'bg-gray-200 text-gray-600 shadow-gray-200/50 ring-1 ring-gray-300', icon: '🌱' };
};

export default function Comments() {
  const { user, token, logout } = useAuth();
  const { isConnected, emit, on, off } = useSocket();
  const [content, setContent] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<{userId: string, username: string}[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('latest');
  const [serverNotifications, setServerNotifications] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState<number>(user?.points || 0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert('File is too large! Maximum allowed is 2MB.');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServerNotifications(response.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const fetchComments = async () => {
    try {
      // ✅ Anti-cache: Adding timestamp query parameter
      const response = await axios.get(`${API_URL}/comments/main-post-id?t=${Date.now()}`);
      setComments(response.data);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  // ✅ FIX: Initial data fetch - sirf ek baar
  useEffect(() => {
    fetchComments();
    if (user) {
      fetchNotifications();
      axios.get(`${API_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUserPoints(res.data.points || 0))
        .catch(console.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ✅ FIX: Socket listeners - isConnected par depend karo
  // Jab bhi socket connect/disconnect ho, listeners fresh attach hon
  useEffect(() => {
    if (!isConnected) return; 

    const handleNotification = (notif: any) => {
      console.log('📨 [Socket] Real-time notification received:', notif);
      if (notif.type === 'comment' || notif.type === 'reply') {
        fetchComments();
      }
      addInternalNotification(notif);
      fetchNotifications();
    };

    const handleOnlineUsers = (users: {userId: string, username: string}[]) => {
      console.log('👥 [Socket] Online users update:', users.length);
      setOnlineUsers(users);
    };

    const handleUserTyping = (data: {username: string}) => {
      setTypingUsers(prev => {
        if (!prev.includes(data.username)) return [...prev, data.username];
        return prev;
      });
    };

    const handleUserStoppedTyping = (data: {username: string}) => {
      setTypingUsers(prev => prev.filter(u => u !== data.username));
    };

    const handleCommentEdited = () => fetchComments();
    const handleCommentDeleted = () => fetchComments();
    
    const handleCommentPosted = (data: any) => {
      console.log('🚀 [Socket] NEW COMMENT DETECTED - Refreshing feed now...', data);
      fetchComments();
    };

    on('notification', handleNotification);
    on('online_users', handleOnlineUsers);
    on('user_typing', handleUserTyping);
    on('user_stopped_typing', handleUserStoppedTyping);
    on('comment_edited', handleCommentEdited);
    on('comment_deleted', handleCommentDeleted);
    on('new_comment_posted', handleCommentPosted);

    return () => {
      off('notification', handleNotification);
      off('online_users', handleOnlineUsers);
      off('user_typing', handleUserTyping);
      off('user_stopped_typing', handleUserStoppedTyping);
      off('comment_edited', handleCommentEdited);
      off('comment_deleted', handleCommentDeleted);
      off('new_comment_posted', handleCommentPosted);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]); // listeners trigger on connect/disconnect state change

  const addInternalNotification = (notif: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, ...notif }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsLoading(true);
    try {
      const endpoint = replyTo ? `/comments/${replyTo}/reply` : '/comments';
      const payload: any = { content, postId: 'main-post-id' };
      if (imagePreview) payload.imageUrl = imagePreview;

      const response = await axios.post(
        `${API_URL}${endpoint}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (replyTo) {
        // Emit Socket event for reply
        const parentComment = comments.find(c => c.id === replyTo);
        if (parentComment) {
          emit('new_reply', {
            recipientId: parentComment.author.id,
            senderName: user.username,
            commentId: replyTo
          });
        }
      } else {
        // Emit Socket event for new comment
        emit('new_comment', {
          senderName: user.username,
          content: content
        });
      }

      setContent('');
      fetchComments();
      if (user) {
         emit('stop_typing', { username: user.username });
      }
      
      // setTimeout(() => {
      //   scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      // }, 100);
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (!user) return;
    
    emit('typing', { username: user.username });
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      emit('stop_typing', { username: user.username });
    }, 2000);
  };

  const handleLike = async (commentId: string, authorId: string) => {
    if (!user) return;
    try {
      await axios.post(
        `${API_URL}/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (authorId !== user.id) {
        emit('new_like', {
          recipientId: authorId,
          senderName: user.username,
          commentId
        });
      }
      
      fetchComments();
    } catch (err) {
      console.error('Failed to like comment', err);
    }
  };

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_URL}/user/profile`,
        profileForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local user data
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // In a real app, I'd use a state management or re-fetch
      window.location.reload(); 
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  const handleFollow = async (targetId: string, targetUsername: string) => {
    if (!user || targetId === user.id) return;
    try {
      const response = await axios.post(
        `${API_URL}/user/${targetId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.following) {
        emit('new_follow', {
          recipientId: targetId,
          senderName: user.username
        });
      }
      
      addInternalNotification({
        type: 'follow',
        message: response.data.following ? `You followed ${targetUsername}` : `You unfollowed ${targetUsername}`
      });
    } catch (err) {
      console.error('Failed to follow user', err);
    }
  };

  const CommentItem = ({ comment, isReply = false, index = 0 }: { comment: Comment; isReply?: boolean; index?: number }) => {
    const [replies, setReplies] = useState<Comment[]>([]);
    const [showReplies, setShowReplies] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Safety check for mongo _id vs id
    const safeCommentId = (comment as any)._id || comment.id;
    const safeAuthorId = (comment.author as any)._id || comment.author.id;

    // NEW FEATURES: Reply & Like States
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isLiked, setIsLiked] = useState<boolean>(comment.likes.includes(user?.id || ''));
    const [likesCount, setLikesCount] = useState<number>(comment.likes.length);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
      setIsLiked(comment.likes.includes(user?.id || ''));
      setLikesCount(comment.likes.length);
    }, [comment.likes, user?.id]);

    const handleLikeClick = async () => {
      if (!user || isLiking) return;
      
      // Optimistic update + Pop animation
      setIsLiking(true);
      const wasLiked = isLiked;
      setIsLiked(!wasLiked);
      setLikesCount(prev => Math.max(0, wasLiked ? prev - 1 : prev + 1));
      setTimeout(() => setIsLiking(false), 300);

      try {
        await axios.post(
          `${API_URL}/comments/${safeCommentId}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!wasLiked && safeAuthorId !== user.id) {
          emit('new_like', {
            recipientId: safeAuthorId,
            senderName: user.username,
            commentId: safeCommentId
          });
        }
        // Background fetch to sync
        fetchComments();
      } catch(err) {
        setIsLiked(wasLiked);
        setLikesCount(prev => Math.max(0, wasLiked ? prev + 1 : prev - 1));
      }
    };

    const handleInlineReply = async () => {
      if (!replyContent.trim() || !user) return;
      try {
        await axios.post(
          `${API_URL}/comments/${safeCommentId}/reply`,
          { content: replyContent, postId: 'main-post-id' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReplyContent('');
        setIsReplying(false);
        setShowReplies(true);
        emit('new_reply', {
          recipientId: safeAuthorId,
          senderName: user.username,
          commentId: safeCommentId
        });
        fetchComments();
        // optionally fetchReplies() is triggered by showReplies effect
      } catch (err) {
        console.error('Failed to reply', err);
      }
    };

    const fetchReplies = async () => {
      try {
        const response = await axios.get(`${API_URL}/comments/${safeCommentId}/replies`);
        setReplies(response.data);
      } catch (err) {
        console.error('Failed to fetch replies', err);
      }
    };

    const handleEditSave = async () => {
      if (!editContent.trim() || editContent === comment.content) {
         setIsEditing(false);
         return;
      }
      try {
        await axios.put(`${API_URL}/comments/${safeCommentId}`, { content: editContent }, { headers: { Authorization: `Bearer ${token}` } });
        setIsEditing(false);
        comment.content = editContent; // local optimistic update
        
        emit('edit_comment', { commentId: safeCommentId, content: editContent });
        fetchComments();
      } catch(err) { console.error('Error editing', err); }
    };
    
    const handleDelete = async () => {
      if(!window.confirm('Are you sure you want to delete this comment?')) return;
      setIsDeleting(true);
      try {
         await axios.delete(`${API_URL}/comments/${safeCommentId}`, { headers: { Authorization: `Bearer ${token}` } });
         emit('delete_comment', { commentId: safeCommentId });
         fetchComments();
      } catch(err) { 
        console.error('Error deleting', err); 
        setIsDeleting(false); 
      }
    };

    const handleShare = () => {
       const url = `${window.location.origin}${window.location.pathname}#comment-${comment.id}`;
       navigator.clipboard.writeText(url);
       // Re-use internal notification
       const notifId = Math.random().toString();
       setNotifications(prev => [...prev, { id: notifId, message: 'Link copied to clipboard!', type: 'system' }]);
       setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== notifId)), 3000);
    };

    useEffect(() => {
      if (showReplies) fetchReplies();
    }, [showReplies]);

    return (
      <div id={`comment-${safeCommentId}`} style={{ animationFillMode: 'both', animationDelay: `${(index % 15) * 0.1}s` }} className={`animate-spring glass p-3 sm:p-5 rounded-[20px] sm:rounded-[32px] flex flex-col gap-2 sm:gap-3 w-full overflow-hidden ${isReply ? 'ml-2 sm:ml-12 mt-2 shadow-sm border-l-2 sm:border-l-4 border-l-primary/30' : 'hover:-translate-y-1 hover:shadow-2xl'} transition-all duration-700`}>
        <div className="flex items-center justify-between px-1 sm:px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 glass flex items-center justify-center overflow-hidden border border-whiteShadow ring-2 ring-white">
               {comment.author.profilePicture ? <img src={comment.author.profilePicture} alt="" className="w-full h-full object-cover" /> : <span className="font-bold text-primary">{comment.author.username.charAt(0)}</span>}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-foreground/80">{comment.author.username}</span>
                {comment.author.points !== undefined && (
                  <span className={`text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 leading-none ${getBadge(comment.author.points).color}`}>
                    {getBadge(comment.author.points).icon} {getBadge(comment.author.points).label}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium opacity-30 tracking-widest">{formatDate(comment.createdAt)}</span>
            </div>
          </div>
          {user && safeAuthorId === user.id ? (
            <div className="flex gap-2">
              <button onClick={() => {setIsEditing(!isEditing); setEditContent(comment.content);}} className="p-1.5 rounded-full hover:bg-black/5 transition-colors opacity-40 hover:opacity-100">
                 {isEditing ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
              </button>
              <button disabled={isDeleting} onClick={handleDelete} className="p-1.5 rounded-full hover:bg-red-50 text-red-500 transition-colors opacity-40 hover:opacity-100">
                 <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            user && (
              <button 
                onClick={() => handleFollow(safeAuthorId, comment.author.username)}
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all border border-primary/10"
              >
                Follow
              </button>
            )
          )}
        </div>
        <div className={`glass rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 shadow-sm border border-white/40 ring-1 ring-primary/5 transition-all group-hover:scale-[1.01] ${isReply ? 'bg-white/40' : 'bg-white/60'} ${isDeleting ? 'opacity-50 scale-95' : ''}`}>
          {isEditing ? (
             <div className="flex flex-col gap-3">
               <textarea
                 value={editContent}
                 onChange={(e) => setEditContent(e.target.value)}
                 className="w-full bg-white/50 border border-primary/20 rounded-2xl px-4 py-3 text-sm focus:ring-[4px] focus:ring-primary/10 transition-all outline-none resize-none font-medium text-foreground"
                 rows={3}
                 autoFocus
               />
               <div className="flex justify-end">
                 <button onClick={handleEditSave} className="flex items-center gap-1.5 text-xs font-bold bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-all shadow-md">
                    <Check className="w-3.5 h-3.5" /> Save Changes
                 </button>
               </div>
             </div>
          ) : (
            <div className="flex flex-col">
             <p className="text-foreground/90 text-base sm:text-lg leading-relaxed font-medium whitespace-pre-wrap">
               {comment.content}
             </p>
             {comment.imageUrl && (
                 <img src={comment.imageUrl} alt="attachment" className="mt-4 rounded-3xl max-h-96 object-cover w-full border border-primary/10 shadow-sm transition-all hover:scale-[1.01]" />
             )}
            </div>
          )}
          <div className="mt-4 flex items-center gap-4 pt-4 border-t border-primary/5">
             <button 
              onClick={handleLikeClick}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all px-3 py-1.5 rounded-full duration-300 ${isLiked ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/40 hover:bg-white/60 opacity-60'} ${isLiking ? 'scale-125' : (isLiked ? 'scale-110' : 'scale-100')}`}
             >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount}
             </button>
             <button 
              onClick={() => setIsReplying(!isReplying)}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all px-3 py-1.5 rounded-full ${isReplying ? 'bg-white/60 opacity-100' : 'hover:bg-white/40 opacity-40 hover:opacity-100'}`}
             >
              <MessageCircle className="w-3.5 h-3.5" />
              Reply
             </button>
             <button 
              onClick={handleShare}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold opacity-40 hover:opacity-100 transition-all px-3 py-1.5 rounded-full hover:bg-white/40"
             >
              <Share2 className="w-3.5 h-3.5" />
              Share
             </button>
             <button 
              onClick={() => setShowReplies(!showReplies)}
              className="ml-auto text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-all"
             >
              {showReplies ? 'Hide' : 'Show'} Replies
             </button>
          </div>
          {isReplying && (
             <div className="mt-4 pt-4 border-t border-primary/10 animate-spring">
               <div className="flex flex-col gap-2">
                 <textarea
                   value={replyContent}
                   onChange={(e) => setReplyContent(e.target.value)}
                   className="w-full bg-white/50 border border-primary/20 rounded-[18px] sm:rounded-2xl px-4 py-3 text-sm focus:ring-[4px] focus:ring-primary/10 transition-all outline-none resize-none font-medium text-foreground"
                   rows={2}
                   placeholder={`Reply to @${comment.author.username}...`}
                   autoFocus
                 />
                 <div className="flex justify-end gap-2">
                   <button onClick={() => setIsReplying(false)} className="px-3 py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">Cancel</button>
                   <button onClick={handleInlineReply} className="px-4 py-1.5 text-xs font-bold bg-primary text-white rounded-[10px] hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center gap-1">
                      <Send className="w-3 h-3" /> Reply
                   </button>
                 </div>
               </div>
             </div>
          )}
        </div>
        {showReplies && (
          <div className="flex flex-col gap-2 mt-4">
            {replies.map((reply, i) => (
              <div key={reply.id} className="relative before:absolute before:w-4 before:h-2 before:border-b-2 before:border-l-2 before:border-primary/20 before:-left-[2px] before:-top-4 before:rounded-bl-xl">
                  <CommentItem comment={reply} isReply index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFilteredComments = () => {
    let result = [...comments];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.content.toLowerCase().includes(query) || 
        c.author.username.toLowerCase().includes(query)
      );
    }

    if (filterOption === 'latest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filterOption === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filterOption === 'most_liked') {
      result.sort((a, b) => b.likes.length - a.likes.length);
    }

    return result;
  };

  const displayedComments = getFilteredComments();

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-6 sm:py-12 px-3 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_60%)] bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-primary)_0%,_transparent_60%)] animate-float">
      {/* Notifications */}
      <div className="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 w-full max-w-sm px-4">
        {notifications.map((n) => (
          <Notification key={n.id} message={n.message} type={n.type} />
        ))}
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-8">
        {/* Modern Header */}
        <header className="flex flex-col items-center justify-center gap-1 sm:gap-2 animate-spring relative pt-8 sm:pt-0">
          <button 
            onClick={logout}
            className="absolute right-0 top-0 p-3 bg-white/20 glass rounded-2xl hover:bg-red-50 transition-colors group"
            title="Logout"
          >
            <LogOut className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:text-red-500 transition-all" />
          </button>
          
          <div className="absolute left-0 top-0 hidden sm:flex flex-col gap-2">
             <div className="flex items-center -space-x-3">
               {onlineUsers.slice(0, 5).map(ou => (
                  <div key={ou.userId} className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center text-xs font-bold text-foreground border-[3px] border-white relative group shadow-sm hover:-translate-y-1 transition-transform cursor-pointer" title={ou.username}>
                     {ou.username.charAt(0).toUpperCase()}
                     <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm" />
                  </div>
               ))}
               {onlineUsers.length > 5 && (
                  <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center text-xs font-bold z-10 border-[3px] border-white backdrop-blur-md">
                     +{onlineUsers.length - 5}
                  </div>
               )}
             </div>
             {onlineUsers.length > 0 && <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest pl-1">{onlineUsers.length} Online Now</span>}
          </div>

          <div className="p-1 sm:p-3 bg-white/40 glass pink-glow rounded-xl sm:rounded-3xl mb-0.5 sm:mb-4 text-primary">
            <div className={`w-1.5 h-1.5 sm:w-4 sm:h-4 rounded-full ${isConnected ? 'bg-green-400 shadow-[0_0_15px_hsl(var(--primary))] animate-pulse' : 'bg-red-400 opacity-60'}`} />
          </div>
          <h1 className="text-3xl sm:text-7xl font-extrabold tracking-tighter text-foreground drop-shadow-sm leading-none">
            echo
          </h1>
          <div className="flex flex-col items-center gap-4 mt-4">
             <button 
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 sm:gap-4 px-3 sm:px-6 py-1.5 sm:py-3 bg-white/40 glass rounded-full sm:rounded-[32px] border border-whiteShadow hover:scale-[1.02] transition-all cursor-pointer"
             >
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full sm:rounded-2xl bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-white relative">
                  {user?.profilePicture ? <img src={user.profilePicture} alt="" className="w-full h-full object-cover" /> : <UserIcon className="w-4 h-4 sm:w-6 h-6 text-primary" />}
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm sm:text-lg font-bold text-foreground leading-tight">{user?.username}</span>
                    <span className={`text-[7px] sm:text-[9px] font-bold uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 ${getBadge(userPoints).color}`}>
                       {getBadge(userPoints).icon} <span className="hidden sm:inline">{getBadge(userPoints).label}</span> <span className="opacity-70 ml-1 hidden lg:inline">({userPoints} XP)</span>
                     </span>
                  </div>
                  <div className="hidden sm:flex gap-2 sm:gap-3 mt-0.5">
                    <span className="text-[9px] sm:text-[10px] font-bold opacity-40 uppercase tracking-widest">{user?.followers?.length || 0} Followers</span>
                    <span className="text-[9px] sm:text-[10px] font-bold opacity-40 uppercase tracking-widest">{user?.following?.length || 0} Following</span>
                  </div>
                </div>
             </button>
             <p className="text-[8px] font-bold opacity-30 tracking-[0.2em] uppercase mt-1">
               {isConnected ? 'LIVE' : 'OFFLINE'}
            </p>
          </div>
        </header>

        {/* Profile Modal */}
        {isProfileOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/20 backdrop-blur-sm animate-spring">
            <div className="max-w-md w-full glass rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-whiteShadow pink-glow relative">
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="absolute right-6 top-6 opacity-30 hover:opacity-100 transition-all font-bold text-lg"
              >
                ✕
              </button>
              <h3 className="text-3xl font-extrabold tracking-tight mb-8">Edit Profile</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Avatar URL</label>
                  <input
                    type="text"
                    value={profileForm.profilePicture}
                    onChange={(e) => setProfileForm({ ...profileForm, profilePicture: e.target.value })}
                    className="w-full bg-white/30 border border-whiteShadow rounded-2xl px-5 py-4 focus:ring-[12px] focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:opacity-20 font-semibold"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Bio</label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full bg-white/30 border border-whiteShadow rounded-2xl px-5 py-4 focus:ring-[12px] focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:opacity-20 font-medium resize-none"
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary py-4 sm:py-5 rounded-[22px] sm:rounded-[28px] text-white font-extrabold shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.95] transition-all text-sm sm:text-base"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
          {/* Main Feed Section */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 gap-4">
              <h2 className="text-xl font-bold opacity-80 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" /> Global Feed
                <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full ml-2">{comments.length}</span>
              </h2>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                 <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40 text-primary" />
                    <input 
                      type="text" 
                      placeholder="Search echoes..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/40 border border-whiteShadow rounded-full pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:opacity-50 text-foreground"
                    />
                 </div>
                 <div className="relative group">
                    <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                    <select 
                      value={filterOption}
                      onChange={(e) => setFilterOption(e.target.value)}
                      className="bg-white/40 border border-whiteShadow rounded-full pl-9 pr-6 py-2 text-xs font-bold opacity-80 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer hover:bg-white/60 transition-colors"
                    >
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="most_liked">Most Liked</option>
                    </select>
                 </div>
              </div>
            </div>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {displayedComments.length === 0 ? (
                <div className="glass rounded-[40px] p-20 text-center border-dashed border-primary/20 bg-white/10 animate-spring">
                  <p className="text-xl font-semibold opacity-40 italic">{comments.length === 0 ? 'Waiting for an echo...' : 'No echoes found matching your search.'}</p>
                </div>
              ) : (
                <div className="space-y-6 pb-10">
                  {displayedComments.map((comment, i) => (
                    <CommentItem key={comment.id} comment={comment} index={i} />
                  ))}
                  <div ref={scrollRef} />
                </div>
              )}
            </div>
          </section>

          {/* Input Section - Top on mobile for better UX */}
          <aside className="lg:sticky lg:top-12 space-y-4 sm:space-y-6 order-first lg:order-last">
            <div className="glass rounded-[24px] sm:rounded-[40px] p-4 sm:p-8 pink-glow border border-whiteShadow shadow-2xl animate-spring">
              <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-6 px-1 flex items-center gap-2">
                Share Thoughts
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
                <div className="space-y-1 sm:space-y-1.5 px-0 relative">
                  <textarea
                    value={content}
                    onChange={handleInput}
                    placeholder="Enter your stream entry..."
                    rows={2}
                    className="w-full bg-white/30 border border-whiteShadow rounded-xl sm:rounded-3xl px-3 sm:px-5 py-2 sm:py-4 focus:ring-[6px] sm:focus:ring-[12px] focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none placeholder:opacity-20 font-medium text-sm sm:text-base"
                    required
                  />
                  {typingUsers.length > 0 && (
                     <div className="absolute -bottom-6 left-4 text-[10px] font-bold text-primary italic animate-pulse opacity-80 tracking-wide">
                        {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                     </div>
                  )}
                  {imagePreview && (
                    <div className="relative mt-2 p-1 bg-white/40 glass rounded-3xl border border-whiteShadow inline-block animate-spring">
                      <img src={imagePreview} alt="upload preview" className="h-32 rounded-2xl object-cover" />
                      <button type="button" onClick={() => setImagePreview(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-all z-10">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-4!">
                  <label className="flex items-center justify-center p-4 bg-white/40 glass rounded-[28px] cursor-pointer hover:bg-white/60 hover:scale-105 active:scale-95 transition-all shadow-sm border border-whiteShadow text-primary h-full">
                    <ImageIcon className="w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  <button
                    type="submit"
                    disabled={isLoading || (!content.trim() && !imagePreview)}
                    className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:scale-100 text-primary-foreground font-extrabold py-3.5 sm:py-5 rounded-xl sm:rounded-[28px] shadow-2xl shadow-primary/40 transform active:scale-[0.95] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group text-xs sm:text-base uppercase tracking-tight"
                  >
                    {isLoading ? 'Relaying...' : (
                      <>
                        <span className="italic">Echo Entry</span>
                        <Send className="w-3.5 h-3.5 sm:w-5 sm:h-5 opacity-50" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="hidden lg:flex glass rounded-[40px] p-6 pink-glow border border-whiteShadow shadow-2xl animate-spring relative overflow-hidden flex-col h-[400px]">
               <div className="flex items-center justify-between mb-4 px-2">
                 <h3 className="text-lg font-bold flex items-center gap-2 opacity-80">
                   <Bell className={`w-5 h-5 ${serverNotifications.filter(n => !n.read).length > 0 ? 'text-primary animate-ring' : 'text-foreground/40'}`} /> 
                   Activity
                 </h3>
                 {serverNotifications.filter(n => !n.read).length > 0 && (
                   <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-primary/20 animate-pulse">
                     {serverNotifications.filter(n => !n.read).length} New
                   </span>
                 )}
               </div>
               
               <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                 {serverNotifications.length === 0 ? (
                   <div className="text-center opacity-40 italic mt-10">No notifications yet</div>
                 ) : (
                   serverNotifications.map(notif => (
                     <div 
                        key={notif._id} 
                        className={`p-4 rounded-3xl transition-all cursor-pointer hover:scale-[1.02] ${notif.read ? 'bg-white/20 opacity-60 hover:opacity-100' : 'bg-primary/5 border border-primary/20 shadow-sm'}`}
                        onClick={async () => {
                          if (!notif.read) {
                            try {
                              await axios.put(`${API_URL}/notifications/${notif._id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
                              fetchNotifications();
                            } catch(err) { console.error('Error reading notif', err); }
                          }
                        }}
                      >
                       <p className="text-xs font-semibold text-foreground/90 leading-relaxed mb-1">{notif.message}</p>
                       <span className="text-[9px] opacity-40 font-bold uppercase tracking-widest">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                     </div>
                   ))
                 )}
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
