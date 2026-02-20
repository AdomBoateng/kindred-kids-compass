import { Student } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { calculateAge } from "@/lib/date-utils";
import { FileEdit } from "lucide-react";

interface StudentCardProps {
  student: Student;
  classInfo?: {
    id: string;
    name: string;
  };
  onEdit?: () => void;
}

export function StudentCard({ student, classInfo, onEdit }: StudentCardProps) {
  const fullName = `${student.firstName} ${student.lastName}`;
  const age = calculateAge(student.dateOfBirth);
  const isBirthdaySoon = isUpcomingBirthday(student.dateOfBirth);
  
  return (
    <Card
      className="bg-[#040273] hover:bg-[#FFC107] transition-colors duration-200 card-hover overflow-hidden h-full group"
    >
      <div className="relative">
        {isBirthdaySoon && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            Birthday Soon!
          </div>
        )}
        <div className="h-24 bg-gradient-to-r from-primary/30 to-secondary/30" />
      </div>
      <CardContent className="pt-6 flex flex-col h-[calc(100%-6rem)]">
        <div className="flex justify-center -mt-12 mb-4">
          <Avatar className="h-16 w-16 border-4 border-background">
            <AvatarImage 
              src={student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullName}`} 
              alt={fullName} 
            />
            <AvatarFallback>
              {student.firstName[0]}{student.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <h3 className="font-semibold text-center text-lg text-white group-hover:text-black">{fullName}</h3>
        <p className="text-sm text-center text-white group-hover:text-black">{age} years old</p>
        
        {classInfo && (
          <p className="text-sm text-center mt-1 text-white group-hover:text-black">
            Class: <span className="font-medium">{classInfo.name}</span>
          </p>
        )}
        
        <div className="mt-4 pt-4 border-t flex flex-col gap-2 justify-end h-full">
          <div className="text-xs text-white group-hover:text-black">
            <div className="flex justify-between">
              <span>Guardian:</span>
              <span className="font-medium">{student.guardianName}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Phone:</span>
              <span className="font-medium">{student.guardianContact}</span>
            </div>
          </div>
          
          <div className="mt-auto pt-2 flex flex-col gap-2">
            <Button asChild className="w-full" variant="outline">
              <Link to={`/student/${student.id}`}>View Profile</Link>
            </Button>
            
            {onEdit && (
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={(e) => {
                  e.preventDefault();
                  onEdit();
                }}
              >
                <FileEdit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to determine if birthday is in the next 14 days
function isUpcomingBirthday(dateOfBirth: string): boolean {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  // Set birth date to current year
  const birthDateThisYear = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  
  // If birthday already passed this year, check for next year's birthday
  if (birthDateThisYear < today) {
    birthDateThisYear.setFullYear(today.getFullYear() + 1);
  }
  
  // Calculate days difference
  const diffTime = birthDateThisYear.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 14;
}
