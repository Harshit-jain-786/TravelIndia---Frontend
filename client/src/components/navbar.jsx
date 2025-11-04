import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Plane } from "lucide-react";
import GlobalSearchBar from "./GlobalSearchBar";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      console.log("Navbar user:", storedUser);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    updateUser();
    window.addEventListener("storage", updateUser);
    window.addEventListener("userChanged", updateUser);
    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("userChanged", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
  window.dispatchEvent(new Event('userChanged'));
    setLocation("/login");
  };

  const navigation = [
  { name: "Home", href: "/" },
  { name: "Flights", href: "/flights" },
  { name: "Hotels", href: "/hotels" },
  { name: "Packages", href: "/packages" },
  { name: "Destinations", href: "/destinations" },
  // Temporarily hide Adventure link from navbar until the page is ready
  // { name: "Adventure", href: "/adventure" },
  ];

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center" data-testid="logo-link">
            <Plane className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold text-secondary">TravelIndia</span>
          </Link>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`font-medium transition-colors duration-200 ${
                location === item.href
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
              data-testid={`nav-link-${item.name.toLowerCase()}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white mr-2"
                  data-testid="navbar-username"
                >
                  {user.first_name || user.firstName || user.username || user.email}
                </Button>
              </Link>
              <Button
                className="bg-primary hover:bg-orange-600"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  data-testid="button-login"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className="bg-primary hover:bg-orange-600"
                  data-testid="button-signup"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 transition-colors duration-200 ${
                  location === item.href
                    ? "text-primary"
                    : "text-gray-700 hover:text-primary"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid={`mobile-nav-link-${item.name.toLowerCase()}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

// Add this helper below the Navbar component to create space for the fixed navbar
export function NavbarSpacer() {
  return <div style={{ height: '64px' }} />; // 16px * 4 = 64px, matches h-16
}
