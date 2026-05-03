"use client";

import Link from 'next/link';
import { Users } from 'lucide-react';

const LOGO_TEXT = "SmartHR";
const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 pt-20 pb-10 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Users size={24} className="text-[#185FA5]" />
            <span className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
              {LOGO_TEXT}
            </span>
          </Link>

          {/* Copyright */}
          <p className="text-gray-400 text-sm font-normal">
            © {YEAR} SmartHR Systems. All rights reserved. Built for modern teams.
          </p>

          {/* Links */}
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-sm font-medium text-gray-400 hover:text-[#185FA5] transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm font-medium text-gray-400 hover:text-[#185FA5] transition-colors">Terms</Link>
            <Link href="/support" className="text-sm font-medium text-gray-400 hover:text-[#185FA5] transition-colors">Support</Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-gray-50 dark:border-gray-800 pt-8">
          <div className="flex items-center gap-6">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#185FA5] transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#185FA5] transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-300 uppercase tracking-widest">
            Made with ❤️ in Morocco
          </div>
        </div>
      </div>
    </footer>
  );
}
