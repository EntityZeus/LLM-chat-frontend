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

  const renderInlineMarkdown = (content: string) => {
    const inlinePattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
    const parts: Array<JSX.Element | string> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = inlinePattern.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      if (match[1]) {
        parts.push(<code key={`${match.index}-code`}>{match[1].slice(1, -1)}</code>);
      } else if (match[2]) {
        parts.push(<strong key={`${match.index}-bold`}>{match[2].slice(2, -2)}</strong>);
      } else if (match[3]) {
        parts.push(<em key={`${match.index}-italic`}>{match[3].slice(1, -1)}</em>);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return <>{parts}</>;
  };

  const renderMarkdownBlocks = (content: string) => {
    const lines = content.split('\n');
    const blocks: Array<JSX.Element> = [];
    let paragraphLines: string[] = [];

    const flushParagraph = () => {
      if (!paragraphLines.length) {
        return;
      }

      blocks.push(
        <p key={`paragraph-${blocks.length}`}>
          {renderInlineMarkdown(paragraphLines.join(' '))}
        </p>,
      );
      paragraphLines = [];
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushParagraph();
        return;
      }

      if (/^[-*]\s+/.test(trimmed)) {
        flushParagraph();
        blocks.push(
          <ul key={`list-${index}`}>
            <li>{renderInlineMarkdown(trimmed.replace(/^[-*]\s+/, ''))}</li>
          </ul>,
        );
        return;
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        flushParagraph();
        blocks.push(
          <ol key={`list-${index}`}>
            <li>{renderInlineMarkdown(trimmed.replace(/^\d+\.\s+/, ''))}</li>
          </ol>,
        );
        return;
      }

      paragraphLines.push(trimmed);
    });

    flushParagraph();
    return <div className="markdown-body">{blocks}</div>;
  };

  const renderMessageContent = (content: string, role: Message['role']) => {
    if (role === 'assistant') {
      return renderMarkdownBlocks(content);
    }

    return <span>{content}</span>;
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
                  {renderMessageContent(item.content, item.role)}
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