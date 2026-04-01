import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

const DEFAULT_CHANNEL = {
  id: "1",
  name: "general",
  description: "General discussion for everyone",
};

function AppContent() {
  const [activeChannel, setActiveChannel] = useState(DEFAULT_CHANNEL);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username] = useState(() => {
    const names = ["Alex", "Jordan", "Riley", "Casey", "Morgan", "Taylor", "Sam", "Drew"];
    return names[Math.floor(Math.random() * names.length)];
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleSelectChannel = (channel) => {
    setActiveChannel(channel);
    closeSidebar();
  };

  return (
    <div className={`app ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar
        activeChannelId={activeChannel.id}
        onSelectChannel={handleSelectChannel}
        username={username}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      <ChatWindow
        key={activeChannel.id}
        channel={activeChannel}
        username={username}
        onToggleSidebar={toggleSidebar}
      />
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
