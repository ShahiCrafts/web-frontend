import React, { useState } from 'react';
import { MessageSquare, ChevronUp } from 'lucide-react';
import { CommentItem } from './CommentItem';

export const CommentThread = ({
  comment,
  allComments,
  repliesByParentId,
  hiddenCommentIds = [],
  onHideComment,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Skip rendering if this comment is hidden (e.g. deleted & expired)
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
              {...props}
            />
          ))}

          {totalReplies > 1 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={16} />
                  Hide replies
                </>
              ) : (
                <>
                  <MessageSquare size={16} />
                  Show more replies
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
