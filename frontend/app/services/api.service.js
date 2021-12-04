app.factory('apiservice', ['$http', function ($http) {
    return {
        forcesearch: (tracks) => {
            console.log(tracks);
            return $http.post('/api/forcesearch/', {tracks: tracks}, {headers: { "Content-Type": "application/json" }})
        }
    };
}]);
