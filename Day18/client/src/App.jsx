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
  const [username] = useState(() => {
    const names = ["Alex", "Jordan", "Riley", "Casey", "Morgan", "Taylor", "Sam", "Drew"];
    return names[Math.floor(Math.random() * names.length)];
  });

  return (
    <div className="app">
      <Sidebar
        activeChannelId={activeChannel.id}
        onSelectChannel={setActiveChannel}
        username={username}
      />
      <ChatWindow
        key={activeChannel.id}
        channel={activeChannel}
        username={username}
      />
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
