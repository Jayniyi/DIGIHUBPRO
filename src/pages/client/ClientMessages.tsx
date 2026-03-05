import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
  attachment?: string;
}

interface Conversation {
  id: number;
  name: string;
  category: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    id: 1, name: "Ads Team", category: "Ads", lastMessage: "Campaign performance report is attached.", time: "2 min ago", unread: true,
    messages: [
      { id: 1, sender: "Ads Team", content: "Hi John! Your Instagram Ad Campaign is now live.", time: "9:00 AM", isOwn: false },
      { id: 2, sender: "You", content: "Great! What's the expected reach?", time: "9:10 AM", isOwn: true },
      { id: 3, sender: "Ads Team", content: "We're targeting 50k–80k impressions in the first week. Campaign performance report is attached.", time: "9:15 AM", isOwn: false },
    ],
  },
  {
    id: 2, name: "Design Team", category: "Designs", lastMessage: "We've updated the logo colors as discussed.", time: "1 hour ago", unread: true,
    messages: [
      { id: 1, sender: "Design Team", content: "Hi! Your brand logo design is ready for review.", time: "Yesterday", isOwn: false },
      { id: 2, sender: "You", content: "Can we tweak the colors a bit? More navy and gold.", time: "Yesterday", isOwn: true },
      { id: 3, sender: "Design Team", content: "We've updated the logo colors as discussed.", time: "1 hour ago", isOwn: false },
    ],
  },
  {
    id: 3, name: "Web Dev Team", category: "Website", lastMessage: "Homepage wireframe is ready.", time: "Yesterday", unread: false,
    messages: [
      { id: 1, sender: "Web Dev Team", content: "Hello! We've started on your website redesign.", time: "2 days ago", isOwn: false },
      { id: 2, sender: "You", content: "Awesome, looking forward to the first draft.", time: "2 days ago", isOwn: true },
      { id: 3, sender: "Web Dev Team", content: "Homepage wireframe is ready. Please review and share feedback!", time: "Yesterday", isOwn: false },
    ],
  },
  {
    id: 4, name: "SEO & Google Business", category: "SEO", lastMessage: "Your Google Business Profile is now verified.", time: "3 days ago", unread: false,
    messages: [
      { id: 1, sender: "SEO Team", content: "We've submitted your Google Business Profile for verification.", time: "5 days ago", isOwn: false },
      { id: 2, sender: "SEO Team", content: "Your Google Business Profile is now verified. We'll start optimization this week.", time: "3 days ago", isOwn: false },
    ],
  },
  {
    id: 5, name: "General Support", category: "Support", lastMessage: "How can we help you today?", time: "1 week ago", unread: false,
    messages: [
      { id: 1, sender: "Support", content: "Welcome to DigiProHub! How can we help you today?", time: "1 week ago", isOwn: false },
    ],
  },
];

const categories = ["All", "Ads", "Designs", "Website", "SEO", "Support"];

const ClientMessages = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConvo, setActiveConvo] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const filtered = activeCategory === "All" ? conversations : conversations.filter(c => c.category === activeCategory);
  const currentConvo = conversations.find(c => c.id === activeConvo);

  const handleSend = () => {
    if (!newMessage.trim() || !activeConvo) return;
    setConversations(prev => prev.map(c => c.id === activeConvo ? {
      ...c,
      lastMessage: newMessage,
      time: "Just now",
      messages: [...c.messages, { id: Date.now(), sender: "You", content: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isOwn: true }],
    } : c));
    setNewMessage("");
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConvo) return;
    setConversations(prev => prev.map(c => c.id === activeConvo ? {
      ...c,
      lastMessage: `📎 ${file.name}`,
      time: "Just now",
      messages: [...c.messages, { id: Date.now(), sender: "You", content: `📎 Attached: ${file.name}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isOwn: true, attachment: file.name }],
    } : c));
    toast({ title: "File attached", description: `${file.name} sent successfully.` });
    e.target.value = "";
  };

  const showList = isMobile ? !activeConvo : true;
  const showChat = isMobile ? !!activeConvo : true;

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="client" />
      <main className="flex-1 flex">
        {showList && (
          <div className={`${isMobile ? 'w-full' : 'w-80'} border-r border-border bg-card flex flex-col`}>
            <div className="p-4 border-b border-border">
              <h2 className="font-heading font-semibold text-card-foreground mb-3">Messages</h2>
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
              {filtered.map(convo => (
                <button
                  key={convo.id}
                  onClick={() => { setActiveConvo(convo.id); setConversations(prev => prev.map(c => c.id === convo.id ? { ...c, unread: false } : c)); }}
                  className={`w-full text-left p-4 border-b border-border transition-colors ${
                    activeConvo === convo.id ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-card-foreground">{convo.name}</span>
                    <span className="text-xs text-muted-foreground">{convo.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground truncate flex-1">{convo.lastMessage}</p>
                    {convo.unread && <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />}
                  </div>
                  <span className="text-[10px] mt-1 inline-block px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{convo.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showChat && currentConvo && (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border bg-card flex items-center gap-3">
              {isMobile && (
                <button onClick={() => setActiveConvo(null)} className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h3 className="font-heading font-semibold text-card-foreground">{currentConvo.name}</h3>
                <span className="text-xs text-muted-foreground">{currentConvo.category}</span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {currentConvo.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-md rounded-xl px-4 py-3 ${
                    msg.isOwn ? "bg-secondary text-secondary-foreground" : "bg-muted text-foreground"
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.isOwn ? "text-secondary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center gap-2">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={handleAttachment}>
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
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

export default ClientMessages;
