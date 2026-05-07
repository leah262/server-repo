const Comments = ({ 
  postId, 
  user,
  comments,
  showComments = true,
  newComment,
  setNewComment,
  editingComment,
  setEditingComment,
  fetchComments,
  addComment,
  deleteComment,
  updateComment
}) => {
  return (
    <div className="comments-section">
      <h4>Comments ({comments.length})</h4>
      
      <div className="add-comment">
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="2"
        />
        <button onClick={() => addComment(postId, user)} className="add-comment-btn">
          Add Comment
        </button>
      </div>
      
      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <strong>{comment.name}</strong>
              <span className="comment-email">({comment.username})</span>
              {Number(comment.user_id) === Number(user?.id) && (
                <div className="comment-actions">
                  <button onClick={() => setEditingComment(comment.id)} className="edit-comment-btn">✏️</button>
                  <button onClick={() => deleteComment(comment.id)} className="delete-comment-btn">🗑️</button>
                </div>
              )}
            </div>
            {editingComment === comment.id ? (
              <div className="edit-comment">
                <textarea
                  id={`edit-textarea-${comment.id}`}
                  defaultValue={comment.body}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      updateComment(comment.id, e.target.value)
                    }
                  }}
                  rows="2"
                />
                <div className="edit-buttons">
                  <button 
                    onClick={() => {
                      const textarea = document.getElementById(`edit-textarea-${comment.id}`)
                      updateComment(comment.id, textarea.value)
                    }} 
                    className="save-edit-btn"
                  >
                    Save
                  </button>
                  <button onClick={() => setEditingComment(null)} className="cancel-edit-btn">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="comment-body">{comment.body}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Comments