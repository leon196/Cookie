
uniform mat4 u_worldViewProjection;
uniform vec3 u_lightWorldPos;
uniform mat4 u_world;
uniform mat4 u_view;
uniform mat4 u_viewInverse;
uniform mat4 u_worldInverseTranspose;
uniform float u_time;
uniform float u_scale;

attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

varying vec4 v_position;
varying vec2 v_texCoord;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

void main() {
  v_texCoord = a_texcoord;
  v_normal = (u_worldInverseTranspose * vec4(a_normal, 0)).xyz;
  vec4 position = u_world * a_position;
  // position.xyz = normalize(position) * mod(length(position + u_time), 5.0);
  // position.y += 0.01 * (sin(-u_time * 4.0 + 50.0 * length(position)) * 0.5 + 0.5);
  // position.
  // position.xyz += 0.2 * v_normal.xyz * (sin(-u_time * 4.0 + 10.0 * length(position)) * 0.5 + 0.5);
  // position.xyz += u_scale * v_normal.xyz;
  v_position = u_view * position;
  v_surfaceToLight = u_lightWorldPos - (u_world * a_position).xyz;
  v_surfaceToView = (u_viewInverse[3] - (u_world * a_position)).xyz;
  gl_Position = v_position;
}