import { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Teacher from "./components/Teacher";
import Student from "./components/Student";

const socket = io.connect("https://localhost:3000");

function App() {
  const [isTeacher, setIsTeacher] = useState(null);
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    setIsTeacher(role === "teacher");
    if (role === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/student");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-[#032830] text-white">
      {isTeacher === null ? (
        <div className="flex flex-col justify-center items-center w-4/5">
          <h1>Select what type of user you are?</h1>
          <div className="flex justify-between w-1/2 m-24">
            <button onClick={() => handleRoleSelection("teacher")}>
              I am Teacher
            </button>
            <button onClick={() => handleRoleSelection("student")}>
              I am Student
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
}

export default App;
