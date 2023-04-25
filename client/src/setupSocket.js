import { io } from 'socket.io-client';

const socket = io(process.env.SETUP_URL);

export default socket;
