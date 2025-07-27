import React, { useState } from "react";
import io from "socket.io-client";
import "../src/App.css";

import Teacher from "./components/Teacher";
import Student from "./components/Student";

const socket = io.connect(
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://live-polling-app.onrender.com"
);

const App = () => {
  const [isTeacher, setIsTeacher] = useState(null);

  const handleRoleSelection = (role) => {
    setIsTeacher(role === "teacher");
  };

  return (
    <div className="flex h-screen justify-center items-center bg-[#032830] text-white px-4">
      {isTeacher === null ? (
        <section className="flex flex-col items-center max-w-md w-full bg-[#134652] rounded-2xl p-10 shadow-lg">
          <h1 className="text-4xl font-extrabold mb-10 text-[#6edff6] select-none drop-shadow-lg text-center">
            Select your role
          </h1>

          <div className="flex gap-8 w-full">
            <button
              onClick={() => handleRoleSelection("teacher")}
              className="flex-1 py-3 font-semibold rounded-lg bg-gradient-to-r from-[#0dcaf0] to-[#18cbb3] text-[#032830] shadow-md
                hover:from-[#15b7d1] hover:to-[#11a693] active:scale-95 active:shadow-sm transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-cyan-400"
              aria-label="I am a Teacher"
            >
              I am a Teacher
            </button>

            <button
              onClick={() => handleRoleSelection("student")}
              className="flex-1 py-3 font-semibold rounded-lg bg-gradient-to-r from-[#5eead4] to-[#38bdf8] text-[#032830] shadow-md
                hover:from-[#4cd7c0] hover:to-[#2bb6f0] active:scale-95 active:shadow-sm transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-sky-400"
              aria-label="I am a Student"
            >
              I am a Student
            </button>
          </div>
        </section>
      ) : isTeacher ? (
        <Teacher socket={socket} />
      ) : (
        <Student socket={socket} />
      )}
    </div>
  );
};

export default App;
