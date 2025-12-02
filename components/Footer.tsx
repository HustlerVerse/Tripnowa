import Link from 'next/link';
import { FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 - Logo and Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Tripnowa
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Discover the world's most extraordinary destinations. From ancient wonders to hidden gems, we help you plan unforgettable journeys.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 - Destinations */}
          <div>
            <h3 className="text-white font-semibold mb-4">Destinations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/world-wonders" className="text-gray-400 hover:text-white transition-colors text-sm">
                  World Wonders
                </Link>
              </li>
              <li>
                <Link href="/categories/romance" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Romantic Escapes
                </Link>
              </li>
              <li>
                <Link href="/categories/beaches" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Beach Paradises
                </Link>
              </li>
              <li>
                <Link href="/categories/mountains" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Mountain Adventures
                </Link>
              </li>
              <li>
                <Link href="/categories/cities" className="text-gray-400 hover:text-white transition-colors text-sm">
                  City Breaks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Regions */}
          <div>
            <h3 className="text-white font-semibold mb-4">Regions</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/places?country=Europe" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Europe
                </Link>
              </li>
              <li>
                <Link href="/places?country=Asia" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Asia
                </Link>
              </li>
              <li>
                <Link href="/places?country=Americas" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Americas
                </Link>
              </li>
              <li>
                <Link href="/places?country=Africa" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Africa
                </Link>
              </li>
              <li>
                <Link href="/places?country=Oceania" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Oceania
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Tripnowa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

