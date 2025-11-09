import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, Award, Users } from 'lucide-react';

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-secondary-500 to-accent-500 py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block animate-bounce-slow rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              🚗 Your Ultimate Vehicle Marketplace
            </div>
            <h1 className="mb-6 text-5xl font-bold text-white drop-shadow-lg md:text-7xl">
              Welcome to <span className="animate-pulse-slow">Gearsey</span>
            </h1>
            <p className="mb-8 text-xl text-white/90 md:text-2xl">
              The premier marketplace for vehicle parts, gear, and accessories.
              Buy, sell, and bid on quality automotive products with confidence.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/products">
                <Button size="lg" className="w-full bg-white text-primary-600 hover:bg-gray-100 sm:w-auto">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auctions">
                <Button variant="outline" size="lg" className="w-full border-2 border-white bg-transparent text-white hover:bg-white/10 sm:w-auto">
                  View Auctions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary-600">10K+</div>
              <div className="text-gray-600">Products Listed</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-secondary-600">5K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-accent-600">99%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="mb-4 text-center text-4xl font-bold">
            Why Choose <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Gearsey</span>?
          </h2>
          <p className="mb-12 text-center text-xl text-gray-600">
            Your trusted partner for all automotive needs
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border-2 border-primary-100 bg-gradient-to-br from-primary-50 to-white p-8 text-center transition-all hover:border-primary-300 hover:shadow-2xl">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg transition-transform group-hover:scale-110">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Quality Products</h3>
              <p className="text-gray-600">
                Verified sellers offering genuine automotive parts and accessories you can trust
              </p>
            </div>
            <div className="group rounded-2xl border-2 border-secondary-100 bg-gradient-to-br from-secondary-50 to-white p-8 text-center transition-all hover:border-secondary-300 hover:shadow-2xl">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 shadow-lg transition-transform group-hover:scale-110">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Live Auctions</h3>
              <p className="text-gray-600">
                Participate in exciting auctions and get the best deals on premium parts
              </p>
            </div>
            <div className="group rounded-2xl border-2 border-accent-100 bg-gradient-to-br from-accent-50 to-white p-8 text-center transition-all hover:border-accent-300 hover:shadow-2xl">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-600 shadow-lg transition-transform group-hover:scale-110">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Secure Payments</h3>
              <p className="text-gray-600">
                Safe and secure payment processing for complete peace of mind
              </p>
            </div>
            <div className="group rounded-2xl border-2 border-primary-100 bg-gradient-to-br from-primary-50 to-white p-8 text-center transition-all hover:border-primary-300 hover:shadow-2xl">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg transition-transform group-hover:scale-110">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Best Prices</h3>
              <p className="text-gray-600">
                Competitive pricing and great deals on all automotive products
              </p>
            </div>
            <div className="group rounded-2xl border-2 border-secondary-100 bg-gradient-to-br from-secondary-50 to-white p-8 text-center transition-all hover:border-secondary-300 hover:shadow-2xl">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 shadow-lg transition-transform group-hover:scale-110">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Top Rated</h3>
              <p className="text-gray-600">
                Award-winning platform trusted by thousands of users worldwide
              </p>
            </div>
            <div className="group rounded-2xl border-2 border-accent-100 bg-gradient-to-br from-accent-50 to-white p-8 text-center transition-all hover:border-accent-300 hover:shadow-2xl">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-600 shadow-lg transition-transform group-hover:scale-110">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Community</h3>
              <p className="text-gray-600">
                Join our thriving community of automotive enthusiasts and experts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 py-20 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="container relative text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Ready to Get Started?</h2>
          <p className="mb-8 text-xl opacity-90">
            Join thousands of satisfied customers and sellers on Gearsey today
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100 hover:scale-105"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
