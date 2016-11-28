
"use strict";

function Mesh (fileName)
{
  this.arrays = CreateBufferFromFile(assets[fileName]);
  this.buffer = twgl.createBufferInfoFromArrays(gl, this.arrays);

  this.draw = function (shader, uniforms)
  {
    gl.useProgram(shader.program);
    twgl.setBuffersAndAttributes(gl, shader.info, this.buffer);
    twgl.setUniforms(shader.info, uniforms);
    gl.drawElements(gl.TRIANGLES, this.buffer.numElements, gl.UNSIGNED_SHORT, 0);
  }
}