/** Utils functions */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * Math.floor(max) + min);
}
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
