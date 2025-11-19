import { memo, useState, useCallback } from "react";
import { GameProps } from "../../interfaces/GameProps.interface";
import styles from "../../styles/CinemaStep.module.css";
import { saveCinemaSelection } from "../../lib/supabase";

interface Showtime {
  id: string;
  time: string;
  format: "IMAX" | "2D";
}

const MOVIE_INFO = {
  title: "Yan Yana",
  originalTitle: "",
  duration: "2 sa 28 dk",
  genre: "Komedi",
  ageRating: "16+",
  posterUrl:
    "https://www.paribucineverse.com/files/movie_posters/HO00007653_638956874123159082_sdbda-veyahut-yan-yana.png", // Görsel URL'i buraya eklenecek
};

const SHOWTIMES: Showtime[] = [
  // IMAX seansları
  { id: "imax-1", time: "17:00", format: "IMAX" },
  { id: "imax-2", time: "20:15", format: "IMAX" },
  { id: "imax-3", time: "23:30", format: "IMAX" },
];

interface DateOption {
  id: string;
  date: Date;
  label: string;
  displayText: string;
}

const getNextWeekDates = (): DateOption[] => {
  const dates: DateOption[] = [];
  const today = new Date();
  const dayNames = [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ];
  const monthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  // Cuma gününü bul (5 = Cuma)
  const currentDay = today.getDay();
  let daysUntilFriday = 5 - currentDay;

  // Eğer bugün Cuma'dan sonra ise (Cumartesi veya Pazar), gelecek Cuma'yı bul
  if (daysUntilFriday < 0) {
    daysUntilFriday += 7;
  }

  // İlk tarih Cuma günü
  const firstDate = new Date(today);
  firstDate.setDate(today.getDate() + daysUntilFriday);

  // Cuma gününden başlayarak 7 gün ekle
  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDate);
    date.setDate(firstDate.getDate() + i);
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];

    let label = "";
    let displayText = "";

    // İlk gün (Cuma) için özel etiket
    if (i === 0) {
      if (daysUntilFriday === 0) {
        label = "Bugün (Cuma)";
        displayText = "Bugün (Cuma)";
      } else {
        label = "Cuma";
        displayText = `${dayName} ${day} ${month}`;
      }
    } else {
      label = `${dayName} ${day} ${month}`;
      displayText = `${dayName} ${day} ${month}`;
    }

    dates.push({
      id: `date-${i}`,
      date,
      label,
      displayText,
    });
  }

  return dates;
};

const CinemaStep = memo(({ onComplete }: GameProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const availableDates = getNextWeekDates();

  const handleDateSelect = useCallback((dateId: string) => {
    setSelectedDate(dateId);
    setSelectedShowtime(null);
  }, []);

  const handleShowtimeSelect = useCallback((showtimeId: string) => {
    setSelectedShowtime(showtimeId);
    setShowMessage(true);
  }, []);

  const handleSaveAndContinue = useCallback(async () => {
    if (selectedDate && selectedShowtime) {
      const dateOption = availableDates.find((d) => d.id === selectedDate);
      const showtime = SHOWTIMES.find((st) => st.id === selectedShowtime);

      if (dateOption && showtime) {
        // Veriyi Supabase'e kaydet
        await saveCinemaSelection({
          movie_title: MOVIE_INFO.title,
          selected_date: dateOption.date.toISOString(),
          selected_time: showtime.time,
        });
      }
    }

    onComplete();
  }, [onComplete, selectedDate, selectedShowtime, availableDates]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.movieHeader}>
          <h2 className={styles.movieMainTitle}>Yan Yana</h2>
          {MOVIE_INFO.posterUrl && (
            <div className={styles.moviePosterWrapper}>
              <img
                src={MOVIE_INFO.posterUrl}
                alt={MOVIE_INFO.title}
                className={styles.moviePoster}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <p className={styles.introText}>
          Sinemaya gidecektin ama hasta olduğun için gidemedin. Hala
          gitmediysen, beraber gidebiliriz! Önce bir tarih seçelim, sonra seans
          seçimi yapalım 💙
        </p>

        <div className={styles.movieCard}>
          <div className={styles.posterContainer}>
            <img
              src={MOVIE_INFO.posterUrl}
              alt={MOVIE_INFO.title}
              className={styles.posterImage}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className={styles.movieInfo}>
            <h3 className={styles.movieTitle}>{MOVIE_INFO.title}</h3>
            <p className={styles.movieOriginalTitle}>
              {MOVIE_INFO.originalTitle}
            </p>
            <div className={styles.movieDetails}>
              <span className={styles.detailItem}>{MOVIE_INFO.duration}</span>
              <span className={styles.detailSeparator}>•</span>
              <span className={styles.detailItem}>{MOVIE_INFO.genre}</span>
              <span className={styles.detailSeparator}>•</span>
              <span className={styles.detailItem}>{MOVIE_INFO.ageRating}</span>
            </div>
          </div>
        </div>

        <div className={styles.dateSelection}>
          <h4 className={styles.dateTitle}>Tarih Seçimi</h4>
          <div className={styles.datesGrid}>
            {availableDates.map((dateOption) => (
              <button
                key={dateOption.id}
                className={`${styles.dateButton} ${
                  selectedDate === dateOption.id ? styles.selected : ""
                }`}
                onClick={() => handleDateSelect(dateOption.id)}
                type="button"
                disabled={
                  selectedDate !== null && selectedDate !== dateOption.id
                }
              >
                <span className={styles.dateDisplay}>
                  {dateOption.displayText}
                </span>
              </button>
            ))}
          </div>
        </div>

        {selectedDate && (
          <div className={styles.showtimesSection}>
            <h4 className={styles.showtimesTitle}>Seans Seçimi</h4>
            <div className={styles.showtimesGrid}>
              {SHOWTIMES.map((showtime) => (
                <button
                  key={showtime.id}
                  className={`${styles.showtimeButton} ${
                    selectedShowtime === showtime.id ? styles.selected : ""
                  }`}
                  onClick={() => handleShowtimeSelect(showtime.id)}
                  type="button"
                  disabled={selectedShowtime !== null}
                >
                  {showtime.time}
                </button>
              ))}
            </div>
          </div>
        )}

        {showMessage && selectedShowtime && selectedDate && (
          <div className={styles.messageBox}>
            <p className={styles.messageText}>
              Harika seçim!{" "}
              {availableDates.find((d) => d.id === selectedDate)?.displayText}{" "}
              günü {SHOWTIMES.find((st) => st.id === selectedShowtime)?.time}{" "}
              seansı için bilet aldım. :)
            </p>
            <button
              className={styles.saveButton}
              onClick={handleSaveAndContinue}
              type="button"
            >
              Tarihi Kaydetmeyi Unutma 📅
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

CinemaStep.displayName = "CinemaStep";

export default CinemaStep;
