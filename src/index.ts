import WebSocket, {WebSocketServer} from 'ws'

//websocket server gets a new instance and expects a port

const wss = new WebSocketServer({port: 3000})

//used for identifying the user count
let userCount = 0;

interface User{
    socket: WebSocket,
    room: string
}
//creating this global array to send the message to all the users present in the array
let allSockets: User[] = [];


wss.on('connection',(socket)=>{
    
    socket.on('message', (message) => {
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
    
        if (parsedMessage.type === 'join') {
            console.log('user joined the room ' + parsedMessage.payload.roomId)
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
    
        if (parsedMessage.type === 'chat') {
            console.log('user joined chat')
            const currentUser = allSockets.find((x) => x.socket === socket)?.room;
           for(let i=0; i<allSockets.length; i++){
                if(allSockets[i].room == currentUser){
                    allSockets[i].socket.send(parsedMessage.payload.message)
                }
           }
        }
    });
    
});


//hard things to watch out for
//1.Send and receive from server
//2. How to send a message to existing client
//3. How to broadcast message from one user to one/multiple users
