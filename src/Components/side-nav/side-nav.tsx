
import { useState } from 'react'
import './side-nav.css'

const chatHistory = [
  'Summarize my project plan',
  'Draft a landing page copy',
  'Explain React state updates',
  'Create a weekly schedule',
]

const SideNavComponent = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className={`side-nav-shell ${mobileOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="side-nav-toggle"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label="Toggle navigation"
        aria-expanded={mobileOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <button
        type="button"
        className="side-nav-backdrop"
        onClick={() => setMobileOpen(false)}
        aria-label="Close navigation"
      />

      <aside className="side-nav">
        <div className="side-nav-header">
          <div>
            <p className="brand-eyebrow">AI workspace</p>
            <h2 className="brand-title">Chat Studio</h2>
          </div>
          <button type="button" className="new-chat-btn">
            + New Chat
          </button>
        </div>

        <div className="side-nav-section">
          <div className="section-heading">
            <span>Recent chats</span>
            <span className="section-pill">4</span>
          </div>
          <ul className="side-nav-list">
            {chatHistory.map((chat, index) => (
              <li key={chat} className={`side-nav-list-item ${index === 0 ? 'active' : ''}`}>
                <span className="chat-icon">✦</span>
                <span className="chat-title">{chat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="side-nav-footer">
          <div className="footer-card">
            <p className="footer-title">Try smarter prompts</p>
            <p className="footer-copy">Ask for summaries, code help, or creative ideas.</p>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default SideNavComponent;