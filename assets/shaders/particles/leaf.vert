precision mediump float;

attribute vec4 a_position;
attribute vec4 a_color;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
attribute vec2 a_anchor;

uniform float u_time;
uniform vec2 u_resolution;
uniform mat4 u_view;
uniform mat4 u_world;
uniform vec3 u_target;
uniform float u_top;
uniform float u_ground;
uniform float u_value;
uniform vec2 u_leafSize;

varying vec2 v_texCoord;
varying vec4 v_position;
varying vec4 v_color;
varying vec3 v_normal;
varying float v_depth;

float luminance ( vec3 color )
{
	return (color.r + color.g + color.b) / 3.0;
}

// hash based 3d value noise
// function taken from https://www.shadertoy.com/view/XslGRr
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// ported from GLSL to HLSL
float hash( float n )
{
	return fract(sin(n)*43758.5453);
}

float noiseIQ( vec3 x )
{
	// The noise function returns a value in the range -1.0f -> 1.0f
	vec3 p = floor(x);
	vec3 f = fract(x);
	f       = f*f*(3.0-2.0*f);
	float n = p.x + p.y*57.0 + 113.0*p.z;
	return mix(mix(mix( hash(n+0.0), hash(n+1.0),f.x),
	 mix( hash(n+57.0), hash(n+58.0),f.x),f.y),
	mix(mix( hash(n+113.0), hash(n+114.0),f.x),
	 mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
}

void main ()
{
	float aspect = u_resolution.y / u_resolution.x;
	vec4 position = u_world * a_position;

	// size *= u_value;
	float size = 0.05;

	// position.w = 1.0;

	vec3 up = normalize(vec3(a_normal.x, a_normal.y, 0.0));
	vec3 right = vec3(up.y, -up.x, 0);
	// up.x *= aspect;
	// right.x *= aspect;

	position = (u_view * position);
	position.xyz += up * a_anchor.x * size;
	position.xyz += right * a_anchor.y * size;
	// position.z = 1.0;

	v_color = a_color;
	v_texCoord = a_texcoord;
	gl_Position = position;
}
