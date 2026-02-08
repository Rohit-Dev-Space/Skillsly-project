import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Paperclip, Send, Smile, ArrowLeft, Users, X } from 'lucide-react';

export default function MessageList() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Rohan', text: 'Bhai, script ready hai?', time: '11:15 AM', isMe: false },
    { id: 2, sender: 'Me', text: 'Haan, voiceover sync kar raha hoon.', time: '11:17 AM', isMe: true },
  ]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom helper
  useEffect(() => {
    if (selectedGroup) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedGroup]);

  // Handle Send
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (newMessage.trim() === '') return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messageObj = {
      id: Date.now(),
      sender: 'Me',
      text: newMessage,
      time: time,
      isMe: true
    };

    setMessages([...messages, messageObj]);
    setNewMessage(''); 

    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }

    // BACKEND COMMENT: 
    // Friend: Trigger axios.post or socket.emit here.
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const groups = [
    { id: 1, name: 'Rohan & Rohit', lastSeen: 'online', lastMessage: 'Check the edit.' },
    { id: 2, name: 'Showroom Sales', lastSeen: '5 mins ago', lastMessage: 'Voiceover done.' },
  ];

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- RENDER LOGIC ---
  
  if (!selectedGroup) {
    return (
      <div className="flex flex-col h-full bg-[#0d0d0d] text-white">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">All Messages</h1>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search groups..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] rounded-lg py-2 pl-10 text-sm outline-none border border-transparent focus:border-teal-400"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div key={group.id} onClick={() => setSelectedGroup(group)} className="p-5 border-b border-gray-900 hover:bg-[#1a1a1a] cursor-pointer flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 text-teal-400"><Users /></div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{group.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{group.lastMessage}</p>
                </div>
              </div>
            ))
          ) : (
            <div className='w-full h-full py-20 flex flex-col items-center justify-center'>
              <h1 className='text-white text-xl mb-6'>No groups found</h1>
              <div className='flex gap-4'>
                <img src="/SadStep-1.png" alt="Sad 1" className="w-32 h-auto" />
                <img src="/SadStep-2.png" alt="Sad 2" className="w-32 h-auto" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-white overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <button onClick={() => setSelectedGroup(null)} className="p-2 hover:bg-[#262626] rounded-full">
            <ArrowLeft className="w-6 h-6 text-teal-400" />
          </button>
          <div className="w-10 h-10 rounded-full bg-teal-900/30 border border-teal-500 flex items-center justify-center font-bold text-teal-400">
             {selectedGroup.name.charAt(0)}
          </div>
          <h2 className="font-bold">{selectedGroup.name}</h2>
        </div>
        <MoreVertical className="w-5 h-5 text-gray-400" />
      </div>

      {/* MESSAGES */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#0a0a0a]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
            <div className={`p-3 rounded-2xl max-w-[85%] break-words whitespace-pre-wrap ${msg.isMe ? 'bg-teal-600 rounded-tr-none' : 'bg-[#1a1a1a] border border-gray-800 rounded-tl-none'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
            <span className="text-[10px] text-gray-600 mt-1">{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-[#1a1a1a] border-t border-gray-800">
        <div className="flex items-end space-x-3 bg-[#0d0d0d] p-3 rounded-xl border border-gray-800 focus-within:border-teal-500">
            <button className="text-gray-500 hover:text-teal-400 mb-1"><Smile /></button>
            <button className="text-gray-500 hover:text-teal-400 mb-1"><Paperclip className="w-5 h-5"/></button>
            
            <textarea 
              ref={textareaRef}
              rows="1"
              autoFocus
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..." 
              className="flex-grow bg-transparent border-none text-white px-2 py-1 outline-none text-sm resize-none min-h-[40px] max-h-[150px] overflow-y-auto w-full"
            />

            <button onClick={handleSendMessage} className="bg-teal-500 p-2 rounded-lg hover:bg-teal-400 transition-all">
              <Send className="w-5 h-5 text-black" />
            </button>
        </div>
      </div>
    </div>
  );
}