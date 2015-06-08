var testing = require('./controllers/testing');

var initTestRoute = function(server){
    server.post('/processTesting', testing.processTesting);
};

var router = function(server){
    // initialize all the routers here
    initTestRoute(server);
};

module.exports = router;
