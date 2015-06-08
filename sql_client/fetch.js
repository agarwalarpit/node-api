var sql = require('mssql'); 
var MongoClient = require('mongodb').MongoClient; 
var assert = require('assert');
var async = require('async'); 

// Connection URL
var mongoURL = 'mongodb://beepidb:Test!ng123@ds031832.mongolab.com:31832/beepidb';

// MSSQL config details.
var config = {
    user: 'beepi',
    password: 'NoMoreL3M0N5',
    server: 'db1.dev.beepi.com', // You can use 'localhost\\instance' to connect to named instance 
    database: 'CarSavvyQA',
    stream: true,
}

var printItem = function (item, doneCallback) {
    console.log(item);
    // Nothing went wrong, so callback with a null error.
    return doneCallback(null);
};

// Use connect method to connect to the Server
MongoClient.connect(mongoURL, function(err, db) {

    assert.equal(null, err);
    console.log("Connected correctly to the mongodb server");

    sql.connect(config, function(err) {
        if (err) throw(err); 
        console.log("Connected to the database"); 

        var request = new sql.Request();
        request.stream = true; 
        request.query('select * from tblCarsForSale_Active'); 

        request.on('row', function(row) {
            // console.log(row); 

            async.each(Object.keys(row), printItem, function(err, result) {
                console.log("Finished the parallelization. "); 
            }); 

            // Get the documents collection
            var collection = db.collection('cars');

            console.log("Going to insert a row in the collection");
            
            // Insert some documents
            collection.insert([row], function(err, result) {

                if (err) {
                    console.log("Error occurred in inserting a document", err); 

                } else {
                    console.log("Inserted a document in the collection. "); 
                    callback(result); 
                }
            });
        }); 
    }); 

    db.close();
});
