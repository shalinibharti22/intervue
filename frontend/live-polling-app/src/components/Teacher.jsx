import React, { useState } from "react";
import PollingResult from "./PollingResult";
import { Button } from "react-bootstrap";

const Teacher = ({ socket }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [questionPublished, setQuestionPublished] = useState(false);
  const [timer, setTimer] = useState(60);

  const askQuestion = () => {
    const questionData = {
      question,
      options: options.filter((option) => option.trim() !== ""),
      timer,
    };

    if (socket && question && questionData.options.length) {
      socket.emit("teacher-ask-question", questionData);
      setQuestionPublished(true);
    }
  };

  const addOption = () => setOptions([...options, ""]);
  const updateOption = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const askAnotherQuestion = () => {
    setQuestionPublished(false);
    setQuestion("");
    setOptions([""]);
    setTimer(60);
  };

  // Color/theme variables
  const colors = {
    bg: "bg-gradient-to-br from-[#252850] via-[#245284] to-[#18cbb3]",
    card: "bg-[#212936]/95 shadow-xl border border-[#0dcaf0] border-opacity-20 rounded-2xl p-8 min-h-[24rem]",
    input:
      "w-full h-11 py-2 px-3 border border-[#5eead4] bg-[#283145] outline-none text-white rounded-lg shadow-sm focus:ring-2 focus:ring-[#12cfea] transition",
    textarea:
      "w-full min-h-[5rem] py-3 px-4 border border-[#38bdf8] bg-[#232f3e] outline-none text-white rounded-lg shadow focus:ring-2 focus:ring-[#18cbb3] transition",
  };

  return (
    <div
      className={`${colors.bg} flex items-center justify-center min-h-screen`}
      style={{
        background:
          "linear-gradient(135deg, #252850 0%, #245284 60%, #18cbb3 100%)",
      }}
    >
      <div className={colors.card} style={{ width: "520px" }}>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-[#18cbb3] mb-2 text-center tracking-wide drop-shadow">
            👩‍🏫 Teacher Interface
          </h1>
          {questionPublished ? (
            <>
              <PollingResult socket={socket} />
              <Button
                style={{
                  background:
                    "linear-gradient(90deg, #5eead4 0%, #38bdf8 90%)",
                  color: "#232f3e",
                  border: "none",
                  fontWeight: "600",
                  boxShadow:
                    "0 4px 24px 2px rgba(24,203,179,0.15), 0 1.5px 6px #48e0e33a",
                  marginTop: "2rem",
                  borderRadius: "1.8rem",
                }}
                className="py-2 text-lg tracking-wide shadow-lg transition hover:scale-105"
                onClick={askAnotherQuestion}
              >
                🔄 Ask Another Question
              </Button>
            </>
          ) : (
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                askQuestion();
              }}
            >
              <div>
                <label className="block mb-1 text-[#a0ecdf] font-medium">
                  Enter Question:
                </label>
                <textarea
                  className={colors.textarea}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What's the next poll question?"
                  maxLength={180}
                />
              </div>
              <div>
                <label className="block mb-1 text-[#a0ecdf] font-medium">
                  Enter Options:
                </label>
                <div className="flex flex-col gap-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        className={colors.input}
                        value={option}
                        onChange={(e) =>
                          updateOption(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        maxLength={48}
                        autoComplete="off"
                        required={index < 2} // first two options required
                      />
                      {options.length > 1 && (
                        <Button
                          size="sm"
                          style={{
                            background: "rgba(220,38,38,0.7)",
                            border: "none",
                            marginLeft: "0.5rem",
                            fontWeight: "bold",
                          }}
                          className="rounded-full hover:bg-red-500 transition"
                          onClick={() => {
                            setOptions(options.filter((_, i) => i !== index));
                          }}
                          title="Remove Option"
                          type="button"
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    style={{
                      background:
                        "linear-gradient(90deg, #38bdf8 0%, #5eead4 90%)",
                      border: "none",
                      color: "#232f3e",
                      fontWeight: 600,
                      borderRadius: "1.5rem",
                    }}
                    className="w-fit px-4 py-2 my-1 transition hover:scale-105"
                    onClick={addOption}
                    type="button"
                  >
                    ➕ Add option
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="timer"
                  className="text-[#a0ecdf] font-medium"
                >
                  Timer (seconds):
                </label>
                <input
                  id="timer"
                  type="number"
                  value={timer}
                  min={10}
                  max={180}
                  onChange={(e) => setTimer(Number(e.target.value))}
                  className="w-24 text-lg text-center rounded-md border-2 border-teal-400 focus:border-cyan-400 transition"
                  style={{ background: "#13292c" }}
                />
              </div>
              <Button
                type="submit"
                style={{
                  background:
                    "linear-gradient(90deg, #16eaff 0%, #2491eb 100%)",
                  border: "none",
                  fontWeight: 700,
                  letterSpacing: ".035em",
                  fontSize: "1.1rem",
                  boxShadow:
                    "0 2px 12px 2px rgba(36,145,235,0.14), 0 1px 3px #16eaff54",
                  borderRadius: "1.8rem",
                }}
                className="py-2 text-white mt-3 tracking-wide shadow-lg transition hover:scale-105"
              >
                🚀 Ask Question
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teacher;
