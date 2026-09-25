import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, User, RefreshCw, Plus, Compass } from 'lucide-react';
import { useWindowDragResize, type PositionPreset } from '../hooks/useWindowDragResize';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: { section: string; similarity: number; metadata?: { source?: string; chunkIndex?: number } }[];
  tokensSaved?: number;
  responseMs?: number;
  timestamp: Date;
  isTyping?: boolean;
  guardrailTriggered?: string;
}

const QUICK_PROMPTS = [
  "What are Garv's present AI & ML projects?",
  "What is Garv's technical skill stack?",
  "What certifications does Garv hold?",
  "How can I contact Garv for opportunities?",
];

const PRESET_OPTIONS: { id: PositionPreset; label: string }[] = [
  { id: 'bottom-right', label: 'Bottom Right' },
  { id: 'bottom-left', label: 'Bottom Left' },
  { id: 'top-right', label: 'Top Right' },
  { id: 'center', label: 'Center Screen' },
];

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am **Garv AI**, powered by a high-performance AI assistant. Ask me anything about Garv's experience, projects, skills, or education!",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typewriterIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    buttonPos,
    winPos,
    winSize,
    preset,
    isMobile,
    isBtnDragging,
    isWinDragging,
    isResizing,
    btnWasDraggedRef,
    setPositionPreset,
    handleButtonPointerDown,
    handleHeaderPointerDown,
    handleResizePointerDown,
  } = useWindowDragResize({
    buttonSize: 56,
    defaultWidth: 420,
    defaultHeight: 580,
    minWidth: 320,
    maxWidth: 700,
    minHeight: 420,
    maxHeight: 850,
    margin: 16,
    initialPreset: 'bottom-right',
  });

  const clearTypewriter = () => {
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current);
      typewriterIntervalRef.current = null;
    }
  };

  const scrollToBottom = (smooth = true) => {
    if (chatContainerRef.current) {
      if (smooth) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      clearTypewriter();
    };
  }, []);

  const handleNewChat = () => {
    clearTypewriter();
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: "Hello! I am **Garv AI**, powered by a high-performance AI assistant. Ask me anything about Garv's experience, projects, skills, or education!",
        timestamp: new Date(),
      },
    ]);
    setInputMessage('');
  };

  // Typewriter text animation helper with performance optimization
  const streamTypewriterText = (
    aiMsgId: string,
    fullText: string,
    sources: any[],
    tokensSaved: number,
    responseMs: number,
    guardrailTriggered?: string
  ) => {
    clearTypewriter();

    const words = fullText.split(' ');
    let currentIdx = 0;
    const chunkSize = Math.max(1, Math.ceil(words.length / 25));

    typewriterIntervalRef.current = setInterval(() => {
      currentIdx += chunkSize;
      const isDone = currentIdx >= words.length;
      const currentText = isDone ? fullText : words.slice(0, currentIdx).join(' ');

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
              ...msg,
              text: currentText + (isDone ? '' : ' ▌'),
              isTyping: !isDone,
              sources: isDone ? sources : undefined,
              tokensSaved: isDone ? tokensSaved : undefined,
              responseMs: isDone ? responseMs : undefined,
              guardrailTriggered: isDone ? guardrailTriggered : undefined,
            }
            : msg
        )
      );

      // Instant scroll during typing to prevent scroll animation thrashing
      scrollToBottom(false);

      if (isDone) {
        clearTypewriter();
      }
    }, 25);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    clearTypewriter();

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    // Prepare multi-turn history window (last 4 messages)
    const historyPayload = messages.slice(-4).map((m) => ({
      role: m.sender === 'ai' ? 'model' : 'user',
      text: m.text.replace(/▌$/, ''),
    }));

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    // Scroll to bottom smoothly when user sends message
    setTimeout(() => scrollToBottom(true), 50);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history: historyPayload }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const aiMsgId = (Date.now() + 1).toString();
      const fullAnswer = data.answer || "Sorry, I couldn't generate a response.";

      // Initial empty AI message shell
      const aiMessageShell: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: '▌',
        timestamp: new Date(),
        isTyping: true,
      };

      setMessages((prev) => [...prev, aiMessageShell]);
      setIsLoading(false);

      // Start smooth typewriter animation
      streamTypewriterText(
        aiMsgId,
        fullAnswer,
        data.sources || [],
        data.tokensSavedEstimate || 0,
        data.responseMs || 0,
        data.guardrailTriggered
      );
    } catch (err) {
      console.error('Chat request failed:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "⚠️ I couldn't reach the AI backend. Please ensure the backend server is running (`npm run server`).",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
      setTimeout(() => scrollToBottom(true), 50);
    }
  };

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, lineIdx) => {
      // Code block handling
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${lineIdx}`} className="my-2 p-2.5 bg-slate-950 text-indigo-200 rounded-lg text-[11px] font-mono overflow-x-auto border border-slate-800">
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={`blank-${lineIdx}`} className="h-1.5" />);
        return;
      }

      // Escape HTML characters to prevent XSS / DOM breaking
      let safeStr = escapeHtml(trimmed);

      // Inline code format: `code`
      safeStr = safeStr.replace(
        /`([^`]+)`/g,
        '<code class="bg-slate-950 text-indigo-300 px-1 py-0.5 rounded text-[11px] font-mono border border-slate-700/60">$1</code>'
      );

      // Markdown links: [label](url)
      safeStr = safeStr.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noreferrer" class="text-blue-400 hover:text-blue-300 underline font-medium break-all">$1</a>'
      );

      // Bold: **text**
      safeStr = safeStr.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>');

      // Italic: *text*
      safeStr = safeStr.replace(/\*(.*?)\*/g, '<em class="text-indigo-200">$1</em>');

      if (trimmed.startsWith('### ')) {
        const h3Content = safeStr.replace(/^###\s*/, '');
        elements.push(
          <h4
            key={lineIdx}
            className="font-bold text-xs sm:text-sm text-cyan-300 mt-2 mb-1 font-[Space_Grotesk] break-words"
            dangerouslySetInnerHTML={{ __html: h3Content }}
          />
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        const h2Content = safeStr.replace(/^##\s*/, '');
        elements.push(
          <h3
            key={lineIdx}
            className="font-bold text-sm text-indigo-300 mt-2.5 mb-1 font-[Space_Grotesk] break-words"
            dangerouslySetInnerHTML={{ __html: h2Content }}
          />
        );
        return;
      }

      if (trimmed.startsWith('# ')) {
        const h1Content = safeStr.replace(/^#\s*/, '');
        elements.push(
          <h2
            key={lineIdx}
            className="font-bold text-base text-purple-300 mt-3 mb-1 font-[Space_Grotesk] break-words"
            dangerouslySetInnerHTML={{ __html: h1Content }}
          />
        );
        return;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
        const liContent = safeStr.replace(/^[-•*]\s*/, '');
        elements.push(
          <li
            key={lineIdx}
            className="ml-3 list-disc my-0.5 text-slate-200 leading-snug break-words"
            dangerouslySetInnerHTML={{ __html: liContent }}
          />
        );
        return;
      }

      elements.push(
        <p
          key={lineIdx}
          className="my-1 leading-relaxed text-slate-200 break-words"
          dangerouslySetInnerHTML={{ __html: safeStr }}
        />
      );
    });

    if (inCodeBlock && codeBlockContent.length > 0) {
      elements.push(
        <pre key="code-unclosed" className="my-2 p-2.5 bg-slate-950 text-indigo-200 rounded-lg text-[11px] font-mono overflow-x-auto border border-slate-800">
          <code>{codeBlockContent.join('\n')}</code>
        </pre>
      );
    }

    return elements;
  };

  return (
    <>
      {/* Floating Circular Widget Button */}
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            left: `${buttonPos.x}px`,
            top: `${buttonPos.y}px`,
            zIndex: 9999,
          }}
          className="touch-none select-none"
        >
          <motion.button
            onPointerDown={handleButtonPointerDown}
            onClick={() => {
              if (!btnWasDraggedRef.current) {
                setIsOpen(true);
              }
            }}
            aria-label="Open Garv AI Chatbot"
            title="Drag to position, click to chat with Garv AI"
            className={`group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-transform duration-200 border border-white/20 cursor-grab active:cursor-grabbing ${isBtnDragging ? 'ring-4 ring-indigo-400/50 scale-105' : ''
              }`}
            whileTap={{ scale: 0.92 }}
          >
            <div className="relative flex items-center justify-center">
              <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
              <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse" />
            </div>

            {/* Online Pulse Indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
            </span>

            {/* Tooltip on Desktop Hover */}
            <span className="absolute right-16 top-1/2 -translate-y-1/2 hidden md:group-hover:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs text-slate-100 font-medium rounded-xl whitespace-nowrap shadow-xl pointer-events-none">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask Garv AI</span>
            </span>
          </motion.button>
        </div>
      )}

      {/* Draggable & Resizable Chat Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop Overlay to close on tap outside if mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[9990] bg-slate-950/60 backdrop-blur-xs md:hidden"
              />
            )}

            <div
              style={{
                position: 'fixed',
                left: `${winPos.x}px`,
                top: `${winPos.y}px`,
                width: `${winSize.width}px`,
                height: `${winSize.height}px`,
                zIndex: 9999,
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`relative w-full h-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 ring-1 ring-white/10 ${isWinDragging ? 'ring-2 ring-indigo-500/50 shadow-indigo-950/60' : ''
                  } ${isResizing ? 'ring-2 ring-purple-500/50' : ''}`}
              >
                {/* Header Bar - Draggable Handle */}
                <div
                  onPointerDown={handleHeaderPointerDown}
                  className="px-3.5 py-2.5 bg-slate-800/90 border-b border-slate-700/60 flex items-center justify-between cursor-grab active:cursor-grabbing select-none touch-none shrink-0"
                >
                  {/* Left: Bot Icon + Title + Status */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-900/30 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="font-bold text-sm text-slate-100 font-[Space_Grotesk] leading-tight truncate">Garv AI</h3>
                      <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 leading-tight mt-0.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" /> Online • Assistant
                      </p>
                    </div>
                  </div>

                  {/* Header Action Controls */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {/* Position Presets Menu Button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowPresetMenu((prev) => !prev)}
                        title="Reposition chatbot window"
                        className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-700/40 hover:bg-slate-700/80 border border-slate-600/40 rounded-lg transition-colors cursor-pointer"
                      >
                        <Compass className="w-4 h-4" />
                      </button>

                      {showPresetMenu && (
                        <div className="absolute right-0 top-9 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5 text-xs">
                          <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-700/60">
                            Screen Position
                          </div>
                          {PRESET_OPTIONS.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => {
                                setPositionPreset(opt.id);
                                setShowPresetMenu(false);
                              }}
                              className={`px-2 py-1.5 rounded-lg text-left transition-colors flex items-center justify-between cursor-pointer ${preset === opt.id ? 'bg-indigo-600/40 text-indigo-200 font-semibold' : 'text-slate-300 hover:bg-slate-700/60'
                                }`}
                            >
                              <span>{opt.label}</span>
                              {preset === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Reset / New Chat (Icon Only) */}
                    <button
                      onClick={handleNewChat}
                      title="New Chat / Reset Conversation"
                      className="p-1.5 text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/60 border border-indigo-500/40 hover:border-indigo-400/60 rounded-lg transition-all cursor-pointer active:scale-95 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Close / Minimize */}
                    <button
                      onClick={() => {
                        setShowPresetMenu(false);
                        setIsOpen(false);
                      }}
                      title="Minimize Chatbot"
                      className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message History Content */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3.5 select-text scrollbar-thin scrollbar-thumb-slate-700"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] text-xs rounded-2xl px-3.5 py-2.5 shadow-sm overflow-hidden break-words ${msg.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                            : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-bl-none'
                          }`}
                      >
                        {renderFormattedText(msg.text)}

                        {/* Sources section badges */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-700/60 text-[10px] text-slate-400 flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-indigo-300 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-300" />
                              Sources:
                            </span>
                            {msg.sources.map((src, sIdx) => {
                              const cleanSec = src.section.replace(/^\d+\.\s*/, '').trim();
                              return (
                                <button
                                  key={sIdx}
                                  onClick={() => handleSendMessage(`Tell me more details about ${cleanSec}`)}
                                  title={`Click to query details about ${cleanSec}`}
                                  disabled={isLoading}
                                  className="bg-slate-800/90 hover:bg-indigo-600/40 text-slate-300 hover:text-indigo-200 px-2 py-1 rounded-md border border-slate-700/80 hover:border-indigo-500/50 transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 group shadow-sm"
                                >
                                  <span className="font-medium text-slate-200">{cleanSec}</span>
                                  <Sparkles className="w-2.5 h-2.5 text-indigo-400 group-hover:text-amber-300 transition-colors" />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {msg.sender === 'user' && (
                        <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-2.5 justify-start">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                        <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                      </div>
                      <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        <span className="ml-1 text-xs text-slate-300 font-medium">Garv AI is thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Chips */}
                {messages.length <= 2 && (
                  <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800 flex flex-wrap gap-1.5 shrink-0 select-none">
                    {QUICK_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[11px] bg-slate-800 hover:bg-indigo-900/40 text-indigo-200 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/80 hover:border-indigo-500/50 transition-all text-left cursor-pointer active:scale-95"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 bg-slate-800/90 border-t border-slate-700/80 flex items-center gap-2 shrink-0 select-text"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about Garv's projects, skills, BCA..."
                    className="flex-1 bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-400 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    maxLength={250}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Window Edge & Corner Resize Handles */}
                {!isMobile && (
                  <>
                    {/* Edges */}
                    <div
                      onPointerDown={(e) => handleResizePointerDown('n', e)}
                      className="absolute top-0 left-3 right-3 h-2 cursor-ns-resize hover:bg-indigo-500/20 z-10 touch-none select-none"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown('s', e)}
                      className="absolute bottom-0 left-3 right-3 h-2 cursor-ns-resize hover:bg-indigo-500/20 z-10 touch-none select-none"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown('w', e)}
                      className="absolute top-3 bottom-3 left-0 w-2 cursor-ew-resize hover:bg-indigo-500/20 z-10 touch-none select-none"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown('e', e)}
                      className="absolute top-3 bottom-3 right-0 w-2 cursor-ew-resize hover:bg-indigo-500/20 z-10 touch-none select-none"
                    />

                    {/* Corners */}
                    <div
                      onPointerDown={(e) => handleResizePointerDown('nw', e)}
                      className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize hover:bg-indigo-500/30 z-20 touch-none select-none"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown('ne', e)}
                      className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize hover:bg-indigo-500/30 z-20 touch-none select-none"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown('sw', e)}
                      className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize hover:bg-indigo-500/30 z-20 touch-none select-none"
                    />
                    <div
                      onPointerDown={(e) => handleResizePointerDown('se', e)}
                      className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize hover:bg-indigo-500/40 z-20 flex items-center justify-center group touch-none select-none"
                      title="Drag to resize window"
                    >
                      <svg
                        className="w-2.5 h-2.5 text-slate-500 group-hover:text-indigo-300 transition-colors"
                        viewBox="0 0 6 6"
                        fill="currentColor"
                      >
                        <circle cx="5" cy="5" r="0.8" />
                        <circle cx="5" cy="2" r="0.8" />
                        <circle cx="2" cy="5" r="0.8" />
                      </svg>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAssistant;

