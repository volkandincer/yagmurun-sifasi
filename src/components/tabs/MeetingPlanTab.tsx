import { memo } from 'react';
import styles from '../../styles/MeetingPlanTab.module.css';

const MeetingPlanTab = memo(() => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Buluşma Planı 📅</h2>
        <p className={styles.description}>
          Yakında burada buluşma planlarını yapabileceğiz...
        </p>
        <div className={styles.placeholder}>
          <span className={styles.placeholderIcon}>💙</span>
          <p>Yakında eklenecek</p>
        </div>
      </div>
    </div>
  );
});

MeetingPlanTab.displayName = 'MeetingPlanTab';

export default MeetingPlanTab;

