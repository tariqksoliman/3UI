var THREE = require( './js/three.min.js' );
window.THREE = THREE;
require( './js/OrbitControls.js' );
require( './js/CSS3DRenderer.js' );

var element = document.createElement( 'div' );
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127,0.5)';

        var number = document.createElement( 'div' );
        number.className = 'number';
        number.textContent = 79;
        element.appendChild( number );

        var symbol = document.createElement( 'div' );
        symbol.className = 'symbol';
        symbol.textContent = 'Au';
        element.appendChild( symbol );

        var details = document.createElement( 'div' );
        details.className = 'details';
        details.innerHTML = 'Gold <br> Aurum ';
        element.appendChild( details );

        var input = document.createElement( 'input' );
        input.setAttribute( 'type', 'text' );
        //element.appendChild( input );

        document.getElementsByClassName( 'element' )[0].addEventListener( 'click', function() {
            this.style.backgroundColor = 'rgba(0,' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',0.5)';
        }  );

// global variables, referenced from render loop
var renderer;
var scene;
var camera;
var controls;

var initWidth;

var elements;
var objects;

init();

function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );

    // create a CSS3DRenderer
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.position = 'absolute';
    document.body.appendChild( renderer.domElement );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.rotateSpeed = 0.05;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false;

    document.body.addEventListener( 'wheel', onMouseWheel, false );

    initWidth = window.innerWidth;
    objects = new THREE.Object3D();

    // position and point the camera to the center of the scene
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 100;
    var z = ( camera.aspect * Math.tan( camera.fov ) ) / ( 2 * initWidth );
    //console.log( z );
    var te = 2 * Math.atan( ( initWidth / camera.aspect ) / ( 2 * z ) ) * ( 180 / Math.PI );
    //console.log( te );
    camera.fov = 2 * Math.atan( ( initWidth / camera.aspect ) / ( 2 * 1600 ) ) * ( 180 / Math.PI ); // in degrees
    //camera.lookAt( scene.position );

    elements = makeElements();

    for( var i = 0; i < elements.length; i++ ) {
        var element = document.createElement( 'div' );
            element.className = 'x-el3UI';
        for( var j = 0; j < elements[i].el.length; j++ ) {
            element.appendChild( elements[i].el[j] );
        }

        object = new THREE.CSS3DObject( element );

        object.position.z = elements[i].pos[2] - 1600;
        rotObject = new THREE.Object3D();
        object.position.y = elements[i].pos[1] - ( elements[i].height / 2 );

        rotObject.rotation.y = elements[i].rot[1];
        rotObject.add( object );
        objects.add( rotObject );
    }

    scene.add( objects );

    window.addEventListener( 'resize', onWindowResize, false );

    animate();
}


function makeElements() {
    var elements = [];
    var element;
    var tags = document.getElementsByTagName( 'x-3UI' );
    for( var i = 0; i < tags.length; i++ ) {
        element = { el: tags[i].children, pos: [], rot: [], height: 0 };
        element.pos = tags[i].getAttribute( 'pos' ).split(',').map(Number);
        element.rot = tags[i].getAttribute( 'rot' ).split(',').map(Number);

        //getHeight
        for( var j = 0; j < tags[i].children.length; j++ ) {
            element.height += tags[i].children[j].clientHeight;
        }
        tags[i].style.display = 'none';

        elements.push( element );
    }
    return elements;
}

function onMouseWheel( e ) {
    objects.position.y += e.deltaY;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.fov = 2 * Math.atan( ( initWidth / camera.aspect ) / ( 2 * 1600 ) ) * ( 180 / Math.PI ); // in degrees

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();
}

function animate() {
    requestAnimationFrame( animate );
    //TWEEN.update();
    render();
}

function render() {
    renderer.render( scene, camera )
    
    controls.update();
    //objects.children[0].rotation.y += 0.005;
    //for( var i = 0; i < objects.children.length; i++ ) {
        //objects[i].lookAt( camera );
    //}
}