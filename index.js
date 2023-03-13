const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const WebSocket = require('ws');

const PORT = 25566;

const wss = new WebSocket.Server({ port: PORT });

const uri = "";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


let app = express();
app.use(express.static('/'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});


wss.on('connection', (ws) => {
    console.log('A client has connected');
  
    // Send a message to the client when they connect
    ws.send('Hello, client!');
  
    // Listen for messages from the client
    ws.on('message', (message) => {
      console.log(`Received message from client: ${message}`);
  
      // Send a response back to the client
      ws.send('Thanks for your message, client!');
    });
  
    // Listen for the WebSocket connection to close
    ws.on('close', () => {
      console.log('Client has disconnected');
    });
  });

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

