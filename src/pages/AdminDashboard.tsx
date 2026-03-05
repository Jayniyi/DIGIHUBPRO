import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import { Users, FileText, Megaphone, TrendingUp, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext"; // add missing import

const leads = [
  { id: 1, name: "Adebayo Fashions", contact: "Adebayo Olanrewaju", stage: "New", service: "Website + Ads" },
  { id: 2, name: "Lagos Eats", contact: "Chioma Eze", stage: "Contacted", service: "Full Package" },
  { id: 3, name: "TechNaija Solutions", contact: "Emeka Obi", stage: "Qualified", service: "SEO + Google Business" },
  { id: 4, name: "Abuja Properties", contact: "Hassan Musa", stage: "Converted", service: "Website + Branding" },
];

const stageColor: Record<string, string> = {
  New: "bg-info/15 text-info border-info/30",
  Contacted: "bg-warning/15 text-warning border-warning/30",
  Qualified: "bg-secondary/15 text-secondary border-secondary/30",
  Converted: "bg-success/15 text-success border-success/30",
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const displayName = user?.businessName || user?.fullName || "";
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="admin" />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Admin Overview{displayName ? ` — ${displayName}` : ""}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Platform performance and pipeline at a glance.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatsCard title="Total Clients" value="42" icon={Users} />
          <StatsCard title="Active Projects" value="18" icon={FileText} />
          <StatsCard title="Ad Campaigns" value="12" icon={Megaphone} />
          <StatsCard title="Pipeline Leads" value="27" icon={Target} />
          <StatsCard title="Revenue (MTD)" value="₦4.2M" icon={TrendingUp} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* CRM Pipeline */}
          <div className="bg-card rounded-xl border border-border">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-heading font-semibold text-lg text-card-foreground">CRM Pipeline</h2>
              <Button variant="secondary" size="sm">View All</Button>
            </div>
            <div className="divide-y divide-border">
              {leads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-card-foreground">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.contact} · {lead.service}</p>
                  </div>
                  <Badge variant="outline" className={stageColor[lead.stage]}>{lead.stage}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl border border-border">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-heading font-semibold text-lg text-card-foreground">Recent Activity</h2>
            </div>
            <div className="p-5 space-y-4">
              {[
                { text: "New lead from landing page — Adebayo Fashions", time: "2 hours ago" },
                { text: "Instagram Ad Campaign completed for Lagos Eats", time: "5 hours ago" },
                { text: "Flyer design approved by TechNaija Solutions", time: "1 day ago" },
                { text: "New staff member added — Amina Ibrahim (Designer)", time: "2 days ago" },
                { text: "Website project delivered to Abuja Properties", time: "3 days ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-card-foreground">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
