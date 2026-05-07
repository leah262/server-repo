import SearchBar from '../SearchBar'
import SortSelect from '../SortSelect'

// TodoForm Component
export const TodoForm = ({ todoForm, setTodoForm, onAdd }) => {
  const handleAdd = () => {
    if (todoForm.title.trim()) {
      onAdd()
    }
  }

  return (
    <div className="add-todo">
      <input
        type="text"
        placeholder="Add new todo..."
        value={todoForm.title}
        onChange={(e) => setTodoForm(prev => ({ ...prev, title: e.target.value }))}
        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  )
}

// TodoControls Component
export const TodoControls = ({ search, setSearch, sortBy, setSortBy }) => {
  const searchOptions = [
    { value: 'id', label: 'ID' },
    { value: 'title', label: 'Title' },
    { value: 'completed', label: 'Status' }
  ]

  const sortOptions = [
    { value: 'id', label: '📋 ID (Number)' },
    { value: 'title', label: '📝 Title (A-Z)' },
    { value: 'completed', label: '✅ Status (Completed First)' }
  ]

  return (
    <div className="controls-section">
      <SortSelect 
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOptions={sortOptions}
      />

      <div className="search-section">
        <label>🔍 Search</label>
        <SearchBar 
          search={search}
          setSearch={setSearch}
          searchOptions={searchOptions}
          placeholder={search.by === 'completed' ? 'true/false' : 'Search todos...'}
        />
      </div>
    </div>
  )
}