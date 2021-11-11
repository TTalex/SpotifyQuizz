var app = angular.module('SpotifyQuizz', ['ngRoute', 'spotify']);
app.config(function ($locationProvider, $routeProvider) {
    //This is used to avoid /#/ in the paths, (easier to resolve static files with node)
    //$locationProvider.html5Mode(true);
    $routeProvider
    .when('/', {
        controller: 'ArtistModeController',
        templateUrl: 'app/views/artistmode.view.html'
    })
    .when('/categorymode', {
        controller: 'CategoryModeController',
        templateUrl: 'app/views/categorymode.view.html'
    })
    .otherwise({
        redirectTo: '/'
    });
});

app.config(function (SpotifyProvider) {
    SpotifyProvider.setClientId('d778ed85a6e84c9bb4372929228be62a');
    SpotifyProvider.setRedirectUri('http://ttalex.hopto.org/SpotifyQuizz/callback.html');
    SpotifyProvider.setScope('');
});
