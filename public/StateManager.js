'use strict';

let StateManager = {
	_drawMode: 0,
	CURSOR: 0,
	GYRO: 1,
	PAN: 2,
	getDrawMode: function() {
		return this._drawMode;
	},
	setDrawMode: function(drawMode) {
		this._drawMode = drawMode;
	}	
}

export { StateManager };
