
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { FileChartLine, FileText } from "lucide-react";
import { toast } from "sonner";
import { mockClasses, mockStudents } from "@/lib/mock-data";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("attendance");
  const [classId, setClassId] = useState("1"); // Default to first class
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "MMMM yyyy"));
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // Get the current class data
  const currentClass = mockClasses.find(c => c.id === classId) || mockClasses[0];
  
  const handleGenerateReport = () => {
    toast.success("Report generated successfully!");
    // In a real app, this would trigger a PDF download or redirect
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Reports" 
        description="Generate attendance and performance reports for your class"
      />
      
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select 
                      value={reportType} 
                      onValueChange={setReportType}
                    >
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="attendance">Attendance Report</SelectItem>
                        <SelectItem value="performance">Performance Report</SelectItem>
                        <SelectItem value="student">Student Details Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="class-select">Class</Label>
                    <Select 
                      value={classId} 
                      onValueChange={setClassId}
                    >
                      <SelectTrigger id="class-select">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockClasses.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {reportType === "attendance" && (
                    <div className="space-y-2">
                      <Label>Select Date Range</Label>
                      <div className="border rounded-md p-4">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={(range) => setDateRange(range)}
                          className="rounded-md border pointer-events-auto"
                        />
                      </div>
                    </div>
                  )}
                  
                  {reportType === "performance" && (
                    <div className="space-y-2">
                      <Label>Select Month</Label>
                      <Select 
                        value={selectedMonth}
                        onValueChange={setSelectedMonth}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="May 2025">May 2025</SelectItem>
                          <SelectItem value="April 2025">April 2025</SelectItem>
                          <SelectItem value="March 2025">March 2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <Button onClick={handleGenerateReport} className="w-full mt-6">
                    Generate Report
                  </Button>
                </div>
                
                <div className="border rounded-md p-4 bg-muted/20">
                  <h3 className="text-lg font-medium mb-4">Report Preview</h3>
                  {reportType === "attendance" && (
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-background rounded-md">
                        <FileChartLine className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h4 className="font-medium mt-2">Attendance Report</h4>
                        <p className="text-sm text-muted-foreground">
                          {currentClass?.name} • {dateRange && dateRange.from ? 
                            `${format(dateRange.from, "PPP")}${dateRange.to ? ` - ${format(dateRange.to, "PPP")}` : ''}` : 
                            "Select date range"}
                        </p>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        This report will include:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Daily attendance records</li>
                          <li>Attendance percentage per student</li>
                          <li>Absence patterns and trends</li>
                          <li>Overall class attendance rate</li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {reportType === "performance" && (
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-background rounded-md">
                        <FileChartLine className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h4 className="font-medium mt-2">Performance Report</h4>
                        <p className="text-sm text-muted-foreground">
                          {currentClass?.name} • {selectedMonth}
                        </p>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        This report will include:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Bible quiz scores</li>
                          <li>Memory verse completion rates</li>
                          <li>Participation metrics</li>
                          <li>Individual and class progress</li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {reportType === "student" && (
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-background rounded-md">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h4 className="font-medium mt-2">Student Details Report</h4>
                        <p className="text-sm text-muted-foreground">
                          {currentClass?.name}
                        </p>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        This report will include:
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Student contact information</li>
                          <li>Guardian details</li>
                          <li>Attendance summary</li>
                          <li>Special needs and accommodations</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Generated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Preschool Class - Attendance Report
                    </TableCell>
                    <TableCell>Attendance</TableCell>
                    <TableCell>May 1, 2025</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Preschool Class - Performance Report
                    </TableCell>
                    <TableCell>Performance</TableCell>
                    <TableCell>April 30, 2025</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Preschool Class - Student Details
                    </TableCell>
                    <TableCell>Student</TableCell>
                    <TableCell>April 15, 2025</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
