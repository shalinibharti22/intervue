import React, { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import tower from "../assets/tower-icon.png";
import { getVariant } from "../utils/util"; // Your own color function

const PollingResult = ({ socket }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    const handleNewQuestion = (question) => setCurrentQuestion(question);

    socket.on("new-question", handleNewQuestion);
    return () => socket.off("new-question", handleNewQuestion);
  }, [socket]);

  if (!currentQuestion) return null;

  // SAFETY: compute total and resolve currentQuestion.results/optionsFrequency
  const freq = currentQuestion.optionsFrequency || {};
  const counts = currentQuestion.results || {};
  const options = Object.keys(freq);
  const totalVotes = options.reduce(
    (sum, opt) => sum + (Number(counts[opt]) || 0),
    0
  );

  return (
    <div className="border border-[#6edff6] bg-[#134652] mb-12 rounded-xl px-6 py-5 shadow-md max-w-xl mx-auto w-full">
      <h2 className="text-center flex items-center gap-2 justify-center font-bold text-2xl text-[#6edff6] mb-5">
        <img src={tower} alt="" width="28" height="28" className="mr-2" />
        Live Results
      </h2>
      {/* Option blocks */}
      <div className="space-y-4">
        {options.map((option, idx) => {
          const count = Number(counts[option]) || 0;
          const percent = totalVotes
            ? Math.round((count / totalVotes) * 100)
            : 0;
          return (
            <div
              key={option}
              className="flex items-center gap-3 rounded-lg bg-[#21657d] px-3 py-2 shadow hover:bg-[#1989a7]/90 transition"
            >
              {/* Option number (circle) */}
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#6edff6] text-[#134652] font-bold text-lg shadow">
                {idx + 1}
              </span>

              {/* Option Text + progress bar (grow) */}
              <div className="flex-1 flex flex-col">
                <div className="text-base text-white font-semibold">{option}</div>
                <ProgressBar
                  now={percent}
                  variant={getVariant(percent)}
                  className="h-3 rounded mt-1 bg-[#173b44] border"
                  style={{
                    minWidth: "140px",
                    boxShadow: "0 1px 5px #23a9c95d",
                  }}
                  animated
                />
              </div>

              {/* Edge display values */}
              <div className="flex flex-col items-end w-16 min-w-[60px] ml-2">
                <span className="text-white font-medium text-sm">{percent}%</span>
                <span className="text-[#b0e2f4] text-xs tracking-wide">
                  {count} vote{count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-xs text-[#69cdf1] mt-2 text-right font-medium italic">
        Total votes: {totalVotes}
      </div>
    </div>
  );
};

export default PollingResult;
