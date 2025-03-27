import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="text-gray-300 text-center">
      © 2025{" "}
      <Link
        target="_blank"
        to="https://protfolio-shailesh-full-stack-developer.vercel.app">
        Shailesh Kale{" "}
      </Link>
      . All Rights Reserved.
    </div>
  );
};

export default Footer;
