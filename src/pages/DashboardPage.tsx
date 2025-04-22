import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, Users, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import ChatModal from "@/components/ChatModal";
import SearchProfilePage from "@/pages/SearchProfilePage";

interface Project {
  id: number;
  title: string;
  members: number;
  progress: number;
}

interface Request {
  id: string;
  fromUid: string;
  fromName: string;
  fromRole: string;
  createdAt: string;
}

interface Notification {
  id: number;
  text: string;
  time: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, title: "Web Development Study Group", members: 4, progress: 35 },
    { id: 2, title: "Mobile App Hackathon Team", members: 3, progress: 68 },
    { id: 3, title: "AI Research Collaboration", members: 2, progress: 15 }
  ]);

  const [requests, setRequests] = useState<Request[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: "New message in Web Development group", time: "2h ago" },
    { id: 2, text: "Project update: Mobile App Hackathon", time: "5h ago" },
    { id: 3, text: "Friend request accepted: Sophia Chen", time: "1d ago" }
  ]);

  const [friends, setFriends] = useState<{ uid: string; name: string }[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatUser, setChatUser] = useState<{ uid: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState("projects");
  const currentUser = auth.currentUser;

  // Fetch pending requests and friends
  useEffect(() => {
    if (!currentUser) {
      console.log("No current user, skipping fetch.");
      return;
    }

    // Fetch pending requests
    const fetchRequests = async () => {
      try {
        console.log("Fetching requests for UID:", currentUser.uid);
        const q = query(
          collection(db, "requests"),
          where("toUid", "==", currentUser.uid),
          where("status", "==", "pending")
        );
        const querySnapshot = await getDocs(q);
        const requestsData: Request[] = [];
        for (const reqDoc of querySnapshot.docs) {
          const req = reqDoc.data();
          console.log("Request found:", req);
          // Get sender's name and role
          const userRef = doc(db, "users", req.fromUid);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
          if (!userData) {
            console.warn(`User ${req.fromUid} not found.`);
            continue;
          }
          requestsData.push({
            id: reqDoc.id,
            fromUid: req.fromUid,
            fromName: userData.name || "Unknown",
            fromRole: userData.title || "Unknown",
            createdAt: req.createdAt
          });
        }
        console.log("Requests loaded:", requestsData);
        setRequests(requestsData);
      } catch (error: any) {
        console.error("Error fetching requests:", error.message);
      }
    };

    // Fetch friends
    const fetchFriends = async () => {
      try {
        console.log("Fetching friends for UID:", currentUser.uid);
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        if (!userData) {
          console.warn(`Current user ${currentUser.uid} not found.`);
          return;
        }
        const friendUids = userData.friends || [];
        const friendsData = [];
        for (const uid of friendUids) {
          const friendRef = doc(db, "users", uid);
          const friendDoc = await getDoc(friendRef);
          const friendData = friendDoc.data();
          if (!friendData) {
            console.warn(`Friend ${uid} not found.`);
            continue;
          }
          friendsData.push({ uid, name: friendData.name || "Unknown" });
        }
        console.log("Friends loaded:", friendsData);
        setFriends(friendsData);
      } catch (error: any) {
        console.error("Error fetching friends:", error.message);
      }
    };

    fetchRequests();
    fetchFriends();
  }, [currentUser]);

  // Handle accept/reject request
  const handleRequestAction = async (requestId: string, action: "accepted" | "rejected") => {
    if (!currentUser) {
      alert("Please log in to perform this action.");
      return;
    }
    try {
      console.log(`Processing ${action} for request ${requestId}`);
      const requestRef = doc(db, "requests", requestId);
      const requestDoc = await getDoc(requestRef);
      const requestData = requestDoc.data();
      if (!requestData) {
        console.error("Request not found:", requestId);
        alert("Request not found.");
        return;
      }
      console.log("Request data:", requestData);

      if (requestData.toUid !== currentUser.uid) {
        console.error("Unauthorized: toUid does not match current user.");
        alert("You are not authorized to update this request.");
        return;
      }

      if (action === "accepted") {
        // Update request status
        await updateDoc(requestRef, { status: "accepted" });
        console.log("Request status updated to accepted.");
        // Add to both users' friends
        const fromUserRef = doc(db, "users", requestData.fromUid);
        const toUserRef = doc(db, "users", currentUser.uid);
        // Verify users exist
        const fromUserDoc = await getDoc(fromUserRef);
        const toUserDoc = await getDoc(toUserRef);
        if (!fromUserDoc.exists() || !toUserDoc.exists()) {
          console.error("One or both users not found.");
          alert("Error: User data missing.");
          return;
        }
        await updateDoc(fromUserRef, { friends: arrayUnion(currentUser.uid) });
        await updateDoc(toUserRef, { friends: arrayUnion(requestData.fromUid) });
        console.log(`Added ${currentUser.uid} to ${requestData.fromUid}'s friends and vice versa.`);
      } else {
        // Update request status
        await updateDoc(requestRef, { status: "rejected" });
        console.log("Request status updated to rejected.");
      }

      // Remove from requests
      setRequests(requests => requests.filter(req => req.id !== requestId));
      alert(`${action.charAt(0).toUpperCase() + action.slice(1)} request successfully!`);
    } catch (error: any) {
      console.error(`Error ${action} request:`, error.message);
      alert(`Failed to ${action} request: ${error.message}`);
    }
  };

  // Open chat modal
  const handleOpenChat = (friend: { uid: string; name: string }) => {
    setChatUser(friend);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <Button className="bg-brand-purple hover:bg-brand-purple/90">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
            <Button
              variant="outline"
              className="border-brand-lightPurple hover:bg-brand-lightPurple/20"
              onClick={() => setActiveTab("search")}
            >
              <Search className="mr-2 h-4 w-4" />
              Search Profiles
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="search">Search Profiles</TabsTrigger>
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

          <TabsContent value="requests" className="space-y-4">
            <div className="grid gap-4">
              <h2 className="text-xl font-bold">Pending Requests</h2>
              {requests.length === 0 ? (
                <p className="text-muted-foreground">No pending requests.</p>
              ) : (
                requests.map(request => (
                  <Card key={request.id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{request.fromName}</p>
                        <p className="text-sm text-muted-foreground">{request.fromRole}</p>
                        <p className="text-xs text-muted-foreground">
                          Sent: {new Date(request.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleRequestAction(request.id, "accepted")}
                          className="bg-brand-purple hover:bg-brand-purple/90"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleRequestAction(request.id, "rejected")}
                          variant="outline"
                        >
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              <h2 className="text-xl font-bold mt-6">Friends</h2>
              {friends.length === 0 ? (
                <p className="text-muted-foreground">No friends yet.</p>
              ) : (
                friends.map(friend => (
                  <Card key={friend.uid}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <p className="font-semibold">{friend.name}</p>
                      <Button
                        onClick={() => handleOpenChat(friend)}
                        className="bg-brand-pink hover:bg-brand-purple/80"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="grid gap-4">
              {notifications.map(notification => (
                <Card key={notification.id}>
                  <CardContent className="p-4">
                    <p>{notification.text}</p>
                    <p className="text-sm text-muted-foreground">{notification.time}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            <SearchProfilePage />
          </TabsContent>
        </Tabs>

        {chatOpen && chatUser && (
          <ChatModal
            friend={chatUser}
            onClose={() => {
              setChatOpen(false);
              setChatUser(null);
            }}
          />
        )}
      </main>
    </div>
  );
}