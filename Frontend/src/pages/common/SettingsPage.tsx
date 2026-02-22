import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Bell, Eye, Key, Lock, Save, Smartphone, UserCog } from "lucide-react";
import { api } from "@/lib/api";
import { LogoLoader } from "@/components/common/LogoLoader";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [notificationSettings, setNotificationSettings] = useState({ emailNotifications: true, pushNotifications: false, birthdayReminders: true, attendanceAlerts: true, newStudentAlerts: true });
  const [displaySettings, setDisplaySettings] = useState({ darkMode: false, highContrast: false, largeText: false });
  const [privacySettings, setPrivacySettings] = useState({ showEmail: false, showPhone: true });

  useEffect(() => {
    api.getSettings().then((settings) => {
      setNotificationSettings((prev) => ({ ...prev, ...(settings.notifications as typeof prev) }));
      setDisplaySettings((prev) => ({ ...prev, ...(settings.display as typeof prev) }));
      setPrivacySettings((prev) => ({ ...prev, ...(settings.privacy as typeof prev) }));
    }).finally(() => setLoading(false));
  }, []);

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return toast({ title: "Passwords don't match", variant: "destructive" });
    await api.changePassword({ current_password: passwordForm.currentPassword, new_password: passwordForm.newPassword });
    toast({ title: "Password changed", description: "Your password has been updated." });
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const saveSection = async (section: "notifications" | "display" | "privacy", payload: Record<string, boolean>) => {
    await api.updateSettings(section, payload);
    toast({ title: "Settings saved", description: `${section} updated.` });
  };

  if (loading) return <Layout><LogoLoader label="Loading settings..." /></Layout>;

  return (
    <Layout>
      <PageHeader title="Account Settings" description="Manage your account preferences" />
      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full md:w-auto">
          <TabsTrigger value="security">Security</TabsTrigger><TabsTrigger value="notifications">Notifications</TabsTrigger><TabsTrigger value="display">Display</TabsTrigger><TabsTrigger value="privacy">Privacy</TabsTrigger><TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="security"><Card><CardHeader><div className="flex items-center gap-2"><Lock className="h-5 w-5" /><CardTitle>Security Settings</CardTitle></div><CardDescription>Update your password and security preferences</CardDescription></CardHeader><CardContent><div className="grid grid-cols-1 gap-4 max-w-md"><div className="space-y-2"><Label>Current Password</Label><Input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} /></div><div className="space-y-2"><Label>New Password</Label><Input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} /></div><div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))} /></div><Button onClick={handleChangePassword}><Key className="mr-2 h-4 w-4" />Change Password</Button></div></CardContent></Card></TabsContent>

        <TabsContent value="notifications"><Card><CardHeader><div className="flex items-center gap-2"><Bell className="h-5 w-5" /><CardTitle>Notification Settings</CardTitle></div></CardHeader><CardContent className="space-y-4">{Object.entries(notificationSettings).map(([k, v]) => <div key={k} className="flex items-center justify-between"><Label>{k}</Label><Switch checked={v} onCheckedChange={() => setNotificationSettings((p) => ({ ...p, [k]: !p[k as keyof typeof p] }))} /></div>)}<Button onClick={() => saveSection("notifications", notificationSettings)}><Save className="mr-2 h-4 w-4" />Save Notification Settings</Button></CardContent></Card></TabsContent>

        <TabsContent value="display"><Card><CardHeader><div className="flex items-center gap-2"><Eye className="h-5 w-5" /><CardTitle>Display Settings</CardTitle></div></CardHeader><CardContent className="space-y-4">{Object.entries(displaySettings).map(([k, v]) => <div key={k} className="flex items-center justify-between"><Label>{k}</Label><Switch checked={v} onCheckedChange={() => setDisplaySettings((p) => ({ ...p, [k]: !p[k as keyof typeof p] }))} /></div>)}<Button onClick={() => saveSection("display", displaySettings)}><Save className="mr-2 h-4 w-4" />Save Display Settings</Button></CardContent></Card></TabsContent>

        <TabsContent value="privacy"><Card><CardHeader><div className="flex items-center gap-2"><UserCog className="h-5 w-5" /><CardTitle>Privacy Settings</CardTitle></div></CardHeader><CardContent className="space-y-4">{Object.entries(privacySettings).map(([k, v]) => <div key={k} className="flex items-center justify-between"><Label>{k}</Label><Switch checked={v} onCheckedChange={() => setPrivacySettings((p) => ({ ...p, [k]: !p[k as keyof typeof p] }))} /></div>)}<Button onClick={() => saveSection("privacy", privacySettings)}><Save className="mr-2 h-4 w-4" />Save Privacy Settings</Button></CardContent></Card></TabsContent>

        <TabsContent value="advanced"><Card><CardHeader><div className="flex items-center gap-2"><Smartphone className="h-5 w-5" /><CardTitle>Advanced Settings</CardTitle></div></CardHeader><CardContent><p className="text-sm text-muted-foreground">Advanced settings are stored server-side via the settings endpoint.</p>{user?.role === "admin" && <Button className="mt-4" onClick={() => api.updateSettings("advanced", { exportedAt: new Date().toISOString() }).then(() => toast({ title: "Advanced setting saved" }))}>Save Advanced Sample</Button>}</CardContent></Card></TabsContent>
      </Tabs>
    </Layout>
  );
}
