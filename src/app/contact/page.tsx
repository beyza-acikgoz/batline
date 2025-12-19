import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="font-sans min-h-screen p-8 sm:p-50 pt-[100px]">
      <div className="flex flex-col space-y-4 text-logican-darkGray">
        <h1 className="text-2xl font-bold">İletişim</h1>
        <p className="text-2x1 font-bold">
          logiCAN Otomasyon ve Test Sistemleri Ltd. Şti.
        </p>
        <p className="flex items-start space-x-2">
          <FaMapMarkerAlt className="mt-1" />
          <span>
            Yıldırım Beyazıt Mah. Aşık Veysel Blv.<br />
            Erciyes University Technology Development Zone No:63/S Melikgazi/Kayseri<br />
            Zip: 38030
          </span>
        </p>
        <p className="flex items-center space-x-2">
          <FaPhone />
          <a href="tel:+903525027868" className="hover:underline text-blue-500">
            +90 352 502 7868
          </a>
        </p>
        <p className="flex items-center space-x-2">
          <FaEnvelope />
          <a
            href="mailto:info@logican.com.tr"
            className="hover:underline text-blue-500"
          >
            info@logican.com.tr
          </a>
        </p>

      </div>
    </main>

  );
}
