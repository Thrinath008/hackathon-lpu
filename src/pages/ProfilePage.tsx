
// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Sparkles, Code, Award, MapPin, Mail, Globe, Github, Linkedin, Monitor, Zap, BookOpen, Edit, FileText, X } from "lucide-react";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { Document, Page, pdfjs } from "react-pdf";

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// TypeScript interfaces for user data
interface Skill {
  name: string;
  level: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  skills: string[];
  status: string;
  contribution: string;
  performance: number;
}

interface Achievement {
  title: string;
  description: string;
  icon: string;
  date: string;
}

interface PerformanceMetrics {
  codeQuality: number;
  problemSolving: number;
  teamwork: number;
  communication: number;
  projectManagement: number;
  technicalSkills: number;
}

interface UserData {
  name: string;
  title: string;
  location: string;
  bio: string;
  avatar: string;
  email: string;
  website: string;
  github: string;
  linkedin: string;
  cvPdf: string;
  tecoRank: number;
  rankLevel: string;
  rankPercentile: number;
  skills: Skill[];
  projects: Project[];
  achievements: Achievement[];
  performanceMetrics: PerformanceMetrics;
  university: string;
  extra: string;
  createdAt: any; // Firestore timestamp
}

// PDF Viewer Modal Component using react-pdf
const PDFViewerModal = ({ isOpen, onClose, pdfUrl }: { isOpen: boolean; onClose: () => void; pdfUrl: string }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Transform Cloudinary URL to use /raw/upload/ instead of /image/upload/
  const transformedPdfUrl = pdfUrl.replace("/image/upload/", "/raw/upload/");

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF. Please try again or download the file.");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-5xl h-5/6 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Resume / CV</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          {error ? (
            <div className="text-red-600 text-center">
              <p>{error}</p>
              <a
                href={transformedPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Open PDF in new tab
              </a>
            </div>
          ) : (
            <Document
              file={transformedPdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="w-full h-full"
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  width={Math.min(800, window.innerWidth - 40)} // Responsive width
                />
              ))}
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};

// Custom Progress Component
const Progress = ({ value }: { value: number }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
  );
};

// Custom Badge Component
const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Custom Tabs Components
const Tabs = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const TabsList = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex border-b">{children}</div>;
};

const TabsTrigger = ({
  value,
  active,
  onClick,
}: {
  value: string;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={`px-4 py-2 font-medium ${
        active ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
      }`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

const TabsContent = ({
  value,
  activeTab,
  children,
}: {
  value: string;
  activeTab: string;
  children: React.ReactNode;
}) => {
  if (value !== activeTab) return null;
  return <div className="mt-4">{children}</div>;
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "star":
      return <Star className="h-5 w-5 text-yellow-500" />;
    case "brain":
      return <Sparkles className="h-5 w-5 text-purple-500" />;
    case "code":
      return <Code className="h-5 w-5 text-blue-500" />;
    default:
      return <Award className="h-5 w-5 text-gray-500" />;
  }
};

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>(); // Get userId from route
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isPdfModalOpen, setPdfModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId!));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          setFormData(data); // Initialize form data for editing
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }

    // Check if current user is viewing their own profile
    setIsCurrentUser(auth.currentUser?.uid === userId);
  }, [userId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar file change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // Save profile changes
  const handleSave = async () => {
    setIsLoading(true);
    try {
      let updatedData = { ...formData };

      // Upload new avatar to Cloudinary if provided
      if (avatarFile) {
        const avatarUrl = await uploadToCloudinary(avatarFile);
        if (avatarUrl) {
          updatedData.avatar = avatarUrl;
        } else {
          console.error("Avatar upload failed");
          setIsLoading(false);
          return;
        }
      }

      // Update Firestore document
      await updateDoc(doc(db, "users", userId!), updatedData);
      setUserData(updatedData as UserData); // Update local state
      setIsEditing(false); // Exit edit mode
      setAvatarFile(null); // Clear avatar file
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(userData || {}); // Reset form to original data
    setAvatarFile(null);
    setIsEditing(false);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <PDFViewerModal isOpen={isPdfModalOpen} onClose={() => setPdfModalOpen(false)} pdfUrl={userData.cvPdf} />

      {/* Profile Header */}
      <div className="bg-gray-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <img
                src={avatarFile ? URL.createObjectURL(avatarFile) : userData.avatar}
                alt={userData.name}
                className="h-32 w-32 rounded-full border-4 border-white"
              />
              {isCurrentUser && isEditing && (
                <div className="absolute -bottom-2 -right-2">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" className="rounded-full h-8 w-8 p-0 bg-white text-gray-900">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit profile picture</span>
                    </Button>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  {isEditing ? (
                    <>
                      <Input
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        className="text-3xl font-bold mb-2 bg-transparent text-white border-white"
                      />
                      <Input
                        name="title"
                        value={formData.title || ""}
                        onChange={handleInputChange}
                        placeholder="Title"
                        className="text-lg text-white/80 bg-transparent border-white"
                      />
                      <div className="flex items-center gap-1 text-white/70 mt-1">
                        <MapPin className="h-4 w-4" />
                        <Input
                          name="location"
                          value={formData.location || ""}
                          onChange={handleInputChange}
                          placeholder="Location"
                          className="bg-transparent text-white/70 border-white"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold">{userData.name}</h1>
                      <p className="text-lg text-white/80">{userData.title || "Not specified"}</p>
                      <p className="flex justify-center md:justify-start items-center gap-1 text-white/70 mt-1">
                        <MapPin className="h-4 w-4" /> {userData.location || "Not specified"}
                      </p>
                    </>
                  )}
                </div>

                {isCurrentUser && (
                  <div className="mt-4 md:mt-0">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save"}
                        </Button>
                        <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-white text-gray-900 hover:bg-white/90"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                {isEditing ? (
                  <>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-white/80" />
                      <Input
                        name="email"
                        value={formData.email || ""}
                        onChange={handleInputChange}
                        className="text-white/80 bg-transparent border-white"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4 text-white/80" />
                      <Input
                        name="website"
                        value={formData.website || ""}
                        onChange={handleInputChange}
                        placeholder="Website"
                        className="text-white/80 bg-transparent border-white"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Github className="h-4 w-4 text-white/80" />
                      <Input
                        name="github"
                        value={formData.github || ""}
                        onChange={handleInputChange}
                        placeholder="GitHub"
                        className="text-white/80 bg-transparent border-white"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Linkedin className="h-4 w-4 text-white/80" />
                      <Input
                        name="linkedin"
                        value={formData.linkedin || ""}
                        onChange={handleInputChange}
                        placeholder="LinkedIn"
                        className="text-white/80 bg-transparent border-white"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <a
                      href={`mailto:${userData.email}`}
                      className="flex items-center gap-1 text-white/80 hover:text-white"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{userData.email}</span>
                    </a>
                    {userData.website && (
                      <a
                        href={`https://${userData.website}`}
                        className="flex items-center gap-1 text-white/80 hover:text-white"
                      >
                        <Globe className="h-4 w-4" />
                        <span>{userData.website}</span>
                      </a>
                    )}
                    {userData.github && (
                      <a
                        href={`https://${userData.github}`}
                        className="flex items-center gap-1 text-white/80 hover:text-white"
                      >
                        <Github className="h-4 w-4" />
                        <span>{userData.github}</span>
                      </a>
                    )}
                    {userData.linkedin && (
                      <a
                        href={`https://${userData.linkedin}`}
                        className="flex items-center gap-1 text-white/80 hover:text-white"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span>{userData.linkedin}</span>
                      </a>
                    )}
                  </>
                )}
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
                <div className="font-bold">{userData.rankLevel || "Not specified"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm">Percentile</div>
                <div className="font-bold">
                  {userData.rankPercentile ? `Top ${100 - userData.rankPercentile}%` : "Not ranked"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs>
          <TabsList>
            <TabsTrigger value="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
            <TabsTrigger value="Projects" active={activeTab === "projects"} onClick={() => setActiveTab("projects")} />
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
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio || ""}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself"
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      <p className="text-gray-700">{userData.bio || "No bio provided"}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription>Skills developed through projects and evaluated by AI</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userData.skills.length > 0 ? (
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
                    ) : (
                      <p className="text-gray-600">No skills listed</p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Projects */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Projects</CardTitle>
                      <Button variant="outline">View All</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {userData.projects.length > 0 ? (
                      <div className="space-y-6">
                        {userData.projects.map((project) => (
                          <div
                            key={project.id}
                            className="flex flex-col sm:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0"
                          >
                            <div className="sm:w-1/4">
                              <div className="h-32 w-full rounded-lg overflow-hidden">
                                <img
                                  src={project.image || "/default-project.jpg"}
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
                                    className={`${
                                      project.status === "Completed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {project.status}
                                  </Badge>
                                  <span className="text-sm text-gray-500">{project.contribution}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <span className="font-medium">Performance:</span>
                                  <span
                                    className={`font-bold ${
                                      project.performance >= 90
                                        ? "text-green-600"
                                        : project.performance >= 70
                                        ? "text-blue-600"
                                        : "text-yellow-600"
                                    }`}
                                  >
                                    {project.performance}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No projects listed</p>
                    )}
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
                    {userData.achievements.length > 0 ? (
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
                    ) : (
                      <p className="text-gray-600">No achievements listed</p>
                    )}
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
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase());
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

                {/* Learning Recommendations (Static for now) */}
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
                          <p className="text-sm text-gray-600 mt-1">
                            Improve your React skills with advanced component patterns
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 pb-4 border-b">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                          <Code className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">API Design Best Practices</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Learn RESTful API design and implementation strategies
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Deep Learning with TensorFlow</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Strengthen your AI skills with practical TensorFlow projects
                          </p>
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
                    <Button variant="outline">Find New Projects</Button>
                  </div>
                  <CardDescription>All projects you've participated in</CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.projects.length > 0 ? (
                    <div className="space-y-8">
                      {userData.projects.map((project) => (
                        <div
                          key={project.id}
                          className="flex flex-col md:flex-row gap-6 pb-8 border-b last:border-0 last:pb-0"
                        >
                          <div className="md:w-1/3">
                            <div className="h-48 w-full rounded-lg overflow-hidden">
                              <img
                                src={project.image || "/default-project.jpg"}
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
                                  className={`mt-1 ${
                                    project.status === "Completed"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
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
                                  <span
                                    className={`font-bold text-lg ${
                                      project.performance >= 90
                                        ? "text-green-600"
                                        : project.performance >= 70
                                        ? "text-blue-600"
                                        : "text-yellow-600"
                                    }`}
                                  >
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
                              <Button variant="outline">View Project</Button>
                              <Button variant="outline">View Evaluation</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No projects listed</p>
                  )}
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
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase());
                        let color = "bg-gray-100 text-gray-800";
                        if (value >= 90) color = "bg-green-100 text-green-800";
                        else if (value >= 80) color = "bg-blue-100 text-blue-800";
                        else if (value >= 70) color = "bg-blue-100 text-blue-800";
                        else if (value >= 60) color = "bg-yellow-100 text-yellow-800";
                        return (
                          <div key={key} className={`p-4 rounded-lg ${color}`}>
                            <h3 className="font-semibold">{formattedKey}</h3>
                            <div className="flex items-end gap-2 mt-2">
                              <span className="text-2xl font-bold">{value}%</span>
                              <span className="text-sm">
                                {value >= 90
                                  ? "Excellent"
                                  : value >= 80
                                  ? "Very Good"
                                  : value >= 70
                                  ? "Good"
                                  : value >= 60
                                  ? "Average"
                                  : "Needs Improvement"}
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
                        {userData.skills.length > 0 ? (
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
                        ) : (
                          <p className="text-gray-600">No technical skills listed</p>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-4">Soft Skills</h3>
                        <div className="space-y-4">
                          {[
                            { name: "Communication", value: userData.performanceMetrics.communication },
                            { name: "Teamwork", value: userData.performanceMetrics.teamwork },
                            { name: "Problem Solving", value: userData.performanceMetrics.problemSolving },
                            { name: "Project Management", value: userData.performanceMetrics.projectManagement },
                            { name: "Technical Skills", value: userData.performanceMetrics.technicalSkills },
                          ].map((skill, index) => (
                            <div key={index}>
                              <div className="flex justify-between text-sm mb-1">
                                <span>{skill.name}</span>
                                <span className="font-medium">{skill.value}%</span>
                              </div>
                              <Progress value={skill.value} />
                            </div>
                          ))}
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
                      <div className="text-4xl font-bold text-blue-600">{userData.tecoRank}</div>
                      <p className="text-gray-600 mt-2">
                        {userData.rankPercentile
                          ? `Your TecoRank™ places you in the top ${100 - userData.rankPercentile}% of developers.`
                          : "Not ranked yet."}
                      </p>
                      <div className="mt-4">
                        <Button variant="outline">Learn More About TecoRank™</Button>
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
                      <li>
                        Collaborate on more team-based projects to further develop your teamwork and communication
                        skills.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
