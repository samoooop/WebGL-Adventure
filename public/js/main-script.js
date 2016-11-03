var scene = new THREE.Scene();
var GLDom = document.getElementById("GL");
// var width = GLDom.offsetWidth;
// var height = GLDom.offsetHeight;
var width = 30;
var height = 30;
var aspect = width / height;
var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
var isoCamera = new THREE.OrthographicCamera( -5, 5, 5, -5, -5, 5 );
var renderer = new THREE.WebGLRenderer();
var dbCanvasDom = document.getElementById("debugCanvas");
var dbCanvasCtx = dbCanvasDom.getContext("2d");
var pixels = new Uint8Array(width * height * 4);
var gl;
renderer.setSize( width, height );
dbCanvasDom.width = width;
dbCanvasDom.height = height;
GLDom.appendChild( renderer.domElement );
renderer.domElement.style.width = "";
renderer.domElement.style.height = "";

var geometry = new THREE.CubeGeometry( 1, 1, 1 );
// var material = new THREE.MeshNormalMaterial();
// var material = new THREE.MeshNormalMaterial({
//     shading: THREE.FlatShading,
//     wireframe: false
// });

for ( var i = 0; i < geometry.faces.length; i += 2 ) {
	var hex = Math.random() * 0xffffff;
	geometry.faces[ i ].color.setHex( hex );
	geometry.faces[ i + 1 ].color.setHex( hex );
}
var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
camera.position.z = 4;
var cube = new THREE.Mesh( geometry,material);
scene.add( cube );
//isoCamera.position.z = 100;
var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 0, 1 ).normalize();
scene.add( light );


cameraDefault = {
    position: {
        x:0, y:0, z:0
    }
};

// var bufferScene = new THREE.Scene();
var bufferTexture = new THREE.WebGLRenderTarget( 30, 30, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );

var prevFrameTime = 0;
var coreRender = function (time) {
    requestAnimationFrame( coreRender );
    render(time - prevFrameTime, time);
    prevFrameTime = time;
};

coreRender(0);

function render(frameTime, time) {
    // cube.rotation.y += 0.001 * frameTime;
    // camera.position.y = cameraDefault.position.y + Math.sin(time / 1000);
    // camera.position.x = cameraDefault.position.y + Math.cos(time / 1000);

    renderer.setSize( width, height );
    renderer.render( scene, camera, bufferTexture );
    renderer.readRenderTargetPixels(bufferTexture,0 ,0,width,height,pixels);
    //console.log(pixels.filter(function(x){return x!=0}));
    renderer.autoClear = false;
    renderer.clear();
    renderer.setSize( 750, 500 );
    var c=0;
    for(var i=0;i<2;i++){
        for(var j=0;j<2;j++){
            renderer.setViewport( 250*i, 250*j, 250, 250);
            isoCamera.position.x = Math.sin(c);
            isoCamera.position.y = Math.cos(c);
            isoCamera.lookAt(scene.position);
            renderer.render( scene, isoCamera );
            c+=Math.PI/2;
        }
    }
    isoCamera.position.y = isoCamera.position.z;
    isoCamera.position.x = 0;
    isoCamera.position.z = 0;
    isoCamera.lookAt(scene.position);
    renderer.render( scene, isoCamera );
    isoCamera.position.y = -isoCamera.position.y;
    isoCamera.lookAt(scene.position);
    renderer.render( scene, isoCamera );

    if(gl === undefined)
        gl = renderer.getContext();
    //gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    //renderer.readRenderTargetPixels(bufferTexture, 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, pixels);
    // dbCanvasCtx.moveTo(10, 10);
    // dbCanvasCtx.lineTo(10+1, 10+1);
    // dbCanvasCtx.stroke();
    // dbCanvasCtx.moveTo(800, 400);
    // dbCanvasCtx.lineTo(0, 0);
    // dbCanvasCtx.stroke();
    /// Canvas Code
    var counter = 0;
    dbCanvasCtx.clearRect(0, 0, dbCanvasDom.width, dbCanvasDom.height);
    dbCanvasCtx.beginPath();
    dbCanvasCtx.moveTo(0, 0);
    for(var index=0; index<height*width*4; index+=4){
//         if(counter++ > 2) break;
        if(pixels[index] !== 0){
            var corX = (index / 4) % width;
            var corY = (index / (4 * width));
            dbCanvasCtx.lineTo(corX, corY);
        }
    }
    dbCanvasCtx.closePath();
    dbCanvasCtx.stroke();
    /// END Canvas Code

    // renderer.render( scene, camera );
}