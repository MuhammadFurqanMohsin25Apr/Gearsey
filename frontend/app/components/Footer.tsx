import { Link } from "react-router";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-base sm:text-xl font-black">G</span>
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-black">Gearsey</h3>
                <p className="text-xs text-gray-400 font-semibold">
                  AUTO PARTS
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Pakistan's premier marketplace for authentic vehicle spare parts.
              Trusted by thousands of customers nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm sm:text-base font-black mb-3 sm:mb-4 text-white">
              LINKS
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-red-500 transition-colors duration-300 text-xs sm:text-sm font-medium"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/auctions"
                  className="text-gray-400 hover:text-red-500 transition-colors duration-300 text-xs sm:text-sm font-medium"
                >
                  Live Auctions
                </Link>
              </li>
              <li>
                <Link
                  to="/manage-products"
                  className="text-gray-400 hover:text-red-500 transition-colors text-xs sm:text-sm font-medium"
                >
                  Sell Parts
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-red-500 transition-colors text-xs sm:text-sm font-medium"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-gray-400 hover:text-red-500 transition-colors text-xs sm:text-sm font-medium"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm sm:text-base font-black mb-3 sm:mb-4 text-white">
              CONTACT
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">
                    Main Office
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Karachi, PK
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">
                    Phone
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    +92 300 1234567
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">
                    Email
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    support@gearsey.pk
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400">
                    Hours
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    M-S: 9AM-6PM
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment & Security */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 text-center md:text-left">
              <p className="text-xs text-gray-500 font-semibold">
                SECURE PAYMENT:
              </p>
              <div className="flex gap-1 sm:gap-2">
                <div className="px-2 sm:px-3 py-1 bg-gray-800 rounded text-xs font-bold">
                  Credit Card
                </div>
                <div className="px-2 sm:px-3 py-1 bg-gray-800 rounded text-xs font-bold">
                  Debit Card
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <p className="text-xs text-gray-500 font-semibold">SSL SECURED</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black border-t border-gray-800">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col text-center gap-2 sm:gap-3">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Gearsey. All rights reserved.
            </p>
            <div className="flex gap-2 sm:gap-6 justify-center flex-wrap">
              <Link
                to="#"
                className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                to="#"
                className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium"
              >
                Terms of Service
              </Link>
              <Link
                to="#"
                className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
