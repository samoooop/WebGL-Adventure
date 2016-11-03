var scene = new THREE.Scene();
var GLDom = document.getElementById("GL");
// var width = GLDom.offsetWidth;
// var height = GLDom.offsetHeight;
var width = 30;
var height = 30;
var aspect = width / height;
var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
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

var geometry = new THREE.SphereGeometry( 1, 10, 10 );
// var material = new THREE.MeshNormalMaterial();
var material = new THREE.MeshNormalMaterial({
    shading: THREE.FlatShading,
    wireframe: false
});
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.z = 4;

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
    cube.rotation.y += 0.001 * frameTime;
    // camera.position.y = cameraDefault.position.y + Math.sin(time / 1000);
    // camera.position.x = cameraDefault.position.y + Math.cos(time / 1000);

    renderer.render( scene, camera, bufferTexture );
    renderer.readRenderTargetPixels(bufferTexture,0 ,0,width,height,pixels);
    //console.log(pixels.filter(function(x){return x!=0}));
    // renderer.render( scene, camera );

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