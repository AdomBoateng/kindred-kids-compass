import { Student } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatDate, getUpcomingBirthday } from "@/lib/date-utils";

interface BirthdayListProps {
  students: Student[];
  title?: string;
  description?: string;
  limit?: number;
  emptyMessage?: string;
}

export function BirthdayList({ 
  students, 
  title = "Upcoming Birthdays", 
  description = "Students with birthdays in the next 30 days",
  limit = 5,
  emptyMessage = "No upcoming birthdays in the next 30 days"
}: BirthdayListProps) {
  // Sort students by upcoming birthday (closest first)
  const sortedStudents = [...students].sort((a, b) => {
    const dateA = getUpcomingBirthday(a.dateOfBirth);
    const dateB = getUpcomingBirthday(b.dateOfBirth);
    return dateA.getTime() - dateB.getTime();
  }).slice(0, limit);

  return (
    <Card className="group bg-[#040273] hover:bg-[#FFC107] transition-colors duration-200 text-white hover:text-black">
      <CardHeader>
        <CardTitle className="text-white group-hover:text-black transition-colors">{title}</CardTitle>
        <CardDescription className="text-white group-hover:text-black transition-colors">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedStudents.length > 0 ? (
          <div className="space-y-4">
            {sortedStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage 
                      src={student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.firstName}${student.lastName}`} 
                      alt={`${student.firstName} ${student.lastName}`} 
                    />
                    <AvatarFallback>
                      {student.firstName[0]}{student.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white group-hover:text-black transition-colors">{student.firstName} {student.lastName}</p>
                    <p className="text-sm text-white group-hover:text-black transition-colors">
                      {formatDate(getUpcomingBirthday(student.dateOfBirth))}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/student/${student.id}`} className="text-white group-hover:text-black transition-colors">View</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white group-hover:text-black transition-colors">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
