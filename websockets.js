const WebSockets = require('ws');
const {getIdFromToken} = require('./Util/TokenService')
const messageDB = require('./DataBase/messagesDB');

const wss = new WebSockets.Server({noServer: true});
const connectedClients = new Map();


wss.on('connection', async (ws, request) => {


    const token = request.headers['authorization'];
    const clientId = getIdFromToken(token);
    connectedClients.set(clientId, ws);
    //console.log(clientId);

    const messages = await messageDB.getAllMessagesForReceiver(clientId,)

    if (!messages) {
      messages.array.forEach(message => {
        const m = {
          code: 0,
          data: {
            senderId: message.senderId,
            messageId: message.messageId,
            messageContent: message.content
          }
        }
        ws.send(JSON.parse(JSON.stringify(m)));
      });
    }
    
    ws.on('message',async (message) => {
      try {
        const {eventCode, data} = JSON.parse(message);
        //console.log(message);

        switch(eventCode) {
          
          case 0:
            const {receiverId, messageId, messageContent} = data;
            if (connectedClients.has(clientId)) {
                const receiver = connectedClients.get(receiverId);
                
                const m = {
                    code: 0,
                    data: {
                      senderId: clientId,
                      messageId,
                      messageContent
                    }
                }
                receiver.send(JSON.stringify(m));
            }
            else {
              const sendTime = Date.now();
              await messageDB.sendMessage(messageId, messageContent, clientId, receiverId, sendTime.toString())
            }
            break;

          default:
            ws.send(JSON.stringify({responseCode: 400}));
            break;
        };

      }
      catch (err) {
        console.error(err);
        ws.emit('error', 'Invalid message format');
      };
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
      connectedClients.delete(senderId);
    });
});

function handleUpgrade(req, socket, head) {
    const token = req.headers['authorization'];

  //console.log(token);
  //console.log(req.headers);
  if (!token) {
    socket.destroy();
  }
  else {
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
  }
}


module.exports = {
    handleUpgrade
}