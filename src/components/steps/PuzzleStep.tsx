import { useState, useCallback, memo, useRef } from "react";
import { GameProps } from "../../interfaces/GameProps.interface";
import { SARCASTIC_MESSAGES } from "../../interfaces/SarcasticMessage.interface";
import styles from "../../styles/PuzzleStep.module.css";
import { savePuzzleResult } from "../../lib/supabase";

interface PlaceTile {
  id: number;
  placeName: string;
  matched: boolean;
  flipped: boolean;
}

// Mekanlar: Salepepe, GG Pizza, Paitan, Kaktüsçü (her biri 2'şer adet = 8 kart)
const PLACES = ["Salepepe", "GG Pizza", "Paitan", "Kaktüsçü"];

const PuzzleStep = memo(({ onComplete }: GameProps) => {
  const startTimeRef = useRef<number>(Date.now());

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
      setTiles((prevTiles) => {
        const tile = prevTiles.find((t) => t.id === tileId);
        if (!tile || tile.matched || tile.flipped) {
          return prevTiles;
        }

        return prevTiles.map((t) =>
          t.id === tileId ? { ...t, flipped: true } : t
        );
      });

      setSelectedTiles((prevSelected) => {
        // Eğer zaten 2 kart seçiliyse, yeni seçim yapma
        if (prevSelected.length >= 2) {
          return prevSelected;
        }

        const newSelected = [...prevSelected, tileId];

        // Eğer 2 kart seçildiyse, eşleşme kontrolü yap
        if (newSelected.length === 2) {
          setTimeout(() => {
            setTiles((currentTiles) => {
              const [firstId, secondId] = newSelected;
              const firstTile = currentTiles.find((t) => t.id === firstId);
              const secondTile = currentTiles.find((t) => t.id === secondId);

              if (
                firstTile &&
                secondTile &&
                firstTile.placeName === secondTile.placeName
              ) {
                // Doğru eşleşme
                const updatedTiles = currentTiles.map((t) =>
                  t.id === firstId || t.id === secondId
                    ? { ...t, matched: true, flipped: true }
                    : t
                );

                setMatches((prev) => {
                  const newMatches = prev + 1;
                  if (newMatches === PLACES.length) {
                    // Tüm eşleşmeler tamamlandı - veriyi kaydet
                    const completionTime = Date.now() - startTimeRef.current;
                    savePuzzleResult({
                      matches: newMatches,
                      wrong_attempts: wrongAttempts,
                      completion_time: Math.round(completionTime / 1000),
                    });

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

                return updatedTiles;
              } else {
                // Yanlış eşleşme - toast mesaj göster ve kartları karıştır
                setWrongAttempts((prev) => prev + 1);

                const randomMessage =
                  SARCASTIC_MESSAGES[
                    Math.floor(Math.random() * SARCASTIC_MESSAGES.length)
                  ];
                setToastMessage(randomMessage);
                setToastType("error");

                setTimeout(() => {
                  setTiles((tilesToShuffle) => {
                    // Önce yanlış seçilen kartları kapat
                    const closedTiles = tilesToShuffle.map((t) =>
                      t.id === firstId || t.id === secondId
                        ? { ...t, flipped: false }
                        : t
                    );

                    // Eşleşmiş kartları ayır
                    const matchedTiles = closedTiles.filter((t) => t.matched);
                    const unmatchedTiles = closedTiles.filter(
                      (t) => !t.matched
                    );

                    // Eşleşmemiş kartları karıştır
                    const shuffledUnmatched = [...unmatchedTiles].sort(
                      () => Math.random() - 0.5
                    );

                    return [...matchedTiles, ...shuffledUnmatched];
                  });
                }, 1500);

                setTimeout(() => {
                  setToastMessage("");
                }, 4000);

                return currentTiles;
              }
            });

            setTimeout(() => {
              setSelectedTiles([]);
            }, 100);
          }, 100);
        }

        return newSelected;
      });
    },
    [wrongAttempts, onComplete]
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
