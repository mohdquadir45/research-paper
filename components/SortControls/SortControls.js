import { ArrowUpDown } from 'lucide-react';
import styles from './SortControls.module.scss';

const SortControls = ({ sortBy, sortOrder, onSortChange }) => {
  const handleSort = (field) => {
    if (sortBy === field) {
      
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      
      onSortChange(field, 'asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={styles.sortControls}>
      <span className={styles.sortControls__label}>Sort by:</span>
      <button
        className={`${styles.sortControls__button} ${sortBy === 'title' ? styles['sortControls__button--active'] : ''}`}
        onClick={() => handleSort('title')}
      >
        Title {getSortIcon('title')}
      </button>
      <button
        className={`${styles.sortControls__button} ${sortBy === 'year' ? styles['sortControls__button--active'] : ''}`}
        onClick={() => handleSort('year')}
      >
        Year {getSortIcon('year')}
      </button>
      <button
        className={`${styles.sortControls__button} ${sortBy === 'impact' ? styles['sortControls__button--active'] : ''}`}
        onClick={() => handleSort('impact')}
      >
        Impact Factor {getSortIcon('impact')}
      </button>
    </div>
  );
};

export default SortControls;
