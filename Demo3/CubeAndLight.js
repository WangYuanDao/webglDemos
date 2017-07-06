// var VSHADER_SOURCE =
// "attribute vec4 a_Position; \n" +
// "attribute vec4 a_Color; \n" +
// "uniform mat4 u_ViewMatrix; \n" +
// "uniform mat4 u_normalMat; \n" +
// "attribute vec4 a_Normal; \n" +
// "uniform vec3 u_LightColor; \n" +
// "uniform vec3 u_environmentLight; \n" +
// "uniform vec3 u_LightDirection; \n" +
// "varying vec4 v_Color; \n" +
// "uniform mat4 u_ModalMat; \n" +
// "uniform vec3 u_LightPosition; \n" +
// "void main() { \n" +
// "    gl_Position = u_ViewMatrix * a_Position; \n" +
// "    vec3 normal = normalize(vec3(u_normalMat * a_Normal)); \n" +
// "    vec4 vertexPosition = u_ModalMat * a_Position; \n" +
// "    vec3 lightDierction = normalize(u_LightPosition - vec3(vertexPosition)); \n" +
// // "    float nDotL = max(dot(u_LightDirection, normal), 0.0); \n" +
// "    float nDotL = max(dot(lightDierction, normal), 0.0); \n" +
// "    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL; \n" +
// "    v_Color = vec4(diffuse + u_environmentLight * a_Color.rgb, a_Color.a); \n" +
// "}\n";

// var FSHADER_SOURCE =
// "precision mediump float; \n" +
// "varying vec4 v_Color; \n" +
// "void main() { \n" +
// "    gl_FragColor = v_Color; \n" +
// "}\n";

var VSHADER_SOURCE =
"attribute vec4 a_Position; \n" +
"attribute vec4 a_Color; \n" +
"uniform mat4 u_ViewMatrix; \n" +
"uniform mat4 u_normalMat; \n" +
"attribute vec4 a_Normal; \n" +
"varying vec4 v_Color; \n" +
"uniform mat4 u_ModalMat; \n" +
"varying vec3 v_Normal; \n" +
"varying vec3 v_Position; \n" +
"void main() { \n" +
"    gl_Position = u_ViewMatrix * a_Position; \n" +
"    v_Normal = normalize(vec3(u_normalMat * a_Normal)); \n" +
"    v_Position = vec3(u_ModalMat * a_Position); \n" +
"    v_Color = a_Color; \n" +
"}\n";

var FSHADER_SOURCE =
"precision mediump float; \n" +
"uniform vec3 u_LightColor; \n" +
"uniform vec3 u_LightPosition; \n" +
"uniform vec3 u_environmentLight; \n" +
"varying vec3 v_Normal; \n" +
"varying vec3 v_Position; \n" +
"varying vec4 v_Color; \n" +
"void main() { \n" +
"    vec3 normal = normalize(v_Normal); \n" +
"    vec3 lightDierction = normalize(u_LightPosition - v_Position); \n" +
"	 float nDotL = max(dot(lightDierction, normal), 0.0); \n" +
"    vec3 diffuse = u_LightColor * v_Color.rgb * nDotL; \n" +
"	 vec3 ambient = u_environmentLight * v_Color.rgb; \n" +
"    gl_FragColor = vec4(diffuse + ambient, v_Color.a); \n" +
"}\n";


function main() {
	var canvas = document.getElementById("webglcanvas");
	var gl = canvas.getContext("webgl");
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	runShader(gl);
}

function runShader(gl) {
	var program;
	program = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
	if (program) {

		var indexBuffer = gl.createBuffer();

		// init Points
		var vertices = new Float32Array([
			1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
			1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
			1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
			-1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
			-1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
			1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0
			

		]);

		var pointsBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
		var a_Position = gl.getAttribLocation(gl.program, "a_Position");
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);


		// init colors
		var colors = new Float32Array([
			0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
			1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
			1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0,
			0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0
		]);

		// var colors = new Float32Array([
		// 	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
		// 	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
		// 	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
		// 	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
		// 	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
		// 	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
		// ]);

		var colorsBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);
		var a_Color = gl.getAttribLocation(gl.program, "a_Color");
		gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Color);


		// init index
		var index = new Uint8Array([
			0, 1, 2, 0, 2, 3,
			4, 5, 6, 4, 6, 7,
			8, 9, 10, 8, 10, 11,
			12, 13, 14, 12, 14, 15,
			16, 17, 18, 16, 18, 19,
			20, 21, 22, 20, 22, 23
		]);

		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);

		// init Matrix
		var cubeMat = new Matrix4();
		var cameraMat = new Matrix4();
		var eyeMat = new Matrix4();
		var positionMat = new Matrix4();
		cameraMat.setPerspective(60, 1, 0.1, 100);
		cameraMat.lookAt(5, 5, 0, 0, 0, 0, 0, 1, 0);
		var cameraPosition = {x: 0, y: 0, z: 0, rx: 0, ry: 0};

		// pingxing light
		// var u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
		// var u_LightDirection = gl.getUniformLocation(gl.program, "u_LightDirection");

		// gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

		// var lightDierction = new Vector3([0.0, 3.0, 5.0]);
		// lightDierction.normalize();
		// gl.uniform3fv(u_LightDirection, lightDierction.elements);

		// point light;

		var u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
		var u_LightPosition = gl.getUniformLocation(gl.program, "u_LightPosition");
		gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
		gl.uniform3f(u_LightPosition, 0.0, 3.0, 4.0);


		// Initlize Light vector

		var normals = new Float32Array([
			0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
			-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
			0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
			0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0
		]);

		var vectorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vectorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, normals, gl.DYNAMIC_DRAW);
		var a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
		gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Normal);

		// init environment light
		var u_environmentLight = gl.getUniformLocation(gl.program, "u_environmentLight");
		gl.uniform3f(u_environmentLight, 0.2, 0.2, 0.2);

		var tx = 0;
		var tick = function() {

			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			// cubeMat.translate(0.1, 0, 0.0);
			cubeMat.rotate(0.3, 0, 1, 0);
			cubeMat.rotate(0.5, 1, 0, 0);
			cubeMat.rotate(0.7, 0, 0, 1);
			var wholeMat = new Matrix4();
			wholeMat.concat(cameraMat).concat(positionMat).concat(cubeMat);
			var normalMat = new Matrix4();
			normalMat.setInverseOf(cubeMat);
			normalMat.transpose();

			var u_normalMat = gl.getUniformLocation(gl.program, "u_normalMat");
			gl.uniformMatrix4fv(u_normalMat, false, normalMat.elements);

			var u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
			gl.uniformMatrix4fv(u_ViewMatrix, false, wholeMat.elements);

			var u_ModalMat = gl.getUniformLocation(gl.program, "u_ModalMat");
			gl.uniformMatrix4fv(u_ModalMat, false, cubeMat.elements);

			gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
			requestAnimationFrame(tick);
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
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.DYNAMIC_DRAW);
	return vertexBuffer;
}
