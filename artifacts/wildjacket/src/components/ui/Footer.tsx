import { Link } from "wouter";
import { Typography } from "./Typography";

const Footer = () => {
  return (
    <footer className="glass border-t border-white/10 mt-16">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Typography variant="h4" className="mb-4">
              WildJacket
            </Typography>
            <Typography variant="p" className="text-earth-600 dark:text-earth-400 max-w-md">
              Premium eco-tourism experiences in nature's most breathtaking destinations.
              Sustainable luxury for the conscious traveler.
            </Typography>
          </div>
          <div>
            <Typography variant="h5" className="mb-4">
              Explore
            </Typography>
            <ul className="space-y-2">
              <li>
                <Link href="/destinations" className="text-earth-700 dark:text-earth-300 hover:text-forest-600 transition-colors duration-200">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="text-earth-700 dark:text-earth-300 hover:text-forest-600 transition-colors duration-200">
                  Experiences
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-earth-700 dark:text-earth-300 hover:text-forest-600 transition-colors duration-200">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <Typography variant="h5" className="mb-4">
              Company
            </Typography>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-earth-700 dark:text-earth-300 hover:text-forest-600 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-earth-700 dark:text-earth-300 hover:text-forest-600 transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-earth-700 dark:text-earth-300 hover:text-forest-600 transition-colors duration-200">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center">
          <Typography variant="caption">
            © 2024 WildJacket. All rights reserved.
          </Typography>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-earth-600 dark:text-earth-400 hover:text-forest-500 text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-earth-600 dark:text-earth-400 hover:text-forest-500 text-sm transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
