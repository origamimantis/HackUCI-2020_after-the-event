class Path {
	constructor(startX, startY) {
		this.id = 0;
		this.lastPoint = [startX, startY];
		this.pendingPoints = [];
		this._down = false;
		this._color = "#000000";
		this._thickness = 1;
	}

	render(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = this._color;
		ctx.lineWidth = this._thickness;
		ctx.moveTo(this.lastPoint[0], this.lastPoint[1]);
		for (let i = 0; i < this.pendingPoints.length; i++) {
			ctx.lineTo(this.pendingPoints[i][0], this.pendingPoints[i][1]);
		}
		ctx.stroke();
		// Set the last point to the last point
		this.lastPoint = this.pendingPoints[this.pendingPoints.length - 1];
		// Kill the pending points
		this.pendingPoints = [];
	}

	addPoint(x, y) {
		this.pendingPoints.push([x, y]);
	}

	setDown() {
		this._down = true;
	}

	setUp() {
		this._down = false;
	}

	isDown() {
		return this._down;
	}

	setColor(color) {
		this._color = color;
	}
	
	setThickness(thicc) {
		this._thickness = thicc;
	}
}

let CanvasControl = {
	init: function(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this._penDown = false;

		this._lastPan = {
			x: 0,
			y: 0
		}
		this._uniqueID = 0;
		this._paths = {};

		this._penColor = "#000000";
		this._penThickness = 1;
	},
	generateUniqueID: function() {
		return Date.now() + this._uniqueID++;
	},
	/*
	 * Extra data:
	 * color
	 * thickness
	 */
	penDown: function(x, y, id, extraData) {
		this._paths[id] = new Path(x, y);
		this._paths[id].setDown();
		// Color
		if (extraData && extraData.color) {
			this._paths[id].setColor(extraData.color);
		} else {
			this._paths[id].setColor(this._penColor);
		}

		// Thickness
		if (extraData && extraData.thickness) {
			this._paths[id].setThickness(extraData.thickness);
		} else {
			this._paths[id].setThickness(this._penThickness);
		}
	},
	draw: function(x, y, id) {
		if (this._paths[id] && this._paths[id].isDown()) {
			this._paths[id].addPoint(x, y);
			this._paths[id].render(this.ctx);
		}
	},
	penUp: function(id) {
		if (this._paths[id] && this._paths[id].isDown()) {
			this._paths[id].setUp();
			delete this._paths[id];
		}
	},
	panStart: function(clientX, clientY) {
		this._lastPan = {
			x: this.canvas.offsetLeft,
			y: this.canvas.offsetTop,
			mouseX: clientX,
			mouseY: clientY
		}
		this._penDown = true;
	},
	pan: function(clientX, clientY) {
		if (this._penDown == true) {
			this.canvas.style.left = (clientX - this._lastPan.mouseX) + this._lastPan.x + "px";
			this.canvas.style.top = (clientY - this._lastPan.mouseY) + this._lastPan.y + "px";
		}
	},
	panEnd: function() {
		this._penDown = false;
	},
	adjustScreenPos: function(pageX, pageY) {
		return {
			x: pageX - this.canvas.offsetLeft,
			y: pageY - this.canvas.offsetTop
		};
	},
	clearCanvas: function() {
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	},
	getHTMLCanvas() {
		return this.canvas;
	},
	getCanvasWidth() {
		return this.canvas.width;
	},
	getCanvasHeight() {
		return this.canvas.height;
	},
	/*
	 * Accepts a hex color string
	 */
	setDrawColor(color = "#000000") {
		this._penColor = color;
	},
	getDrawColor() {
		return this._penColor;
	},
	setThickness(size = 1) {
		this._penThickness = size;
	},
	getThickness() {
		return this._penThickness;
	}
}

export { CanvasControl }
