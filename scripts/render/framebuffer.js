
function FrameBuffer ()
{
	this.array = [];
	this.current = 0;

	this.createBuffer = function (gl, width, height, points)
	{
		for (var i = 0; i < 2; ++i)
		{
			var frame = twgl.createTexture(gl, { type: gl.FLOAT, min: gl.NEAREST, mag: gl.NEAREST, wrap: gl.CLAMP_TO_EDGE, width: width, height: height, src: points });
			this.array.push(frame);
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