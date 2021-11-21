const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'frontend')));

let lobbyIndex = 1;
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('createLobby', (callback) => {
        console.log("createlobby");
        const lobbyId = (lobbyIndex++).toString();
        socket.join(lobbyId);
        callback({
            lobbyId: lobbyId
        })
    });
    socket.on('tracks', (data) => {
        const lobbyId = data.lobbyId;
        const tracks = data.tracks;
        const correct_track_id = data.correct_track_id;
        io.to(lobbyId).emit("tracks", {tracks: tracks, correct_track_id: correct_track_id});
    })
    socket.on('playerJoin', (data) => {
        const lobbyId = data.lobbyId;
        const playerId = data.playerId;
        console.log("playerJoin lobby:", lobbyId, "player:", playerId);
        socket.join(lobbyId);
        io.to(lobbyId).emit("playerJoin", {playerId: playerId});
    });
    socket.on('playerGuess', (data) => {
        const lobbyId = data.lobbyId;
        const playerId = data.playerId;
        const guessId = data.guessId;
        console.log("playerGuess lobby:", lobbyId, "player:", playerId, "guess:", guessId);
        io.to(lobbyId).emit("playerGuess", {playerId: playerId, guessId: guessId});
    });
});

server.listen(8000, () => {
    console.log('listening on *:8000');
});
