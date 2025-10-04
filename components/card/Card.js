
import styles from './Card.module.scss';

const Card = ({ paper, onViewDetails }) => {
  const baseUrl = 'https://easydash.enago.com';
  const imgSrc = paper.journal?.journalimage?.url
    ? baseUrl + paper.journal.journalimage.url
    : 'https://easydash.enago.com/uploads/thumbnail_paper3_447eac901e.png';

  const authors = paper.coauthors || ''
  const firstAuthor = authors.split(',')[0]

  
  const year = paper.journaldetails?.match(/\d{4}/) ?
    paper.journaldetails.match(/\d{4}/)[0] :
    (paper.published_at ? new Date(paper.published_at).getFullYear() : 'N/A');

  
  const doi = paper.journal?.issn || 'N/A';

  
  const pdfLink = paper.articlelink;

  return (
    <div className={styles.card}>
      <div className={styles['card__image-wrap']}>
        <img
          className={styles['card__image']}
          src={imgSrc}
          alt={'Journal Cover'}
        />
        <div className={styles['card__impact']}>
          IF {paper.journal?.impactfactor ?? 'N/A'}
        </div>
      </div>
      <div className={styles['card__content']}>
        <div className={styles['card__title']}>
          <strong>Paper Title:</strong> {paper.papertitle}
        </div>
        <hr className={styles['card__divider']} />
        <div><strong>Author:</strong> {firstAuthor}</div>
        <div><strong>Year:</strong> {year}</div>
        <div>
          <strong>Publisher:</strong> {paper.publisher?.publishername}
        </div>
        <div>
          <strong>Journal:</strong> {paper.journal?.title}
        </div>
        <div><strong>DOI/ISSN:</strong> {doi}</div>
        {pdfLink && (
          <div className={styles['card__link']}>
            <strong>Article Link:</strong>{' '}
            <a
              href={pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['card__link-anchor']}
            >
              View Paper
            </a>
          </div>
        )}
        <button
          className={styles['card__details-btn']}
          onClick={() => onViewDetails(paper)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Card;
