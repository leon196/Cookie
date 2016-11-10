
"use strict";
var gl;
var m4 = twgl.m4;
var program, programInfo, bufferCookie, bufferCookieWired, tex, uniforms;
var bufferParticles;
var particles;
var particleTexture;
var PI = 3.1416;
var program2, programInfo2;
window.onload = function ()
{
  loadAssets(init);
  requestAnimationFrame(render);
}

function init () {

  twgl.setDefaults({attribPrefix: "a_"});
  gl = twgl.getWebGLContext(document.getElementById("view"), {
    // premultipliedAlpha: false,
    // alpha: false
  });

  program = twgl.createProgramFromSources(gl, [assets["leaf.vert"], assets["color.frag"]]);
  programInfo = twgl.createProgramInfoFromProgram(gl, program);
  program2 = twgl.createProgramFromSources(gl, [assets["cube.vert"], assets["cube.frag"]]);
  programInfo2 = twgl.createProgramInfoFromProgram(gl, program2);

  bufferCookie = twgl.createBufferInfoFromArrays(gl, createMesh(assets["Cookie.ply"]));
  // bufferCookieWired = twgl.createBufferInfoFromArrays(gl, createMesh(assets["Cookie.ply"], {wired:true}));
  particles = parsePointCloud(assets["CookieCloud25k.ply"]);
  bufferParticles = twgl.createBufferInfoFromArrays(gl, createParticles(particles.points));

  tex = createTexture({
    src: "assets/models/Cookie.png",
    flipY: true,
  }) 
  particleTexture = createTexture({
    src: "assets/images/Circle.png",
    flipY: true,
    wrap: gl.CLAMP_TO_EDGE,
  }) 

  uniforms = {
    u_lightWorldPos: [1, 8, -10],
    u_lightColor: [1, 0.8, 0.8, 1],
    u_ambient: [0, 0, 0, 1],
    u_specular: [1, 1, 1, 1],
    u_shininess: 0,
    u_specularFactor: 0,
    u_diffuse: tex,
    u_sprite: particleTexture,
    u_time: 0,
    u_scale: 0.0,
  };
}

function render(time) {
  if (texturesLoaded) {

    time *= 0.001;
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // gl.clearColor(1, 1, 1, 1);
    // gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var projection = m4.perspective(30 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 1000);
    var eye = [1, 2, -3];
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
    uniforms.u_scale = 0.0;
    
    // m4.translate(m4.identity(), particles.middle, world);
    world = m4.rotationX(-PI * 0.5);
    world = m4.rotateZ(world, time * 0.1);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    uniforms.u_world = world;
    uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
    uniforms.u_worldViewProjection = m4.multiply(world, viewProjection);
    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferParticles);
    twgl.setUniforms(programInfo, uniforms);
    gl.drawElements(gl.TRIANGLES, bufferParticles.numElements, gl.UNSIGNED_SHORT, 0);

    // gl.enable(gl.DEPTH_TEST);
    // gl.disable(gl.BLEND);
    // world = m4.rotationY(time * 0.1);
    // uniforms.u_world = world;
    // uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
    // uniforms.u_worldViewProjection = m4.multiply(world, viewProjection);
    // gl.useProgram(programInfo2.program);
    // twgl.setBuffersAndAttributes(gl, programInfo2, bufferCookie);
    // twgl.setUniforms(programInfo2, uniforms);
    // gl.drawElements(gl.TRIANGLES, bufferCookie.numElements, gl.UNSIGNED_SHORT, 0);
  }
  requestAnimationFrame(render);
}
