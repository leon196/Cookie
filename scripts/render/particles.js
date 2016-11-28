
"use strict";

function Particles (fileName)
{
	this.points = CreateArrayOfPointFromFile(assets[fileName]);
	this.buffer = twgl.createBufferInfoFromArrays(gl, CreateParticlesBufferFromArrayOfPoint(this.points));
}