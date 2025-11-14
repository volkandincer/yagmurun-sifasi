import { memo, useState } from "react";
import { GameProps } from "../../interfaces/GameProps.interface";
import styles from "../../styles/MessageStep.module.css";

const MessageStep = memo(({ step, onComplete }: GameProps) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showNoPopup, setShowNoPopup] = useState<boolean>(false);
  const isFirstStep = step.id === 1;

  const handleContinueClick = () => {
    if (isFirstStep && !showConfirmation) {
      setShowConfirmation(true);
    } else {
      // Evet butonuna tıklandığında da popup göster
      if (isFirstStep && showConfirmation) {
        setShowNoPopup(true);
      } else {
        onComplete();
      }
    }
  };

  const handleNoClick = () => {
    setShowNoPopup(true);
  };

  const handlePopupClose = () => {
    setShowNoPopup(false);
    onComplete();
  };

  if (isFirstStep && showConfirmation) {
    return (
      <div className={styles.messageContainer}>
        <p className={styles.confirmationQuestion}>Emin misin?</p>
        <div className={styles.confirmationButtons}>
          <button
            className={styles.confirmButtonRed}
            onClick={handleContinueClick}
          >
            Evet
          </button>
          <button className={styles.confirmButtonGreen} onClick={handleNoClick}>
            Hayır
          </button>
        </div>

        {/* Hayır Pop-up */}
        {showNoPopup && (
          <div className={styles.popupOverlay} onClick={handlePopupClose}>
            <div
              className={styles.popupContent}
              onClick={(e) => e.stopPropagation()}
            >
              <p className={styles.popupMessage}>
                Evet ya da hayır fark etmiyordu ki… Bir sonraki aşamaya
                geçebiliriz 😄
                <br />
                Zorlu bir oyun bu! 💪
              </p>
              <button className={styles.popupButton} onClick={handlePopupClose}>
                Devam mı →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.messageContainer}>
      <p className={styles.messageText}>{step.content}</p>
      <button className={styles.continueButton} onClick={handleContinueClick}>
        Devam Ediyoruzzz →
      </button>
    </div>
  );
});

MessageStep.displayName = "MessageStep";

export default MessageStep;
