import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null); // To store user info
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
  const location = useLocation();
  const navigate = useNavigate();
  const closeSheet = () => setIsOpen(false);

  // Reference for the dropdown
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  // Check Firebase login state and get user info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setUser(user); // Set user info
    });

    return () => unsubscribe();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both the dropdown and the profile button
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    // Only add the listener when dropdown is open
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Handle toggle dropdown
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Stop event propagation
    setDropdownOpen(!dropdownOpen);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setDropdownOpen(false);
      setTimeout(() => navigate("/login"), 100); // Give router time to process
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navLinkClasses = (to) =>
    cn(
      "text-foreground/70 hover:text-foreground transition font-medium px-3 py-1 rounded",
      location.pathname.startsWith(to) && "bg-brand-lightPurple/60 text-brand-purple"
    );

  // Conditional rendering based on location
  const shouldHideDashboardLink = location.pathname === "/dashboard";
  const shouldHideFindMembersLink = location.pathname === "/find-members";

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
          {/* Conditionally render links */}
          {!shouldHideFindMembersLink && (
            <Link to="/find-members" className={navLinkClasses("/find-members")}>
              Find Members
            </Link>
          )}
          <Link to="/features" className={navLinkClasses("/features")}>
            Features
          </Link>

          {/* Add Dashboard link conditionally */}
          {!shouldHideDashboardLink && (
            <Link to="/dashboard" className={navLinkClasses("/dashboard")}>
              Dashboard
            </Link>
          )}

          {/* Profile dropdown and log out */}
          {isAuthenticated && user ? (
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 p-0 rounded-full" 
                onClick={toggleDropdown}
                ref={profileButtonRef}
              >
                {/* Display user's profile picture or a default icon */}
                <img
                  src={user.photoURL || "/default-profile.jpg"}
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </Button>
              {dropdownOpen && (
                <div 
                  ref={dropdownRef} 
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50 border border-gray-100"
                >
                  <Link 
                    to={`/profile/${user.uid}`} 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/about" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setDropdownOpen(false)}
                  >
                    About
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
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
              {/* Conditionally render links */}
              {!shouldHideFindMembersLink && (
                <Link to="/find-members" className="text-lg font-medium" onClick={closeSheet}>
                  Find Members
                </Link>
              )}
              <Link to="/features" className="text-lg font-medium" onClick={closeSheet}>
                Features
              </Link>

              {/* Add Dashboard link conditionally */}
              {!shouldHideDashboardLink && (
                <Link to="/dashboard" className="text-lg font-medium" onClick={closeSheet}>
                  Dashboard
                </Link>
              )}

              {/* Profile and Log out for mobile */}
              {isAuthenticated && user ? (
                <>
                  <Link to={`/profile/${user.uid}`} className="text-lg font-medium" onClick={closeSheet}>
                    Profile
                  </Link>
                  <Link to="/about" className="text-lg font-medium" onClick={closeSheet}>
                    About
                  </Link>
                  <Button onClick={handleLogout} className="w-full mt-4">
                    Log out
                  </Button>
                </>
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
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}