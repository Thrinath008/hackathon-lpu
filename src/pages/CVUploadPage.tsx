// src/pages/CVUploadPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CoolFileUpload from "@/components/CoolFileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

export default function CVUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [extra, setExtra] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return;

    setIsLoading(true);

    try {
      // Upload CV to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file);
      if (!cloudinaryUrl) {
        alert("CV upload failed.");
        setIsLoading(false);
        return;
      }

      // Get avatar from Firebase auth (Google photoURL) or use placeholder
      const avatarUrl = auth.currentUser?.photoURL || "/default-profile.jpg";

      // Create full user data structure
      const userData = {
        name,
        university,
        extra,
        email: auth.currentUser?.email || "",
        cvPdf: cloudinaryUrl,
        createdAt: new Date(),
        title: "", // Default empty string
        location: "",
        bio: "",
        website: "",
        github: "",
        linkedin: "",
        avatar: avatarUrl,
        tecoRank: 0, // Default number
        rankLevel: "",
        rankPercentile: 0,
        skills: [], // Default empty array
        projects: [],
        achievements: [],
        performanceMetrics: {
          codeQuality: 0,
          problemSolving: 0,
          teamwork: 0,
          communication: 0,
          projectManagement: 0,
          technicalSkills: 0,
        },
      };

      // Store in Firestore
      await setDoc(doc(db, "users", auth.currentUser!.uid), userData);

      setIsLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error uploading file or saving to Firestore: ", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-lightPurple/40 to-white py-14">
      <Card className="w-full max-w-lg shadow-2xl animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl text-center mb-3">Step 2: Complete Your Profile</CardTitle>
          <p className="text-center text-sm text-muted-foreground">Upload your CV and add any extra details. This helps collaborators find you!</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="university"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="Your university"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extra">Extra Info <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="extra"
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder="Eg. Open to remote projects"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cv">CV/Resume</Label>
              <CoolFileUpload value={file} onChange={setFile} />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !file}
              className="w-full bg-brand-purple hover:bg-brand-purple/90 mt-2"
            >
              {isLoading ? "Finishing..." : "Complete Signup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}