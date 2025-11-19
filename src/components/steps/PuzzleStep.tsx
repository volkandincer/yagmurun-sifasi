import { useState, useCallback, memo } from "react";
import { GameProps } from "../../interfaces/GameProps.interface";
import { SARCASTIC_MESSAGES } from "../../interfaces/SarcasticMessage.interface";
import styles from "../../styles/PuzzleStep.module.css";

interface PlaceTile {
  id: number;
  placeName: string;
  matched: boolean;
  flipped: boolean;
}

// Mekanlar: Salepepe, GG Pizza, Paitan, Kaktüsçü (her biri 2'şer adet = 8 kart)
const PLACES = ["Salepepe", "GG Pizza", "Paitan", "Kaktüsçü"];

const PuzzleStep = memo(({ onComplete }: GameProps) => {
  const [tiles, setTiles] = useState<PlaceTile[]>(() => {
    const placePairs = [...PLACES, ...PLACES];
    const shuffled = placePairs.sort(() => Math.random() - 0.5);
    return shuffled.map((placeName, index) => ({
      id: index,
      placeName,
      matched: false,
      flipped: false,
    }));
  });

  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"error" | "success" | "info">(
    "error"
  );

  const handleTileClick = useCallback(
    (tileId: number) => {
      const tile = tiles[tileId];

      if (tile.matched || tile.flipped || selectedTiles.length >= 2) {
        return;
      }

      setTiles((prev) => {
        const updatedTiles = prev.map((t) =>
          t.id === tileId ? { ...t, flipped: true } : t
        );
        const newSelected = [...selectedTiles, tileId];

        if (newSelected.length === 2) {
          const [firstId, secondId] = newSelected;
          const firstTile = updatedTiles.find((t) => t.id === firstId);
          const secondTile = updatedTiles.find((t) => t.id === secondId);

          if (
            firstTile &&
            secondTile &&
            firstTile.placeName === secondTile.placeName
          ) {
            // Doğru eşleşme - state'i güncelle
            setTimeout(() => {
              setTiles((currentTiles) =>
                currentTiles.map((t) =>
                  t.id === firstId || t.id === secondId
                    ? { ...t, matched: true, flipped: true }
                    : t
                )
              );
              setMatches((prev) => {
                const newMatches = prev + 1;
                if (newMatches === PLACES.length) {
                  // Tüm eşleşmeler tamamlandı
                  setToastMessage("Harika! Tüm mekanları eşleştirdin! 🎉");
                  setToastType("success");
                  setTimeout(() => {
                    setToastMessage("");
                    onComplete();
                  }, 2000);
                } else {
                  setToastMessage("Doğru eşleşme! 🎯");
                  setToastType("success");
                  setTimeout(() => {
                    setToastMessage("");
                  }, 2000);
                }
                return newMatches;
              });
              setSelectedTiles([]);
            }, 100);
          } else {
            // Yanlış eşleşme - toast mesaj göster ve kartları karıştır
            const newWrongAttempts = wrongAttempts + 1;
            setWrongAttempts(newWrongAttempts);

            const randomMessage =
              SARCASTIC_MESSAGES[
                Math.floor(Math.random() * SARCASTIC_MESSAGES.length)
              ];
            setToastMessage(randomMessage);
            setToastType("error");

            setTimeout(() => {
              setTiles((currentTiles) => {
                // Önce yanlış seçilen kartları kapat
                const closedTiles = currentTiles.map((t) =>
                  t.id === firstId || t.id === secondId
                    ? { ...t, flipped: false }
                    : t
                );

                // Eşleşmiş kartları ayır
                const matchedTiles = closedTiles.filter((t) => t.matched);
                const unmatchedTiles = closedTiles.filter((t) => !t.matched);

                // Eşleşmemiş kartları karıştır (ID'leri koru, sadece array içindeki sıralamayı değiştir)
                const shuffledUnmatched = [...unmatchedTiles].sort(
                  () => Math.random() - 0.5
                );

                // Eşleşmiş kartları başa, karıştırılmış eşleşmemiş kartları sona ekle
                return [...matchedTiles, ...shuffledUnmatched];
              });
              setSelectedTiles([]);
            }, 1500);

            setTimeout(() => {
              setToastMessage("");
            }, 4000);
          }

          setSelectedTiles(newSelected);
        } else {
          setSelectedTiles(newSelected);
        }

        return updatedTiles;
      });
    },
    [selectedTiles, wrongAttempts, onComplete]
  );

  // 2x4 grid için (8 kart)
  const gridSize = 4;

  return (
    <div className={styles.puzzleContainer}>
      <div className={styles.statsContainer}>
        <div className={styles.matchCounter}>
          Eşleşme: {matches} / {PLACES.length}
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
          <button
            key={tile.id}
            className={`${styles.tile} ${tile.flipped ? styles.flipped : ""} ${
              tile.matched ? styles.matched : ""
            }`}
            onClick={() => handleTileClick(tile.id)}
            disabled={tile.matched || selectedTiles.length >= 2}
          >
            {!tile.flipped && !tile.matched ? (
              <span className={styles.questionMark}>?</span>
            ) : (
              <span className={styles.placeName}>{tile.placeName}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
});

PuzzleStep.displayName = "PuzzleStep";

export default PuzzleStep;
