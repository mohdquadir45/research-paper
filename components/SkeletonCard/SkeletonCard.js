import styles from './SkeletonCard.module.scss';

const SkeletonCard = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeleton__imageWrap}>
        <div className={styles.skeleton__image}></div>
        <div className={styles.skeleton__impact}></div>
      </div>
      <div className={styles.skeleton__content}>
        <div className={`${styles.skeleton__line} ${styles['skeleton__line--title']}`}></div>
        <div className={styles.skeleton__divider}></div>
        <div className={styles.skeleton__line}></div>
        <div className={styles.skeleton__line}></div>
        <div className={styles.skeleton__line}></div>
        <div className={`${styles.skeleton__line} ${styles['skeleton__line--short']}`}></div>
        <div className={styles.skeleton__button}></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
