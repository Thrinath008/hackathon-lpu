// UserProfilePage.tsx
import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Sparkles, Code, Award, MapPin, Mail, Globe, Github, Linkedin, Monitor, Zap, BookOpen, Edit, FileText, X } from "lucide-react"

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'star':
      return <Star className="h-5 w-5 text-yellow-500" />
    case 'brain':
      return <Sparkles className="h-5 w-5 text-purple-500" />
    case 'code':
      return <Code className="h-5 w-5 text-blue-500" />
    default:
      return <Award className="h-5 w-5 text-gray-500" />
  }
}
// PDF Viewer Modal Component
const PDFViewerModal = ({ isOpen, onClose, pdfUrl }: { isOpen: boolean, onClose: () => void, pdfUrl: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-5xl h-5/6 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Resume / CV</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 p-1 overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title="CV/Resume PDF Viewer"
          />
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

const userData = {
  cvPdf: "/resume-alex-morgan.pdf",
  name: "Alex Morgan",
  title: "Computer Science Student",
  location: "Boston University",
  bio: "Passionate computer science student focusing on web development and AI. Looking to collaborate on innovative projects and expand my skill set through practical experience.",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  email: "alex.morgan@example.com",
  website: "alexmorgan.dev",
  github: "github.com/alexmorgan",
  linkedin: "linkedin.com/in/alexmorgan",
  tecoRank: 850,
  rankLevel: "Advanced Developer",
  rankPercentile: 92,
  skills: [
    { name: "JavaScript", level: 85 },
    { name: "React.js", level: 80 },
    { name: "Node.js", level: 75 },
    { name: "Python", level: 70 },
    { name: "TensorFlow", level: 55 },
    { name: "SQL", level: 65 },
    { name: "Git & GitHub", level: 90 },
    { name: "UI/UX Design", level: 60 },
  ],
  projects: [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Built a modern e-commerce platform with React, Node.js, and MongoDB.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2070&q=80",
      skills: ["React", "Node.js", "MongoDB"],
      status: "Completed",
      contribution: "Frontend Development",
      performance: 87,
    },
    {
      id: 2,
      title: "AI-Powered Task Manager",
      description: "Created a task management app that uses machine learning to prioritize tasks.",
      image: "https://images.unsplash.com/photo-1661956602139-ec64991b8b16?auto=format&fit=crop&w=930&q=80",
      skills: ["Python", "TensorFlow", "React"],
      status: "In Progress",
      contribution: "AI Model Development",
      performance: 92,
    },
  ],
  achievements: [
    {
      title: "Top Contributor",
      description: "Recognized as a top contributor in the E-commerce Platform project",
      icon: "star",
      date: "August 2023",
    },
    {
      title: "AI Excellence",
      description: "Awarded for implementing an innovative machine learning solution",
      icon: "brain",
      date: "June 2023",
    },
    {
      title: "Code Quality Champion",
      description: "Achieved highest code quality score for three consecutive sprints",
      icon: "code",
      date: "April 2023",
    },
  ],
  performanceMetrics: {
    codeQuality: 88,
    problemSolving: 92,
    teamwork: 85,
    communication: 87,
    projectManagement: 78,
    technicalSkills: 90,
  },
}

// Custom Progress Component
const Progress = ({ value }: { value: number }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  )
}

// Custom Badge Component
const Badge = ({
  children,
  variant = "default",
  className = ""
}: {
  children: React.ReactNode,
  variant?: "default" | "secondary" | "outline",
  className?: string
}) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700"
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

// Custom Tabs Component
const Tabs = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

const TabsList = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex border-b">{children}</div>
}

const TabsTrigger = ({
  value,
  active,
  onClick
}: {
  value: string,
  active: boolean,
  onClick: () => void
}) => {
  return (
    <button
      className={`px-4 py-2 font-medium ${active
        ? "border-b-2 border-blue-500 text-blue-600"
        : "text-gray-500 hover:text-gray-700"}`}
      onClick={onClick}
    >
      {value}
    </button>
  )
}

const TabsContent = ({
  value,
  activeTab,
  children
}: {
  value: string,
  activeTab: string,
  children: React.ReactNode
}) => {
  if (value !== activeTab) return null
  return <div className="mt-4">{children}</div>
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isCurrentUser, setIsCurrentUser] = useState(true)
  const [isPdfModalOpen, setPdfModalOpen] = useState(false)

  return (

    <div className="container mx-auto">
      <PDFViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        pdfUrl={userData.cvPdf}
      />
      {/* Profile Header */}
      <div className="bg-gray-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <img
                src={userData.avatar}
                alt={userData.name}
                className="h-32 w-32 rounded-full border-4 border-white"
              />
              {isCurrentUser && (
                <div className="absolute -bottom-2 -right-2">
                  <Button variant="outline" className="rounded-full h-8 w-8 p-0 bg-white text-gray-900">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit profile picture</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{userData.name}</h1>
                  <p className="text-lg text-white/80">{userData.title}</p>
                  <p className="flex justify-center md:justify-start items-center gap-1 text-white/70 mt-1">
                    <MapPin className="h-4 w-4" /> {userData.location}
                  </p>
                </div>

                {isCurrentUser ? (
                  <Button className="mt-4 md:mt-0 bg-white text-gray-900 hover:bg-white/90">
                    Edit Profile
                  </Button>
                ) : (
                  <Button className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white">
                    Connect
                  </Button>
                )}
              </div>

              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                <a href={`mailto:${userData.email}`} className="flex items-center gap-1 text-white/80 hover:text-white">
                  <Mail className="h-4 w-4" />
                  <span>{userData.email}</span>
                </a>
                <a href={`https://${userData.website}`} className="flex items-center gap-1 text-white/80 hover:text-white">
                  <Globe className="h-4 w-4" />
                  <span>{userData.website}</span>
                </a>
                <a href={`https://${userData.github}`} className="flex items-center gap-1 text-white/80 hover:text-white">
                  <Github className="h-4 w-4" />
                  <span>{userData.github}</span>
                </a>
                <a href={`https://${userData.linkedin}`} className="flex items-center gap-1 text-white/80 hover:text-white">
                  <Linkedin className="h-4 w-4" />
                  <span>{userData.linkedin}</span>
                </a>
              </div>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                <a href={`mailto:${userData.email}`} className="flex items-center gap-1 text-white/80 hover:text-white">
                  <Mail className="h-4 w-4" />
                  <span>{userData.email}</span>
                </a>
                {/* Other social links... */}
                <a href={`https://${userData.linkedin}`} className="flex items-center gap-1 text-white/80 hover:text-white">
                  <Linkedin className="h-4 w-4" />
                  <span>{userData.linkedin}</span>
                </a>

                {/* Add this button to view CV */}
                <Button
                  onClick={() => setPdfModalOpen(true)}
                  className="bg-white text-gray-900 hover:bg-white/90 flex items-center gap-1"
                  size="sm"
                >
                  <FileText className="h-4 w-4" />
                  <span>View CV</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teco Rank Badge */}
      <div className="bg-gradient-to-r from-gray-800 to-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm">TecoRank™</div>
                <div className="font-bold text-xl">{userData.tecoRank}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm">Level</div>
                <div className="font-bold">{userData.rankLevel}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm">Percentile</div>
                <div className="font-bold">Top {100 - userData.rankPercentile}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs>
          <TabsList>
            <TabsTrigger
              value="Overview"
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            <TabsTrigger
              value="Projects"
              active={activeTab === "projects"}
              onClick={() => setActiveTab("projects")}
            />
            <TabsTrigger
              value="Performance"
              active={activeTab === "performance"}
              onClick={() => setActiveTab("performance")}
            />
          </TabsList>

          <TabsContent value="overview" activeTab={activeTab}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <div className="lg:col-span-2 space-y-8">

                {/* Bio */}
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{userData.bio}</p>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription>Skills developed through projects and evaluated by AI</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userData.skills.map((skill, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{skill.name}</span>
                            <span className="font-medium">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Projects */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Projects</CardTitle>
                      <Button variant="outline">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {userData.projects.map((project) => (
                        <div key={project.id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0">
                          <div className="sm:w-1/4">
                            <div className="h-32 w-full rounded-lg overflow-hidden">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="sm:w-3/4">
                            <h3 className="text-lg font-semibold">{project.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{project.description}</p>

                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={`${project.status === 'Completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                >
                                  {project.status}
                                </Badge>
                                <span className="text-sm text-gray-500">{project.contribution}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <span className="font-medium">Performance:</span>
                                <span className={`font-bold ${project.performance >= 90 ? 'text-green-600' :
                                  project.performance >= 70 ? 'text-blue-600' :
                                    'text-yellow-600'
                                  }`}>
                                  {project.performance}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.achievements.map((achievement, index) => (
                        <div key={index} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            {getIcon(achievement.icon)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>AI-evaluated performance across key areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(userData.performanceMetrics).map(([key, value]) => {
                        const formattedKey = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase());

                        return (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{formattedKey}</span>
                              <span className="font-medium">{value}%</span>
                            </div>
                            <Progress value={value} />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Recommendations</CardTitle>
                    <CardDescription>Based on your projects and skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-3 pb-4 border-b">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                          <Monitor className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Advanced React Patterns</h3>
                          <p className="text-sm text-gray-600 mt-1">Improve your React skills with advanced component patterns</p>
                        </div>
                      </div>

                      <div className="flex gap-3 pb-4 border-b">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                          <Code className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">API Design Best Practices</h3>
                          <p className="text-sm text-gray-600 mt-1">Learn RESTful API design and implementation strategies</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Deep Learning with TensorFlow</h3>
                          <p className="text-sm text-gray-600 mt-1">Strengthen your AI skills with practical TensorFlow projects</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" activeTab={activeTab}>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Project History</CardTitle>
                    <Button variant="outline">
                      Find New Projects
                    </Button>
                  </div>
                  <CardDescription>All projects you've participated in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* This would display all projects with more details in a real app */}
                    {userData.projects.map((project) => (
                      <div key={project.id} className="flex flex-col md:flex-row gap-6 pb-8 border-b last:border-0 last:pb-0">
                        <div className="md:w-1/3">
                          <div className="h-48 w-full rounded-lg overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="md:w-2/3">
                          <h3 className="text-xl font-semibold">{project.title}</h3>
                          <p className="text-gray-600 mt-2">{project.description}</p>

                          <div className="flex flex-wrap gap-2 mt-4">
                            {project.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Status</h4>
                              <Badge
                                className={`mt-1 ${project.status === 'Completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                  }`}
                              >
                                {project.status}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Role</h4>
                              <p className="mt-1">{project.contribution}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Performance Rating</h4>
                              <div className="mt-1 flex items-center gap-2">
                                <span className={`font-bold text-lg ${project.performance >= 90 ? 'text-green-600' :
                                  project.performance >= 70 ? 'text-blue-600' :
                                    'text-yellow-600'
                                  }`}>
                                  {project.performance}%
                                </span>
                                <div className="w-32">
                                  <Progress value={project.performance} />
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Skills Impact</h4>
                              <p className="mt-1 text-blue-600">
                                +{Math.floor(project.performance / 10)} skill points
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 flex gap-3">
                            <Button variant="outline">
                              View Project
                            </Button>
                            <Button variant="outline">
                              View Evaluation
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" activeTab={activeTab}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                    <CardDescription>AI-evaluated skills and performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(userData.performanceMetrics).map(([key, value]) => {
                        const formattedKey = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase());

                        let color = 'bg-gray-100 text-gray-800';
                        if (value >= 90) color = 'bg-green-100 text-green-800';
                        else if (value >= 80) color = 'bg-blue-100 text-blue-800';
                        else if (value >= 70) color = 'bg-blue-100 text-blue-800';
                        else if (value >= 60) color = 'bg-yellow-100 text-yellow-800';

                        return (
                          <div key={key} className={`p-4 rounded-lg ${color}`}>
                            <h3 className="font-semibold">{formattedKey}</h3>
                            <div className="flex items-end gap-2 mt-2">
                              <span className="text-2xl font-bold">{value}%</span>
                              <span className="text-sm">
                                {value >= 90 ? 'Excellent' :
                                  value >= 80 ? 'Very Good' :
                                    value >= 70 ? 'Good' :
                                      value >= 60 ? 'Average' : 'Needs Improvement'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Performance chart will be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Skills Breakdown</CardTitle>
                    <CardDescription>Detailed analysis of your technical and soft skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-4">Technical Skills</h3>
                        <div className="space-y-4">
                          {userData.skills.slice(0, 5).map((skill, index) => (
                            <div key={index}>
                              <div className="flex justify-between text-sm mb-1">
                                <span>{skill.name}</span>
                                <span className="font-medium">{skill.level}%</span>
                              </div>
                              <Progress value={skill.level} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Soft Skills</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Communication</span>
                              <span className="font-medium">87%</span>
                            </div>
                            <Progress value={87} />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Teamwork</span>
                              <span className="font-medium">85%</span>
                            </div>
                            <Progress value={85} />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Problem Solving</span>
                              <span className="font-medium">92%</span>
                            </div>
                            <Progress value={92} />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Adaptability</span>
                              <span className="font-medium">83%</span>
                            </div>
                            <Progress value={83} />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Time Management</span>
                              <span className="font-medium">79%</span>
                            </div>
                            <Progress value={79} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>TecoRank™ Analysis</CardTitle>
                    <CardDescription>Understanding your ranking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-bold text-blue-600">
                        {userData.tecoRank}
                      </div>
                      <p className="text-gray-600 mt-2">
                        Your TecoRank™ places you in the top {100 - userData.rankPercentile}% of developers.
                      </p>
                      <div className="mt-4">
                        <Button variant="outline">
                          Learn More About TecoRank™
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Improvement Suggestions</CardTitle>
                    <CardDescription>Actionable insights to boost your performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Focus on improving your project management skills to enhance your overall performance.</li>
                      <li>Consider taking advanced courses in TensorFlow to strengthen your AI expertise.</li>
                      <li>Collaborate on more team-based projects to further develop your teamwork and communication skills.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}