
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { 
  Bell,
  Eye,
  Key,
  Lock,
  Save,
  Smartphone,
  UserCog
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    birthdayReminders: true,
    attendanceAlerts: true,
    newStudentAlerts: true
  });
  
  const [displaySettings, setDisplaySettings] = useState({
    darkMode: false,
    highContrast: false,
    largeText: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showPhone: true
  });
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would send this data to an API
    console.log("Password change requested");
    
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully"
    });
    
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };
  
  const handleToggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleToggleDisplay = (key: keyof typeof displaySettings) => {
    setDisplaySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleTogglePrivacy = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleSaveSettings = (type: string) => {
    // In a real app, we would send this data to an API
    console.log(`${type} settings saved`, {
      notificationSettings,
      displaySettings,
      privacySettings
    });
    
    toast({
      title: "Settings saved",
      description: `Your ${type} settings have been updated`
    });
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Account Settings" 
        description="Manage your account preferences" 
      />
      
      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full md:w-auto">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>
                Update your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Change Password
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    
                    <Button onClick={handleChangePassword}>
                      Change Password
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Login Sessions</h3>
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Started 2 hours ago · Chrome on Windows</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100">Active</Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="mt-4">
                    Log Out Of All Devices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notification Settings</CardTitle>
              </div>
              <CardDescription>
                Choose when and how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotif">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="emailNotif"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={() => handleToggleNotification("emailNotifications")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pushNotif">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                      </div>
                      <Switch
                        id="pushNotif"
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={() => handleToggleNotification("pushNotifications")}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="birthdayReminders">Birthday Reminders</Label>
                        <p className="text-sm text-muted-foreground">Notify me about upcoming student birthdays</p>
                      </div>
                      <Switch
                        id="birthdayReminders"
                        checked={notificationSettings.birthdayReminders}
                        onCheckedChange={() => handleToggleNotification("birthdayReminders")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="attendanceAlerts">Attendance Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notify me about missed attendance</p>
                      </div>
                      <Switch
                        id="attendanceAlerts"
                        checked={notificationSettings.attendanceAlerts}
                        onCheckedChange={() => handleToggleNotification("attendanceAlerts")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="newStudentAlerts">New Student Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notify me when new students join my class</p>
                      </div>
                      <Switch
                        id="newStudentAlerts"
                        checked={notificationSettings.newStudentAlerts}
                        onCheckedChange={() => handleToggleNotification("newStudentAlerts")}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveSettings("notification")}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Notification Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <CardTitle>Display Settings</CardTitle>
              </div>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Use dark theme throughout the application</p>
                    </div>
                    <Switch
                      id="darkMode"
                      checked={displaySettings.darkMode}
                      onCheckedChange={() => handleToggleDisplay("darkMode")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="highContrast">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                    </div>
                    <Switch
                      id="highContrast"
                      checked={displaySettings.highContrast}
                      onCheckedChange={() => handleToggleDisplay("highContrast")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="largeText">Large Text</Label>
                      <p className="text-sm text-muted-foreground">Increase text size throughout the application</p>
                    </div>
                    <Switch
                      id="largeText"
                      checked={displaySettings.largeText}
                      onCheckedChange={() => handleToggleDisplay("largeText")}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveSettings("display")}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Display Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                <CardTitle>Privacy Settings</CardTitle>
              </div>
              <CardDescription>
                Control what information is visible to others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information Visibility</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showEmail">Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">Allow other teachers to see your email</p>
                    </div>
                    <Switch
                      id="showEmail"
                      checked={privacySettings.showEmail}
                      onCheckedChange={() => handleTogglePrivacy("showEmail")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showPhone">Show Phone Number</Label>
                      <p className="text-sm text-muted-foreground">Allow other teachers to see your phone number</p>
                    </div>
                    <Switch
                      id="showPhone"
                      checked={privacySettings.showPhone}
                      onCheckedChange={() => handleTogglePrivacy("showPhone")}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveSettings("privacy")}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Privacy Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                <CardTitle>Advanced Settings</CardTitle>
              </div>
              <CardDescription>
                Additional configuration options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Advanced settings are currently unavailable.</p>
                
                {user?.role === "admin" && (
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Administrator Tools</h3>
                    <Button variant="outline" className="mr-2">Data Export</Button>
                    <Button variant="outline">System Logs</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
