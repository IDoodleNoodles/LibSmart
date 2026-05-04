import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-6 max-w-md">
        <div>
          <h1 className="text-6xl font-bold text-black mb-2">404</h1>
          <p className="text-xl text-libsmart-slate">Page not found</p>
        </div>
        <p className="text-libsmart-slate">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Link to="/">
          <Button className="bg-libsmart-blue hover:bg-libsmart-blue/90">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
