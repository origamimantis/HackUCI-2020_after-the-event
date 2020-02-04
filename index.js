const express = require("express");
const fs = require("fs");
//const https = require('https');
var crypto = require('crypto');


//const KEY = "/etc/letsencrypt/live/applenoodlesmoothie.tech/privkey.pem";
//const CERT = "/etc/letsencrypt/live/applenoodlesmoothie.tech/fullchain.pem";


//const options = {
 // key: fs.readFileSync(KEY),
 // cert: fs.readFileSync(CERT)

//}



const app = express();
const port = 9990;
//const port = 443;


app.use(express.static(__dirname + "/public"));



app.get("/",  (req, res) => {
	res.sendFile( __dirname + "/views/index.html");
	
});

var http = require('http');
//http.createServer(function (req, res) {
//    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//    res.end();
//}).listen(80);

let server = http.createServer(app).listen(port, () => console.log("Live on port " + port));

const io = require("socket.io")(server);

let users =
	{
	}

function addSocket(id, socket)
{
	
	if (users[id] == undefined)
	{
	 users[id] = [socket];
	}
	else
	{
	 users[id].push(socket);
	}

}
function removeSocket(socket)
{
	let arr = users[socket.pairId];
	for (let i = 0; i < arr.length; ++i)
	{
		if (arr[i] == socket)
		{
			arr.splice(i, 1);

			if (arr.length == 0)
			{	delete users[socket.pairId]; }

			return;
		}
	}
}


io.on("connection", (socket)=>
{
	var id = crypto.randomBytes(2).toString('hex').toLowerCase();


	socket.pairId = id;
	addSocket(id, socket);
	
	socket.emit('id', {id:id})	

	socket.on('canvas_data',(data)=> {
		  for (let sock of users[socket.pairId])
		  {
			  sock.emit("draw_data", data);
		  }
		//console.log(data);
	});

	socket.on('pair',(new_id)=> {
		if (new_id.length>0 && new_id != socket.pairId)
		{
			removeSocket(socket);

			new_id = new_id.toLowerCase();
			socket.pairId = new_id;

			addSocket(new_id, socket);

			socket.emit('id', {id:new_id})	
		}
		
	});
	socket.on('cursor',(xy)=> {
		  for (let sock of users[socket.pairId])
		  {
			  sock.emit("cursor", xy);
		  }
			
	});

	socket.on('disconnect',()=> {
		removeSocket(socket);
	});
	socket.on('debug',(stuff)=> {
		console.log(stuff);
	});

	  
  });

