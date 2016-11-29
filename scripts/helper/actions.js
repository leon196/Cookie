
"use strict";

function Actions (file)
{
	this.library = new blenderHTML5Animations.ActionLibrary(file);

	this.getValue = function (actionName, propertyName)
	{
		return this.library[actionName].paths[propertyName][0].keyframes[0].value;
	};

	this.getVector3 = function (actionName, propertyName)
	{
		var property = this.library[actionName].paths[propertyName];
		return [property[0].keyframes[0].value, property[1].keyframes[0].value, property[2].keyframes[0].value];
	};

	this.getRotation = function (actionName)
	{
		var property = this.library[actionName].paths["rotation_euler"];
		return [property[0].keyframes[0].value - Math.PI * 0.5, property[1].keyframes[0].value, property[2].keyframes[0].value];
	};

	this.evaluate = function (actionName, propertyName, time)
	{
		return this.library[actionName].paths[propertyName].evaluate(time);
	};
}