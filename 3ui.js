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
var pages;

var objects;

init();

function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

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
    //var z = ( camera.aspect * Math.tan( camera.fov ) ) / ( 2 * initWidth );
    //console.log( z );
    //var te = 2 * Math.atan( ( initWidth / camera.aspect ) / ( 2 * z ) ) * ( 180 / Math.PI );
    //console.log( te );
    camera.fov = 2 * Math.atan( ( initWidth / camera.aspect ) / ( 2 * 1600 ) ) * ( 180 / Math.PI ); // in degrees
    //camera.lookAt( scene.position );

    scene.add( makePages() );

    window.addEventListener( 'resize', onWindowResize, false );

    animate();
}

function makePages() {
    
    var objects = new THREE.Object3D();
    var object;

    var rotObject;
    var lastRotObject = objects;
    var lastRotCandidate;
    
    var lastPage;

    apply3UI( document.body );

    function apply3UI( parent ) {
        if( !parent.className.includes( 'css3drenderer' ) ) {
            if( parent.x3UI ) { lastRotObject = parent.x3UI;
                console.log( parent.tagName );
            }
            for( var i = 0; i < parent.children.length; i++ ) {
                switch( parent.children[i].nodeName ) {
                    case 'X3UI-PAGE':
                            parent.children[i].x3UI = setObject( parent.children[i], true );
                        break;
                    case 'X3UI-DIV':
                            parent.children[i].x3UI = setObject( parent.children[i], false );
                        break;
                }
                apply3UI( parent.children[i] );
            }
        }
    }

    function setObject( element, isPage ) {
        //Make the base element
        var page = document.createElement( 'div' );
        page.className = element.tagName;
        //Add all the children
        for( var i = 0; i < element.children.length; i++ ) {
            page.appendChild( element.children[i].cloneNode(true) );
        }
        //Remove all x3UI children
        var subX3UI = page.getElementsByTagName( 'x3UI-div' );
        while( subX3UI[0] ) subX3UI[0].parentNode.removeChild( subX3UI[0] );

        var pos = element.getAttribute( 'pos' );
        var rot = element.getAttribute( 'rot' );
        var rotp = element.getAttribute( 'rotp' );
        pos = pos ? pos.split(',').map(Number) : [0,0,0];
        rot = rot ? rot.split(',').map(Number) : [0,0,0];
        rotp = rotp ? rotp.split(',').map(Number) : [0,0,0];
        var height = 0;
        for( var i = 0; i < element.children.length; i++ ) {
            height += element.children[i].clientHeight;
        }

        object = new THREE.CSS3DObject( page );

        object.position.z = pos[2] - 1600;
        object.position.y = pos[1] - ( height / 2 );
        object.position.x = pos[0];

        object.rotation.y = rot[1] * ( Math.PI / 180 );
        object.rotation.x = rot[0] * ( Math.PI / 180 );
        object.rotation.z = rot[2] * ( Math.PI / 180 );
        
        rotObject = new THREE.Object3D();

        rotObject.rotation.y = rotp[1] * ( Math.PI / 180 );
        rotObject.rotation.x = rotp[0] * ( Math.PI / 180 );
        rotObject.rotation.z = rotp[2] * ( Math.PI / 180 );

        rotObject.add( object );
        if( isPage ) {
            objects.add( rotObject );
        }
        else {
            lastRotObject.add( rotObject );
        }
        return rotObject;
    }

    //set all X3UI-page to no display
    var X3UIpages = document.getElementsByTagName( 'x3UI-page' );
    for( var i = 0; i < X3UIpages.length; i++ ) {
        X3UIpages[i].style.display = 'none';
    }

    return objects;
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