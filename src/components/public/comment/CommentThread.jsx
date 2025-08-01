import React, { useState } from 'react';
import { MessageSquare, ChevronUp } from 'lucide-react';
import { CommentItem } from './CommentItem';

export const CommentThread = ({
  comment,
  allComments,
  repliesByParentId,
  currentUser, // 👈 1. Accept currentUser as a prop
  hiddenCommentIds = [],
  onHideComment,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Skip rendering if this comment is hidden
  if (hiddenCommentIds.includes(comment._id)) return null;

  const directReplies = repliesByParentId[comment._id] || [];
  const visibleReplies = directReplies.filter(r => !hiddenCommentIds.includes(r._id));

  const totalReplies = visibleReplies.length;
  const lastReply = totalReplies > 0 ? visibleReplies[totalReplies - 1] : null;
  const repliesToShow = isExpanded ? visibleReplies : (lastReply ? [lastReply] : []);

  return (
    <div className="space-y-4">
      <CommentItem
        comment={comment}
        allComments={allComments}
        onHide={onHideComment}
        currentUser={currentUser} // 👈 2. Pass currentUser to CommentItem
        {...props}
      />

      {totalReplies > 0 && (
        <div className="ml-6 pl-6 border-l-2 border-gray-200 space-y-4">
          {repliesToShow.map(reply => (
            <CommentThread
              key={reply._id}
              comment={reply}
              allComments={allComments}
              repliesByParentId={repliesByParentId}
              hiddenCommentIds={hiddenCommentIds}
              onHideComment={onHideComment}
              currentUser={currentUser} // 👈 3. Pass currentUser to nested threads
              {...props}
            />
          ))}

          {totalReplies > 1 && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <MessageSquare size={16} />
              <span>
                Show {totalReplies - 1} more repl{totalReplies - 1 > 1 ? 'ies' : 'y'}
              </span>
            </button>
          )}

          {isExpanded && (
             <button
              onClick={() => setIsExpanded(false)}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <ChevronUp size={16} />
              Hide replies
            </button>
          )}
        </div>
      )}
    </div>
  );
};