
"use strict";

function CreateMeshBufferFromFile (meshData, info)
{
	info = info || {};
	var wired = info.wired || false;
	var scale = info.scale || 1;

	var mesh = {
		position: { numComponents: 3, data: [] }, 
		normal: { numComponents: 3, data: [] },
		texcoord: { numComponents: 2, data: [] }, 
		indices: { numComponents: wired ? 2 : 3, data: [] },
	};

	var lines = meshData.split("\n");
	for (var l = 15; l < lines.length; ++l)
	{
		var column = lines[l].split(" ");

		// position, normals, texcoord
		if (column.length == 8)
		{
			Array.prototype.push.apply(mesh.position.data, [ parseFloat(column[0]) * scale, parseFloat(column[1]) * scale, parseFloat(column[2]) * scale ]);
			Array.prototype.push.apply(mesh.normal.data, [ parseFloat(column[3]), parseFloat(column[4]), parseFloat(column[5]) ]);
			Array.prototype.push.apply(mesh.texcoord.data, [ parseFloat(column[6]), parseFloat(column[7]) ]);
		}
		// indices
		else if (column.length == 4)
		{
			var a = parseFloat(column[1]);
			var b = parseFloat(column[2]);
			var c = parseFloat(column[3]);
			if (wired) {
				Array.prototype.push.apply(mesh.indices.data, [ a,b, a,c, c,b ]);

			} else {
				Array.prototype.push.apply(mesh.indices.data, [ a, b, c ]);
			}
		}
	}

	return mesh;
}

function CreateArrayOfPointFromFile (data, step)
{
	var cloud = {};
	cloud.points = [];

	cloud.middle = [0, 0, 0];
	cloud.top = -9000;
	cloud.ground = 9000;
	var scale = 1.0;
	step = step || 1;
	var lines = data.split("\n");
	for (var l = 17; l < lines.length; l += step)
	{
		var column = lines[l].split(" ");
		if (column.length > 8)
		{
			var point = { x: parseFloat(column[0]), y: parseFloat(column[1]), z: parseFloat(column[2]) };
			point.x *= scale;
			point.y *= scale;
			point.z *= scale;
			point.normal = { x: parseFloat(column[3]), y: parseFloat(column[4]), z: parseFloat(column[5]) };
			point.color = { r: parseInt(column[6]) / 255, g: parseInt(column[7]) / 255, b: parseInt(column[8]) / 255, a: parseInt(column[9]) / 255 };
			cloud.points.push(point);

			cloud.middle[0] += point.x;
			cloud.middle[1] += point.y;
			cloud.middle[2] += point.z;

			cloud.top = Math.max(cloud.top, point.y);
			cloud.ground = Math.min(cloud.ground, point.y);
		}
	}

	cloud.middle[0] /= cloud.points.length;
	cloud.middle[1] /= cloud.points.length;
	cloud.middle[2] /= cloud.points.length;

	for (var i = 0; i < cloud.points.length; ++i) {
		cloud.points[i].x -= cloud.middle[0];
		cloud.points[i].y -= cloud.middle[1];
		cloud.points[i].z -= cloud.middle[2];
	}
 
	cloud.ground = cloud.ground;

	return cloud;
}

function CreateParticlesBufferFromArrayOfPoint (array)
{
	var particles = {
		position: { numComponents: 3, data: []},
		normal: { numComponents: 3, data: []},
		texcoord: { numComponents: 2, data: [] }, 
		anchor: { numComponents: 2, data: [] }, 
		color: { numComponents: 4, data: [] }, 
		indices: { numComponents: 3, data: [] },
	};

	var index = 0;
	for (var i = 0; i < array.length; ++i) {
		Array.prototype.push.apply(particles.texcoord.data, [ 0.0,0.0, 1.0,0.0, 0.5,2.0]);//, 0.5,0.5, 0,1, 0.25,0 ]);
		Array.prototype.push.apply(particles.anchor.data, [ -1.0,-1.0, 1.0,-1.0, 0.0,2.0]);//, 0.5,0.5, 0,1, 0.25,0 ]);

		var point = array[i];

		for (var a = 0; a < 3; ++a) {
			Array.prototype.push.apply(particles.position.data, [point.x, point.y, point.z]);
			Array.prototype.push.apply(particles.normal.data, [point.normal.x, point.normal.y, point.normal.z]);
			Array.prototype.push.apply(particles.color.data, [point.color.r, point.color.g, point.color.b, point.color.a]);
		}

			// var a = parseFloat(column[1]);
			// var b = parseFloat(column[2]);
			// var c = parseFloat(column[3]);
			// if (wired) {
			// 	Array.prototype.push.apply(mesh.indices.data, [ a,b, a,c, c,b ]);

			// } else {
				Array.prototype.push.apply(particles.indices.data, [ index, index+1, index+2 ]);
				index += 3;
	}

	return particles;
}