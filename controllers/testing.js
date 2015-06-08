var api = module.exports;

var restify    = require('restify');
var config     = require('config');
var async      = require('async');
var S 		   = require('string');

api.processTesting = function(req,res){
    console.log('We\'ll play here');
    res.send('Started playing.');
};
