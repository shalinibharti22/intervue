import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProgressBar, Button } from "react-bootstrap";
import tower from "../assets/tower-icon.png";
import { getVariant } from "../utils/util";

const Student = ({ socket }) => {
  const [name, setName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [connectedStudents, setConnectedStudents] = useState(null);
  const [votingValidation, setVotingValidation] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("studentName");

    if (storedName) {
      setName(storedName);
      setShowQuestion(true);
      socket.emit("student-set-name", { name: storedName });
    }

    const handleNewQuestion = (question) => {
      setCurrentQuestion(question);
      setShowQuestion(true);
      setSelectedOption("");

      setTimeout(() => {
        setShowQuestion(false);
      }, question.timer * 1000); // Convert seconds to milliseconds
    };

    const handleStudentVoteValidation = (connectedStudents) => {
      setConnectedStudents(connectedStudents);
    };

    socket.on("new-question", handleNewQuestion);
    socket.on("student-vote-validation", handleStudentVoteValidation);

    return () => {
      socket.off("new-question", handleNewQuestion);
      socket.off("student-vote-validation", handleStudentVoteValidation);
    };
  }, [socket]);

  useEffect(() => {
    const found = connectedStudents
      ? connectedStudents.find((data) => data.socketId === socket.id)
      : undefined;
    if (found) {
      setVotingValidation(found.voted);
    }
  }, [connectedStudents, socket.id]);

  const handleSubmit = () => {
    localStorage.setItem("studentName", name);
    socket.emit("student-set-name", { name });
    setShowQuestion(true);
  };

  const handlePoling = () => {
    socket.emit("handle-polling", {
      option: selectedOption,
    });
  };

  return (
    <div className="flex justify-center w-full p-20">
      {showQuestion && name ? (
        <div className="w-full max-w-xl border border-[#6edff6] bg-[#134652] rounded-md shadow-lg">
          <h1 className="text-center text-3xl font-bold py-6 text-[#6edff6]">
            Welcome, {name}
          </h1>

          {currentQuestion ? (
            currentQuestion.answered === false || votingValidation === false ? (
              <div className="gap-y-4 gap-x-4 border-t border-[#6edff6] px-10 py-12">
                <h2 className="text-xl font-bold text-white mb-6">
                  Question: {currentQuestion.question}
                </h2>
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex justify-between my-4 h-12 p-4 cursor-pointer items-center rounded-md 
                      ${selectedOption === option
                        ? "border-2 border-green-500 bg-green-300 text-black"
                        : "border border-[#6edff6] text-[#6edff6] hover:bg-[#6edff6] hover:text-black transition-colors duration-300"
                      }`}
                    onClick={() => setSelectedOption(option)}
                  >
                    {option}
                  </div>
                ))}
                <Button
                  className="h-10 bg-green-600 w-1/4 rounded-lg font-semibold"
                  variant="primary"
                  onClick={handlePoling}
                  disabled={!selectedOption}
                >
                  Submit
                </Button>
              </div>
            ) : (
              // Updated live results UI like the teacher's PollingResult component
              <div className="mt-12 mb-12 border border-[#6edff6] bg-[#134652] rounded-xl p-6 max-w-xl mx-auto shadow-md">
                <h2 className="text-center flex items-center justify-center font-bold text-2xl text-[#6edff6] mb-6">
                  <img
                    src={tower}
                    alt="tower icon"
                    width="24"
                    height="24"
                    className="mr-3"
                  />
                  Live Results
                </h2>
                <div className="space-y-4">
                  {Object.keys(currentQuestion.optionsFrequency).map((option, idx) => {
                    const count = Number(currentQuestion.results[option]) || 0;
                    const totalVotes = Object.values(currentQuestion.results)
                      .map((v) => Number(v))
                      .reduce((a, b) => a + b, 0) || 0;
                    const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
                    return (
                      <div
                        key={option}
                        className="flex items-center gap-3 rounded-md bg-[#21657d] px-4 py-2 shadow hover:bg-[#1989a7]/90 transition"
                      >
                        {/* Option number circle */}
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#6edff6] text-[#134652] font-bold text-lg shadow">
                          {idx + 1}
                        </span>

                        {/* Option text and progress bar */}
                        <div className="flex-1 flex flex-col">
                          <div className="text-white font-semibold text-base">{option}</div>
                          <ProgressBar
                            now={percent}
                            variant={getVariant(percent)}
                            className="h-3 rounded mt-1 bg-[#173b44] border border-[#0dcaf0]"
                            style={{
                              minWidth: "140px",
                              boxShadow: "0 1px 5px #23a9c95d",
                            }}
                            animated
                          />
                        </div>

                        {/* Percentage and count at edge */}
                        <div className="flex flex-col items-end w-20 min-w-[60px] ml-2">
                          <span className="text-white font-medium text-sm">{percent}%</span>
                          <span className="text-[#b0e2f4] text-xs tracking-wide">
                            {count} vote{count !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-[#69cdf1] mt-3 text-right font-medium italic">
                  Total votes:{" "}
                  {Object.values(currentQuestion.results)
                    .map((v) => Number(v))
                    .reduce((a, b) => a + b, 0) || 0}
                </div>
              </div>
            )
          ) : (
            <h1 className="flex justify-center font-bold text-xl text-[#6edff6] py-12">
              Waiting for question...
            </h1>
          )}
        </div>
      ) : (
        <div className="flex w-full justify-center flex-col items-center gap-y-4">
          <h2 className="text-2xl font-bold text-[#0dcaf0] mb-4 text-center">
            Enter your name to participate in the contest
          </h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="w-[45%] h-10 p-2.5 border border-[#0dcaf0] rounded-md bg-[#2a444a] outline-none text-white transition focus:ring-2 focus:ring-[#0dcaf0]"
          />
          <Button
            className="bg-blue-600 h-10 w-1/5 rounded-lg font-semibold"
            variant="info"
            size="lg"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default Student;
