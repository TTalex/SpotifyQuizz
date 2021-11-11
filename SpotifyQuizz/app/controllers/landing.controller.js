app.controller('LandingController',
['$scope', 'Spotify', '$window',
function ($scope, Spotify, $window) {
    var spotifyToken = $window.localStorage.getItem("spotify-token");
    var spotifyExpiration = parseInt($window.localStorage.getItem("spotify-expiration") || 0);
    console.log(new Date(spotifyExpiration))
    if (spotifyToken && (spotifyExpiration > Date.now() + 10 * 60 * 1000)) {
        Spotify.setAuthToken(spotifyToken);
        $scope.needs_spotify_pairing = false;
    } else {
        $scope.needs_spotify_pairing = true;
    }
    $scope.login = function () {
        Spotify.login().then(function (data) {
            console.log(data);
            $scope.needs_spotify_pairing = false;
        }, function () {
            console.log('didn\'t log in');
        });
    };
}]);
