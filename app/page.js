'use client'

import { useState, useEffect, useMemo } from 'react';
import Card from '../components/card/Card'
import SearchBar from '../components/SearchBar/SearchBar'
import SortControls from '../components/SortControls/SortControls'
import Pagination from '../components/Pagination/Pagination'
import Modal from '../components/Modal/Modal'
import SkeletonCard from '../components/SkeletonCard/SkeletonCard'
import { useDebounce } from '../hooks/useDebounce'
import styles from './page.module.scss';

async function fetchAcceptedPapers() {
  try {
    const res = await fetch('https://easydash.enago.com/acceptedpapers', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching accepted papers:', error)
    throw error;
  }
}

export default function Home() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('title');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 12;

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    async function loadPapers() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAcceptedPapers();
        setPapers(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load papers');
      } finally {
        setLoading(false);
      }
    }

    loadPapers();
  }, []);

  const filteredAndSortedPapers = useMemo(() => {
    // Filter papers using debounced search term
    let result = papers;

    if (debouncedSearchTerm) {
      result = papers.filter(paper => {
        const term = debouncedSearchTerm.toLowerCase();

        switch (searchCategory) {
          case 'title':
            return paper.papertitle?.toLowerCase().includes(term);
          case 'author':
            return paper.coauthors?.toLowerCase().includes(term);
          case 'journal':
            return paper.journal?.title?.toLowerCase().includes(term);
          default:
            return true;
        }
      });
    }

    // Sort papers
    const sorted = [...result].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.papertitle?.toLowerCase() || '';
          bValue = b.papertitle?.toLowerCase() || '';
          break;
        case 'year':
          aValue = a.journaldetails?.match(/\d{4}/) ?
            parseInt(a.journaldetails.match(/\d{4}/)[0]) :
            (a.published_at ? new Date(a.published_at).getFullYear() : 0);
          bValue = b.journaldetails?.match(/\d{4}/) ?
            parseInt(b.journaldetails.match(/\d{4}/)[0]) :
            (b.published_at ? new Date(b.published_at).getFullYear() : 0);
          break;
        case 'impact':
          aValue = a.journal?.impactfactor || 0;
          bValue = b.journal?.impactfactor || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [papers, debouncedSearchTerm, searchCategory, sortBy, sortOrder]);

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Paginate papers
  const paginatedPapers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedPapers.slice(startIndex, endIndex);
  }, [filteredAndSortedPapers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedPapers.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, searchCategory]);

  const handleViewDetails = (paper) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPaper(null);
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.skeletonSearch}></div>
        <div className={styles.skeletonSort}></div>
        <div className={styles.cardList}>
          {[...Array(12)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <main className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <p>Please try again later.</p>
        </div>
      </main>
    );
  }

  if (papers.length === 0) {
    return (
      <main className={styles.container}>
        <p>No papers found.</p>
      </main>
    );
  }

  return (
    <div className={styles.wrapper}>
      <SearchBar
        searchTerm={searchTerm}
        searchCategory={searchCategory}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSearchCategory}
      />
      <SortControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      <div className={styles.cardList}>
        {paginatedPapers.length > 0 ? (
          paginatedPapers.map(paper => (
            <Card key={paper.id} paper={paper} onViewDetails={handleViewDetails} />
          ))
        ) : (
          <p className={styles.noResults}>No papers match your search criteria.</p>
        )}
      </div>
      {filteredAndSortedPapers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredAndSortedPapers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        paper={selectedPaper}
      />
    </div>
  );
}
