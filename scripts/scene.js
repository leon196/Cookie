
"use strict";

function Scene ()
{
	this.init = function ()
	{
		this.particleShader = new Shader("leaf.vert", "color.frag");
		this.diffuseShader = new Shader("cube.vert", "cube.frag");

		this.cookieMesh = new Mesh(CreateMeshBufferFromFile(assets["Cookie.ply"]));
		this.particles = new Particles("CookieCloud25k.ply");

		this.cookieTexture = new Texture("assets/models/Cookie.png");
		this.circleTexture = new Texture("assets/images/Circle.png");

		this.frameBuffer = new FrameBuffer();

		this.uniforms = {
			u_lightWorldPos: [1, 8, -10],
			u_lightColor: [1, 0.8, 0.8, 1],
			u_ambient: [0, 0, 0, 1],
			u_specular: [1, 1, 1, 1],
			u_shininess: 0,
			u_specularFactor: 0,
			u_diffuse: this.cookieTexture.data,
			u_sprite: this.circleTexture.data,
			u_time: 0,
			u_scale: 0.0,
		};

		this.projection = m4.perspective(30 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 1000);
		this.eye = [1, 2, -3];
		this.target = [0, 0, 0];
		this.up = [0, 1, 0];

		this.camera = m4.lookAt(this.eye, this.target, this.up);
		this.view = m4.inverse(this.camera);
		this.viewProjection = m4.multiply(this.view, this.projection);
		this.world = m4.identity();
	}

	this.render = function (time)
	{
		this.uniforms.u_viewInverse = this.camera;
		this.uniforms.u_world = this.world;
		this.uniforms.u_view = this.viewProjection;
		this.uniforms.u_time = time;
		this.uniforms.u_scale = 0.0;
		
		this.uniforms.u_world = this.world;
		this.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(this.world));
		this.uniforms.u_worldViewProjection = m4.multiply(this.world, this.viewProjection);

		gl.disable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// uniforms.u_world = world;
		// uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
		// uniforms.u_worldViewProjection = m4.multiply(world, viewProjection);
		// gl.useProgram(programInfo.program);
		// twgl.setBuffersAndAttributes(gl, programInfo, bufferParticles);
		// twgl.setUniforms(programInfo, uniforms);
		// gl.drawElements(gl.TRIANGLES, bufferParticles.numElements, gl.UNSIGNED_SHORT, 0);

		gl.enable(gl.DEPTH_TEST);
		gl.disable(gl.BLEND);

		this.cookieMesh.draw(this.diffuseShader, this.uniforms);
	};
}