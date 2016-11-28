
"use strict";

function Texture (filePathName)
{
	this.data = createTexture({
		src: filePathName,
		flipY: true,
		wrap: gl.CLAMP_TO_EDGE,
		min: gl.LINEAR,
		mag: gl.LINEAR,
	})
}