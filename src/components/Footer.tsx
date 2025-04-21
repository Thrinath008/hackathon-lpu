
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center font-bold text-2xl">
              <span className="text-brand-purple">Friend</span>
              <span>Forge</span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Connecting skilled individuals to create amazing projects together. Find the perfect collaborator for your next venture.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-4">Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-muted-foreground hover:text-foreground transition">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-foreground transition">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition">
                  Log In
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="text-muted-foreground">
                support@friendforge.com
              </li>
              <li className="text-muted-foreground">
                Privacy Policy
              </li>
              <li className="text-muted-foreground">
                Terms of Service
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} FriendForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
