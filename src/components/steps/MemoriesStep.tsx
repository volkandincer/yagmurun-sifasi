import { memo, useState, useCallback } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/MemoriesStep.module.css';

interface Memory {
  id: number;
  title: string;
  description: string;
  emoji: string;
}

const MEMORY_PROMPTS: Memory[] = [
  {
    id: 1,
    title: 'İlk Buluşmamız',
    description: 'İlk buluştuğumuzda neler yaptık?',
    emoji: '💙',
  },
  {
    id: 2,
    title: 'En Komik Anı',
    description: 'Birlikte güldüğümüz en komik anı neydi?',
    emoji: '😂',
  },
  {
    id: 3,
    title: 'En Özel Gün',
    description: 'Birlikte geçirdiğimiz en özel gün hangisiydi?',
    emoji: '✨',
  },
  {
    id: 4,
    title: 'Favori Yerimiz',
    description: 'Birlikte en çok sevdiğimiz yer neresi?',
    emoji: '📍',
  },
];

const MemoriesStep = memo(({ onComplete }: GameProps) => {
  const [selectedMemory, setSelectedMemory] = useState<number | null>(null);
  const [memoryText, setMemoryText] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const handleMemorySelect = useCallback((memoryId: number) => {
    setSelectedMemory(memoryId);
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedMemory && memoryText.trim()) {
      setHasSubmitted(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [selectedMemory, memoryText, onComplete]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.introText}>
          Birlikte geçirdiğimiz güzel anıları hatırlayalım. Bir anı seçip
          paylaşmak ister misin? 💙
        </p>

        <div className={styles.memoriesGrid}>
          {MEMORY_PROMPTS.map((memory) => (
            <button
              key={memory.id}
              className={`${styles.memoryCard} ${
                selectedMemory === memory.id ? styles.selected : ''
              }`}
              onClick={() => handleMemorySelect(memory.id)}
              type="button"
              disabled={hasSubmitted}
            >
              <div className={styles.memoryEmoji}>{memory.emoji}</div>
              <h3 className={styles.memoryTitle}>{memory.title}</h3>
              <p className={styles.memoryDescription}>{memory.description}</p>
            </button>
          ))}
        </div>

        {selectedMemory && !hasSubmitted && (
          <div className={styles.textAreaContainer}>
            <textarea
              className={styles.memoryTextArea}
              placeholder="Bu anıyı paylaşmak istersen yazabilirsin... (Opsiyonel)"
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
              rows={4}
            />
          </div>
        )}

        {!hasSubmitted ? (
          <button
            className={`${styles.submitButton} ${
              !selectedMemory ? styles.disabled : ''
            }`}
            onClick={handleSubmit}
            disabled={!selectedMemory}
            type="button"
          >
            {selectedMemory
              ? memoryText.trim()
                ? 'Anıyı Paylaş 💙'
                : 'Anıyı Seç (Yazmak opsiyonel)'
              : 'Bir anı seç'}
          </button>
        ) : (
          <div className={styles.successMessage}>
            <p>
              ✅ Anı paylaşıldı! Birlikte geçirdiğimiz güzel anılar her zaman
              kalbimizde 💙
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

MemoriesStep.displayName = 'MemoriesStep';

export default MemoriesStep;

