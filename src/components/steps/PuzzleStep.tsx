import { useState, useCallback, memo } from "react";
import { GameProps } from "../../interfaces/GameProps.interface";
import { SARCASTIC_MESSAGES } from "../../interfaces/SarcasticMessage.interface";
import styles from "../../styles/PuzzleStep.module.css";

interface ImageTile {
  id: number;
  imageUrl: string;
  matched: boolean;
  flipped: boolean;
  isBonus?: boolean;
}

// 3x3 grid için 4 çift (8 kart) + 1 bonus kart = 9 kart
const CAR_IMAGES = [
  "https://www.shutterstock.com/image-photo/seattle-washington-usa-march-31-600nw-2283283721.jpg",
  "https://www.shutterstock.com/image-photo/kharkiv-ukraine-july-2021-bmw-600nw-2028637640.jpg",
  "https://cdn.motor1.com/images/mgl/m6Pjq/s1/4x3/2019-bmw-3-series.webp",
  "https://cdn.motor1.com/images/mgl/Lwbwj/s1/1x1/bmw-3-series-special-edition.webp",
];

const BONUS_IMAGE = "🎵"; // Bonus kart için emoji
const YOUTUBE_VIDEO_ID = "NF09k1LU1wA"; // Barış Manço - Nane Limon Kabuğu
const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`;

const PuzzleStep = memo(({ step, onComplete }: GameProps) => {
  const [tiles, setTiles] = useState<ImageTile[]>(() => {
    const imagePairs = [...CAR_IMAGES, ...CAR_IMAGES];
    // Bonus kartı ekle
    const allTiles = [...imagePairs, BONUS_IMAGE];
    const shuffled = allTiles.sort(() => Math.random() - 0.5);
    return shuffled.map((imageUrl, index) => ({
      id: index,
      imageUrl,
      matched: false,
      flipped: false,
      isBonus: imageUrl === BONUS_IMAGE,
    }));
  });

  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"error" | "success" | "info">(
    "error"
  );
  const [showYouTube, setShowYouTube] = useState<boolean>(false);
  const [showNextStepPopup, setShowNextStepPopup] = useState<boolean>(false);
  const [showClickHint, setShowClickHint] = useState<boolean>(false);

  const handleTileClick = useCallback(
    (tileId: number) => {
      const tile = tiles[tileId];

      // Bonus karta tıklandıysa ve tüm eşleşmeler tamamlandıysa
      if (tile.isBonus) {
        if (matches === CAR_IMAGES.length && !tile.flipped) {
          setTiles((prev) =>
            prev.map((t) => (t.id === tileId ? { ...t, flipped: true } : t))
          );
          // Tıklama ipucunu kapat
          setShowClickHint(false);
          // YouTube iframe'ini göster
          setShowYouTube(true);
          return;
        } else if (matches < CAR_IMAGES.length) {
          setToastMessage("Önce tüm eşleşmeleri tamamla! 🎯");
          setToastType("info");
          setTimeout(() => {
            setToastMessage("");
          }, 4000);
          return;
        }
      }

      if (
        tile.matched ||
        tile.flipped ||
        selectedTiles.length >= 2 ||
        tile.isBonus
      ) {
        return;
      }

      setTiles((prev) =>
        prev.map((t) => (t.id === tileId ? { ...t, flipped: true } : t))
      );

      const newSelected = [...selectedTiles, tileId];
      setSelectedTiles(newSelected);

      if (newSelected.length === 2) {
        const [firstId, secondId] = newSelected;
        const firstTile = tiles[firstId];
        const secondTile = tiles[secondId];

        if (
          firstTile.imageUrl === secondTile.imageUrl &&
          !firstTile.isBonus &&
          !secondTile.isBonus
        ) {
          setTiles((prev) =>
            prev.map((t) =>
              t.id === firstId || t.id === secondId
                ? { ...t, matched: true, flipped: true }
                : t
            )
          );
          setMatches((prev) => {
            const newMatches = prev + 1;
            if (newMatches === CAR_IMAGES.length) {
              // Son eşleşme - özel mesaj göster ve tıklama ipucunu göster
              setToastMessage(
                "Biraz daha iyisin bence :D Şimdi son karta tıkla! 🎵"
              );
              setToastType("success");
              setTimeout(() => {
                setToastMessage("");
              }, 4500);
              // Bonus kart için tıklama ipucunu göster
              setShowClickHint(true);
            }
            return newMatches;
          });
          setSelectedTiles([]);
        } else {
          // Yanlış eşleşme - toast mesaj göster
          const newWrongAttempts = wrongAttempts + 1;
          setWrongAttempts(newWrongAttempts);

          const randomMessage =
            SARCASTIC_MESSAGES[
              Math.floor(Math.random() * SARCASTIC_MESSAGES.length)
            ];
          setToastMessage(randomMessage);
          setToastType("error");

          setTimeout(() => {
            setTiles((prev) =>
              prev.map((t) =>
                t.id === firstId || t.id === secondId
                  ? { ...t, flipped: false }
                  : t
              )
            );
            setSelectedTiles([]);
          }, 1500);

          setTimeout(() => {
            setToastMessage("");
          }, 4000);
        }
      }
    },
    [tiles, selectedTiles, wrongAttempts, matches, onComplete]
  );

  // 3x3 grid için sabit boyut
  const gridSize = 3;

  const handleCloseYouTube = useCallback(() => {
    setShowYouTube(false);
    setTimeout(() => {
      setShowNextStepPopup(true);
    }, 300);
  }, []);

  const handleNextStep = useCallback(() => {
    setShowNextStepPopup(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  }, [onComplete]);

  return (
    <div className={styles.puzzleContainer}>
      <p className={styles.puzzleDescription}>{step.content}</p>
      <div className={styles.statsContainer}>
        <div className={styles.matchCounter}>
          Eşleşme: {matches} / {CAR_IMAGES.length}
        </div>
        {wrongAttempts > 0 && (
          <div className={styles.wrongCounter}>
            Yanlış Deneme: {wrongAttempts}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`${styles.toast} ${
            toastType === "error"
              ? styles.toastError
              : toastType === "success"
              ? styles.toastSuccess
              : styles.toastInfo
          }`}
        >
          {toastMessage}
        </div>
      )}

      <div
        className={styles.puzzleGrid}
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {tiles.map((tile) => (
          <div key={tile.id} className={styles.tileWrapper}>
            <button
              className={`${styles.tile} ${
                tile.flipped ? styles.flipped : ""
              } ${tile.matched ? styles.matched : ""}`}
              onClick={() => handleTileClick(tile.id)}
              disabled={
                tile.isBonus
                  ? matches < CAR_IMAGES.length || tile.flipped
                  : tile.matched || selectedTiles.length >= 2
              }
            >
              {!tile.flipped && !tile.matched ? (
                <span className={styles.questionMark}>?</span>
              ) : tile.isBonus && tile.flipped ? (
                <span className={styles.bonusEmoji}>🎵</span>
              ) : (
                <img
                  src={tile.imageUrl}
                  alt="BMW"
                  className={styles.tileImage}
                  loading="lazy"
                />
              )}
            </button>
            {showClickHint &&
              tile.isBonus &&
              !tile.flipped &&
              matches === CAR_IMAGES.length && (
                <div className={styles.clickHint}>
                  <div className={styles.clickHintArrow}>👇</div>
                  <div className={styles.clickHintText}>sürprizzzz!!!!</div>
                </div>
              )}
          </div>
        ))}
      </div>

      {/* YouTube Modal */}
      {showYouTube && (
        <div className={styles.youtubeOverlay} onClick={handleCloseYouTube}>
          <div
            className={styles.youtubeModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={handleCloseYouTube}>
              ✕
            </button>
            <div className={styles.youtubeContainer}>
              <iframe
                className={styles.youtubeIframe}
                src={YOUTUBE_EMBED_URL}
                title="Barış Manço - Nane Limon Kabuğu"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Next Step Popup */}
      {showNextStepPopup && (
        <div className={styles.popupOverlay} onClick={handleNextStep}>
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <p className={styles.popupMessage}>
              Nane Limon içilmeli ki kendini iyi hissedebilesin. 🚀
            </p>
            <button className={styles.popupButton} onClick={handleNextStep}>
              sıkılmadın dimi →
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

PuzzleStep.displayName = "PuzzleStep";

export default PuzzleStep;
