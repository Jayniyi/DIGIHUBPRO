import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: number; name: string; client: string; type: string; assignedTo: string; status: string; priority: string; deadline: string;
}

const initialProjects: Project[] = [
  { id: 1, name: "E-commerce Website", client: "Adebayo Fashions", type: "Website Development", assignedTo: "Amina Ibrahim", status: "In Progress", priority: "High", deadline: "2024-02-15" },
  { id: 2, name: "Instagram Ad Campaign", client: "Lagos Eats", type: "Ads Management", assignedTo: "Tunde Bakare", status: "In Progress", priority: "Medium", deadline: "2024-02-01" },
  { id: 3, name: "Brand Identity Package", client: "TechNaija Solutions", type: "Branding", assignedTo: "Amina Ibrahim", status: "Review", priority: "Medium", deadline: "2024-01-30" },
  { id: 4, name: "Corporate Website", client: "Abuja Properties", type: "Website Development", assignedTo: "Kola Adeyemi", status: "Completed", priority: "High", deadline: "2024-01-20" },
  { id: 5, name: "Promo Flyer Series", client: "NaijaFit Gym", type: "Flyer Design", assignedTo: "Amina Ibrahim", status: "Pending", priority: "Low", deadline: "2024-02-20" },
];

const statusColor: Record<string, string> = { Pending: "bg-muted text-muted-foreground border-border", "In Progress": "bg-info/15 text-info border-info/30", Review: "bg-warning/15 text-warning border-warning/30", Completed: "bg-success/15 text-success border-success/30" };
const priorityColor: Record<string, string> = { Low: "bg-muted text-muted-foreground", Medium: "bg-warning/15 text-warning", High: "bg-destructive/15 text-destructive" };

const AdminProjects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", client: "", type: "", assignedTo: "", priority: "", deadline: "" });
  const { toast } = useToast();

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.name || !form.client) return;
    setProjects(prev => [{ id: Date.now(), ...form, status: "Pending" }, ...prev]);
    setForm({ name: "", client: "", type: "", assignedTo: "", priority: "", deadline: "" });
    setAddOpen(false);
    toast({ title: "Project Created" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="admin" />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground text-sm mt-1">Track and manage all client projects.</p>
          </div>
          <Button className="gap-2" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4" /> New Project</Button>
        </div>

        <div className="mb-6 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(project => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium text-card-foreground">{project.name}</TableCell>
                  <TableCell className="text-muted-foreground">{project.client}</TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{project.type}</TableCell>
                  <TableCell className="text-card-foreground hidden lg:table-cell">{project.assignedTo}</TableCell>
                  <TableCell><Badge variant="outline" className={priorityColor[project.priority]}>{project.priority}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={statusColor[project.status]}>{project.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{project.deadline}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Input placeholder="Project Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Client" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} />
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue placeholder="Project Type" /></SelectTrigger>
                <SelectContent>
                  {["Website Development", "Ads Management", "Branding", "Flyer Design", "SEO", "Social Media"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input placeholder="Assign To" value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} />
              <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  {["Low", "Medium", "High"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
              <Button className="w-full" onClick={handleAdd}>Create Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminProjects;
