
function FrameBuffer (attachements)
{
	this.array = [];
	this.current = 0;
	this.attachements = attachements;

	this.createBuffer = function (gl, width, height, count)
	{
		count = count || 2;
		for (var i = 0; i < count; ++i)
		{
			var frameBuffer = twgl.createTexture(gl, { type: gl.FLOAT, min: gl.NEAREST, mag: gl.NEAREST, wrap: gl.CLAMP_TO_EDGE, width: width, height: height });
			this.array.push(frameBuffer);
		}
	}

	this.getFrameBuffer = function ()
	{
		return this.array[this.current];
	}

	this.getTexture = function ()
	{
		return this.array[this.current].attachments[0];
	}

	this.swap = function ()
	{
		this.current = (this.current + 1) % this.array.length;
	}
}