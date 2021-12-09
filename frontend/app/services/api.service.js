app.factory('apiservice', ['$http', function ($http) {
    return {
        forcesearch: (tracks) => {
            console.log(tracks);
            return $http.post('/api/forcesearch/', {tracks: tracks}, {headers: { "Content-Type": "application/json" }})
        },
        loadstreakscores: (playlist_id) => {
            return $http.get('/api/loadstreakscores/' + playlist_id)
        },
        savestreakscore: (playlist_id, player_name, score) => {
            return $http.post('/api/savestreakscore/', {playlist_id: playlist_id, player_name: player_name, score: score})
        },
    };
}]);
