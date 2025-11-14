import { memo, useCallback } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/SpotifyStep.module.css';

// Spotify playlist ID - kullanıcı playlist linkini buraya ekleyebilir
// Örnek: https://open.spotify.com/playlist/37i9dQZF1DX... -> 37i9dQZF1DX...
const SPOTIFY_PLAYLIST_ID = '37i9dQZF1DXcBWIGoYBM5M'; // Placeholder - gerçek playlist ID ile değiştirilmeli
const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`;

const SpotifyStep = memo(({ step, onComplete }: GameProps) => {
  const handleContinue = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className={styles.spotifyContainer}>
      <div className={styles.messageSection}>
        <h3 className={styles.messageTitle}>☕ Kahveni Yap ve Dinle ☕</h3>
        <p className={styles.messageText}>
          Şimdi kahveni yapıp bu özel playlist'i dinleyerek pinekle. 
          Bu şarkılar senin için seçildi, keyfini çıkar! 🎵💙
        </p>
      </div>

      <div className={styles.spotifyPlayer}>
        <iframe
          className={styles.spotifyIframe}
          src={SPOTIFY_EMBED_URL}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Playlist"
        />
      </div>

      <div className={styles.continueSection}>
        <button className={styles.continueButton} onClick={handleContinue}>
          Dinledim, Devam Edelim →
        </button>
      </div>
    </div>
  );
});

SpotifyStep.displayName = 'SpotifyStep';

export default SpotifyStep;

