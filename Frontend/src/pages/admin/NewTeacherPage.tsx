import { useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, RefreshCw, X, Check } from "lucide-react";
import { api } from "@/lib/api";

export default function NewTeacherPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    bio: "",
    avatar: "",
    dateOfBirth: ""
  });

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera modal state
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [captured, setCaptured] = useState(false);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Open camera modal
  const handleCapture = async () => {
    setShowCamera(true);
    setCaptured(false);
    if (navigator.mediaDevices?.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } else {
      alert("Camera not supported on this device.");
    }
  };

  // Take photo from camera
  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      setPreview(dataUrl);
      setFormData(prev => ({ ...prev, avatar: dataUrl }));
      setCaptured(true);
      // Pause the video stream
      videoRef.current.pause();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Retake photo
  const retakePhoto = async () => {
    setCaptured(false);
    setPreview(null);
    if (navigator.mediaDevices?.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    }
  };

  // Cancel camera modal
  const cancelCamera = () => {
    setShowCamera(false);
    setCaptured(false);
    setPreview(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.password || formData.password.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same",
        variant: "destructive"
      });
      return;
    }

    try {
      await api.createTeacher({
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        date_of_birth: formData.dateOfBirth || undefined,
        password: formData.password,
      });

      toast({
        title: "Teacher added successfully",
        description: `${formData.name} has been added as a new teacher.`
      });

      navigate("/admin/teachers");
    } catch (error) {
      toast({
        title: "Unable to add teacher",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Add New Teacher"
        description="Register a new teacher account"
      />

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex flex-col items-center relative">
            {!captured ? (
              <>
                <video
                  ref={videoRef}
                  className="rounded-lg mb-4"
                  style={{ width: 320, height: 240, background: "#222" }}
                  autoPlay
                  playsInline
                />
                <div className="flex gap-4">
                  <Button onClick={takePhoto} className="bg-[#040273] hover:bg-[#FFC107] text-white hover:text-black" title="Capture">
                    <Camera className="mr-2" /> Capture
                  </Button>
                  <Button onClick={cancelCamera} variant="outline" title="Cancel">
                    <X className="mr-2" /> Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <img src={preview!} alt="Captured" className="rounded-lg mb-4" style={{ width: 320, height: 240, objectFit: "cover" }} />
                <div className="flex gap-4">
                  <Button onClick={retakePhoto} className="bg-[#040273] hover:bg-[#FFC107] text-white hover:text-black" title="Retake">
                    <RefreshCw className="mr-2" /> Retake
                  </Button>
                  <Button onClick={cancelCamera} variant="outline" title="Cancel">
                    <X className="mr-2" /> Cancel
                  </Button>
                  <Button onClick={() => setShowCamera(false)} className="bg-green-600 hover:bg-green-700 text-white" title="Use Photo">
                    <Check className="mr-2" /> Use Photo
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-4 gap-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src={preview || formData.avatar} alt="Teacher avatar" />
                <AvatarFallback className="text-2xl">
                  {formData.name
                    ? formData.name.charAt(0)
                    : "T"
                  }
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2 mt-2">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCapture}
                >
                  Take Photo
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biography (optional)</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Experience, qualifications, teaching style, etc."
                className="min-h-32"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/teachers")}>
                Cancel
              </Button>
              <Button type="submit" className="hover:bg-[#FFC107] hover:text-black transition-colors">
                Add Teacher
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}
