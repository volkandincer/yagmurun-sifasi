import { memo, useState, useCallback } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/MoviesStep.module.css';

interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  icon: string;
}

const MOVIE_SUGGESTIONS: Movie[] = [
  {
    id: 1,
    title: 'Romantik Komedi',
    description: 'Hafif ve eğlenceli filmler',
    genre: 'Romantik Komedi',
    icon: '💕',
  },
  {
    id: 2,
    title: 'Dram',
    description: 'Derin ve duygusal hikayeler',
    genre: 'Dram',
    icon: '🎭',
  },
  {
    id: 3,
    title: 'Aksiyon/Macera',
    description: 'Heyecan dolu filmler',
    genre: 'Aksiyon',
    icon: '🎬',
  },
  {
    id: 4,
    title: 'Animasyon',
    description: 'Eğlenceli ve renkli animasyonlar',
    genre: 'Animasyon',
    icon: '🎨',
  },
  {
    id: 5,
    title: 'Belgesel',
    description: 'Bilgilendirici ve ilham verici',
    genre: 'Belgesel',
    icon: '📚',
  },
  {
    id: 6,
    title: 'Korku/Gerilim',
    description: 'Gerilim dolu filmler',
    genre: 'Gerilim',
    icon: '👻',
  },
];

const MoviesStep = memo(({ onComplete }: GameProps) => {
  const [selectedMovies, setSelectedMovies] = useState<number[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const handleMovieToggle = useCallback((movieId: number) => {
    setSelectedMovies((prev) => {
      if (prev.includes(movieId)) {
        return prev.filter((id) => id !== movieId);
      }
      return [...prev, movieId];
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedMovies.length > 0) {
      setHasSubmitted(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [selectedMovies.length, onComplete]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.introText}>
          Birlikte izleyebileceğimiz filmler için öneriler. Hangi türleri
          seviyorsun? Birkaçını seç, birlikte izleyelim 💙
        </p>

        <div className={styles.moviesGrid}>
          {MOVIE_SUGGESTIONS.map((movie) => (
            <button
              key={movie.id}
              className={`${styles.movieCard} ${
                selectedMovies.includes(movie.id) ? styles.selected : ''
              }`}
              onClick={() => handleMovieToggle(movie.id)}
              type="button"
              disabled={hasSubmitted}
            >
              <div className={styles.movieIcon}>{movie.icon}</div>
              <h3 className={styles.movieTitle}>{movie.title}</h3>
              <p className={styles.movieDescription}>{movie.description}</p>
              {selectedMovies.includes(movie.id) && (
                <div className={styles.checkmark}>✓</div>
              )}
            </button>
          ))}
        </div>

        {!hasSubmitted ? (
          <button
            className={`${styles.submitButton} ${
              selectedMovies.length === 0 ? styles.disabled : ''
            }`}
            onClick={handleSubmit}
            disabled={selectedMovies.length === 0}
            type="button"
          >
            {selectedMovies.length > 0
              ? `Seçilen ${selectedMovies.length} türü kaydet 💙`
              : 'En az bir tür seç'}
          </button>
        ) : (
          <div className={styles.successMessage}>
            <p>
              ✅ Film tercihlerin kaydedildi! Birlikte izleyeceğimiz güzel
              filmler olacak 💙
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

MoviesStep.displayName = 'MoviesStep';

export default MoviesStep;

