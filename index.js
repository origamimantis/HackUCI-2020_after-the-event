const express = require("express");
const fs = require("fs");
var crypto = require('crypto');

const app = express();
const port = process.env.PORT || 9990;

app.use(express.static(__dirname + "/public"));

app.get("/",  (req, res) => {
	res.sendFile( __dirname + "/views/index.html");
	
});

var http = require('http');

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
