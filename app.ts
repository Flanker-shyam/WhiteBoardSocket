import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8083 });

let sessionIdMap : {[key:string]:WebSocket[]} = {};

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");

  ws.on("message", (message: string) => {
    try {
      let parsedMessage = JSON.parse(message);

      if(parsedMessage.type === "sessionKey"){
        let sessionId = parsedMessage.key;

        if(sessionIdMap[sessionId]){
          sessionIdMap[sessionId].push(ws);
        }
        else{
          sessionIdMap[sessionId] = [ws];
        }
      }
      else{
        console.log("Broadcasting message to all subscribed clients");

        const clients = sessionIdMap[parsedMessage.type];
        if(clients){
          clients.forEach((client: WebSocket) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(parsedMessage.data);
            }
          });
        }
        else{
          console.log("NO clients found for session ID: ", parsedMessage.type);
        }
      }

    } catch (error) {
      console.error("Error parsing message: ", error);
    }
  });

 ws.on("close", () => {
    console.log("Client disconnected");
    removeFromMap(ws);
  });
});

function removeFromMap(value: WebSocket): void {
  for (const key in sessionIdMap) {
    if (sessionIdMap[key]) {
      sessionIdMap[key] = sessionIdMap[key].filter((item) => item !== value);
    }
  }
};

wss.on("error", (error: Error) => {
  console.error("WebSocket server error: ", error);
});
