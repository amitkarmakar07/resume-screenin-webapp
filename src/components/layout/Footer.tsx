
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} HiringHive. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-app-primary text-sm">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-app-primary text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-app-primary text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-app-primary text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
