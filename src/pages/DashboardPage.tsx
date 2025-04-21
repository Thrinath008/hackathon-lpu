// src/pages/DashboardPage.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, Users, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [projects, setProjects] = useState([
    { id: 1, title: "Web Development Study Group", members: 4, progress: 35 },
    { id: 2, title: "Mobile App Hackathon Team", members: 3, progress: 68 },
    { id: 3, title: "AI Research Collaboration", members: 2, progress: 15 }
  ]);

  const [requests, setRequests] = useState([
    { id: 1, name: "Alex Johnson", skill: "UX Designer" },
    { id: 2, name: "Taylor Smith", skill: "Backend Developer" }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New message in Web Development group", time: "2h ago" },
    { id: 2, text: "Project update: Mobile App Hackathon", time: "5h ago" },
    { id: 3, text: "Friend request accepted: Sophia Chen", time: "1d ago" }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Remove the header here, since Navbar is globally added elsewhere */}

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <Button className="bg-brand-purple hover:bg-brand-purple/90">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Find Collaborators
            </Button>
          </div>
        </div>

        <Tabs defaultValue="projects" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.members} team members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-purple h-full transition-all duration-300 ease-in-out"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="pt-4">
                        <Button variant="outline" className="w-full">View Project</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* The rest of your tabs code... */}
        </Tabs>
      </main>
    </div>
  );
}
