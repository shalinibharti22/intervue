
import React, { useState } from "react";
import PollingResult from "./PollingResult";
import { Button } from "react-bootstrap";

const Teacher = ({ socket }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [questionPublished, setQuestionPublished] = useState(false);

  const askQuestion = () => {
    const questionData = {
      question,
      options: options.filter((option) => option.trim() !== ""),
    };

    if (socket && question && questionData.options.length) {
      socket.emit("teacher-ask-question", questionData);
      setQuestionPublished(true);
    }
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const updateOption = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const askAnotherQuestion = () => {
    setQuestionPublished(false);
    setQuestion("");
    setOptions([""]);
  };

  return (
    <div
      className="w-[60%] h-[80vh] text-white"
    >
      <h1>Teacher Interface</h1>
      {questionPublished ? (
        <>
          <PollingResult socket={socket} />
          <Button variant="primary" onClick={askAnotherQuestion}>
            Ask Another Question?
          </Button>
        </>
      ) : (
        <div
         className="flex flex-col gap-y-4"
        >
          <label>Enter Question and Options</label>
          <textarea
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter question..."
            className="w-[50%] h-24 border border-[#0dcaf0] bg-[#2a444a] outline-none text-white rounded-md p-2.5"
          />
          <br />
          <label>Enter Options:</label>
          {options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Enter Option number ${index + 1}`}
                className="w-[35%] h-8 p-2 border border-[#0dcaf0] rounded-md bg-[#2a444a] outline-none text-white"
              />
            </div>
          ))}
          <div
            className="flex justify-between"
          >
            <Button variant="outline-info" onClick={addOption}>
              Add another option +
            </Button>
            <Button variant="primary" onClick={askQuestion}>
              Ask Question -&gt;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teacher;
