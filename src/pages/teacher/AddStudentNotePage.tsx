
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { mockStudents } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

const noteCategories = ["Behavior", "Academic", "Social", "Special Needs", "Parent Communication", "General"];

export default function AddStudentNotePage() {
  const { id } = useParams<{ id: string }>();
  const [noteCategory, setNoteCategory] = useState("");
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();
  
  const student = mockStudents.find(s => s.id === id);
  
  if (!student) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
          <p className="text-muted-foreground mb-6">The student you are looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/teacher/students">Back to Students</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const fullName = `${student.firstName} ${student.lastName}`;
  
  const handleSubmit = () => {
    if (!noteCategory || !title || !content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Note added for:', fullName);
    console.log('Date:', date);
    console.log('Category:', noteCategory);
    console.log('Title:', title);
    console.log('Content:', content);
    
    toast({
      title: "Note Added",
      description: `Successfully added note for ${fullName}`,
    });
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link 
          to={`/student/${id}`} 
          className="text-muted-foreground hover:text-foreground flex items-center text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Student Profile
        </Link>
      </div>
      
      <PageHeader 
        title="Add Note" 
        description={`Add a teacher note for ${fullName}`}
      />
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage 
                  src={student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}`}
                  alt={fullName}
                />
                <AvatarFallback className="text-lg">
                  {student.firstName[0]}{student.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{fullName}</h2>
                <p className="text-muted-foreground">
                  {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()} years old
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Note Category</label>
                <Select value={noteCategory} onValueChange={setNoteCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select note category" />
                  </SelectTrigger>
                  <SelectContent>
                    {noteCategories.map(category => (
                      <SelectItem key={category} value={category.toLowerCase().replace(' ', '-')}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input 
                  placeholder="Enter note title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Note Content</label>
                <Textarea 
                  placeholder="Write your note here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                  <Link to={`/student/${id}`}>Cancel</Link>
                </Button>
                <Button onClick={handleSubmit}>Save Note</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
