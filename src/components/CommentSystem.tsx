import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Reply, Flag, Trash2, Edit3, Check, X, User } from 'lucide-react';
import { sanitizeInput, validate, formRateLimiter } from '../utils/security';

interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  isApproved: boolean;
  isReported: boolean;
}

interface CommentSystemProps {
  pageId: string;
  title?: string;
  className?: string;
}

const CommentSystem: React.FC<CommentSystemProps> = ({ 
  pageId, 
  title = "Comments & Stories",
  className = '' 
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: '', email: '', content: '' });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [pageId]);

  const loadComments = () => {
    const savedComments = localStorage.getItem(`comments_${pageId}`);
    if (savedComments) {
      try {
        const parsed = JSON.parse(savedComments);
        setComments(parsed.filter((comment: Comment) => comment.isApproved));
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    }
  };

  const saveComments = (updatedComments: Comment[]) => {
    localStorage.setItem(`comments_${pageId}`, JSON.stringify(updatedComments));
    setComments(updatedComments.filter(comment => comment.isApproved));
  };

  const validateComment = (author: string, email: string, content: string): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validate.required(author)) {
      newErrors.author = 'Name is required';
    } else if (!validate.maxLength(author, 50)) {
      newErrors.author = 'Name must be less than 50 characters';
    }

    if (!validate.required(email)) {
      newErrors.email = 'Email is required';
    } else if (!validate.email(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validate.required(content)) {
      newErrors.content = 'Comment is required';
    } else if (!validate.minLength(content, 5)) {
      newErrors.content = 'Comment must be at least 5 characters';
    } else if (!validate.maxLength(content, 500)) {
      newErrors.content = 'Comment must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitComment = async (parentId?: string) => {
    const { author, email, content } = newComment;
    
    if (!validateComment(author, email, content)) {
      return;
    }

    // Rate limiting
    const clientId = `comment_${email}`;
    if (!formRateLimiter.isAllowed(clientId)) {
      const remainingTime = formRateLimiter.getRemainingTime(clientId);
      setErrors({ submit: `Too many comments. Please try again in ${Math.ceil(remainingTime / 60)} minutes.` });
      return;
    }

    setIsSubmitting(true);

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        author: sanitizeInput.text(author),
        email: sanitizeInput.email(email) || '',
        content: sanitizeInput.html(content),
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: [],
        isApproved: true, // In production, this would be false until moderated
        isReported: false
      };

      const allComments = JSON.parse(localStorage.getItem(`comments_${pageId}`) || '[]');
      
      if (parentId) {
        // Add as reply
        const updateReplies = (comments: Comment[]): Comment[] => {
          return comments.map(c => {
            if (c.id === parentId) {
              return { ...c, replies: [...c.replies, comment] };
            } else if (c.replies.length > 0) {
              return { ...c, replies: updateReplies(c.replies) };
            }
            return c;
          });
        };
        saveComments(updateReplies(allComments));
      } else {
        // Add as new comment
        saveComments([comment, ...allComments]);
      }

      // Reset form
      setNewComment({ author: '', email: '', content: '' });
      setReplyingTo(null);
      setErrors({});

    } catch (error) {
      setErrors({ submit: 'Error posting comment. Please try again.' });
      console.error('Comment submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = (commentId: string) => {
    const allComments = JSON.parse(localStorage.getItem(`comments_${pageId}`) || '[]');
    
    const updateLikes = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        } else if (comment.replies.length > 0) {
          return { ...comment, replies: updateLikes(comment.replies) };
        }
        return comment;
      });
    };

    saveComments(updateLikes(allComments));
  };

  const handleReportComment = (commentId: string) => {
    const allComments = JSON.parse(localStorage.getItem(`comments_${pageId}`) || '[]');
    
    const updateReported = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, isReported: true };
        } else if (comment.replies.length > 0) {
          return { ...comment, replies: updateReported(comment.replies) };
        }
        return comment;
      });
    };

    saveComments(updateReported(allComments));
    alert('Comment has been reported for review. Thank you for helping keep our community safe.');
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const CommentForm = ({ parentId }: { parentId?: string }) => (
    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={newComment.author}
            onChange={(e) => setNewComment(prev => ({ ...prev, author: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
              errors.author ? 'border-red-300' : 'border-orange-300'
            }`}
            maxLength={50}
            disabled={isSubmitting}
          />
          {errors.author && <p className="text-red-600 text-xs mt-1">{errors.author}</p>}
        </div>
        <div>
          <input
            type="email"
            placeholder="Your email (not shown publicly)"
            value={newComment.email}
            onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
              errors.email ? 'border-red-300' : 'border-orange-300'
            }`}
            maxLength={254}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>
      
      <div className="mb-4">
        <textarea
          placeholder={parentId ? "Write your reply..." : "Share your thoughts, adoption story, or ask a question..."}
          value={newComment.content}
          onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none ${
            errors.content ? 'border-red-300' : 'border-orange-300'
          }`}
          rows={4}
          maxLength={500}
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.content ? (
            <p className="text-red-600 text-xs">{errors.content}</p>
          ) : (
            <span></span>
          )}
          <span className="text-xs text-amber-600">{newComment.content.length}/500</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs text-amber-700">
          Comments are moderated and will appear after approval.
        </p>
        <div className="flex space-x-2">
          {parentId && (
            <button
              onClick={() => setReplyingTo(null)}
              className="px-4 py-2 text-amber-700 hover:text-amber-900 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => handleSubmitComment(parentId)}
            disabled={isSubmitting}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400 flex items-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{isSubmitting ? 'Posting...' : (parentId ? 'Reply' : 'Post Comment')}</span>
          </button>
        </div>
      </div>

      {errors.submit && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {errors.submit}
        </div>
      )}
    </div>
  );

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-orange-200 pl-4' : ''}`}>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-100 rounded-full p-2">
              <User className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-amber-900">{comment.author}</h4>
              <p className="text-xs text-amber-600">{formatDate(comment.timestamp)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleLikeComment(comment.id)}
              className="flex items-center space-x-1 text-amber-600 hover:text-red-500 transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span className="text-xs">{comment.likes}</span>
            </button>
            <button
              onClick={() => handleReportComment(comment.id)}
              className="text-amber-500 hover:text-red-500 transition-colors"
              title="Report comment"
            >
              <Flag className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setReplyingTo(comment.id)}
            className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center space-x-1 transition-colors"
          >
            <Reply className="h-4 w-4" />
            <span>Reply</span>
          </button>
        </div>
        
        {replyingTo === comment.id && (
          <div className="mt-4">
            <CommentForm parentId={comment.id} />
          </div>
        )}
      </div>
      
      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-orange-200 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <MessageCircle className="h-6 w-6 text-amber-600" />
        <h3 className="text-2xl font-semibold text-amber-900">{title}</h3>
        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
          {comments.length}
        </span>
      </div>

      <div className="mb-8">
        <CommentForm />
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-amber-300 mx-auto mb-4" />
            <p className="text-amber-600">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSystem;