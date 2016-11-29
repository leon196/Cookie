
"use strict";

function Scene ()
{
	this.cookieTexture = new Texture("assets/models/Cookie.png");
	this.circleTexture = new Texture("assets/images/Circle.png");

	this.init = function (time)
	{
		this.particleShader = new Shader("leaf.vert", "color.frag");
		this.diffuseShader = new Shader("cube.vert", "cube.frag");

		this.cookieMesh = new Mesh(CreateMeshBufferFromFile(assets["Cookie.ply"], { scale: 1.0 }));
		this.particles = new Particles("CookieCloud25k.ply");

		this.frameBuffer = new FrameBuffer();

		this.uniforms = new Uniforms();
		this.uniforms.u_diffuse = this.cookieTexture.data;
		this.uniforms.u_sprite = this.circleTexture.data;
		this.uniforms.u_scale = 0.0;

		this.camera = new Camera();
		this.world = m4.identity();

		this.actions = new Actions(cookieActions);

		this.timeStarted = time;
	}

	this.render = function (time)
	{
		this.world = m4.identity();

		time -= this.timeStarted;

		this.camera.setPosition(this.actions.evaluate("CameraAction", "location", time));
		this.uniforms.u_lightWorldPos = this.actions.evaluate("SunAction", "location", time);
		// this.world = m4.rotateX(this.world, sunRotation[0]);
		// this.world = m4.rotateY(this.world, sunRotation[1]);
		// this.world = m4.rotateZ(this.world, sunRotation[2]);

		this.uniforms.u_viewInverse = this.camera.matrix;
		this.uniforms.u_world = this.world;
		this.uniforms.u_view = this.camera.viewProjectionMatrix;
		this.uniforms.u_time = time;
		this.uniforms.u_scale = 0.0;
		
		this.uniforms.u_world = this.world;
		this.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(this.world));
		this.uniforms.u_worldViewProjection = m4.multiply(this.world, this.camera.viewProjectionMatrix);

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