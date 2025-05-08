
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Edit, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    avatar: user?.avatar || ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    // In a real app, we would send this data to an API
    console.log("Updated profile:", profile);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved."
    });
    
    setIsEditing(false);
  };
  
  return (
    <Layout>
      <PageHeader 
        title="My Profile" 
        description="View and edit your account information"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-lg">{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{profile.name}</CardTitle>
              <CardDescription className="capitalize">{user?.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
                {profile.phone && (
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{profile.phone}</p>
                  </div>
                )}
                {!isEditing && (
                  <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Profile" : "Profile Information"}</CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Update your personal information" 
                  : "Your personal details and information"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Profile Picture URL</Label>
                      <Input
                        id="avatar"
                        name="avatar"
                        value={profile.avatar}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      rows={6}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {profile.bio ? (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Biography</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No biography provided.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {!isEditing && user?.role === "teacher" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Teaching Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Classes</h3>
                    <p className="text-sm text-muted-foreground">Preschool, Elementary</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Students</h3>
                    <p className="text-sm text-muted-foreground">15 students</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Responsibilities</h3>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      <li>Lead Sunday school classes</li>
                      <li>Track attendance and performance</li>
                      <li>Communicate with parents</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
