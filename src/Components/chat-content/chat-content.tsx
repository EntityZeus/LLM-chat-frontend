import './chat-content.css';
import { getResponseForMessage } from '../../services/api-services';
import { useState, type ChangeEvent, type KeyboardEvent } from 'react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const ChatContentComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onMessageSend();
    }
  };

  const onMessageSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const res = await getResponseForMessage(trimmedMessage, messages);
      const replyText = res?.response || res?.message || res?.data?.message || 'I am ready when you are.';

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: replyText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.log(err);
      const fallbackMessage: Message = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-shell">
      <div className="chat-body">
        {messages.length === 0 ? (
          <div className="chat-hero">
            <p className="eyebrow">Your AI workspace</p>
            <h1>What would you like to explore today?</h1>
            <p className="chat-copy">
              Build, summarize, or generate ideas with a polished chat experience.
            </p>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((item) => (
              <div key={item.id} className={`message-row ${item.role}`}>
                <div className={`message-bubble ${item.role}`}>
                  {item.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-row assistant">
                <div className="message-bubble assistant typing">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="chat-input-card">
        <textarea
          className="chat-textarea"
          placeholder="Ask anything..."
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
        />
        <button type="button" className="send-btn" onClick={onMessageSend}>
          ↗
        </button>
      </div>
    </div>
  );
};

export default ChatContentComponent;