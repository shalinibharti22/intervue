import React, { useState } from "react";
import io from "socket.io-client";
import "../src/App.css";

import Teacher from "./components/Teacher";
import Student from "./components/Student";

const socket = io.connect("http://localhost:3001");

const App = () => {
  const [isTeacher, setIsTeacher] = useState(null);

  const handleRoleSelection = (role) => {
    setIsTeacher(role === "teacher");
  };

  return (
    <div
      className="flex h-screen justify-center items-center bg-[#032830] text-white"
    >
      {isTeacher === null ? (
        <div
          className="flex flex-col justify-center items-center w-80"
        >
          <h1>Select what type of user you are?</h1>
          <div
            className="flex justify-between w-1/2 mx-24 gap-x-12"
          >
            <button
              onClick={() => handleRoleSelection("teacher")}
              className="parentAndStudentButton"
            >
              I am a Teacher
            </button>
            <button
              onClick={() => handleRoleSelection("student")}
              className="parentAndStudentButton"
            >
              I am a Student
            </button>
          </div>
        </div>
      ) : isTeacher ? (
        <Teacher socket={socket} />
      ) : (
        <Student socket={socket} />
      )}
    </div>
  );
};

export default App;