import { memo, useState, useCallback } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/MeetingStep.module.css';

const ACTIVITY_SUGGESTIONS = [
  {
    id: 1,
    title: 'Sinema 🎬',
    description: 'Koku/tat olmadan da keyifli bir film izleyebiliriz',
    icon: '🎬',
  },
  {
    id: 2,
    title: 'Yürüyüş 🚶',
    description: 'Açık havada hafif bir yürüyüş yapabiliriz',
    icon: '🚶',
  },
  {
    id: 3,
    title: 'Müze/Galeri 🖼️',
    description: 'Sessiz ve huzurlu bir ortamda vakit geçirebiliriz',
    icon: '🖼️',
  },
  {
    id: 4,
    title: 'Kahve & Sohbet ☕',
    description: 'Sadece sohbet edip vakit geçirebiliriz',
    icon: '☕',
  },
];

const MeetingStep = memo(({ onComplete }: GameProps) => {
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const handleActivitySelect = useCallback(
    (activityId: number) => {
      setSelectedActivity(activityId);
      setShowMessage(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    },
    [onComplete]
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.introText}>
          Buluşamadığımız bu günlerde, birlikte plan yapalım. İyileştiğinde
          yapabileceğimiz aktiviteleri seçelim 💙
        </p>

        <div className={styles.activitiesGrid}>
          {ACTIVITY_SUGGESTIONS.map((activity) => (
            <button
              key={activity.id}
              className={`${styles.activityCard} ${
                selectedActivity === activity.id ? styles.selected : ''
              }`}
              onClick={() => handleActivitySelect(activity.id)}
              type="button"
              disabled={selectedActivity !== null}
            >
              <div className={styles.activityIcon}>{activity.icon}</div>
              <h3 className={styles.activityTitle}>{activity.title}</h3>
              <p className={styles.activityDescription}>
                {activity.description}
              </p>
            </button>
          ))}
        </div>

        {showMessage && selectedActivity && (
          <div className={styles.messageBox}>
            <p className={styles.messageText}>
              Harika seçim! İyileştiğinde birlikte yapalım 💙
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

MeetingStep.displayName = 'MeetingStep';

export default MeetingStep;

