var scene = new THREE.Scene();
var width = window.innerWidth;
var height = window.innerHeight;
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

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
    var pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    
    renderer.render( scene, camera );
}