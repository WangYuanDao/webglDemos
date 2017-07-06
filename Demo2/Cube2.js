var VSHADER_SOURCE =
"attribute vec4 a_Position; \n" +
"attribute vec4 a_Color; \n" +
"uniform mat4 u_ViewMatrix; \n" +
"varying vec4 v_Color; \n" +
"void main() { \n" +
"    gl_Position = u_ViewMatrix * a_Position; \n" +
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
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	runShader(gl);
}

function runShader(gl) {
	var program;
	program = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
	if (program) {
		var vertices = new Float32Array([
			1.0, 1.0, 1.0, 1.0, 0.0, 0.0,
			-1.0, 1.0, 1.0, 1.0, 1.0, 0.0,
			-1.0, -1.0, 1.0, 1.0, 0.0, 1.0,
			1.0, -1.0, 1.0, 0.0, 1.0, 0.0,
			1.0, -1.0, -1.0, 0.0, 0.0, 1.0,
			1.0, 1.0, -1.0, 1.0, 1.0, 0.5,
			-1.0, 1.0, -1.0, 0.5, 1.0, 0.0,
			-1.0, -1.0, -1.0, 1.0, 0.0, 0.5

		]);

		var index = new Uint8Array([
			0, 1, 2, 0, 2, 3,
			0, 3, 4, 0, 4, 5,
			0, 5, 6, 0, 6, 1,
			1, 6, 7, 1, 7, 2,
			7, 4, 3, 7, 3, 2,
			4, 7, 6, 4, 6, 5
		]);

		var indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);

		var cubeMat = new Matrix4();
		var cameraMat = new Matrix4();
		var eyeMat = new Matrix4();
		var positionMat = new Matrix4();
		cameraMat.setPerspective(90, 1, 0.1, 100);
		eyeMat.setLookAt(0, 0, 5, 0, 0, 0, 0, 1, 0);
		var cameraPosition = {x: 0, y: 0, z: 0, rx: 0, ry: 0};

		document.addEventListener("keydown", (ev) => {
			switch (ev.code) {
				case "ArrowUp": {
					cameraMat.rotate(-cameraPosition.rx, 1, 0, 0);
					cameraMat.rotate(-cameraPosition.ry, 0, 1, 0);
					cameraMat.translate(0, -0.1, 0.0);
					cameraPosition.y -= 0.1;
					cameraMat.rotate(cameraPosition.ry, 0, 1, 0);
					cameraMat.rotate(cameraPosition.rx, 1, 0, 0);
				}
				break;
				case "ArrowDown": {					
					cameraMat.rotate(-cameraPosition.rx, 1, 0, 0);
					cameraMat.rotate(-cameraPosition.ry, 0, 1, 0);
					cameraMat.translate(0, 0.1, 0.0);
					cameraPosition.y += 0.1;
					cameraMat.rotate(cameraPosition.ry, 0, 1, 0);
					cameraMat.rotate(cameraPosition.rx, 1, 0, 0);
				}
				break;
				case "ArrowLeft": {
					cameraMat.rotate(-cameraPosition.rx, 1, 0, 0);
					cameraMat.rotate(-cameraPosition.ry, 0, 1, 0);
					cameraMat.translate(0.1, 0, 0);
					cameraPosition.x += 0.1;
					cameraMat.rotate(cameraPosition.ry, 0, 1, 0);
					cameraMat.rotate(cameraPosition.rx, 1, 0, 0);
				}
				break;
				case "ArrowRight": {
					cameraMat.rotate(-cameraPosition.rx, 1, 0, 0);
					cameraMat.rotate(-cameraPosition.ry, 0, 1, 0);
					cameraMat.translate(-0.1, 0, 0);
					cameraPosition.x -= 0.1;
					cameraMat.rotate(cameraPosition.ry, 0, 1, 0);
					cameraMat.rotate(cameraPosition.rx, 1, 0, 0);
				}
				break;
				case "KeyW": {
					// cameraMat.rotate(-cameraPosition.rx, 1, 0, 0);
					// cameraMat.rotate(-cameraPosition.ry, 0, 1, 0);
					cameraMat.translate(-cameraPosition.x, -cameraPosition.y, -cameraPosition.z);
					cameraMat.rotate(2, 1, 0, 0);
					cameraMat.translate(cameraPosition.x, cameraPosition.y, cameraPosition.z);
					// cameraMat.rotate(cameraPosition.ry, 0, 1, 0);
					// cameraMat.rotate(cameraPosition.rx, 1, 0, 0);
					cameraPosition.rx += 2;
				}
				break;
				case "KeyS": {
					// cameraMat.rotate(-cameraPosition.rx, 1, 0, 0);
					// cameraMat.rotate(-cameraPosition.ry, 0, 1, 0);
					cameraMat.translate(-cameraPosition.x, -cameraPosition.y, -cameraPosition.z);
					cameraMat.rotate(-2, 1, 0, 0);
					cameraMat.translate(cameraPosition.x, cameraPosition.y, cameraPosition.z);
					// cameraMat.rotate(cameraPosition.ry, 0, 1, 0);
					// cameraMat.rotate(cameraPosition.rx, 1, 0, 0);
					cameraPosition.rx -= 2;
				}
				break;
				case "KeyD": {
					// cameraMat.rotate(-cameraPosition.rx, 1, 0, 0);
					// cameraMat.rotate(-cameraPosition.ry, 0, 1, 0);
					cameraMat.translate(-cameraPosition.x, -cameraPosition.y, -cameraPosition.z);
					cameraMat.rotate(2, 0, 1, 0);
					cameraMat.translate(cameraPosition.x, cameraPosition.y, cameraPosition.z);
					// cameraMat.rotate(cameraPosition.ry, 0, 1, 0);
					// cameraMat.rotate(cameraPosition.rx, 1, 0, 0);
					cameraPosition.ry += 2;
				}
				break;
				case "KeyA": {
					// cameraMat.rotate(-cameraPosition.rx, 1, 0, 0);
					// cameraMat.rotate(-cameraPosition.ry, 0, 1, 0);
					cameraMat.translate(-cameraPosition.x, -cameraPosition.y, -cameraPosition.z);
					cameraMat.rotate(-2, 0, 1, 0);
					cameraMat.translate(cameraPosition.x, cameraPosition.y, cameraPosition.z);
					// cameraMat.rotate(cameraPosition.ry, 0, 1, 0);
					// cameraMat.rotate(cameraPosition.rx, 1, 0, 0);
					cameraPosition.ry -= 2;
				}
				break;
				case "ArrowUp":
				case "KeyE": {
					cameraMat.rotate(-cameraPosition.rx, 1, 0, 0);
					cameraMat.rotate(-cameraPosition.ry, 0, 1, 0);
					cameraMat.translate(0, 0, 0.1);
					cameraPosition.z += 0.1;					
					cameraMat.rotate(cameraPosition.ry, 0, 1, 0);
					cameraMat.rotate(cameraPosition.rx, 1, 0, 0);
				}
				break;
				case "ArrowDown":
				case "KeyR": {
					cameraMat.rotate(-cameraPosition.rx, 1, 0, 0);
					cameraMat.rotate(-cameraPosition.ry, 0, 1, 0);
					cameraMat.translate(0, 0, -0.1);
					cameraPosition.z -= 0.1;
					cameraMat.rotate(cameraPosition.ry, 0, 1, 0);
					cameraMat.rotate(cameraPosition.rx, 1, 0, 0);
				}
				break;
				
			}
			tick();

		});

		var tick = function() {

			var wholeMat = new Matrix4();
			wholeMat.concat(cameraMat).concat(eyeMat).concat(positionMat).concat(cubeMat);

			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			var u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
			gl.uniformMatrix4fv(u_ViewMatrix, false, wholeMat.elements);

			var vertexBuffer = createAndSetBuffer(gl, vertices);
			var a_Position = getAttributeValue(gl, "a_Position");
			gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 4 * 6, 0);
			gl.enableVertexAttribArray(a_Position);

			var a_Color = gl.getAttribLocation(gl.program, "a_Color");
			gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 4 * 6, 4 * 3);
			gl.enableVertexAttribArray(a_Color);
			gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
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
