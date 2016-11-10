
"use strict";
var gl;
var m4 = twgl.m4;
var program, programInfo, bufferCookie, bufferCookieWired, tex, uniforms;

window.onload = function ()
{
  loadAssets(init);
  requestAnimationFrame(render);
}

function init () {

  twgl.setDefaults({attribPrefix: "a_"});
  gl = twgl.getWebGLContext(document.getElementById("view"));

  program = twgl.createProgramFromSources(gl, [assets["cube.vert"], assets["cube.frag"]]);
  programInfo = twgl.createProgramInfoFromProgram(gl, program);

  bufferCookie = twgl.createBufferInfoFromArrays(gl, createMesh(assets["Cookie.ply"]));
  bufferCookieWired = twgl.createBufferInfoFromArrays(gl, createMesh(assets["Cookie.ply"], {wired:true}));

  tex = createTexture({
    src: "assets/models/Cookie.png",
    flipY: true,
  }) 

  uniforms = {
    u_lightWorldPos: [1, 8, -10],
    u_lightColor: [1, 0.8, 0.8, 1],
    u_ambient: [0, 0, 0, 1],
    u_specular: [1, 1, 1, 1],
    u_shininess: 0,
    u_specularFactor: 0,
    u_diffuse: tex,
    u_time: 0,
    u_scale: 0.0,
  };
}

function render(time) {
  if (texturesLoaded) {

    time *= 0.001;
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var projection = m4.perspective(30 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.5, 10);
    var eye = [1, 4, -6];
    var target = [0, 0, 0];
    var up = [0, 1, 0];

    var camera = m4.lookAt(eye, target, up);
    var view = m4.inverse(camera);
    var viewProjection = m4.multiply(view, projection);
    var world = m4.rotationY(time * 0.1);

    uniforms.u_viewInverse = camera;
    uniforms.u_world = world;
    uniforms.u_view = viewProjection;
    uniforms.u_time = time;
    uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
    uniforms.u_worldViewProjection = m4.multiply(world, viewProjection);
    uniforms.u_scale = 0.0;

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferCookie);
    twgl.setUniforms(programInfo, uniforms);
    gl.drawElements(gl.TRIANGLES, bufferCookie.numElements, gl.UNSIGNED_SHORT, 0);

    // world = m4.scale(world, [1.1,1.1,1.1], world);
    // uniforms.u_world = world;
    // uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
    // uniforms.u_worldViewProjection = m4.multiply(world, viewProjection);
    uniforms.u_scale = 0.1;
    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferCookieWired);
    twgl.setUniforms(programInfo, uniforms);
    gl.drawElements(gl.LINES, bufferCookieWired.numElements, gl.UNSIGNED_SHORT, 0);
  }
  requestAnimationFrame(render);
}
