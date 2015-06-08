// Load required packages
var config   = require('config');
var restify  = require('restify');
var mongoose = require('mongoose');
var redis    = require('redis');
var url		 = require('url');

/**** Set Environment Variables ****/
var server = restify.createServer();
var env = process.env.NODE_ENV || 'dev';
console.log(env);

/**** Init MongoDB ****/
var initMongo;
initMongo = function () {
    var db_config = null;
    var url = null;

    if (env == 'dev') {
        db_config = config.get('PROJECT_NAME.MONGO_DEV');
        url = 'mongodb://' + db_config.host + ':' + db_config.port + '/' + db_config.dbName;
    } else if (env == 'production') {
        db_config = config.get("PROJECT_NAME.MONGO_PROD");
        url = 'mongodb://' + db_config.user + ':' + db_config.password + '@' + db_config.host + ':' + db_config.port + '/' + db_config.dbName;
    }

    mongoose.connect(url, {server: {auto_reconnect: true}});

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function callback(cb) {
        console.info('MongoDB connection is established');
    });

    db.on('disconnected', function () {
        console.error('MongoDB disconnected!');
        mongoose.connect(url, {server: {auto_reconnect: true}});
    });

    db.on('reconnected', function () {
        console.info('MongoDB reconnected!');
    });
};

/**** Init RedisDB ****/
var initRedis;
initRedis = function () {
    if (env == 'dev') {
        var redisConfig = config.get("PROJECT_NAME.REDIS_DEV");
        global.REDIS_CLIENT = redis.createClient(redisConfig['PORT'], redisConfig['HOST'], {no_ready_check: true});
    } else {
        var redis_url = url.parse(config.get("PROJECT_NAME.REDIS_PROD.URL"));
        global.REDIS_CLIENT = redis.createClient(redis_url.port, redis_url.hostname, {no_ready_check: true});
        global.REDIS_CLIENT.auth(redis_url.auth.split(":")[1]);
    }

    global.REDIS_CLIENT.set('foo', 'bar');
    global.REDIS_CLIENT.get('foo', function (err, reply) {
        // body...
        console.log(reply);
    });
};

/****************** Server Init ****************************/
var initServer;
initServer = function () {
    server.listen(config.get('PROJECT_NAME.SERVER.PORT'), function () {
        console.log('Server Started Listening on the port ' + config.get("PROJECT_NAME.SERVER.PORT"));
        console.log("Magic is happening!.");
    });
};

/********************* MIDDLEWEARS ***********************/
server.use(restify.acceptParser(server.acceptable));
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser({ mapParams:false}));
server.use(restify.throttle({
    burst: 100,
    rate: 50,
    ip: true,
    overrides: {
        '192.168.1.1': {
            rate: 0,        // unlimited
            burst: 0
        }
    }
}));

/*********************** ROUTES ***************************/
server.post('/test', function (req, res, next) {
    console.log(res, req);
    res.send('Done.');
    next();
});

require('./routes')(server);

/*************** Let's start the server now *******************/
var init = function(){
    initRedis();
    initServer();
};

init();
module.exports = server;
