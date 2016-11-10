
"use strict";
var assets = {};
var filePathList = [
  "assets/shaders/cube.vert", 
  "assets/shaders/cube.frag",
  "assets/models/Cookie.ply",
]

function loadAssets(onComplete) {
  loadFiles(filePathList, 
    function (error, content) { 
      assets = content;
      if (onComplete) {
        onComplete();
      }
    }
  );
}

var texturesLoaded = false;
var textureCount = 0;
function loadedTexture (err, texture, souce) {
  --textureCount;
  if (textureCount == 0) {
    texturesLoaded = true;
  }
}

function createTexture (argument) {
  ++textureCount;
  return twgl.createTexture(gl, argument, loadedTexture);
}