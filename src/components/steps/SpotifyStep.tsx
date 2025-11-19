import { memo, useCallback } from "react";
import { GameProps } from "../../interfaces/GameProps.interface";
import styles from "../../styles/SpotifyStep.module.css";

// Spotify playlist ID
const SPOTIFY_PLAYLIST_ID = "1dCuwsILd6q5vB9Mb32UNO";
const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}?si=b4fd2824c0614162&pt=0e79c72f8ee647749eeae09b70c04cfd`;

const SpotifyStep = memo(({ step, onComplete }: GameProps) => {
  // step prop'u kullanılmıyor ama interface'de zorunlu
  void step;

  const handleContinue = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className={styles.spotifyContainer}>
      <div className={styles.messageSection}>
        <h2 className={styles.messageTitle}>
          Bu siteyi yaparken fonda çalan şarkılar bu playlistte. Kodları
          yazarken bana eşlik ettiler, belki iyileşirken sana da eşlik ederler.
          Bonus: İçinde bolca 'iyi hissettiren' şarkı var.
        </h2>
      </div>

      <a
        href={SPOTIFY_PLAYLIST_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.spotifyButton}
      >
        <span className={styles.spotifyIcon}>🎵</span>
        Spotify'da Aç
      </a>

      <button
        className={styles.continueButton}
        onClick={handleContinue}
        type="button"
      >
        Devam Et →
      </button>
    </div>
  );
});

SpotifyStep.displayName = "SpotifyStep";

export default SpotifyStep;
