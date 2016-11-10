precision mediump float;

uniform sampler2D u_sprite;
varying vec4 v_color;
varying vec2 v_texCoord;

void main ()
{
	gl_FragColor = v_color;
	gl_FragColor.a = step(0.5, texture2D(u_sprite, v_texCoord).a);
}
