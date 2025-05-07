
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted py-8 border-t mt-auto">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm mr-2">KC</div>
            <span className="text-lg font-heading font-semibold">Kindred Kids Compass</span>
          </div>
          
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help & Support</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; {currentYear} Kindred Kids Compass. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
