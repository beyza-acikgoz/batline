import React from "react";
import Link from "next/link";
import LogoLogican from "./LogoLogican";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-logican-lightGray text-logican-darkBlue shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Telif hakkı */}
        <p className="text-sm">© {new Date().getFullYear()} Logican. Tüm hakları saklıdır.</p>

        {/* Logo ve iletişim yan yana */}
        <div className="flex items-center space-x-4">
          <LogoLogican />
          <Link href="/contact" className="hover:underline text-sm">
            İletişim
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
