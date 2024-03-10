"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ port: 8083 });
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            console.log('Received: ', parsedMessage);
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify(parsedMessage));
                }
            });
        }
        catch (error) {
            console.error('Error parsing message: ', error);
        }
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
wss.on('error', (error) => {
    console.error('WebSocket server error: ', error);
});
