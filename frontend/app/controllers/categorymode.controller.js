app.controller('CategoryModeController',
    ['$scope', 'Spotify', '$sce', '$timeout', '$window', '$document', 'apiservice',
    function ($scope, Spotify, $sce, $timeout, $window, $document, apiservice) {
        $scope.sample_time = 10;
        $scope.score = 0;
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
                $scope.categories.push({
                    name: "MES PLAYLISTS",
                    id: "MES PLAYLISTS"
                })
            }, function(data) {
                console.log("err ", data);
            });
        };
        $scope.selectcategory = function(c) {
            if (c.name == "MES PLAYLISTS") {
                Spotify.getCurrentUser().then(function (data) {
                    console.log("getCurrentUser data", data)
                    Spotify.getUserPlaylists(data.data.id).then(function(data) {
                        console.log("getUserPlaylists data", data)
                        $scope.playlists = data.data.items;
                        $scope.playlists.push({
                            name: "MES TOP TRACKS",
                            id: "MES TOP TRACKS"
                        })
                    })
                })
            } else {
                $scope.selected_category = c.id;
                Spotify.getCategoryPlaylists(c.id, {"country": "FR"}).then(function (data) {
                    $scope.playlists = data.data.playlists.items;
                }, function(data) {
                    console.log("err ", data);
                });
            }
        };
        handle_playlist_tracks = function (tracks) {
            console.log(tracks);
            var filtered = tracks.filter(function (elt) {
                return elt.preview_url;
            });
            console.log(filtered);
            $scope.filtered_tracks = $scope.filtered_tracks.concat(filtered);
        };
        function forcesearch(tracks) {
            apiservice.forcesearch(tracks)
            .success((data) => {
                handle_playlist_tracks(data.tracks)
            })
        }
        handle_err = function (data){
            console.log("err ", data);
        };
        function handle_playlist_tracks_result(data, moredata) {
            var tracks = data.data.items.map(function (elt) {
                return elt.track;
            });
            if (moredata) {
                var moretracks = moredata.data.items.map(function (elt) {
                    return elt.track;
                });
                tracks = tracks.concat(moretracks);
            }
            if ($scope.forcesearch_selected) {
                forcesearch(tracks);
            } else {
                handle_playlist_tracks(tracks);
            }
        }
        $scope.selectplaylist = function(p) {
            $scope.selected_playlist = p.id;
            $scope.filtered_tracks = [];
            if (p.id == "MES TOP TRACKS") {
                Spotify.getUserTopTracks().then(function (data) {
                    console.log("getUserTopTracks", data);
                    var tracks = data.data.items;
                    if ($scope.forcesearch_selected) {
                        forcesearch(tracks);
                    } else {
                        handle_playlist_tracks(tracks);
                    }
                });
                return;
            }
            Spotify.getPlaylistTracks(p.owner.id, p.id, { limit: 50, market: "FR" }).then(function (data) {
                if (data.data.total > 50) {
                    Spotify.getPlaylistTracks(p.owner.id, p.id, { limit: 50, offset: 50, market: "FR" }).then(function (moredata) {
                        handle_playlist_tracks_result(data, moredata);
                    }, handle_err);
                } else {
                    handle_playlist_tracks_result(data);
                }
            }, handle_err);
        };
        $scope.generate_tracks = function(button) {
            var tracks = [];
            var number_of_tracks = 4;
            var tmpfiltered = $scope.filtered_tracks.slice();
            if (button) {
                $scope.track_counter = 0;
                $scope.score = 0;
                $scope.responses = [];
                $scope.message_success = "";
                $scope.message_failure = "";
            }
            for (var i = 0; i < number_of_tracks; i++) {
                tracks[i] = tmpfiltered.splice(getRandomInt(0, tmpfiltered.length), 1)[0];
            }
            $scope.tracks = tracks;
            $scope.random_track = tracks[getRandomInt(0, number_of_tracks)];
            play_track($scope.random_track);
        };
        add_score = function() {
            var response_time = (Date.now() - timer) / 1000;
            var res;
            if (response_time > $scope.sample_time) {
                res = 1;
            } else {
                res =  ($scope.sample_time - response_time)/ $scope.sample_time * 15;
            }
            $scope.score += res;
            return res;
        };
        $document.bind('keyup', function (e) {
            switch (e.keyCode) {
                case 97:
                case 49:
                    $scope.choose($scope.tracks[1 - 1]);
                    break;
                case 98:
                case 50:
                    $scope.choose($scope.tracks[2 - 1]);
                    break;
                case 99:
                case 51:
                    $scope.choose($scope.tracks[3 - 1]);
                    break;
                case 100:
                case 52:
                    $scope.choose($scope.tracks[4 - 1]);
                    break;
                default:

            }
            $scope.$apply();
        });
        $scope.choose = function(track) {
            if (!$scope.tracks) {
                // Not yet in track mode !
                return;
            }
            var waitime = 2000;
            var fzS = FuzzySet([$scope.random_track.id]);
            if (fzS.get(track.id, null, 0.9)) {
                var sc = add_score();
                $scope.message_success = "Bravo ! +" + sc + " points.";
                $scope.responses.push(sc);
            } else {
                $scope.message_failure = "Perdu ! La bonne r??ponse ??tait " + $scope.random_track.artists[0].name + " - " + $scope.random_track.name;
                waitime = 5000;
                $scope.responses.push(false);
            }
            if ($scope.track_counter < $scope.MAX_TRACKS) {
                $scope.waiting = "Chanson suivante dans " + waitime/1000 + " secondes...";
                $timeout(function () {
                    $scope.message_success = "";
                    $scope.message_failure = "";
                    $scope.waiting = "";
                    $scope.generate_tracks();
                }, waitime);
            }
        };
        $scope.volume = 0.5;
        $scope.setVolume = function(value) {
            audio.volume = value;
            $scope.volume = value;
        }
    }
]);
