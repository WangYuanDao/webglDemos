var VSHADER_SOURCE =
"attribute vec4 a_Position; \n" +
"attribute vec4 a_Color; \n" +
"attribute vec2 a_TextureCoord; \n" +
"varying vec4 v_Color; \n" +
"varying vec2 v_TextureCoord; \n" +
"void main() { \n" +
"    gl_Position = a_Position; \n" +
"    v_Color = a_Color; \n" +
"    v_TextureCoord = a_TextureCoord; \n" +
"}\n";

var FSHADER_SOURCE =
"precision mediump float; \n" +
"varying vec4 v_Color; \n" +
"varying vec2 v_TextureCoord; \n" +
"uniform sampler2D u_Sampler; \n" +
"void main() { \n" +
"    gl_FragColor = texture2D(u_Sampler, v_TextureCoord); \n" +
// "    gl_FragColor = v_Color; \n" +
"}\n";

function main() {
	var canvas = document.getElementById("webglcanvas");
	var gl = canvas.getContext("webgl");
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	runShader(gl);
}

function runShader(gl) {
	var program;
	program = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
	if (program) {
		var vertices = new Float32Array([
			-0.5, 0.5, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0,
			-0.5, -0.5, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0,
		    0.5, 0.5, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,
			0.5, -0.5, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0
		]);

		var texture = gl.createTexture();
		var u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
		var image = new Image();
		image.onload = function() {
			loadTexture(gl, texture, u_Sampler, image);
		};
		image.src = "./3.jpg";

		var loadTexture = function(gl, texture, u_Sampler, image) {
			tick();
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
			gl.uniform1i(u_Sampler, 0);
			console.log("onloaded image");
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		};

		var tick = function() {
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT);

			var vertexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
			var a_Position = getAttributeValue(gl, "a_Position");
			gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 4 * 8, 0);
			gl.enableVertexAttribArray(a_Position);

			var a_Color = gl.getAttribLocation(gl.program, "a_Color");
			gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 4 * 8, 4 * 3);
			gl.enableVertexAttribArray(a_Color);
			var a_TextureCoord = gl.getUniformLocation(gl.program, "a_TextureCoord");
			gl.vertexAttribPointer(a_TextureCoord, 2, gl.FLOAT, false, 4 * 8, 4 * 6);
			gl.enableVertexAttribArray(a_TextureCoord);

		};
		tick();
	}
}

function initShader(gl, vshaderSource, fshaderSource) {
	var vshader = gl.createShader(gl.VERTEX_SHADER);
	var fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(vshader, VSHADER_SOURCE);
	gl.shaderSource(fshader, FSHADER_SOURCE);
	try {
		gl.compileShader(vshader);
		if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
			console.log(gl.getShaderInfoLog(vshader));
		}
	} catch (e) {
		console.error("compileShader vertex error");
	}
	try {
		gl.compileShader(fshader);
		if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
			console.log(gl.getShaderInfoLog(fshader));
		}
	} catch (e) {
		console.error("compileShader fragment error");
	}
	var program = gl.createProgram();
	gl.program = program;
	gl.attachShader(program, vshader);
	gl.attachShader(program, fshader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.log(gl.getProgramInfoLog(program));
	}
	gl.useProgram(program);
	return program;
}

function getAttributeValue(gl, value) {
	return gl.getAttribLocation(gl.program, value);
}

function createAndSetBuffer(gl, floatArray) {
	
}
