# SpotifyQuizz
![SpotifyQuizz](frontend/assets/img/logo.png)

SpotifyQuizz is a song guessing game using Spotify and Angularjs.

It has two game modes: **Artist mode** and **Category mode**. Work is in progress to add a local **Mutiplayer mode**.

### Artist mode
In the artist mode, the player choses an artist, and ten of its songs are selected.

Each round, a sample of one of the songs is played for a given duration, the player has to guess which song is playing. If the player is right, the duration shortens for the next guesses. If he is wrong the duration increases.

The goal is to reach a duration of 1 second and correctly guess the song

### Category mode
> *UI is a work in progress*

In the category mode, the player choses a playlist from which songs are randomly picked.

Each round, a song is played and four choices are given to the player. Quick guess yield more points, but a wrong guess gives no points.

The goal is to get as many points as possible at the end of the ten songs. With 15 points maximum per song, the best reachable score is 150.

## Try it online
[Demo](http://TTalex.hopto.org/SpotifyQuizz)

## Self deployment
First, be sure to edit `frontend/app/app.js` with your Spotify app ID, and configure a valid callback URI

Then, install the dependencies
```
npm install
```

And run, the server runs on port 8000 by default
```
node server.js
```
