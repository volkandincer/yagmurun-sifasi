import { memo, useState, useCallback } from "react";
import { GameProps } from "../../interfaces/GameProps.interface";
import styles from "../../styles/MoviesStep.module.css";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  type: "film" | "dizi";
  icon: string;
  year?: string;
  imdbId?: string;
  imdbUrl?: string;
  letterboxdUrl?: string;
  posterUrl?: string;
}

// Dizi önerileri
const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    title: "Da Vinci's Demons",
    description:
      "Leonardo da Vinci'nin gençliğini ve maceralarını anlatan bu dizi, tarih, gizem ve macera dolu bir hikaye sunuyor. İyileşme sürecinde izlemek için harika bir seçim!",
    type: "dizi",
    icon: "📺",
    year: "2013",
    imdbId: "tt2094262",
    imdbUrl: "https://www.imdb.com/title/tt2094262/",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BYzc5ODJmOTItYzgwOC00YTM4LTk5YmQtYjhkMWU3ZDdlMzg5XkEyXkFqcGc@._V1_QL75_UY281_CR11,0,190,281_.jpg",
  },
  {
    id: 2,
    title: "11.22.63",
    description:
      "Stephen King'in romanından uyarlanan bu mini dizi, bir İngilizce öğretmeninin zamanda geriye giderek Kennedy suikastını önlemeye çalışmasını anlatıyor. Gerilim dolu ve sürükleyici bir hikaye!",
    type: "dizi",
    icon: "📺",
    year: "2016",
    letterboxdUrl: "https://letterboxd.com/film/11-22-63/",
    posterUrl:
      "https://upload.wikimedia.org/wikipedia/tr/6/64/11.22.63_TV_series.jpg",
  },
  {
    id: 3,
    title: "Russian Doll",
    description:
      "Nadia, doğum günü partisinde sürekli ölüp aynı geceye geri dönmeye başlar. Zaman döngüsü içinde kendini ve hayatını keşfeden bir komedi-drama dizisi. Sürükleyici ve düşündürücü!",
    type: "dizi",
    icon: "📺",
    year: "2019",
    imdbUrl: "https://www.imdb.com/title/tt7520794/",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BZWRlM2ExMDEtOWJhZS00YTM4LWE5MDAtMWQ1NWFkOWRiODQ5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  },
];

const MoviesStep = memo(({ onComplete }: GameProps) => {
  const [hasViewed, setHasViewed] = useState<boolean>(false);

  const handleContinue = useCallback(() => {
    setHasViewed(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  }, [onComplete]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.introText}>
          Durumunu öğrendik, şimdi iyileşme sürecinde izleyebileceğin özel
          önerilerim var! Birlikte izleyebileceğimiz diziler seni bekliyor 💙
        </p>

        <div className={styles.recommendationsContainer}>
          <div className={styles.seriesSection}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📺</span>
              Dizi Önerileri
            </h3>
            <div className={styles.recommendationsGrid}>
              {RECOMMENDATIONS.map((dizi) => (
                <div key={dizi.id} className={styles.recommendationCard}>
                  {dizi.posterUrl && (
                    <div className={styles.posterContainer}>
                      <img
                        src={dizi.posterUrl}
                        alt={dizi.title}
                        className={styles.posterImage}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className={styles.cardHeader}>
                    {!dizi.posterUrl && (
                      <div className={styles.recommendationIcon}>
                        {dizi.icon}
                      </div>
                    )}
                    <div className={styles.recommendationInfo}>
                      <h4 className={styles.recommendationTitle}>
                        {dizi.title}
                      </h4>
                      {dizi.year && (
                        <span className={styles.recommendationYear}>
                          {dizi.year}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={styles.recommendationDescription}>
                    {dizi.description}
                  </p>
                  <div className={styles.linkContainer}>
                    {dizi.imdbUrl && (
                      <a
                        href={dizi.imdbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.imdbLink}
                      >
                        IMDB'de Görüntüle →
                      </a>
                    )}
                    {dizi.letterboxdUrl && (
                      <a
                        href={dizi.letterboxdUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.letterboxdLink}
                      >
                        Letterboxd'de Görüntüle →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!hasViewed ? (
          <button
            className={styles.continueButton}
            onClick={handleContinue}
            type="button"
          >
            Önerileri Gördüm, Devam Edelim 💙
          </button>
        ) : (
          <div className={styles.successMessage}>
            <p>✅ İzleyebileceğin güzel vakitler seni bekliyor 💙</p>
          </div>
        )}
      </div>
    </div>
  );
});

MoviesStep.displayName = "MoviesStep";

export default MoviesStep;
