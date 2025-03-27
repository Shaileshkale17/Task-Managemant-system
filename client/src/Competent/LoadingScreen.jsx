import React from "react";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex space-x-2 gap-2 text-4xl font-bold text-gray-300">
        {["T", "A", "S", "K", ".", ".", "."].map((char, index) => (
          <span
            key={index}
            className="animate-bounce"
            style={{ animationDelay: `${index * 200}ms` }}>
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
