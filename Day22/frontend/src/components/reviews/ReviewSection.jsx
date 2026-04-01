import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../context/SocketContext';
import { AuthContext } from '../../context/AuthContext';
import { Star, Heart, MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const NEST_URL = `${import.meta.env.VITE_NEST_URL}/api`;

// ─── Star Rating Input ──────────────────────────────────────────────────────
const StarInput = ({ value, onChange }) => (
  <div className="star-input">
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} type="button" onClick={() => onChange(s)} className="star-btn">
        <Star
          size={22}
          fill={s <= value ? 'var(--color-star)' : 'none'}
          stroke={s <= value ? 'var(--color-star)' : '#9ca3af'}
        />
      </button>
    ))}
  </div>
);

// ─── Individual Review Card ─────────────────────────────────────────────────
const ReviewCard = ({ review, currentUser, isAdmin, onLike, onReply, onFlag, onDelete }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const liked = currentUser && review.likes?.includes(currentUser._id || currentUser.id);
  const repliesCount = review.replies?.length || 0;

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return toast.error('Log in to reply');
    if (!replyBody.trim()) return;
    setSubmitting(true);
    await onReply(review._id, replyBody.trim());
    setReplyBody('');
    setSubmitting(false);
    setShowReplyForm(false);
    setShowReplies(true);
  };

  return (
    <div className="review-card">
      {/* Header */}
      <div className="review-card-header">
        <div className="review-avatar">{review.authorName?.[0]?.toUpperCase()}</div>
        <div className="review-meta">
          <span className="review-author">{review.authorName}</span>
          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={12}
                fill={s <= review.rating ? 'var(--color-star)' : 'none'}
                stroke={s <= review.rating ? 'var(--color-star)' : '#9ca3af'}
              />
            ))}
          </div>
        </div>
        <span className="review-date">
          {new Date(review.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          })}
        </span>
      </div>

      {/* Body */}
      <p className="review-body">{review.body}</p>
      {review.flagged && <span className="review-flagged">⚑ Under review</span>}

      {/* Actions */}
      <div className="review-actions">
        <button
          className={`review-action-btn ${liked ? 'liked' : ''}`}
          onClick={() => currentUser ? onLike(review._id) : toast.error('Log in to like')}
        >
          <Heart size={14} fill={liked ? '#ec4899' : 'none'} />
          <span>{review.likes?.length || 0}</span>
        </button>

        <button
          className="review-action-btn"
          onClick={() => setShowReplyForm((v) => !v)}
        >
          <MessageSquare size={14} />
          <span>Reply</span>
        </button>

        {repliesCount > 0 && (
          <button
            className="review-action-btn"
            onClick={() => setShowReplies((v) => !v)}
          >
            {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}</span>
          </button>
        )}

        {/* Admin Tools */}
        {isAdmin && (
          <>
            <button
              className="review-action-btn review-admin-flag"
              onClick={() => onFlag(review._id)}
              title={review.flagged ? 'Unflag Review' : 'Flag for Moderation'}
            >
              <span>⚑ {review.flagged ? 'Unflag' : 'Flag'}</span>
            </button>
            <button
              className="review-action-btn review-admin-delete"
              onClick={() => {
                if(window.confirm('Delete this review completely?')) onDelete(review._id);
              }}
              title="Delete Review"
            >
              <span>🗑 Delete</span>
            </button>
          </>
        )}
      </div>

      {/* Replies list */}
      {showReplies && repliesCount > 0 && (
        <div className="replies-list">
          {review.replies.map((r, i) => (
            <div key={i} className="reply-item">
              <div className="reply-avatar">{r.authorName?.[0]?.toUpperCase()}</div>
              <div className="reply-content">
                <span className="reply-author">{r.authorName}</span>
                <p className="reply-body">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      {showReplyForm && (
        <form className="reply-form" onSubmit={handleReplySubmit}>
          <input
            className="reply-input"
            placeholder="Write a reply…"
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            autoFocus
          />
          <button className="reply-submit" type="submit" disabled={submitting}>
            <Send size={14} />
          </button>
        </form>
      )}
    </div>
  );
};

// ─── Main ReviewSection ─────────────────────────────────────────────────────
const ReviewSection = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  // ── Fetch reviews ──────────────────────────────────────────────────────────
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${NEST_URL}/reviews/product/${productId}`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  // ── Real-time: prepend new reviews instantly ───────────────────────────────
  useEffect(() => {
    if (!socket) return;
    const handleNewReview = ({ review }) => {
      if (review.productId === productId || review.productId?.toString() === productId) {
        setReviews((prev) => {
          const exists = prev.some((r) => r._id === review._id);
          return exists ? prev : [review, ...prev];
        });
      }
    };
    socket.on('new-review', handleNewReview);
    return () => socket.off('new-review', handleNewReview);
  }, [socket, productId]);

  // ── Real-time: update review when replied ─────────────────────────────────
  useEffect(() => {
    if (!socket) return;
    const handleNewReply = ({ reviewId }) => {
      // Refresh the specific review
      fetch(`${NEST_URL}/reviews/product/${productId}`)
        .then((r) => r.json())
        .then((data) => { if (data.success) setReviews(data.reviews); });
    };
    socket.on('new-reply', handleNewReply);
    return () => socket.off('new-reply', handleNewReply);
  }, [socket, productId]);

  // ── Submit new review ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please log in to leave a review');
    if (!body.trim()) return toast.error('Review text is required');

    setSubmitting(true);
    try {
      const res = await fetch(`${NEST_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          authorId: user._id || user.id,
          authorName: user.name,
          rating,
          body: body.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBody('');
        setRating(5);
        toast.success('Review posted! 🎉');
        // Socket broadcast will add it to list automatically
      } else {
        toast.error('Failed to post review');
      }
    } catch {
      toast.error('Network error');
    }
    setSubmitting(false);
  };

  // ── Like handler ───────────────────────────────────────────────────────────
  const handleLike = async (reviewId) => {
    try {
      const res = await fetch(`${NEST_URL}/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id || user.id }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? data.review : r))
        );
      }
    } catch { toast.error('Network error'); }
  };

  // ── Reply handler ──────────────────────────────────────────────────────────
  const handleReply = async (reviewId, replyBody) => {
    try {
      const res = await fetch(`${NEST_URL}/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: user._id || user.id,
          authorName: user.name,
          body: replyBody,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? data.review : r))
        );
        toast.success('Reply posted!');
      }
    } catch { toast.error('Network error'); }
  };

  // ── Admin: Delete handler ──────────────────────────────────────────────────
  const handleDelete = async (reviewId) => {
    try {
      const res = await fetch(`${NEST_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter(r => r._id !== reviewId));
        toast.success('Review deleted');
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch { toast.error('Network error'); }
  };

  // ── Admin: Flag handler ──────────────────────────────────────────────────
  const handleFlag = async (reviewId) => {
    try {
      const res = await fetch(`${NEST_URL}/reviews/${reviewId}/flag`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.map(r => r._id === reviewId ? data.review : r));
        toast.success(data.review.flagged ? 'Review flagged for moderation' : 'Flag removed');
      } else {
        toast.error(data.message || 'Failed to flag');
      }
    } catch { toast.error('Network error'); }
  };

  // ── Average rating ─────────────────────────────────────────────────────────
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="review-section">
      <div className="review-section-inner">
        {/* Header */}
        <div className="review-section-header">
          <h2 className="review-section-title">Customer Reviews</h2>
          {avgRating && (
            <div className="review-avg">
              <Star size={18} fill="var(--color-star)" stroke="var(--color-star)" />
              <span className="review-avg-score">{avgRating}</span>
              <span className="review-avg-count">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}
        </div>

        {/* Write a review form */}
        <div className="review-form-wrap">
          <h3 className="review-form-title">
            {user ? 'Write a Review' : 'Log in to leave a review'}
          </h3>
          {user && (
            <form className="review-form" onSubmit={handleSubmit}>
              <StarInput value={rating} onChange={setRating} />
              <textarea
                className="review-textarea"
                rows={4}
                placeholder="Share your experience with this tea…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <button className="review-submit-btn" type="submit" disabled={submitting}>
                {submitting ? 'Posting…' : 'Post Review'}
              </button>
            </form>
          )}
        </div>

        {/* Reviews list */}
        {loading ? (
          <div className="review-loading">Loading reviews…</div>
        ) : reviews.length === 0 ? (
          <div className="review-empty">
            <MessageSquare size={32} className="review-empty-icon" />
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((r) => (
              <ReviewCard
                key={r._id}
                review={r}
                currentUser={user}
                isAdmin={isAdmin}
                onLike={handleLike}
                onReply={handleReply}
                onDelete={handleDelete}
                onFlag={handleFlag}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
