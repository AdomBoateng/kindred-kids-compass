import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Settings } from "lucide-react";
import { useChurchScope } from "@/hooks/use-church-scope";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { LogoLoader } from "@/components/common/LogoLoader";

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { classes, isLoading } = useChurchScope();
  const filtered = useMemo(() => classes.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())), [classes, searchTerm]);

  const onDelete = async (id: string, name: string) => {
    await api.deleteClass(id);
    toast({ title: "Class Deleted", description: `${name} removed.` });
    window.location.reload();
  };

  if (isLoading) return <Layout><LogoLoader label="Loading classes..." /></Layout>;

  return <Layout><PageHeader title="Classes" description="Manage classes" /><div className="flex justify-between mb-4"><Input placeholder="Search classes" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-full max-w-sm" /><Button asChild><Link to="/admin/classes/new"><Plus className="mr-2 h-4 w-4" />Create Class</Link></Button></div><div className="grid gap-4 md:grid-cols-2">{filtered.map((c)=><Card key={c.id} className="border-0 shadow-xl bg-[#040273] hover:bg-[#FFC107] transition-colors duration-200 text-white hover:text-black"><CardContent className="pt-6 flex items-center justify-between"><div><p className="font-medium">{c.name}</p><p className="text-sm text-muted-foreground">{c.ageGroup}</p></div><div className="flex gap-2"><Button size="icon" variant="ghost" asChild><Link to={`/admin/classes/${c.id}`}><Settings className="h-4 w-4" /></Link></Button><Button size="icon" variant="ghost" onClick={()=>onDelete(c.id,c.name)}><Trash2 className="h-4 w-4" /></Button></div></CardContent></Card>)}</div></Layout>;
}
