import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-accent/20 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">StartFund</h3>
            <p className="text-gray-300 mb-4">
              Empowering entrepreneurs and investors to build the future together. 
              Join our community to support innovative startups and make a difference.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-accent">Home</Link>
              </li>
              <li>
                <Link to="/guest" className="text-gray-300 hover:text-accent">Browse Projects</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-accent">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-accent">Register</Link>
              </li>
              <li>
                <Link to="/create-campaign" className="text-gray-300 hover:text-accent">Start a Campaign</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-accent">How It Works</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-accent">Success Stories</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-accent">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-accent">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-accent">Community Guidelines</a>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">Legal & Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-accent">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-accent">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-accent">Cookie Policy</a>
              </li>
              <li>
                <a href="mailto:support@startfund.com" className="text-gray-300 hover:text-accent">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-accent">FAQ</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-accent/20 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} StartFund. All rights reserved.</p>
          <p className="mt-2 text-sm">
            StartFund is a platform for crowdfunding innovative startups. 
            Investing in startups involves risk. Please read our terms and conditions carefully.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 