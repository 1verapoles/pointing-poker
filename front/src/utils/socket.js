import io from 'socket.io-client';

let socket = io( "http://localhost:5000/", { transports: ['websocket', 'polling'],
cors: {
  origin: '*'
} });

// socket.on("connect", () => {
//   console.log(17, socket.id); // x8WIv7-mJelg7on_ALbx
// });

export default socket;