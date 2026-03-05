import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: number; name: string; contact: string; email: string; industry: string; status: string; projects: number; joined: string;
}

const initialClients: Client[] = [
  { id: 1, name: "Adebayo Fashions", contact: "Adebayo Olanrewaju", email: "adebayo@fashions.ng", industry: "Fashion", status: "Active", projects: 3, joined: "2023-11-15" },
  { id: 2, name: "Lagos Eats", contact: "Chioma Eze", email: "chioma@lagoseats.ng", industry: "Food & Beverage", status: "Active", projects: 2, joined: "2023-12-01" },
  { id: 3, name: "TechNaija Solutions", contact: "Emeka Obi", email: "emeka@technaija.ng", industry: "Technology", status: "Active", projects: 1, joined: "2024-01-05" },
  { id: 4, name: "Abuja Properties", contact: "Hassan Musa", email: "hassan@abujaprops.ng", industry: "Real Estate", status: "Suspended", projects: 1, joined: "2023-10-20" },
  { id: 5, name: "NaijaFit Gym", contact: "Blessing Ade", email: "blessing@naijafit.ng", industry: "Health & Fitness", status: "Active", projects: 0, joined: "2024-01-16" },
];

const statusColor: Record<string, string> = { Active: "bg-success/15 text-success border-success/30", Suspended: "bg-destructive/15 text-destructive border-destructive/30" };

const AdminClients = () => {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", email: "", industry: "" });
  const { toast } = useToast();

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.name || !form.contact) return;
    setClients(prev => [{ id: Date.now(), ...form, status: "Active", projects: 0, joined: new Date().toISOString().split("T")[0] }, ...prev]);
    setForm({ name: "", contact: "", email: "", industry: "" });
    setAddOpen(false);
    toast({ title: "Client Added", description: `${form.name} has been added.` });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="admin" />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage all client accounts and profiles.</p>
          </div>
          <Button className="gap-2" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4" /> Add Client</Button>
        </div>

        <div className="mb-6 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="hidden md:table-cell">Industry</TableHead>
                <TableHead className="hidden md:table-cell">Projects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(client => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium text-card-foreground">{client.name}</TableCell>
                  <TableCell className="text-muted-foreground">{client.contact}</TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{client.industry}</TableCell>
                  <TableCell className="text-card-foreground hidden md:table-cell">{client.projects}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColor[client.status]}>{client.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground hidden lg:table-cell">{client.joined}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => setViewClient(client)}><Eye className="w-4 h-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={!!viewClient} onOpenChange={() => setViewClient(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{viewClient?.name}</DialogTitle></DialogHeader>
            {viewClient && (
              <div className="space-y-3 text-sm mt-2">
                <Badge variant="outline" className={statusColor[viewClient.status]}>{viewClient.status}</Badge>
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-muted-foreground">Contact:</span> <span className="text-foreground">{viewClient.contact}</span></div>
                  <div><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{viewClient.email}</span></div>
                  <div><span className="text-muted-foreground">Industry:</span> <span className="text-foreground">{viewClient.industry}</span></div>
                  <div><span className="text-muted-foreground">Projects:</span> <span className="text-foreground">{viewClient.projects}</span></div>
                  <div><span className="text-muted-foreground">Joined:</span> <span className="text-foreground">{viewClient.joined}</span></div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Client</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Input placeholder="Business Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Contact Person" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
              <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              <Input placeholder="Industry" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
              <Button className="w-full" onClick={handleAdd}>Add Client</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminClients;
