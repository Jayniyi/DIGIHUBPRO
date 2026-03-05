import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Paperclip, ImageIcon } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: number; sender: string; content: string; time: string; isClient: boolean; hasImage?: boolean;
}

interface Thread {
  id: number; client: string; category: string; lastMessage: string; time: string; unread: boolean; messages: Message[];
}

const initialThreads: Thread[] = [
  {
    id: 1, client: "Adebayo Fashions", category: "Ads", lastMessage: "Can we increase the ad budget?", time: "5 min ago", unread: true,
    messages: [
      { id: 1, sender: "Adebayo", content: "Hi, the Instagram campaign is doing great!", time: "10:00 AM", isClient: true },
      { id: 2, sender: "Admin", content: "Glad to hear! We're seeing 3x ROAS.", time: "10:05 AM", isClient: false },
      { id: 3, sender: "Adebayo", content: "Can we increase the ad budget?", time: "10:10 AM", isClient: true },
    ],
  },
  {
    id: 2, client: "Lagos Eats", category: "Designs", lastMessage: "Here's a screenshot of what I need", time: "1 hour ago", unread: true,
    messages: [
      { id: 1, sender: "Chioma", content: "I need a menu flyer for our new branch.", time: "9:00 AM", isClient: true },
      { id: 2, sender: "Chioma", content: "Here's a screenshot of what I need", time: "9:05 AM", isClient: true, hasImage: true },
    ],
  },
  {
    id: 3, client: "TechNaija Solutions", category: "Website", lastMessage: "When will the website be ready?", time: "Yesterday", unread: false,
    messages: [
      { id: 1, sender: "Emeka", content: "When will the website be ready?", time: "Yesterday", isClient: true },
      { id: 2, sender: "Admin", content: "We're on track for delivery by Feb 15th.", time: "Yesterday", isClient: false },
    ],
  },
  {
    id: 4, client: "NaijaFit Gym", category: "Support", lastMessage: "How do I update my profile?", time: "2 days ago", unread: false,
    messages: [
      { id: 1, sender: "Blessing", content: "How do I update my profile?", time: "2 days ago", isClient: true },
      { id: 2, sender: "Admin", content: "Go to Settings > Profile, you can update everything there.", time: "2 days ago", isClient: false },
    ],
  },
  {
    id: 5, client: "Abuja Properties", category: "SEO", lastMessage: "Google Business listing looks great!", time: "3 days ago", unread: false,
    messages: [
      { id: 1, sender: "Hassan", content: "Google Business listing looks great! Thanks team.", time: "3 days ago", isClient: true },
    ],
  },
];

const categories = ["All", "Ads", "Designs", "Website", "SEO", "Support"];

const AdminMessages = () => {
  const [threads, setThreads] = useState(initialThreads);
  const [activeThread, setActiveThread] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const isMobile = useIsMobile();

  const filtered = activeCategory === "All" ? threads : threads.filter(t => t.category === activeCategory);
  const currentThread = threads.find(t => t.id === activeThread);

  const handleSend = () => {
    if (!newMessage.trim() || !activeThread) return;
    setThreads(prev => prev.map(t => t.id === activeThread ? {
      ...t,
      lastMessage: newMessage,
      time: "Just now",
      messages: [...t.messages, { id: Date.now(), sender: "Admin", content: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isClient: false }],
    } : t));
    setNewMessage("");
  };

  const showList = isMobile ? !activeThread : true;
  const showChat = isMobile ? !!activeThread : true;

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="admin" />
      <main className="flex-1 flex">
        {showList && (
          <div className={`${isMobile ? 'w-full' : 'w-80'} border-r border-border bg-card flex flex-col`}>
            <div className="p-4 border-b border-border">
              <h2 className="font-heading font-semibold text-card-foreground mb-3">Client Messages</h2>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.map(thread => (
                <button
                  key={thread.id}
                  onClick={() => { setActiveThread(thread.id); setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unread: false } : t)); }}
                  className={`w-full text-left p-4 border-b border-border transition-colors ${activeThread === thread.id ? "bg-muted" : "hover:bg-muted/50"}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-card-foreground">{thread.client}</span>
                    <span className="text-xs text-muted-foreground">{thread.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground truncate flex-1">{thread.lastMessage}</p>
                    {thread.unread && <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />}
                  </div>
                  <span className="text-[10px] mt-1 inline-block px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{thread.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showChat && currentThread && (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border bg-card flex items-center gap-3">
              {isMobile && (
                <button onClick={() => setActiveThread(null)} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h3 className="font-heading font-semibold text-card-foreground">{currentThread.client}</h3>
                <span className="text-xs text-muted-foreground">{currentThread.category}</span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {currentThread.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isClient ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-md rounded-xl px-4 py-3 ${msg.isClient ? "bg-muted text-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    <p className="text-xs font-medium mb-1">{msg.sender}</p>
                    <p className="text-sm">{msg.content}</p>
                    {msg.hasImage && (
                      <div className="mt-2 p-3 rounded-lg bg-background/20 flex items-center gap-2 text-xs">
                        <ImageIcon className="w-4 h-4" /> <span>screenshot.png (attached)</span>
                      </div>
                    )}
                    <p className={`text-xs mt-1 ${msg.isClient ? "text-muted-foreground" : "text-secondary-foreground/60"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Reply to client..."
                  className="flex-1"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <Button variant="secondary" size="icon" onClick={handleSend}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMessages;
