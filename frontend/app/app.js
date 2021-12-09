var app = angular.module('SpotifyQuizz', ['ngRoute', 'spotify']);
app.config(function ($locationProvider, $routeProvider) {
    //This is used to avoid /#/ in the paths, (easier to resolve static files with node)
    //$locationProvider.html5Mode(true);
    $routeProvider
    .when('/', {
        controller: 'LandingController',
        templateUrl: 'app/views/landing.view.html'
    })
    .when('/artistmode', {
        controller: 'ArtistModeController',
        templateUrl: 'app/views/artistmode.view.html'
    })
    .when('/categorymode', {
        controller: 'CategoryModeController',
        templateUrl: 'app/views/categorymode.view.html'
    })
    .when('/streaksmode', {
        controller: 'StreaksModeController',
        templateUrl: 'app/views/streaksmode.view.html'
    })
    .when('/multiplayerlobby', {
        controller: 'MultiplayerLobbyController',
        templateUrl: 'app/views/multiplayerlobby.view.html'
    })
    .when('/multiplayerremote', {
        controller: 'MultiplayerRemoteController',
        templateUrl: 'app/views/multiplayerremote.view.html'
    })
    .otherwise({
        redirectTo: '/'
    });
});

app.config(function (SpotifyProvider) {
    SpotifyProvider.setClientId('d778ed85a6e84c9bb4372929228be62a');
    SpotifyProvider.setRedirectUri('http://ttalex.hopto.org/callback.html');
    SpotifyProvider.setScope('');
    SpotifyProvider.setScope('user-top-read');
});
