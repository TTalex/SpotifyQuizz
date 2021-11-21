app.controller('ArtistModeController',
['$scope', 'Spotify', '$sce', '$timeout', '$window',
function ($scope, Spotify, $sce, $timeout, $window) {
    $scope.sample_time = 10;
    //var artist = 'Macklemore & Ryan Lewis';
    $scope.artist = 'Rage against the machine';
    var audio = document.getElementById("audioelement");
    var pausetimeout;
    var spotifyToken = $window.localStorage.getItem("spotify-token");
    var spotifyExpiration = parseInt($window.localStorage.getItem("spotify-expiration") || 0);
    if (spotifyToken && (spotifyExpiration > Date.now() + 10 * 60 * 1000)) {
        Spotify.setAuthToken(spotifyToken);
    } else {
        $window.location.href = "/";
    }
    function play_track(track) {
        console.log(track);
        $scope.preview_url = $sce.trustAsResourceUrl(track.preview_url);
        if(pausetimeout) {
            $timeout.cancel(pausetimeout);
        }
        $timeout(function () {
            audio.currentTime = getRandomInt(0, 30 - $scope.sample_time);
            audio.play();
            audio.volume = $scope.volume;
            pausetimeout = $timeout(function () {
                audio.pause();
            }, $scope.sample_time * 1000);
        }, 100);
    }
    function play_random_track() {
        $scope.random_track = $scope.filtered_tracks[getRandomInt(0, $scope.filtered_tracks.length)];
        play_track($scope.random_track);
    }
    $scope.start = function() {
        $scope.tries = 0;
        Spotify.search($scope.artist, 'artist').then(function (data) {
            console.log(data);
            var artist_uri = data.data.artists.items[0].uri;
            Spotify.getArtistTopTracks(artist_uri, 'FR').then(function(data) {
                console.log(data);
                var tracks = data.data.tracks;
                $scope.filtered_tracks = tracks.filter(function (elt) {
                    return elt.preview_url;
                });
                $scope.tracks = $scope.filtered_tracks.map(function (elt) {
                    return elt.name;
                });
                $scope.tracks = uniq($scope.tracks);
                if ($scope.tracks.length === 0) {
                    $scope.message_failure = "Aucune musique disponible pour cet artiste";
                } else {
                    play_random_track();
                }
            });
        }, function(data) {
            console.log("err ", data);
        });
    };
    $scope.choose = function(track) {
        var waitime = 1000;
        $scope.tries += 1;
        var fzS = FuzzySet([$scope.random_track.name]);
        if (fzS.get(track, null, 0.9)) {
            $scope.message_success = "Bravo !";
            $scope.message_failure = "";
            if ($scope.sample_time > 1) {
                $scope.sample_time = parseInt($scope.sample_time) - 1;
            } else {
                $scope.message_success = "Victoire sur " + $scope.artist + " en " + $scope.tries + " coups !";
                $scope.sample_time = 10;
                return;
            }
        } else {
            $scope.message_failure = "Perdu ! La bonne réponse était " + $scope.random_track.name;
            $scope.message_success = "";
            if ($scope.sample_time < 30) {
                $scope.sample_time = parseInt($scope.sample_time) + 1;
            }
            waitime = 5000;
        }
        $scope.waiting = "Chanson suivante dans " + waitime/1000 + " secondes...";
        $timeout(function () {
            $scope.message_success = "";
            $scope.message_failure = "";
            $scope.waiting = "";
            play_random_track();
        }, waitime);
    };
    $scope.volume = 0.5;
    $scope.setVolume = function(value) {
        audio.volume = value;
    }
    //
    // $timeout(function () {
    //     audio.play();
    // }, 2000);
}]);
