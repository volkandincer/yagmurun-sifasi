import { memo, useCallback } from "react";
import { GameProps } from "../../interfaces/GameProps.interface";
import styles from "../../styles/SpotifyStep.module.css";

// Spotify playlist ID
const SPOTIFY_PLAYLIST_ID = "1dCuwsILd6q5vB9Mb32UNO";
const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`;

const SpotifyStep = memo(({ onComplete }: GameProps) => {
  const handleContinue = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className={styles.spotifyContainer}>
      <div className={styles.messageSection}>
        <h2 className={styles.messageTitle}>
          Bu siteyi yaparken fonda çalan şarkılar bu playlistte. Kodları
          yazarken bana eşlik ettiler, belki iyileşirken sana da eşlik ederler.
          Bonus: Biraz fazla karışık bi liste oldu :) 🎵💙
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
