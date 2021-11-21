app.controller('MultiplayerLobbyController',
    ['$scope', 'Spotify', '$sce', '$timeout', '$window', '$document',
    function ($scope, Spotify, $sce, $timeout, $window, $document) {
        var socket = io();
        $scope.lobbyId = "";
        $scope.nbPlayers = 0;
        socket.emit("createLobby", (response) => {
            $scope.lobbyId = response.lobbyId;
            $scope.$apply();
            var qrcode = new QRCode(
                document.getElementById("qrcode"),
                "http://192.168.1.34:8000/#/multiplayerremote?lobbyId=" + $scope.lobbyId + "&playerId=" + $scope.nbPlayers
            );
            socket.on("playerJoin", (data) => {
                console.log("playerJoin", data.playerId);
                $scope.nbPlayers += 1;
                $scope.$apply();
                qrcode.makeCode("http://192.168.1.34:8000/#/multiplayerremote?lobbyId=" + $scope.lobbyId + "&playerId=" + $scope.nbPlayers);
            });
            socket.on("playerGuess", (data) => {
                console.log("playerGuess", data.playerId, data.guessId);
                $scope.choose($scope.tracks[parseInt(data.guessId)], parseInt(data.playerId));
            });
        });

        $scope.sample_time = 10;
        $scope.scores = [];
        $scope.track_counter = 0;
        $scope.MAX_TRACKS = 10;
        $scope.responses = [];
        var timer = 0;
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
            $scope.track_counter += 1;
            $scope.preview_url = $sce.trustAsResourceUrl(track.preview_url);
            if(pausetimeout) {
                $timeout.cancel(pausetimeout);
            }
            if (!$scope.sample_time) {
                $scope.sample_time = 29;
            }
            $timeout(function () {
                timer = Date.now();
                audio.currentTime = getRandomInt(0, 30 - $scope.sample_time);
                audio.play();
                audio.volume = $scope.volume;
                pausetimeout = $timeout(function () {
                    audio.pause();
                }, $scope.sample_time * 1000);
            }, 100);
        }

        $scope.start = function() {
            Spotify.getCategories({ country: 'FR' }).then(function (data) {
                $scope.categories = data.data.categories.items;
            }, function(data) {
                console.log("err ", data);
            });
        };
        $scope.selectcategory = function(c) {
            $scope.selected_category = c.id;
            Spotify.getCategoryPlaylists(c.id, {"country": "FR"}).then(function (data) {
                $scope.playlists = data.data.playlists.items;
            }, function(data) {
                console.log("err ", data);
            });
        };
        handle_playlist_tracks = function (data) {
            var tracks = data.data.items.map(function (elt) {
                return elt.track;
            });
            console.log(tracks);
            var filtered = tracks.filter(function (elt) {
                return elt.preview_url;
            });
            console.log(filtered);
            $scope.filtered_tracks = $scope.filtered_tracks.concat(filtered);
        };
        handle_err = function (data){
            console.log("err ", data);
        };
        $scope.selectplaylist = function(p) {
            $scope.selected_playlist = p.id;
            $scope.filtered_tracks = [];
            Spotify.getPlaylistTracks(p.owner.id, p.id, { limit: 50, market: "FR" }).then(function (data) {
                handle_playlist_tracks(data);
                if (data.data.total > 50) {
                    Spotify.getPlaylistTracks(p.owner.id, p.id, { limit: 50, offset: 50, market: "FR" }).then(function (data) {
                        handle_playlist_tracks(data);
                    }, handle_err);
                }
            }, handle_err);
        };
        $scope.generate_tracks = function(button) {
            var tracks = [];
            var number_of_tracks = 4;
            var tmpfiltered = $scope.filtered_tracks.slice();
            if (button) {
                $scope.track_counter = 0;
                $scope.scores = [];
                $scope.responses = [];
                for (var i = 0; i < $scope.nbPlayers; i++) {
                    $scope.responses.push([]);
                    $scope.scores.push(0);
                }
                $scope.message = "";
            }
            for (var i = 0; i < number_of_tracks; i++) {
                tracks[i] = tmpfiltered.splice(getRandomInt(0, tmpfiltered.length), 1)[0];
            }
            $scope.tracks = tracks;
            var correct_track_id = getRandomInt(0, number_of_tracks);
            $scope.random_track = tracks[correct_track_id];

            socket.emit("tracks", {
                tracks: tracks,
                correct_track_id: correct_track_id,
                lobbyId: $scope.lobbyId
            })
            play_track($scope.random_track);
        };
        compute_score = function() {
            var response_time = (Date.now() - timer) / 1000;
            var res;
            if (response_time > $scope.sample_time) {
                res = 1;
            } else {
                res =  ($scope.sample_time - response_time)/ $scope.sample_time * 15;
            }
            return res;
        };
        var nbGuesses = 0;
        $scope.choose = function(track, playerId) {
            if (!$scope.tracks) {
                // Not yet in track mode !
                return;
            }
            if ($scope.responses[playerId].length == $scope.track_counter) {
                // Going too fast, player has already guessed !
                return;
            }
            nbGuesses += 1;
            var waitime = 2000;
            var fzS = FuzzySet([$scope.random_track.id]);
            if (fzS.get(track.id, null, 0.9)) {
                var sc = compute_score();
                //$scope.message_success = "Bravo ! +" + sc + " points.";
                $scope.responses[playerId].push(sc);
                $scope.scores[playerId]+=sc;
            } else {
                //$scope.message_failure = "Perdu ! La bonne réponse était " + $scope.random_track.artists[0].name + " - " + $scope.random_track.name;
                //waitime = 5000;
                $scope.responses[playerId].push(false);
            }
            if (nbGuesses == $scope.nbPlayers && $scope.track_counter < $scope.MAX_TRACKS) {
                $scope.waiting = "Chanson suivante dans " + waitime/1000 + " secondes...";
                $timeout(function () {
                    $scope.message_success = "";
                    $scope.message_failure = "";
                    $scope.waiting = "";
                    nbGuesses = 0;
                    $scope.generate_tracks();
                    $scope.$apply();
                }, waitime);
            }

            $scope.$apply();
        };
        $scope.volume = 0.5;
        $scope.setVolume = function(value) {
            audio.volume = value;
        }
    }]
);
