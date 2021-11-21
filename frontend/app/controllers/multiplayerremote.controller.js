app.controller('MultiplayerRemoteController',
    ['$scope', '$location',
    function ($scope, $location) {
        var socket = io();
        $scope.lobbyId = $location.search().lobbyId;
        $scope.playerId = $location.search().playerId;
        socket.emit("playerJoin", {
            lobbyId: $scope.lobbyId,
            playerId: $scope.playerId
        });
        var hasGuessed = false;
        socket.on("tracks", (data) => {
            console.log("tracks", data.tracks);
            $scope.tracks = data.tracks;
            for (var i = 0; i < $scope.tracks.length; i++) {
                $scope.tracks[i].class = "btn-info";
            }
            $scope.correct_track_id = data.correct_track_id;
            hasGuessed = false;
            $scope.$apply();
        });
        $scope.playerGuess =  function(guess) {
            if (!hasGuessed) {
                hasGuessed = true;
                socket.emit("playerGuess", {
                    lobbyId: $scope.lobbyId,
                    playerId: $scope.playerId,
                    guessId: guess
                });
                for (var i = 0; i < $scope.tracks.length; i++) {
                    console.log("i, $scope.correct_track_id, guess", i, $scope.correct_track_id, guess);
                    $scope.tracks[i].class = "btn-secondary";
                    if (i == $scope.correct_track_id) {
                        if (i == guess) {
                            $scope.tracks[i].class = "btn-success";
                        } else {
                            $scope.tracks[i].class = "btn-warning";
                        }
                    } else if (i == guess) {
                        $scope.tracks[i].class = "btn-danger";
                    }
                }
            }
        };
    }]
);
