import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-md">
                <span className="text-xl font-bold">G</span>
              </div>
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-xl font-bold text-transparent">
                Gearsey
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Your trusted marketplace for quality vehicle parts, gear, and accessories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-gray-600 transition-colors hover:text-primary-600">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/auctions" className="text-gray-600 transition-colors hover:text-primary-600">
                  Live Auctions
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 transition-colors hover:text-primary-600">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-gray-600 transition-colors hover:text-primary-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 transition-colors hover:text-primary-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 transition-colors hover:text-primary-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Get In Touch</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-600" />
                support@gearsey.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-600" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-600" />
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} Gearsey. All rights reserved. Made with ❤️ for automotive enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
}
