
"use strict";

function Shader (vert, frag)
{
	this.program = twgl.createProgramFromSources(gl, [assets[vert], assets[frag]]);
	this.info = twgl.createProgramInfoFromProgram(gl, this.program);
}