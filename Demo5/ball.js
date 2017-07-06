var VSHADER_SOURCE =
"attribute vec4 a_Position; \n" +
"uniform mat4 u_ViewMatrix; \n" +
"uniform mat4 u_normalMat; \n" +
"attribute vec4 a_Normal; \n" +
"uniform mat4 u_ModalMat; \n" +
"varying vec3 v_Normal; \n" +
"varying vec3 v_Position; \n" +
"void main() { \n" +
"    gl_Position = u_ViewMatrix * a_Position; \n" +
"    v_Normal = normalize(vec3(u_normalMat * a_Normal)); \n" +
"    v_Position = vec3(u_ModalMat * a_Position); \n" +
"}\n";

var FSHADER_SOURCE =
"precision mediump float; \n" +
"uniform vec3 u_LightColor; \n" +
"uniform vec3 u_LightPosition; \n" +
"uniform vec3 u_environmentLight; \n" +
"varying vec3 v_Normal; \n" +
"varying vec3 v_Position; \n" +
"void main() { \n" +
"    vec4 pixel = vec4(1.0, 1.0, 0.0, 1.0); \n" +
"    vec3 normal = normalize(v_Normal); \n" +
"    vec3 lightDierction = normalize(u_LightPosition - v_Position); \n" +
"	 float nDotL = max(dot(lightDierction, normal), 0.0); \n" +
"    vec3 diffuse = u_LightColor * pixel.rgb * nDotL; \n" +
"	 vec3 ambient = u_environmentLight * pixel.rgb; \n" +
"    gl_FragColor = vec4(diffuse + ambient, 1.0); \n" +
"}\n";


function main() {
	var canvas = document.getElementById("webglcanvas");
	var gl = canvas.getContext("webgl");
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	runShader(gl);
}

const radius = 1;
const counts = n = 20;
const step = 360 / counts;

function f(a, b) {
	var a=Math.PI*a/n,b=2*Math.PI*b/n,l=Math.sin(a);
    return [Math.sin(b)*l,Math.cos(a),Math.cos(b)*l];
}

function createBallPoints(ballPoints, normalArray, mapArray) {
	for (let rh = 1; rh <= counts; rh++) {
		for (let rv = 1; rv <= counts; rv++) {
			let k=[].concat(f(rh,rv),f(rh-1,rv),f(rh,rv-1),f(rh,rv-1),f(rh-1,rv),f(rh-1,rv-1));
			ballPoints.push.apply(ballPoints, k);
			normalArray.push.apply(normalArray, k);
			mapArray.push(
			      rv/n,1-rh/n, rv/n,1-(rh-1)/n, (rv-1)/n,1-rh/n,
			      (rv-1)/n,1-rh/n, rv/n,1-(rh-1)/n, (rv-1)/n,1-(rh-1)/n
			    );
		}
	}
}

function runShader(gl) {
	var program;
	program = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
	if (program) {

		var indexBuffer = gl.createBuffer();

		var ballPoints = [];
		var normalArray = [];
		var mapArray = [];
		createBallPoints(ballPoints, normalArray, mapArray);

		console.log(ballPoints.length);
		var vertices = new Float32Array(ballPoints);
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

				// init Matrix
		var cubeMat = new Matrix4();
		var cameraMat = new Matrix4();
		var eyeMat = new Matrix4();
		var positionMat = new Matrix4();
		cameraMat.setPerspective(60, 1, 0.1, 100);
		cameraMat.lookAt(5, 5, 0, 0, 0, 0, 0, 1, 0);
		var cameraPosition = {x: 0, y: 0, z: 0, rx: 0, ry: 0};

		var u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
		var u_LightPosition = gl.getUniformLocation(gl.program, "u_LightPosition");
		gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
		gl.uniform3f(u_LightPosition, 0.0, 3.0, 4.0);

		var normals = new Float32Array(normalArray);

		var vectorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vectorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, normals, gl.DYNAMIC_DRAW);
		var a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
		gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(a_Normal);

		var u_environmentLight = gl.getUniformLocation(gl.program, "u_environmentLight");
		gl.uniform3f(u_environmentLight, 0.5, 0.5, 0.5);

		var tx = 0;

		var tick = function() {

			gl.clearColor(0.0, 1.0, 0.0, 1.0);
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

			gl.drawArrays(gl.LINES, 0, n * n * 6);
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
