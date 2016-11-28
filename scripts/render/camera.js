
"use strict";

function Camera ()
{
	this.projection = m4.perspective(30 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 1000);
	this.position = [1, 2, -3];
	this.target = [0, 0, 0];
	this.up = [0, 1, 0];

	this.matrix = m4.lookAt(this.position, this.target, this.up);
	this.viewMatrix = m4.inverse(this.matrix);
	this.viewProjectionMatrix = m4.multiply(this.viewMatrix, this.projection);
}