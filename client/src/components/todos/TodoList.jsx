export const TodoItem = ({ 
  todo, 
  todoForm, 
  setTodoForm, 
  onToggle, 
  onEdit, 
  onSave, 
  onDelete 
}) => {
  const isEditing = todoForm.editing === todo.id

  return (
    <div className="todo-item">
      <div className="todo-info">
        <span className="todo-id">#{todo.id}</span>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, { completed: !todo.completed })}
        />
        {isEditing ? (
          <input
            type="text"
            value={todoForm.title}
            onChange={(e) => setTodoForm(prev => ({ ...prev, title: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && onSave()}
            className="edit-input"
          />
        ) : (
          <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
            {todo.title}
          </span>
        )}
      </div>
      
      <div className="todo-actions">
        {isEditing ? (
          <>
            <button onClick={onSave} className="save-btn">✓</button>
            <button onClick={() => setTodoForm({ title: '', editing: null })} className="cancel-btn">✗</button>
          </>
        ) : (
          <>
            <button onClick={() => onEdit(todo.id, todo.title)} className="edit-btn">✏️</button>
            <button onClick={() => onDelete(todo.id)} className="delete-btn">🗑️</button>
          </>
        )}
      </div>
    </div>
  )
}

// TodoList Component
export const TodoList = ({ 
  todos, 
  todoForm, 
  setTodoForm, 
  onToggle, 
  onEdit, 
  onSave, 
  onDelete 
}) => {
  return (
    <div className="todos-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          todoForm={todoForm}
          setTodoForm={setTodoForm}
          onToggle={onToggle}
          onEdit={onEdit}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}