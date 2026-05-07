import '../styles/SearchBar.css'

export default function SearchBar({ search, setSearch, searchOptions, placeholder = "Search..." }) {
    return (
        <div className="search-container">
            <input
                type="text"
                placeholder={placeholder}
                value={search.term}
                onChange={(e) => setSearch(prev => ({ ...prev, term: e.target.value }))}
                className="search-input"
            />
            <select
                value={search.by}
                onChange={(e) => setSearch(prev => ({ ...prev, by: e.target.value }))}
                className="search-select"
            >
                {searchOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}