"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ port: 8083 });
let sessionIdMap = {};
wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.on("message", (message) => {
        try {
            let parsedMessage = JSON.parse(message);
            console.log("Message received after parse first: ", parsedMessage);
            if (parsedMessage.type === "sessionKey") {
                let sessionId = parsedMessage.key;
                if (sessionIdMap[sessionId]) {
                    sessionIdMap[sessionId].push(ws);
                }
                else {
                    sessionIdMap[sessionId] = [ws];
                }
                console.log("Client is subscribed to session: ", sessionId);
                console.log("type of key: ", typeof sessionId);
            }
            else {
                console.log("Broadcasting message to all subscribed clients");
                const clients = sessionIdMap[parsedMessage.type];
                if (clients) {
                    clients.forEach((client) => {
                        console.log("sending...... in loop");
                        if (client !== ws && client.readyState === ws_1.default.OPEN) {
                            console.log("sending message to client112222222222222222: ");
                            client.send(parsedMessage.data);
                        }
                    });
                }
                else {
                    console.log("NO clients found for session ID: ", parsedMessage.type);
                }
            }
        }
        catch (error) {
            console.error("Error parsing message: ", error);
        }
    });
    ws.on("close", () => {
        console.log("Client disconnected");
        // Remove WebSocket connection from sessionMap when client disconnects
        removeFromMap(ws);
    });
});
// Removing a specific value from all arrays in the map
function removeFromMap(value) {
    for (const key in sessionIdMap) {
        if (sessionIdMap[key]) {
            sessionIdMap[key] = sessionIdMap[key].filter((item) => item !== value);
        }
    }
}
;
wss.on("error", (error) => {
    console.error("WebSocket server error: ", error);
});
