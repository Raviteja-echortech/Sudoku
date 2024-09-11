const io = require('socket.io')(3000, {
    cors: {
      origin: "*",
    },
});

let gameState = {
  board: [
    { items: "", id: 1 },
    { items: "", id: 2 },
    { items: "", id: 3 },
    { items: "", id: 4 },
    { items: "", id: 5 },
    { items: "", id: 6 },
    { items: "", id: 7 },
    { items: "", id: 8 },
    { items: "", id: 9 },
  ],
  switchCondition: true,
};

const winningCombinations = [
  [0, 1, 2], [0, 4, 8], [2, 4, 6],
  [2, 5, 8], [0, 3, 6], [3, 4, 5],
  [6, 7, 8], [1, 4, 7],
];

const checkWinner = (board, player) => {
  return winningCombinations.some(combination =>
    combination.every(index => board[index].items === player)
  );
};

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send the initial game state to the connected client
  socket.emit("game_update", gameState);

  socket.on("game_update", (data) => {
    gameState = data;

    io.emit("game_update", gameState); // this statement is to run the code in on both the client

    if (checkWinner(gameState.board, "O")) {
      io.emit("game_winner", "Winner O");
    } else if (checkWinner(gameState.board, "X")) {
      io.emit("game_winner", "Winner X");
    } else {
      const allBoxesFilled = gameState.board.every(box => box.items !== "");
      if (allBoxesFilled) {
        io.emit("game_winner", "It's a Tie!");
      }
    }
  });

  socket.on("reset_game", (resetData) => {
    gameState = resetData;
    io.emit("game_update", gameState);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
