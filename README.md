# node-api
A framework for making API engine in Node API based project with Redis | Mongo integrations.
Just update the remote/local urls.

And readily available framework integrations with:

- Restify
- Mongoose
- Redis
... (check package.json).

## Installation

- Clone the repo: `git clone git@github.com:agarwalarpit/node-api`
- Install dependencies: `npm install`
- Install Redis server, and start it by: redis-server
- Install Mongo serveer, and start it by: 1) mkdir mongod.db, 2) sudo mongod --dbpath mongod.db
- (Make sure that mongo is running on port 27017, and Redis server is running on port 6379.
- Start the server: `node server.js`

-- If you still get an error, please create an issue! I'll reply back within a day.

## Testing the API
Test your API using [Postman](https://chrome.google.com/webstore/detail/postman-rest-client-packa/fhbjgbiflinjbdggehcddcbncdddomop)

## Tips
You can customize the project by replacing PROJECT_NAME to the actual project-name.
