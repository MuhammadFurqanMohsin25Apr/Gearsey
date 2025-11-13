import { Link } from "react-router";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-xl font-black">G</span>
              </div>
              <div>
                <h3 className="text-xl font-black">Gearsey</h3>
                <p className="text-xs text-gray-400 font-semibold">AUTO PARTS</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Pakistan's premier marketplace for authentic vehicle spare parts. Trusted by thousands of customers nationwide.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300">
                <span className="text-sm font-bold">FB</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300">
                <span className="text-sm font-bold">TW</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300">
                <span className="text-sm font-bold">IG</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300">
                <span className="text-sm font-bold">YT</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-black mb-4 text-white">QUICK LINKS</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-red-500 transition-colors duration-300 text-sm font-medium">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/auctions" className="text-gray-400 hover:text-red-500 transition-colors duration-300 text-sm font-medium">
                  Live Auctions
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                  Sell Parts
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-base font-black mb-4 text-white">CATEGORIES</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Engine" className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                  Engine Parts
                </Link>
              </li>
              <li>
                <Link to="/products?category=Wheels" className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                  Wheels & Tires
                </Link>
              </li>
              <li>
                <Link to="/products?category=Brakes" className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                  Brake System
                </Link>
              </li>
              <li>
                <Link to="/products?category=Suspension" className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                  Suspension
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electrical" className="text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
                  Electrical Parts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-base font-black mb-4 text-white">CONTACT US</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-400">Main Office</p>
                  <p className="text-sm text-gray-500">Karachi, Pakistan</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-400">Phone</p>
                  <p className="text-sm text-gray-500">+92 300 1234567</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-400">Email</p>
                  <p className="text-sm text-gray-500">support@gearsey.pk</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-400">Working Hours</p>
                  <p className="text-sm text-gray-500">Mon-Sat: 9AM - 6PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment & Security */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-500 font-semibold">SECURE PAYMENT:</p>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-gray-800 rounded text-xs font-bold">VISA</div>
                <div className="px-3 py-1 bg-gray-800 rounded text-xs font-bold">MC</div>
                <div className="px-3 py-1 bg-gray-800 rounded text-xs font-bold">JAZZ</div>
                <div className="px-3 py-1 bg-gray-800 rounded text-xs font-bold">EASY</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">🔒</span>
              <p className="text-xs text-gray-500 font-semibold">SSL SECURED</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Gearsey. All rights reserved. Built with ❤️ in Pakistan
            </p>
            <div className="flex gap-6">
              <Link to="#" className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link to="#" className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium">
                Terms of Service
              </Link>
              <Link to="#" className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
