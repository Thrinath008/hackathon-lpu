import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const closeSheet = () => setIsOpen(false);

  // Check Firebase login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    console.log("Location changed to:", location.pathname);
  }, [location]);
  

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await signOut(auth);
      setIsAuthenticated(false);
      setTimeout(() => navigate("/login"), 100); // Give router time to process
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navLinkClasses = (to: string) =>
    cn(
      "text-foreground/70 hover:text-foreground transition font-medium px-3 py-1 rounded",
      location.pathname.startsWith(to) && "bg-brand-lightPurple/60 text-brand-purple"
    );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center font-bold text-2xl">
            <span className="text-brand-purple">Friend</span>
            <span>Forge</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/find-members" className={navLinkClasses("/find-members")}>
            Find Members
          </Link>
          <Link to="/features" className={navLinkClasses("/features")}>
            Features
          </Link>
          <Link to="/about" className={navLinkClasses("/about")}>
            About
          </Link>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button className="bg-brand-purple hover:bg-brand-purple/90" asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="sm:max-w-xs">
            <div className="flex flex-col gap-6 pt-8">
              <Link to="/find-members" className="text-lg font-medium" onClick={closeSheet}>
                Find Members
              </Link>
              <Link to="/features" className="text-lg font-medium" onClick={closeSheet}>
                Features
              </Link>
              <Link to="/about" className="text-lg font-medium" onClick={closeSheet}>
                About
              </Link>
              <div className="flex flex-col gap-2 mt-4">
                {isAuthenticated ? (
                  <Button onClick={() => navigate("/login")}>Test Navigate</Button>

                ) : (
                  <>
                    <Button variant="outline" asChild onClick={closeSheet}>
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button className="bg-brand-purple hover:bg-brand-purple/90" asChild onClick={closeSheet}>
                      <Link to="/register">Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
