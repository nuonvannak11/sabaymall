import React from "react";
import Header from "@/components/Header";

export default function Center() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        <div className="w-full md:w-1/3 p-1 rounded-2xl bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
          <div className="bg-[#121212] rounded-xl p-8 h-full flex flex-col items-center text-center">
            <img
              src="https://placehold.co/150x150/222/fff?text=JD"
              alt="Profile Picture of John Doe"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-lg"
            />

            <h2 className="mt-6 text-2xl font-bold text-white">
              John <span className="text-pink-400">Doe</span>
            </h2>

            <p className="mt-1 text-gray-400">Web Developer</p>
          </div>
        </div>

        <div className="w-full md:w-2/3 p-1 rounded-2xl bg-gradient-to-br from-pink-500 to-blue-500">
          <div className="bg-[#121212] rounded-xl p-8 h-full text-white">
            <h3 className="text-xl font-bold text-pink-300 mb-6">
              Profile Details
            </h3>

            <div className="space-y-4 text-gray-300">
              <div className="flex">
                <p className="w-24 font-semibold text-gray-400">Name</p>
                <p>: John Doe</p>
              </div>
              <div className="flex">
                <p className="w-24 font-semibold text-gray-400">Age</p>
                <p>: 35</p>
              </div>
              <div className="flex">
                <p className="w-24 font-semibold text-gray-400">Mobile</p>
                <p>: +91 XXXXXXXXXX</p>
              </div>
              <div className="flex">
                <p className="w-24 font-semibold text-gray-400">Email</p>
                <p>: john@example.com</p>
              </div>
              <div className="flex">
                <p className="w-24 font-semibold text-gray-400">Address</p>
                <p>: 123 Main St, Anytown, USA</p>
              </div>
            </div>

            {/* Footer */}
            <p className="mt-10 text-center text-gray-500">
              Made with <span className="text-red-500">&hearts;</span> by
              Learning Robo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
