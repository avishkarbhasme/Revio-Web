import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFacebook } from "react-icons/fa";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900  text-gray-300 py-8">
      <div className="container mx-auto px-10 flex flex-direction: row justify-between">

        {/* Contact Section */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-white">Contact</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <FaEnvelope /> <span>timepasstalkies12@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> <span>+91 7385465418</span>
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt /> <span>Tasgaon, Sangli, India</span>
            </li>
          </ul>
        </div>


        {/* Social Section */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-white">Follow Us</h2>
          <div className="flex gap-4 mt-2">
            <a target="_blank" href="https://github.com/avishkarbhasme" className="hover:text-white"><FaGithub size={22} /></a>
            <a target="_blank" href="https://www.linkedin.com/in/avishkar-bhasme-438307265?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B0ivcf4%2FdQXaBc5PnRu1CjQ%3D%3D" 
            className="hover:text-white"><FaLinkedin size={22} /></a>
            <a target="_blank" href="https://www.facebook.com/profile.php?id=100015474286776" 
            className="hover:text-white"><FaFacebook size={22} /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-8 border-t border-gray-700 pt-4 text-sm text-gray-400">
        © {new Date().getFullYear()} RevioCompany. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
