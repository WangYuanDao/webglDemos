var VSHADER_SOURCE = VTEXTURE_SOURCE =
"attribute vec4 a_Position; \n" +
"attribute vec4 a_Color; \n" +
"uniform mat4 u_ViewMatrix; \n" +
"uniform mat4 u_normalMat; \n" +
"uniform mat4 u_camraMat; \n" +
"attribute vec4 a_Normal; \n" +
"varying vec4 v_Color; \n" +
"uniform mat4 u_ModalMat; \n" +
"varying vec3 v_Normal; \n" +
"varying vec3 v_Position; \n" +
"void main() { \n" +
"    gl_Position = u_camraMat * u_ViewMatrix * u_ModalMat * a_Position; \n" +
"    v_Normal = normalize(vec3(u_normalMat * a_Normal)); \n" +
"    v_Position = vec3(u_ModalMat * a_Position); \n" +
"    v_Color = a_Color; \n" +
"}\n";

var FSHADER_SOURCE = FTEXTURE_SOURCE = 
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

// var VTEXTURE_SOURCE = 
// "attribute vec4 a_Position; \n" +
// "uniform mat4 u_ViewMatrix; \n" +
// "uniform mat4 u_normalMat; \n" +
// "attribute vec4 a_Normal; \n" +
// "varying vec4 v_Color; \n" +
// "uniform mat4 u_ModalMat; \n" +
// "varying vec3 v_Normal; \n" +
// "varying vec3 v_Position; \n" +
// "attribute vec2 a_TexCoord; \n" +
// "varying vec2 v_TexCoord; \n" +
// "void main() { \n" +
// "    gl_Position = u_ViewMatrix * a_Position; \n" +
// "    v_Normal = normalize(vec3(u_normalMat * a_Normal)); \n" +
// "    v_Position = vec3(u_ModalMat * a_Position); \n" +
// "    v_TexCoord = a_TexCoord; \n" +
// "}\n";

// var FTEXTURE_SOURCE = 
// "precision mediump float; \n" +
// "uniform vec3 u_LightColor; \n" +
// "uniform vec3 u_LightPosition; \n" +
// "uniform vec3 u_environmentLight; \n" +
// "varying vec3 v_Normal; \n" +
// "varying vec3 v_Position; \n" +
// "uniform sampler2D u_Sample; \n" +
// "varying vec2 v_TexCoord; \n" +
// "void main() { \n" +
// "    vec4 pixel = texture2D(u_Sample, v_TexCoord); \n" +
// "    vec3 normal = normalize(v_Normal); \n" +
// "    vec3 lightDierction = normalize(u_LightPosition - v_Position); \n" +
// "	 float nDotL = max(dot(lightDierction, normal), 0.0); \n" +
// "    vec3 diffuse = u_LightColor * pixel.rgb * nDotL; \n" +
// "	 vec3 ambient = u_environmentLight * pixel.rgb; \n" +
// "    gl_FragColor = vec4(diffuse + ambient, 1.0); \n" +
// "}\n";

var program;
var program2;
function main() {
	var canvas = document.getElementById("webglcanvas");
	var gl = canvas.getContext("webgl");
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	program = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
	program2 = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
	runShader(gl);
}



function runShader(gl) {
	gl.useProgram(program);
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
		var a_Position = gl.getAttribLocation(program, "a_Position");
		gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position);

		var a_Position2 = gl.getAttribLocation(program2, "a_Position");
		gl.vertexAttribPointer(a_Position2, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Position2);

		// init colors
		var colors = new Float32Array([
			0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
			1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
			1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0,
			0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0
		]);

		var colorsBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);
		var a_Color = gl.getAttribLocation(program, "a_Color");
		gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Color);
		var a_Color2 = gl.getAttribLocation(program2, "a_Color");
		gl.vertexAttribPointer(a_Color2, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Color2);


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
		cameraMat.lookAt(5, 5, 5, 0, 0, 0, 0, 1, 0);
		var cameraPosition = {x: 0, y: 0, z: 0, rx: 0, ry: 0};
		var u_ViewMatrix = gl.getUniformLocation(program, "u_camraMat");
		gl.uniformMatrix4fv(u_ViewMatrix, false, cameraMat.elements);


		// pingxing light
		// var u_LightColor = gl.getUniformLocation(program, "u_LightColor");
		// var u_LightDirection = gl.getUniformLocation(program, "u_LightDirection");

		// gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

		// var lightDierction = new Vector3([0.0, 3.0, 5.0]);
		// lightDierction.normalize();
		// gl.uniform3fv(u_LightDirection, lightDierction.elements);

		// point light;

		var u_LightColor = gl.getUniformLocation(program, "u_LightColor");
		var u_LightPosition = gl.getUniformLocation(program, "u_LightPosition");
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
		var a_Normal = gl.getAttribLocation(program, "a_Normal");
		gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Normal);

		var a_Normal2 = gl.getAttribLocation(program2, "a_Normal");
		gl.vertexAttribPointer(a_Normal2, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Normal2);

		// init environment light
		var u_environmentLight = gl.getUniformLocation(program, "u_environmentLight");
		gl.uniform3f(u_environmentLight, 0.2, 0.2, 0.2);

		var leftLegTheta = rightLegTheta = leftArmTheta = rightArmTheta = headTheta = 0;
		var armStep = 1;
		var legStep = 0.5;
		var headStep = 1;
		var legRange = 0;
		var armRange = 0;
		var headRange = 0;
		cubeMat.rotate(90, 0, 1, 0);
		cubeMat.scale(1.0, 1.1, 1.0);
		var tx = 0;

		function tick() {
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			tx++;
			gl.useProgram(program);
			var robotMat = new Matrix4();
			robotMat.rotate(tx, 0, 1, 0);

			if (legRange < 40) {
				leftLegTheta += legStep;
				rightLegTheta -= legStep;
				legRange++;
			} else {
				legRange = -40;
				legStep = -legStep;
			}

			if (armRange < 40) {
				leftArmTheta += armStep;
				rightArmTheta -= armStep;
				armRange++;
			} else {
				armRange = -40;
				armStep = -armStep;
			}

			if (headRange < 20) {
				headTheta -= headStep;
				headRange++;
			} else {
				headRange = -20;
				headStep = -headStep;
			}
	
			var normalMat = new Matrix4();
			normalMat.setInverseOf(cubeMat);
			normalMat.transpose();
			drawBox(gl, program, 36, cubeMat, normalMat, robotMat);

			var cubeMat2 = new Matrix4();
			cubeMat2.rotate(rightLegTheta, 1, 0, 0);
			cubeMat2.translate(-0.8, -2.0, 0.0);
			cubeMat2.scale(0.5, 1.0, 0.5);
			var normalMat2 = new Matrix4();
			normalMat2.setInverseOf(cubeMat2);
			normalMat2.transpose();
			drawBox(gl, program, 36, cubeMat2, normalMat2, robotMat);

			var cubeMat3 = new Matrix4();
			cubeMat3.rotate(leftLegTheta, 1, 0, 0);
			cubeMat3.translate(0.8, -2.0, 0.0);
			cubeMat3.scale(0.5, 1.0, 0.5);
			var normalMat3 = new Matrix4();
			normalMat3.setInverseOf(cubeMat3);
			normalMat3.transpose();
			drawBox(gl, program, 36, cubeMat3, normalMat3, robotMat);

			var cubeMat4 = new Matrix4();
			cubeMat4.rotate(leftArmTheta, 1, 0, 0);
			cubeMat4.translate(1.5, 1.0, 0.0);
			cubeMat4.scale(0.4, 0.8, 0.4);
			var normalMat4 = new Matrix4();
			normalMat4.setInverseOf(cubeMat4);
			normalMat4.transpose();
			drawBox(gl, program, 36, cubeMat4, normalMat4, robotMat);

			var cubeMat5 = new Matrix4();
			cubeMat5.rotate(rightArmTheta, 1, 0, 0);
			cubeMat5.translate(-1.5, 1.0, 0.0);
			cubeMat5.scale(0.5, 1.0, 0.5);
			var normalMat5 = new Matrix4();
			normalMat5.setInverseOf(cubeMat5);
			normalMat5.transpose();
			drawBox(gl, program, 36, cubeMat5, normalMat5, robotMat);
			
			var cubeMat6 = new Matrix4();
			cubeMat6.rotate(headTheta, 0, 1, 0);
			cubeMat6.translate(0.0, 1.5, 0.0);
			cubeMat6.scale(0.5, 0.5, 0.5);
			var normalMat6 = new Matrix4();
			normalMat6.setInverseOf(cubeMat6);
			normalMat6.transpose();
			drawBox(gl, program, 36, cubeMat6, normalMat6, robotMat);

			gl.useProgram(program2);

			var u_ViewMatrix2 = gl.getUniformLocation(program2, "u_camraMat");
			gl.uniformMatrix4fv(u_ViewMatrix2, false, cameraMat.elements);

			var u_LightColor2 = gl.getUniformLocation(program2, "u_LightColor");
			var u_LightPosition2 = gl.getUniformLocation(program2, "u_LightPosition");
			gl.uniform3f(u_LightColor2, 1.0, 1.0, 1.0);
			gl.uniform3f(u_LightPosition2, 0.0, 3.0, 4.0);
			var u_environmentLight2 = gl.getUniformLocation(program2, "u_environmentLight");
			gl.uniform3f(u_environmentLight2, 0.2, 0.2, 0.2);

			var cubeMat7 = new Matrix4();
			cubeMat7.scale(8.0, 8.0, 8.0);
			var normalMat7 = new Matrix4();
			normalMat7.setInverseOf(cubeMat6);
			normalMat7.transpose();
			drawBox(gl, program2, 36, cubeMat7, normalMat7, new Matrix4());

			requestAnimationFrame(tick);
		}
		tick();
	}
}

function drawBox(gl, target, n, viewMat, normalMat, robotMat) {
	var u_normalMat = gl.getUniformLocation(target, "u_normalMat");
	gl.uniformMatrix4fv(u_normalMat, false, normalMat.elements);

	var u_ModalMat = gl.getUniformLocation(target, "u_ModalMat");
	gl.uniformMatrix4fv(u_ModalMat, false, viewMat.elements);

	var u_ViewMatrix = gl.getUniformLocation(target, "u_ViewMatrix");
	gl.uniformMatrix4fv(u_ViewMatrix, false, robotMat.elements);

	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
}

function initShader(gl, vshaderSource, fshaderSource) {
	var vshader = gl.createShader(gl.VERTEX_SHADER);
	var fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(vshader, vshaderSource);
	gl.shaderSource(fshader, fshaderSource);
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
	program = program;
	gl.attachShader(program, vshader);
	gl.attachShader(program, fshader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.log(gl.getProgramInfoLog(program));
	}
	return program;
}