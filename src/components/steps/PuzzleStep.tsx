import { useState, useCallback, useMemo, memo } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import { SARCASTIC_MESSAGES } from '../../interfaces/SarcasticMessage.interface';
import styles from '../../styles/PuzzleStep.module.css';

interface ImageTile {
  id: number;
  imageUrl: string;
  matched: boolean;
  flipped: boolean;
  isBonus?: boolean;
}

// 3x3 grid için 4 çift (8 kart) + 1 bonus kart = 9 kart
const CAR_IMAGES = [
  'https://www.shutterstock.com/image-photo/seattle-washington-usa-march-31-600nw-2283283721.jpg',
  'https://www.shutterstock.com/image-photo/kharkiv-ukraine-july-2021-bmw-600nw-2028637640.jpg',
  'https://cdn.motor1.com/images/mgl/m6Pjq/s1/4x3/2019-bmw-3-series.webp',
  'https://cdn.motor1.com/images/mgl/Lwbwj/s1/1x1/bmw-3-series-special-edition.webp'
];

const BONUS_IMAGE = '🎵'; // Bonus kart için emoji
const YOUTUBE_VIDEO_ID = 'NF09k1LU1wA'; // Barış Manço - Nane Limon Kabuğu
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
  const [sarcasticMessage, setSarcasticMessage] = useState<string>('');
  const [showYouTube, setShowYouTube] = useState<boolean>(false);

  const handleTileClick = useCallback(
    (tileId: number) => {
      const tile = tiles[tileId];
      
      // Bonus karta tıklandıysa ve tüm eşleşmeler tamamlandıysa
      if (tile.isBonus) {
        if (matches === CAR_IMAGES.length && !tile.flipped) {
          setTiles((prev) =>
            prev.map((t) => (t.id === tileId ? { ...t, flipped: true } : t))
          );
          // YouTube iframe'ini göster
          setShowYouTube(true);
          return;
        } else if (matches < CAR_IMAGES.length) {
          setSarcasticMessage('Önce tüm eşleşmeleri tamamla! 🎯');
          setTimeout(() => {
            setSarcasticMessage('');
          }, 1500);
          return;
        }
      }

      if (tile.matched || tile.flipped || selectedTiles.length >= 2 || tile.isBonus) {
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

        if (firstTile.imageUrl === secondTile.imageUrl && !firstTile.isBonus && !secondTile.isBonus) {
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
              // Son eşleşme - özel mesaj göster
              setSarcasticMessage('Biraz daha iyisin bence :D Şimdi son karta tıkla! 🎵');
            }
            return newMatches;
          });
          setSelectedTiles([]);
          // Son eşleşme değilse mesajı temizle
          if (matches + 1 < CAR_IMAGES.length) {
            setSarcasticMessage('');
          }
        } else {
          // Yanlış eşleşme - alaycı mesaj göster
          const newWrongAttempts = wrongAttempts + 1;
          setWrongAttempts(newWrongAttempts);
          
          const randomMessage = SARCASTIC_MESSAGES[
            Math.floor(Math.random() * SARCASTIC_MESSAGES.length)
          ];
          setSarcasticMessage(randomMessage);
          
          setTimeout(() => {
            setTiles((prev) =>
              prev.map((t) =>
                t.id === firstId || t.id === secondId
                  ? { ...t, flipped: false }
                  : t
              )
            );
            setSelectedTiles([]);
            setTimeout(() => {
              setSarcasticMessage(''); // Mesajı 1.5 saniye sonra temizle
            }, 500);
          }, 1500);
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
      
      {/* Alaycı Mesaj / Başarı Mesajı */}
      {sarcasticMessage && (
        <div 
          className={styles.sarcasticMessage}
          data-success={sarcasticMessage.includes('Biraz daha iyisin') ? 'true' : 'false'}
        >
          {sarcasticMessage}
        </div>
      )}

      <div
        className={styles.puzzleGrid}
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {tiles.map((tile) => (
          <button
            key={tile.id}
            className={`${styles.tile} ${tile.flipped ? styles.flipped : ''} ${
              tile.matched ? styles.matched : ''
            }`}
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
        ))}
      </div>

      {/* YouTube Modal */}
      {showYouTube && (
        <div className={styles.youtubeOverlay} onClick={handleCloseYouTube}>
          <div className={styles.youtubeModal} onClick={(e) => e.stopPropagation()}>
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

    </div>
  );
});

PuzzleStep.displayName = 'PuzzleStep';

export default PuzzleStep;

