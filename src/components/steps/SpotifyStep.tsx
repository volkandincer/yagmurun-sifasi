import { memo, useCallback, useState } from "react";
import { GameProps } from "../../interfaces/GameProps.interface";
import styles from "../../styles/SpotifyStep.module.css";

// Spotify playlist ID
const SPOTIFY_PLAYLIST_ID = "7fqxqFfFub738YVHv50OaY";
const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`;

const SpotifyStep = memo(({ step, onComplete }: GameProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [hasSworn, setHasSworn] = useState<boolean>(false);

  const handleCheckboxChange = useCallback(() => {
    setIsChecked((prev) => {
      const newValue = !prev;
      if (newValue && !hasSworn) {
        // Checkbox işaretlendiğinde popup aç
        setShowPopup(true);
      }
      return newValue;
    });
  }, [hasSworn]);

  const handleSwear = useCallback(() => {
    setHasSworn(true);
    setShowPopup(false);
  }, []);

  const handlePopupClose = useCallback(() => {
    setShowPopup(false);
    // Popup kapatıldığında checkbox'ı kaldır
    setIsChecked(false);
  }, []);

  const handleContinue = useCallback(() => {
    if (isChecked && hasSworn) {
      onComplete();
    }
  }, [onComplete, isChecked, hasSworn]);

  return (
    <div className={styles.spotifyContainer}>
      <div className={styles.messageSection}>
        <p className={styles.messageText}>
          Şimdi kahveni yapıp bu özel playlist'i dinleyerek pinekle. Bu şarkılar
          senin için seçildi, keyfini çıkar! 🎵💙
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
        <div className={styles.checkboxContainer}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>
              Yemin ederim dinleyeceğim ✋
            </span>
          </label>
        </div>
        <button
          className={`${styles.continueButton} ${
            !isChecked || !hasSworn ? styles.continueButtonDisabled : ""
          }`}
          onClick={handleContinue}
          disabled={!isChecked || !hasSworn}
        >
          Dinledim, Devam Edelim →
        </button>
      </div>

      {/* Sözleşme Popup */}
      {showPopup && (
        <div className={styles.popupOverlay} onClick={handlePopupClose}>
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.popupTitle}>Sözleşme</h3>
            <p className={styles.popupText}>
              Bu playlist'i dinleyeceğime söz veriyorum.
            </p>
            <div className={styles.popupButtons}>
              <button className={styles.swearButton} onClick={handleSwear}>
                Yemin Ediyorum ✋
              </button>
              <button
                className={styles.cancelButton}
                onClick={handlePopupClose}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

SpotifyStep.displayName = "SpotifyStep";

export default SpotifyStep;
