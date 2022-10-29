import { io } from 'socket.io-client';
export const socket = io('http://localhost:8000');
export let socketID = '';
socket.on('connect', () => {
    console.log(socket.id)
    socketID = socket.id
})