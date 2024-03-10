import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8083 });

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.on('message', (message: string) => {
        try {
            const parsedMessage = JSON.parse(message);
            console.log('Received: ', parsedMessage);

            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(parsedMessage));
                }
            });
        } catch (error) {
            console.error('Error parsing message: ', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

wss.on('error', (error: Error) => {
    console.error('WebSocket server error: ', error);
});
