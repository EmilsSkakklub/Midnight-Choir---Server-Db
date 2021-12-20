//server setup
const { response } = require('express');
var express = require('express');
var app = express();



//Opens a connection to the database
var client;
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb+srv://admin:admin@motedu.fbj4y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", function (connectionError, dbclient) {

	//Check for Errors
	if (!connectionError) {
		console.log("MongoDB - Connection: Established");
	}
	else {
		console.log("MongoDB - Connection: Error");
		console.log(connectionError);
	}

	client = dbclient;

	//Starts the server
	app.listen(3000, function () {
		console.log('listening on *:3000');
	});
});


app.get('/', function(request, response){
    console.log("HTTP GET request: /");
    response.send("Hello there");
})

//CREATE player
app.get('/createPlayer', async (request, respond) => {

	//Extracts the field values from the request
	var name = request.query['name'];
	var score = request.query['score'];
	console.log("HTTP Get Request: /createPlayer?name=" + name + "&score=" + score);

	//specifies the database within the cluster and collection within the database
	var collection = client.db('EmthonDB').collection('Players');

	try {
		user = await collection.findOne({name: name});
		if(user == null){
			//Creates and inserts a new document into the collection
			collection.insertOne({ name: name, score: score});
			respond.send("Player was Created");
			console.log("Player was Created");
		}	
		else{
			respond.send("Player already exists!");
			console.log("Player already exists!");
		}
	} catch (insertionError) {
		respond.send("Player was not Created");
		console.log("MongoDB - Insert: Error");
		console.log(insertionError);
	};
});

//READ player
app.get('/readPlayer', function (request, respond) {

	//Extracts the field values from the request
	var name = request.query['name'];
	console.log("HTTP Get Request: /readPlayer?name=" + name);

	//specifies the database within the cluster and collection within the database
	var collection = client.db('EmthonDB').collection('Players');

	//Returns a single document, if one fits the conditions
	collection.findOne({ name: name}, function (findError, result) {
		//Check for Errors
		if (!findError) {
			console.log("MongoDB - Find: No Errors");
		}
		else {
			console.log("MongoDB - Find: Error");
			console.log(findError);
		}

		//Sends the player data back to Unity as a string
		if (!result) {
			respond.send("Player not found");
		}
		else {
			console.log(result);
			respond.send(result);
		}
	});
});


//UPDATE player score
app.get('/updatePlayer', function (request, respond) {

	//Extracts the field values from the request
	var name = request.query['name'];
	var score = request.query['score'];
	console.log("HTTP Get Request: /updatePlayer?name=" + name + "&score=" + score);

	//specifies the database within the cluster and collection within the database
	var collection = client.db('EmthonDB').collection('Players');

	try {
		//Updates an existing document from the collection
		collection.updateOne({ name: name }, { $set: { score: score }});
		respond.send("Player was Updated");
		console.log("Player was Updated");
	} catch (insertionError) {
		respond.send("Playerwas not Updated");
		console.log("MongoDB - Update: Error");
		console.log(insertionError);
	};
});