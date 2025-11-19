import { memo, useState, useCallback, useMemo } from 'react';
import { GameProps } from '../../interfaces/GameProps.interface';
import styles from '../../styles/ChatStep.module.css';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    text: 'Merhaba! Nasılsın bugün? 💙',
    sender: 'other',
    timestamp: '10:00',
  },
  {
    id: 2,
    text: 'İyileşme yolunda olduğunu biliyorum, sen çok güçlüsün!',
    sender: 'other',
    timestamp: '10:01',
  },
];

const ChatStep = memo(({ onComplete }: GameProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [messageCount, setMessageCount] = useState<number>(0);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setMessageCount((prev) => prev + 1);

    // 3 mesaj gönderildikten sonra otomatik tamamla
    if (messageCount + 1 >= 2) {
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  }, [inputText, messages.length, messageCount, onComplete]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const canComplete = useMemo(() => messageCount >= 2, [messageCount]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.introText}>
          Birlikte sohbet edelim. Nasılsın, neler hissediyorsun? Seni dinlemek
          istiyorum 💙
        </p>

        <div className={styles.chatContainer}>
          <div className={styles.messagesList}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.sender === 'user' ? styles.userMessage : styles.otherMessage
                }`}
              >
                <div className={styles.messageBubble}>
                  <p className={styles.messageText}>{message.text}</p>
                  <span className={styles.timestamp}>{message.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.messageInput}
              placeholder="Mesajını yaz..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={canComplete}
            />
            <button
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={!inputText.trim() || canComplete}
              type="button"
            >
              Gönder
            </button>
          </div>

          {canComplete && (
            <div className={styles.completionMessage}>
              <p>💙 Sohbet için teşekkürler! Her zaman yanındayım.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ChatStep.displayName = 'ChatStep';

export default ChatStep;

