var sceneSize = 300
let utils = new Utils({ width: sceneSize * 3, height: sceneSize });
var gl = utils.gl;

let vertices = [];
let colors = [];

let cubeVertices = [
    [-.5, -.5, .5],
    [-.5, .5, .5],
    [-.5, .5, -.5],
    [-.5, -.5, -.5],
    [.5, -.5, .5],
    [.5, .5, .5],
    [.5, .5, -.5],
    [.5, -.5, -.5]
];

let cubeColors = [];

for (let x = -.5; x <= .5; x++) {
    for (let y = -.5; y <= .5; y++) {
        for (let z = -.5; z <= .5; z++) {
            // cubeVertices.push([x, y, z]);
            cubeColors.push([
                x + .5,
                y + .5,
                z + .5
            ]);
        }
    }
}

function makeFace(v1, v2, v3, v4) {
    // Guarda 6 coordenadas (2 Triângulos)
    let triangulos = [];

    triangulos.push(v1, v2, v3);
    triangulos.push(v1, v3, v4);

    triangulos.forEach(vertice => {
        vertices.push(...cubeVertices[vertice]);
        colors.push(...cubeColors[v1]);
    })
}

makeFace(0, 1, 2, 3);
makeFace(2, 6, 7, 3);
makeFace(3, 7, 4, 0);
makeFace(4, 5, 1, 0);
makeFace(5, 6, 2, 1);
makeFace(6, 5, 4, 7);

let theta = [0, 0, 0]

let transform_x = 1, transform_y = 1, transform_z = 0;

let speed = 100;

utils.initShader();

utils.initBuffer({ vertices });

utils.linkBuffer({ variable: "aPosition", reading: 3 });


//Criando Textura do quessada
var textura = gl.createTexture();
var joaoquessadaImage = new Image();
joaoquessadaImage.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, textura);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, joaoquessadaImage)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}
joaoquessadaImage.src = 'joaoquessada.jpg'
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, textura);

//Criando Textura do cavo
var textura1 = gl.createTexture();
var cavoImage = new Image();
cavoImage.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, textura1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cavoImage)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}
cavoImage.src = 'cavo.jpg'
gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, textura1);

//Criando Textura do eu
var textura2 = gl.createTexture();
var euImage = new Image();
euImage.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, textura2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, euImage)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}
euImage.src = 'eu.jpg'
gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, textura2);


var textureCoordinates = [
    // Front face
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Você precisa repetir para as outras faces
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    //
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    //
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    //
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    //
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ];

    utils.initBuffer({ vertices: textureCoordinates });

    utils.linkBuffer({ reading: 2, variable: "textCoords" });


var projectionPerspectiveMatrix = mat4.create();
var projectionOrthoMatrix = mat4.create();

//Camera Ortogonal
var size = 1;
var centerX = 0;
var centerY = 0;
mat4.ortho(projectionOrthoMatrix, centerX - size, centerX + size, centerY - size, centerY + size, 0.1, 100);


//Camera Perspectiva
var thetaView = Math.PI / 4;
var aspectRatio = 1;
mat4.perspective(projectionPerspectiveMatrix, thetaView, aspectRatio, 0.1, 100);



utils.linkUniformMatrix({
    shaderName: "uProjectionMatrix",
    value: projectionPerspectiveMatrix,
    kind: "4fv"
});


var view1 = mat4.create();
mat4.lookAt(view1, [15, 15, 15], [0, 0, 0], [0, 1, 0]);

var view2 = mat4.create();
mat4.lookAt(view2, [5, 5, 5], [0, 0, 0], [0, 1, 0]);

var view3 = mat4.create();
mat4.lookAt(view3, [1, 1, 1], [0, 0, 0], [0, 1, 0]);


function render() {

    theta[0] += transform_x;
    theta[1] += transform_y;
    theta[2] += transform_z;

    
    utils.linkUniformVariable({ shaderName: "theta", value: theta, kind: "3fv" });
    utils.linkUniformVariable({shaderName: "uSampler", value: 0, kind:"1i"});
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: view1, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: 0, y: 0, width: sceneSize, height: sceneSize } });


    utils.linkUniformVariable({shaderName: "uSampler", value: 1, kind:"1i"});
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: view2, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: sceneSize, y: 0, width: sceneSize, height: sceneSize } });

    utils.linkUniformVariable({shaderName: "uSampler", value: 2, kind:"1i"});
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: view3, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: sceneSize * 2, y: 0, width: sceneSize, height: sceneSize } });

    window.setTimeout(render, speed);
}

render();