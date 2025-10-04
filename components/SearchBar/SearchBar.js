import styles from './SearchBar.module.scss';

const SearchBar = ({ searchTerm, searchCategory, onSearchChange, onCategoryChange }) => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search papers..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchBar__input}
      />
      <select
        value={searchCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={styles.searchBar__select}
      >
        <option value="title">Title</option>
        <option value="author">Author</option>
        <option value="journal">Journal</option>
      </select>
    </div>
  );
};

export default SearchBar;
