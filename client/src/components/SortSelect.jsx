import React from 'react'
import '../styles/SortSelect.css'

export default function SortSelect({ sortBy, setSortBy, sortOptions, label = "🔄 Sort by" }) {
    return (
        <div className="sort-section">
            <label>{label}</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}