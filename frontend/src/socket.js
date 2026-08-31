// Shared Socket.io connection — Person 5 builds on this
// Everyone imports this same socket instance so events stay consistent

import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || (window.location.hostname !== 'localhost' ? window.location.origin : 'http://localhost:5000');

export const socket = io(SOCKET_URL, { autoConnect: window.location.hostname === 'localhost' });
