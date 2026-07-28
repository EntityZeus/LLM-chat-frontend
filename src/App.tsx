import './App.css'
import SideNavComponent from './Components/side-nav/side-nav';
import ChatContentComponent from './Components/chat-content/chat-content';

//// TODOs:
// fix mobile view side nav slide.
// use markdowns for ai responses.

function App() {
  return (
    <div className="main-app-container">
      <div className="left-nav-bar">
        <SideNavComponent />
      </div>

      <main className="right-chat-content">
        <ChatContentComponent />
      </main>
    </div>
  )
}

export default App
