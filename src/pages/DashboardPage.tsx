
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, Users, Plus, Search } from "lucide-react";

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
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center font-bold text-2xl">
              <span className="text-brand-purple">Friend</span>
              <span>Forge</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Users className="h-5 w-5" />
              <span className="sr-only">Friends</span>
            </Button>
            <Button className="bg-brand-purple hover:bg-brand-purple/90">
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
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
              
              <Card className="border-dashed flex flex-col items-center justify-center p-6 h-full">
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground font-medium">Create a new project</p>
                <Button variant="ghost" className="mt-4">
                  Get Started
                </Button>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-4">
            {requests.length > 0 ? (
              <div className="grid gap-4">
                {requests.map(request => (
                  <Card key={request.id}>
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-brand-lightPurple flex items-center justify-center">
                          <span className="font-medium text-brand-purple">
                            {request.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{request.name}</p>
                          <p className="text-muted-foreground text-sm">{request.skill}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Decline</Button>
                        <Button className="bg-brand-purple hover:bg-brand-purple/90" size="sm">Accept</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No pending requests</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            {notifications.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {notifications.map(notification => (
                      <li key={notification.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between">
                          <p>{notification.text}</p>
                          <p className="text-muted-foreground text-sm">{notification.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No notifications</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
