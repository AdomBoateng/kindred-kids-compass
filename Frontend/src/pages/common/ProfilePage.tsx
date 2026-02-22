import { useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) return toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
    const res = await api.uploadMyAvatar(file);
    setAvatar(res.avatar_url);
    await api.updateMe({ avatar_url: res.avatar_url });
    toast({ title: "Profile photo updated" });
  };

  const saveProfile = async () => {
    await api.updateMe({ full_name: name, phone, avatar_url: avatar || undefined });
    toast({ title: "Profile saved" });
  };

  return (
    <Layout>
      <PageHeader title="My Profile" description="Update your profile information" />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile Photo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Avatar className="h-24 w-24"><AvatarImage src={avatar} /><AvatarFallback>{name?.charAt(0) || "U"}</AvatarFallback></Avatar>
            <input type="file" accept="image/*" capture="environment" ref={fileRef} className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => fileRef.current?.click()}>Upload Photo</Button>
              <Button variant="outline" onClick={() => fileRef.current?.click()}>Take Photo</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Email</Label><Input value={user?.email || ""} disabled /></div>
            <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <Button onClick={saveProfile}>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
