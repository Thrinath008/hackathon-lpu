import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";

interface User {
  id: string;
  name: string;
  title: string;
  university: string;
}

export default function SearchProfilePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  // Search users by name
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      // Firestore doesn't support case-insensitive search, so fetch all and filter
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as User))
        .filter(
          user =>
            user.id !== currentUser?.uid &&
            user.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
      setResults(users);
    } catch (error) {
      console.error("Error searching users:", error);
      alert("Failed to search users.");
    } finally {
      setLoading(false);
    }
  };

  // Send collaboration request
  const handleSendRequest = async (toUid: string) => {
    if (!currentUser) {
      alert("Please log in to send requests.");
      return;
    }
    try {
      // Check for existing request
      const existingRequests = await getDocs(
        query(
          collection(db, "requests"),
          where("fromUid", "==", currentUser.uid),
          where("toUid", "==", toUid),
          where("status", "in", ["pending", "accepted"])
        )
      );
      if (!existingRequests.empty) {
        alert("Request already sent or accepted.");
        return;
      }

      const requestId = doc(collection(db, "requests")).id;
      await setDoc(doc(db, "requests", requestId), {
        fromUid: currentUser.uid,
        toUid,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      alert("Request sent!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search users by name..."
          className="bg-white/80 border-brand-lightPurple focus:ring-brand-purple"
          onKeyDown={e => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <Button
          onClick={handleSearch}
          className="bg-brand-purple hover:bg-brand-purple/90"
          disabled={loading}
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-muted-foreground">
          {searchTerm ? "No users found." : "Enter a name to search."}
        </p>
      ) : (
        <div className="grid gap-4">
          {results.map(user => (
            <Card key={user.id} className="glass border-brand-purple/20">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-brand-purple">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.title}</p>
                  <p className="text-xs text-muted-foreground">{user.university}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/profile/${user.id}`)}
                    variant="outline"
                    className="hover:bg-brand-lightPurple/20"
                  >
                    View Profile
                  </Button>
                  <Button
                    onClick={() => handleSendRequest(user.id)}
                    className="bg-brand-pink hover:bg-brand-purple/80 text-brand-purple"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Send Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}