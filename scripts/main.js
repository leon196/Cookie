
"use strict";

var gl, scene;
var m4 = twgl.m4;

window.onload = function ()
{
	loadAssets(init);
	requestAnimationFrame(render);
}

function init ()
{
	twgl.setDefaults({attribPrefix: "a_"});
	gl = twgl.getWebGLContext(document.getElementById("view"), { premultipliedAlpha: false, alpha: false });
	scene = new Scene();
	scene.init();
}

function render(time)
{
	if (texturesLoaded)
	{
		time *= 0.001;
		twgl.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		gl.clearColor(0, 0, 0, 1);
		gl.enable(gl.CULL_FACE);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		scene.render(time);
	}
	requestAnimationFrame(render);
}
