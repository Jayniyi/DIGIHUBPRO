import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import { FileText, Clock, CheckCircle, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../context/AuthContext"; // relative import to avoid alias issues

interface Project {
  id: number; name: string; service: string; status: string; date: string;
}

const services = ["Website Development", "Digital Ads", "Branding", "Google Business", "SEO", "Social Media Management", "Flyer & Graphics"];

const initialProjects: Project[] = [
  { id: 1, name: "Website Redesign", service: "Website Development", status: "In Progress", date: "2026-02-20" },
  { id: 2, name: "Instagram Ad Campaign", service: "Digital Ads", status: "Review", date: "2026-02-18" },
  { id: 3, name: "Brand Logo Design", service: "Branding", status: "Completed", date: "2026-02-10" },
  { id: 4, name: "Google Business Setup", service: "Google Business", status: "Pending", date: "2026-02-22" },
];

const statusColor: Record<string, string> = {
  Pending: "bg-warning/15 text-warning border-warning/30",
  "In Progress": "bg-info/15 text-info border-info/30",
  Review: "bg-secondary/15 text-secondary border-secondary/30",
  Completed: "bg-success/15 text-success border-success/30",
};

const ClientDashboard = () => {
  const { user } = useAuth();
  if (!user) {
    // shouldn't happen; RequireAuth should redirect, but guard anyway
    return null;
  }
  const displayName = user.businessName || user.fullName || "";
  const [projects, setProjects] = useState(initialProjects);
  const [requestOpen, setRequestOpen] = useState(false);
  const [form, setForm] = useState({ name: "", service: "", description: "" });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!form.name || !form.service) return;
    setProjects(prev => [{ id: Date.now(), name: form.name, service: form.service, status: "Pending", date: new Date().toISOString().split("T")[0] }, ...prev]);
    setForm({ name: "", service: "", description: "" });
    setRequestOpen(false);
    toast({ title: "Request Submitted", description: "Your project request has been sent for review." });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="client" />
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Welcome back{displayName ? `, ${displayName}` : ""} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here's an overview of your digital projects.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Projects" value={String(projects.length)} icon={FileText} />
          <StatsCard title="In Progress" value={String(projects.filter(p => p.status === "In Progress").length)} icon={Clock} />
          <StatsCard title="Completed" value={String(projects.filter(p => p.status === "Completed").length)} icon={CheckCircle} />
          <StatsCard title="Messages" value="3" subtitle="2 unread" icon={MessageSquare} />
        </div>

        <div className="bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-heading font-semibold text-lg text-card-foreground">Recent Projects</h2>
            <Button variant="secondary" size="sm" className="gap-2" onClick={() => setRequestOpen(true)}>
              <Plus className="w-4 h-4" /> New Request
            </Button>
          </div>
          <div className="divide-y divide-border">
            {projects.map(project => (
              <div key={project.id} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium text-card-foreground">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{project.service}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground hidden sm:block">{project.date}</span>
                  <Badge variant="outline" className={statusColor[project.status]}>{project.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit a New Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Project Name</label>
                <Input placeholder="e.g. New Website for my store" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Service Type</label>
                <Select value={form.service} onValueChange={v => setForm(f => ({ ...f, service: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                  <SelectContent>
                    {services.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
                <Textarea placeholder="Describe what you need..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <Button className="w-full" onClick={handleSubmit}>Submit Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default ClientDashboard;
