import { useState, useCallback, useMemo, memo } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/PuzzleStep.module.css';

interface ColorTile {
  id: number;
  color: string;
  matched: boolean;
  flipped: boolean;
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

const PuzzleStep = memo(({ step, onComplete }: GameProps) => {
  const [tiles, setTiles] = useState<ColorTile[]>(() => {
    const colorPairs = [...COLORS, ...COLORS];
    const shuffled = colorPairs.sort(() => Math.random() - 0.5);
    return shuffled.map((color, index) => ({
      id: index,
      color,
      matched: false,
      flipped: false,
    }));
  });

  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  const handleTileClick = useCallback(
    (tileId: number) => {
      const tile = tiles[tileId];
      
      if (tile.matched || tile.flipped || selectedTiles.length >= 2) {
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

        if (firstTile.color === secondTile.color) {
          setTiles((prev) =>
            prev.map((t) =>
              t.id === firstId || t.id === secondId
                ? { ...t, matched: true, flipped: true }
                : t
            )
          );
          setMatches((prev) => {
            const newMatches = prev + 1;
            if (newMatches === COLORS.length) {
              setTimeout(() => {
                onComplete();
              }, 500);
            }
            return newMatches;
          });
          setSelectedTiles([]);
        } else {
          setTimeout(() => {
            setTiles((prev) =>
              prev.map((t) =>
                t.id === firstId || t.id === secondId
                  ? { ...t, flipped: false }
                  : t
              )
            );
            setSelectedTiles([]);
          }, 1000);
        }
      }
    },
    [tiles, selectedTiles, onComplete]
  );

  const gridSize = useMemo(() => Math.sqrt(tiles.length), [tiles.length]);

  return (
    <div className={styles.puzzleContainer}>
      <p className={styles.puzzleDescription}>{step.content}</p>
      <div className={styles.matchCounter}>
        Eşleşme: {matches} / {COLORS.length}
      </div>
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
            style={
              tile.flipped || tile.matched
                ? { backgroundColor: tile.color }
                : undefined
            }
            disabled={tile.matched || selectedTiles.length >= 2}
          >
            {!tile.flipped && !tile.matched ? '?' : ''}
          </button>
        ))}
      </div>
    </div>
  );
});

PuzzleStep.displayName = 'PuzzleStep';

export default PuzzleStep;

