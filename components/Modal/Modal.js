import { X, Download } from 'lucide-react';
import styles from './Modal.module.scss';

const Modal = ({ isOpen, onClose, paper }) => {
  if (!isOpen || !paper) return null;

  const baseUrl = 'https://easydash.enago.com';
  const imgSrc = paper.journal?.journalimage?.url
    ? baseUrl + paper.journal.journalimage.url
    : 'https://easydash.enago.com/uploads/thumbnail_paper3_447eac901e.png';

  const year = paper.journaldetails?.match(/\d{4}/) ?
    paper.journaldetails.match(/\d{4}/)[0] :
    (paper.published_at ? new Date(paper.published_at).getFullYear() : 'N/A');

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.modalHeader}>
          <img src={imgSrc} alt="Journal Cover" className={styles.modalImage} />
          <div>
            <h2 className={styles.modalTitle}>{paper.papertitle}</h2>
            <p className={styles.modalSubtitle}>{paper.journal?.title}</p>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalSection}>
            <h3>Authors</h3>
            <p>{paper.coauthors || 'N/A'}</p>
          </div>

          <div className={styles.modalSection}>
            <h3>Publication Details</h3>
            <p><strong>Year:</strong> {year}</p>
            <p><strong>Publisher:</strong> {paper.publisher?.publishername || 'N/A'}</p>
            <p><strong>Journal:</strong> {paper.journal?.title || 'N/A'}</p>
            <p><strong>DOI/ISSN:</strong> {paper.journal?.issn || 'N/A'}</p>
            <p><strong>Impact Factor:</strong> {paper.journal?.impactfactor || 'N/A'}</p>
            {paper.journalaltimpactfactor && (
              <p><strong>Alt Impact Factor:</strong> {paper.journalaltimpactfactor}</p>
            )}
          </div>

          {paper.journal && (
            <div className={styles.modalSection}>
              <h3>Journal Information</h3>
              {paper.journal.journalreach && <p><strong>Reach:</strong> {paper.journal.journalreach}</p>}
              {paper.journal.mediumofpublication && <p><strong>Medium:</strong> {paper.journal.mediumofpublication}</p>}
              {paper.journal.scicategory && <p><strong>SCI Category:</strong> {paper.journal.scicategory}</p>}
            </div>
          )}

          {paper.articlelink && (
            <div className={styles.modalSection}>
              <h3>Article Link</h3>
              <div className={styles.modalActions}>
                <a
                  href={paper.articlelink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalLink}
                >
                  View Full Article
                </a>
                <a
                  href={paper.articlelink}
                  download
                  className={`${styles.modalLink} ${styles['modalLink--download']}`}
                >
                  <Download size={18} />
                  Download PDF
                </a>
              </div>
            </div>
          )}

          {paper.servicetype && (
            <div className={styles.modalSection}>
              <h3>Service Type</h3>
              <p>{paper.servicetype.servicename}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
