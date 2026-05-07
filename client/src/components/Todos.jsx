import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useTodos } from '../hooks/useTodos'
import useLastPath from '../hooks/useLastPath'
import { TodoForm, TodoControls } from './todos/TodoComponents'
import { TodoList } from './todos/TodoList'
import '../styles/forms.css'
import '../styles/Todos.css'

function Todos() {
  const { userId } = useParams()
  const { user } = useUser()
  
  useLastPath()
  const {
    todos,
    search,
    setSearch,
    sortBy,
    setSortBy,
    todoForm,
    setTodoForm,
    addTodo,
    updateTodo,
    deleteTodo,
    startEdit,
    saveEdit,
    loading
  } = useTodos(userId)

  if (!user) return null

  return (
    <div className="login-page">
      <div className="container form-container todos-container">
        <div className="todos-sticky-header">
          <h2>My Todos {loading && <span style={{fontSize: '14px', color: '#666'}}>⏳ Loading...</span>}</h2>

          <div className="todos-controls">
            <TodoForm
              todoForm={todoForm}
              setTodoForm={setTodoForm}
              onAdd={addTodo}
            />
            <TodoControls
              search={search}
              setSearch={setSearch}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </div>

        <TodoList
          todos={todos}
          todoForm={todoForm}
          setTodoForm={setTodoForm}
          onToggle={updateTodo}
          onEdit={startEdit}
          onSave={saveEdit}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  )
}

export default Todos