const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var sqlite3 = require('sqlite3');

app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.json({limit: '50mb'}));

var db = new sqlite3.Database('databases/trackspreview.db');
db.run("CREATE TABLE TracksPreviews (id TEXT PRIMARY KEY, previewUrl text)", (err) => {})

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
function checkInDb(track) {
    return new Promise(resolve => {
        db.get("SELECT previewUrl from TracksPreviews WHERE id = ?", track.id, (err, data) => {
            if (data && data.previewUrl) {
                resolve(data.previewUrl)
            } else {
                resolve(null);
            }
        })
    });
}
function saveInDb(id, previewUrl) {
    db.run("INSERT INTO TracksPreviews VALUES (?, ?)", [id, previewUrl], err => {
        if (err) {
            console.log("Insert error", err)
        }
    });
}
async function hackFetchPreviewUrl(track) {
    // first check in db to avoid too many requests to the embed site (scrapping is frowned upon after all)
    let dbPreviewUrl = await checkInDb(track);
    if (dbPreviewUrl) {
        return dbPreviewUrl;
    }
    let embedUrl = "https://open.spotify.com/embed/track/" + track.id;
    let response = await fetch(embedUrl);
    let text = await response.text();
    let matched = text.match(/preview_url%22%3A%22(.*)%3Fcid/);
    let previewUrl = "";
    if (matched && matched.length > 0) {
        previewUrl = decodeURIComponent(matched[1]);
    }
    // Save in db for next time !
    saveInDb(track.id, previewUrl);
    return previewUrl;
}
app.post('/api/forcesearch', async (req, res) => {
    let tracks = req.body.tracks;
    // console.log(tracks);
    for (var i = 0; i < tracks.length; i++) {
        if (!tracks[i].preview_url) {
            tracks[i].preview_url = await hackFetchPreviewUrl(tracks[i]);
        }
    }
    res.json({
        tracks: tracks
    });
});
server.listen(8000, () => {
    console.log('listening on *:8000');
});
