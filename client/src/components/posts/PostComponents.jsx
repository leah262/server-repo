import { useState } from 'react'
import { useComments } from '../../hooks/useComments'
import Comments from './Comments'

export const PostForm = ({ postForm, setPostForm, onSave, onCancel }) => {
  if (!postForm.show) return null

  return (
    <div className="add-form">
      <h3>{postForm.editing ? 'Edit Post' : 'Add New Post'}</h3>
      <input
        type="text"
        placeholder="Post Title"
        value={postForm.title}
        onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
      />
      <textarea
        placeholder="Post Content"
        value={postForm.body}
        onChange={(e) => setPostForm(prev => ({ ...prev, body: e.target.value }))}
        rows="4"
      />
      <div className="form-buttons">
        <button onClick={onSave} className="save-btn">
          {postForm.editing ? 'Update' : 'Add'}
        </button>
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  )
}

export const PostCard = ({ 
  post, 
  user, 
  getUserInitials, 
  onEdit, 
  onDelete, 
  selectedPost, 
  onSelect
}) => {
  const commentsHook = useComments()
  const isSelected = selectedPost?.id === post.id
  const canEdit = Number(post.user_id) === Number(user?.id)
  const [showComments, setShowComments] = useState(false)

  return (
    <div className={`post-card ${isSelected ? 'selected' : ''}`}>
      <div className="post-header">
        <div className="user-avatar">
          {getUserInitials(post.user_id)}
        </div>
        <span className="post-id">#{post.id}</span>
        {canEdit && (
          <div className="post-actions">
            <button onClick={() => onEdit(post)} className="edit-btn">✏️</button>
            <button onClick={() => onDelete(post.id)} className="delete-btn">🗑️</button>
          </div>
        )}
      </div>
      <h3 className="post-title" onClick={() => onSelect(post)}>{post.title}</h3>
      {isSelected && (
        <div className="post-details">
          <p className="post-body">{post.body}</p>
          <button className="comments-toggle" onClick={() => {
            if (!showComments) {
              commentsHook.fetchComments(post.id)
            }
            setShowComments(!showComments)
          }}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>
          {showComments && (
            <Comments 
              postId={post.id}
              user={user}
              showComments={showComments}
              {...commentsHook}
            />
          )}
        </div>
      )}
    </div>
  )
}

export const PostList = ({ 
  posts, 
  user, 
  getUserInitials, 
  onEdit, 
  onDelete, 
  selectedPost, 
  onSelect
}) => {
  return (
    <div className="posts-grid">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          user={user}
          getUserInitials={getUserInitials}
          onEdit={onEdit}
          onDelete={onDelete}
          selectedPost={selectedPost}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}