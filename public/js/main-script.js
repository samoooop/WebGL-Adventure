var scene = new THREE.Scene();
var GLDom = document.getElementById("GL");
var width = GLDom.offsetWidth;
var height = GLDom.offsetHeight;
var aspect = width / height;
var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
var dbCanvasDom = document.getElementById("debugCanvas");
var dbCanvasCtx = dbCanvasDom.getContext("2d");
renderer.setSize( width, height );
GLDom.appendChild( renderer.domElement );

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
var bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter} );

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

    var gl = renderer.getContext();
    var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    dbCanvasCtx.moveTo(10, 10);
    dbCanvasCtx.lineTo(10+1, 10+1);
    dbCanvasCtx.stroke();
    dbCanvasCtx.moveTo(800, 400);
    dbCanvasCtx.lineTo(0, 0);
    dbCanvasCtx.stroke();
    /// Canvas Code
    for(var index=0; index<height*width*4; index+=1){
        if(pixels[index] != 0){
            var corX = (index / 4) % width;
            var corY = (index / (4 * width));
            dbCanvasCtx.moveTo(corX, corY);
            dbCanvasCtx.lineTo(corX+1, corY+1);
            dbCanvasCtx.stroke();
        }
    }
    /// END Canvas Code
    
    renderer.render( scene, camera );
}