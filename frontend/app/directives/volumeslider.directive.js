app.directive('volumeslider', function() {
    return {
        scope: {
            "setvolume": "="
        },
        link: function(scope, elem, attrs) {
            var volume_input = angular.element(document.querySelector('#volume'));
            volume_input.on("change", function(evt){
                scope.setvolume(parseFloat(evt.target.value) / 100)
            });
        },
        template: '<div id="volumeslider"><i class="fa fa-volume-down"></i><input type="range" id="volume"></input><i class="fa fa-volume-up"></i></div>'
    }
})
