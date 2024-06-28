
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

server.listen(3001, () => {
  console.log("server is running");
});

let currentQuestion = {};
const connectedStudents = new Map();

io.on("connection", (socket) => {
  socket.on("teacher-ask-question", (questionData) => {
    const question = {
      question: questionData.question,
      options: questionData.options,
      optionsFrequency: {},
      answered: false,
      results: {},
    };

    question.options.forEach((option) => {
      question.optionsFrequency[option] = 0;
    });

    currentQuestion = question;

    io.emit("new-question", question);
  });

  socket.on("handle-polling", ({ option }) => {
    if (currentQuestion && currentQuestion.options?.includes(option)) {
      if (currentQuestion.optionsFrequency[option]) {
        currentQuestion.optionsFrequency[option] += 1;
      } else {
        currentQuestion.optionsFrequency[option] = 1;
      }

      const totalResponses = Object.values(
        currentQuestion.optionsFrequency
      ).reduce((acc, ans) => acc + ans);

      Object.keys(currentQuestion.optionsFrequency).forEach((option) => {
        const percentage =
          (currentQuestion.optionsFrequency[option] / totalResponses) * 100;
        currentQuestion.results[option] = percentage;
      });

      currentQuestion.answered = true;

      const student = connectedStudents.get(socket.id);
      if (student) {
        student.voted = true;
        connectedStudents.set(socket.id, student);
        io.emit("student-vote-validation", [...connectedStudents.values()]);
      }

      io.emit("new-question", currentQuestion);

      io.emit("polling-results", currentQuestion.results);
    }
  });

  socket.on("student-set-name", ({ name }) => {
    const student = {
      name,
      socketId: socket.id,
      voted: false,
    };

    connectedStudents.set(socket.id, student);
    console.log(`Student ${name} connected`);

    io.emit("student-connected", Array.from(connectedStudents.values()));
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");

    connectedStudents.get(socket.id);
    connectedStudents.delete(socket.id);

    io.emit("student-disconnected", Array.from(connectedStudents.values()));
  });
});
