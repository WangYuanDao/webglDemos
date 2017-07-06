var VSHADER_SOURCE =
"attribute vec4 a_Position; \n" +
"attribute vec4 a_Color; \n" +
"varying vec4 v_Color; \n" +
"void main() { \n" +
"    gl_Position = a_Position; \n" +
"    gl_PointSize = 10.0; \n" +
"    v_Color = a_Color; \n" +
"}\n";

var FSHADER_SOURCE =
"precision mediump float; \n" +
"varying vec4 v_Color; \n" +
"void main() { \n" +
"    gl_FragColor = v_Color; \n" +
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
			0.0, 0.5, 1.0, 0.0, 0.0,
			-0.5, -0.5, 0.0, 1.0, 0.0,
			0.5, -0.5, 0.0, 0.0, 1.0
		]);
		var vertexBuffer = createAndSetBuffer(gl, vertices);
		var FSize = vertexBuffer.BYTES_PER_ELEMENT;
		console.log("FSize is ", FSize);
		var a_Position = getAttributeValue(gl, "a_Position");
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * 5, 0);
		gl.enableVertexAttribArray(a_Position);

		var a_Color = gl.getAttribLocation(gl.program, "a_Color");
		gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 4 * 5, 4 * 2);
		gl.enableVertexAttribArray(a_Color);
		// gl.drawArrays(gl.POINTS, 0, 3);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
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
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.DYNAMIC_DRAW);
	return vertexBuffer;
}