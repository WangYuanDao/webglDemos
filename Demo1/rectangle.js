var VSHADER_SOURCE =
"attribute vec4 a_Position; \n" +
"attribute vec4 a_Color; \n" +
"uniform mat4 u_xformMatrix; \n" +
"uniform mat4 u_projectMatrix; \n" +
"varying vec4 v_Color; \n" +
"void main() { \n" +
"    gl_Position = u_projectMatrix * a_Position; \n" +
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
			0.0, 0.5, -0.2, 1.0, 0.0, 0.0,
			-0.5, -0.5, -0.2, 1.0, 0.0, 0.0,
		    0.5, -0.5, -0.2, 1.0, 0.0, 0.0,

			0.5, 0.5, 0.0, 1.0, 1.0, 0.0,
			-0.5, 0.5, 0.0, 1.0, 1.0, 0.0,
			0.0, -0.5, 0.0, 1.0, 1.0, 0.0,

			0.0, 0.5, 0.2, 1.0, 0.0, 1.0,
			-0.5, -0.5, 0.2, 1.0, 0.0, 1.0,
		    0.5, -0.5, 0.2, 1.0, 0.0, 1.0,			

		]);

		var scale = 0;
		var step = 0.01;
		var x, y, z, r, thetax, thetay, near, far, torwards_x, torwards_y, torwards_z;
		x = y = thetay = thetax = torwards_x = torwards_y = 0;
		z = 0.5;
		r = 0.5;
		near = 0.1;
		far = 20;
		torwards_z = -20;
		var checkTheta = function(value) {
			if (value < 0) {
				value += 360;
				return value;
			}
			if (value >= 360) {
				value -= 360;
				return value;
			}
			return value;
		};

		
		// document.addEventListener("keydown", (e)=> {
		// 	switch (e.code){
		// 		case "ArrowLeft": {
		// 			// thetax = checkTheta(thetax - 1);
		// 			x -= 0.1 * Math.cos(Math.PI * thetax / 180);
		// 		}
		// 		break;
		// 		case "ArrowUp": {
		// 			// thetay = checkTheta(thetay + 1);
		// 			y += 0.1 * Math.cos(Math.PI * thetay / 180);
		// 		}
		// 		break;
		// 		case "ArrowDown": {
		// 			// thetay = checkTheta(thetay - 1);
		// 			y -= 0.1 * Math.cos(Math.PI * thetax / 180);
		// 		}
		// 		break;
		// 		case "ArrowRight": {
		// 			// thetax = checkTheta(thetax + 1);
		// 			x += 0.1 * Math.cos(Math.PI * thetay / 180);
		// 		}
		// 		break;
		// 		case "KeyW": {
		// 			// near -= 0.05;
		// 			thetay = checkTheta(thetay + 1);
		// 		}
		// 		break;
		// 		case "KeyS" : {
		// 			// near += 0.05;
		// 			thetay = checkTheta(thetay - 1);
		// 		}
		// 		break;
		// 		case "KeyA": {
		// 			thetax = checkTheta(thetax - 1);
		// 			// far += 0.05;
		// 		}
		// 		break;
		// 		case "KeyD": {
		// 			thetax = checkTheta(thetax + 1);
		// 			// far -= 0.05;
		// 		}
		// 		break;
		// 		case "KeyR": {
		// 			z -= 0.05;
		// 		}
		// 		break;
		// 		case "KeyE": {
		// 			z += 0.05;
		// 		}
		// 		break;
		// 	}
		// 	let tx = Math.PI * thetax / 180;
		// 	let ty = Math.PI * thetay / 180;
		// 	// x = r * Math.sin(tx);
		// 	// y = r * Math.sin(ty);
		// 	// z = r * Math.cos(ty) * Math.cos(tx);
		// 	torwards_x = far * Math.sin(tx) + x;
		// 	torwards_y = far * Math.sin(ty) + y;
		// 	torwards_z = -far * Math.cos(ty) * Math.cos(tx) + z;

		// 	console.log("yanxi.wl", x, y, z, near, far);
		// 	tick();
		// });

		var tick = function() {
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			scale += step;
			var xformMatrix = new Float32Array([
				1.0, 0.0, 0.0, 0.0,
				0.0, 1.0, 0.0, 0.0,
				0.0, 0.0, 1.0, 0.0,
				0.0, 0.0, scale, 1.0
			]);

			var u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix");
			gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

			var matLookAt = new Matrix4();
			matLookAt.setLookAt(x, y, z, torwards_x, torwards_y, torwards_z, 0, 1, 0);
			var mat = new Matrix4();
			mat.setOrtho(-1, 1, -1, 1, near, far);
			// mat.setPerspective(90, 1, near, far);
			mat.concat(matLookAt);
			var u_projectMatrix = gl.getUniformLocation(gl.program, "u_projectMatrix");
			gl.uniformMatrix4fv(u_projectMatrix, false, mat.elements);

			var vertexBuffer = createAndSetBuffer(gl, vertices);
			var FSize = vertexBuffer.BYTES_PER_ELEMENT;
			console.log("FSize is ", FSize);
			var a_Position = getAttributeValue(gl, "a_Position");
			gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 4 * 6, 0);
			gl.enableVertexAttribArray(a_Position);

			var a_Color = gl.getAttribLocation(gl.program, "a_Color");
			gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 4 * 6, 4 * 3);
			gl.enableVertexAttribArray(a_Color);
			// gl.drawArrays(gl.POINTS, 0, 3);
			// gl.drawArrays(gl.LINE_LOOP, 0, 4);
			gl.drawArrays(gl.TRIANGLES, 0, 9);
			if (scale >= 1 || scale <= 0) {
				step = -step;
			}
			// requestAnimationFrame(tick);
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
