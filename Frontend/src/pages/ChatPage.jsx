import React, { useState } from 'react';
import Sidebar from '../components/ChatPage/SideBar';
import ChatWindow from '../components/ChatPage/ChatWindow';

const ChatPage = () => {

  const [chatKey, setChatKey] = useState(0);

  const handleNewChat = () => {
    setChatKey(prev => prev + 1);
  };
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <Sidebar onNewChat={handleNewChat} />
      <main className="flex-1 flex flex-col relative">
        <ChatWindow key={chatKey} />
      </main>
    </div>
  );
};

export default ChatPage;