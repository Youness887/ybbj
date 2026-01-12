<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>AI NEXUS V8 - Mobile</title>
    <!-- Tailwind CSS for styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { 
            font-family: 'Tajawal', sans-serif; 
            -webkit-tap-highlight-color: transparent; 
            background-color: #020617;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        /* Smooth animations */
        .fade-in { animation: fadeIn 0.3s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="text-slate-200">
    <div id="root"></div>

    <!-- React and Libraries (UMD for single file use) -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <script type="text/babel">
        const { useState, useEffect, useRef } = React;

        function App() {
            const [input, setInput] = useState('');
            const [messages, setMessages] = useState([
                { role: 'assistant', content: 'مرحباً بك في نظام NEXUS V8! ارفع ملفاتك، صمم NFTs، أو ابدأ التداول الآن.' }
            ]);
            const [activeMode, setActiveMode] = useState('chat');
            const [isTyping, setIsTyping] = useState(false);
            const messagesEndRef = useRef(null);

            // Function to handle sending messages
            const handleSend = async () => {
                if (!input.trim()) return;
                const userMsg = { role: 'user', content: input };
                setMessages(prev => [...prev, userMsg]);
                setInput('');
                setIsTyping(true);

                // Simulation for now - You can add Gemini API call here
                setTimeout(() => {
                    let response = "أنا جاهز لمساعدتك في " + activeMode;
                    if (activeMode === 'nft') response = "لقد قمت بتحليل فكرة الـ NFT الخاصة بك. هل ننتقل لتوليد الصور؟";
                    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
                    setIsTyping(false);
                }, 1000);
            };

            useEffect(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, [messages]);

            return (
                <div className="flex flex-col h-screen max-h-screen overflow-hidden">
                    {/* Top Status Bar */}
                    <header className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-50">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <span className="font-black text-xs uppercase tracking-widest text-white">NEXUS V8 PRO</span>
                        </div>
                        <div className="flex gap-2">
                             <div className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20 font-bold uppercase">
                                {activeMode}
                             </div>
                        </div>
                    </header>

                    {/* Chat Area */}
                    <main className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-32">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'} fade-in`}>
                                <div className={`max-w-[88%] p-4 rounded-2xl text-sm shadow-2xl relative ${
                                    m.role === 'user' 
                                    ? 'bg-slate-800 text-slate-100 rounded-tr-none border border-slate-700' 
                                    : 'bg-indigo-600 text-white rounded-tl-none font-medium'
                                }`}>
                                    {m.content}
                                    <div className={`absolute top-0 w-3 h-3 ${m.role === 'user' ? 'right-[-6px] bg-slate-800' : 'left-[-6px] bg-indigo-600'}`} 
                                         style={{ clipPath: m.role === 'user' ? 'polygon(0 0, 0 100%, 100% 0)' : 'polygon(0 0, 100% 100%, 100% 0)' }}>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-1 p-2">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </main>

                    {/* Bottom Controls */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent">
                        {/* Mode Switcher */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 py-1">
                            {['chat', 'nft', 'trading', 'marketing'].map(mode => (
                                <button 
                                    key={mode}
                                    onClick={() => setActiveMode(mode)}
                                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap border ${
                                        activeMode === mode 
                                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.4)]' 
                                        : 'bg-slate-900/80 text-slate-500 border-slate-800'
                                    }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>

                        {/* Input Box */}
                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-[2rem] p-1.5 shadow-2xl focus-within:border-indigo-600 transition-all">
                            <button className="p-3 text-slate-500 hover:text-indigo-400 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </button>
                            <textarea 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                                placeholder="اكتب استفسارك هنا..."
                                className="flex-1 bg-transparent px-2 py-3 outline-none text-sm resize-none h-12 text-white placeholder:text-slate-600"
                            />
                            <button 
                                onClick={handleSend}
                                className="w-11 h-11 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-500 transition-all shadow-lg active:scale-90"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                        <p className="text-[8px] text-center text-slate-600 mt-3 font-bold tracking-[0.2em] uppercase">Powered by AI Nexus V8 Infrastructure</p>
                    </div>
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>

