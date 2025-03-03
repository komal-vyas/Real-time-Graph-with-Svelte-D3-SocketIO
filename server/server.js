const io = require("socket.io")(3000, {
    cors: { origin: "*" } // Allow all origins (for dev)
  });
  
  setInterval(() => {
    io.emit("data", { timestamp: Date.now(), value: Math.random() * 100 });
  }, 1000);
  
  console.log("WebSocket server running on port 3000");