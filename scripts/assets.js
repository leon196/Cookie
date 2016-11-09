
"use strict";
var assets = {};
var filePathList = [
  "assets/shaders/cube.vert", 
  "assets/shaders/cube.frag",
  "assets/models/Cookie.ply",
  "assets/models/Cookie.png",
]

function loadAssets(onComplete) {
  loadFiles(filePathList, 
    function (error, content) { 
      assets = content;
      onComplete();
    }
  );
}