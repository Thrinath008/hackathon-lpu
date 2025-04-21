import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CoolFileUpload from "@/components/CoolFileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { storage, db, auth } from "../firebase"; // Import Firebase services
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
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
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file);
  
      if (!cloudinaryUrl) {
        alert("CV upload failed.");
        setIsLoading(false);
        return;
      }
  
      // Store in Firestore
      await setDoc(doc(db, "users", auth.currentUser?.uid!), {
        name,
        university,
        extra,
        cvPdf: cloudinaryUrl, // Save Cloudinary URL instead
        email: auth.currentUser?.email,
        createdAt: new Date(),
      });
  
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
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="university"
                value={university}
                onChange={e => setUniversity(e.target.value)}
                placeholder="Your university"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extra">Extra Info <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="extra"
                value={extra}
                onChange={e => setExtra(e.target.value)}
                placeholder="Eg. Open to remote projects"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cv">CV/Resume</Label>
              <CoolFileUpload
                value={file}
                onChange={setFile}
              />
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
