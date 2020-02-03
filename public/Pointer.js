'use strict';

let Pointer = {
	/*
	 * Pass the div that will be used as the pointer for mobile devices
	 */
	init: function(pointerDomElement) {
		this.element = pointerDomElement;
		this.element.style.position = "fixed";
		this.element.style.zIndex = 100;
		this.hide();
	},
	point: function(pageX, pageY) {
		this.element.style.left = pageX + "px";
		this.element.style.top = pageY + "px";
	},
	getPos() {
		return {
			x: this.element.offsetLeft,
			y: this.element.offsetTop
		}
	},
	show: function() {
		this.element.style.display = "block";
	},
	hide: function() {
		this.element.style.display = "none";
	}
};

export { Pointer };
