import { useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useChurchScope } from "@/hooks/use-church-scope";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, RefreshCw, X, Check } from "lucide-react";
import { api } from "@/lib/api";

export default function NewStudentPage() {
  const navigate = useNavigate();
  const { classes } = useChurchScope();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    guardianName: "",
    guardianContact: "",
    classId: "",
    allergies: "",
    notes: "",
    avatar: ""
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.createStudent({
        class_id: formData.classId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        guardian_name: formData.guardianName,
        guardian_contact: formData.guardianContact,
        gender: formData.gender as "male" | "female" | "other" | undefined,
        allergies: formData.allergies || undefined,
        notes: formData.notes || undefined,
        avatar_url: formData.avatar || undefined,
      });
      toast({
        title: "Student added successfully",
        description: `${formData.firstName} ${formData.lastName} has been added.`
      });
      navigate("/admin/students");
    } catch (error) {
      toast({
        title: "Unable to add student",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Add New Student"
        description="Register a new child to the system"
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
                <AvatarImage src={preview || formData.avatar} alt="Student avatar" />
                <AvatarFallback className="text-2xl">
                  {formData.firstName && formData.lastName
                    ? `${formData.firstName[0]}${formData.lastName[0]}`
                    : "??"
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
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianContact">Guardian Contact</Label>
                <Input
                  id="guardianContact"
                  name="guardianContact"
                  value={formData.guardianContact}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select name="classId" value={formData.classId} onValueChange={(value) => handleSelectChange("classId", value)}>
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies (optional)</Label>
              <Textarea
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="List any allergies or health concerns"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any other important information"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/students")}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="hover:bg-[#FFC107] hover:text-black transition-colors"
              >
                Add Student
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
}
