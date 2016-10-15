const co = require('co');

var renderer, stats;
var width, height, controls;
var currentArea = -1;
var spotLight = new Array();
var arrowMaterials = new Array();
var arrow = new Array();
var arrowInterval;
var arrowIntervalCount = 0;
var currentHint;
var arrowHeight, arrowPoint;
var animationInterval;
var animationIntervalCount = 0;
var currentControl = 0;
var cameraPositionX, cameraPositionY, cameraPositionZ, initialPositionX, initialPositionY, initialPositionZ;
var cameraLookatX, cameraLookatY, cameraLookatZ, initialLookatX, initialLookatY, initialLookatZ;

import path from 'path';
const pathPrefix = path.join('file://', path.resolve('app/model'), '/');

function initThree(){
    // TODO
    const canvas = document.getElementById('canvas-frame');
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    //alert(height);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height);
    canvas.appendChild(renderer.domElement);
    stats = new Stats();
    var container = document.createElement( 'div' );
    container.appendChild( stats.dom );
    canvas.appendChild( container );

    //renderer.setClearColor(0xF9F9F9, 1.0);
}

var camera;

function initCamera(){
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    initialLookatX = cameraLookatX = 0;
    initialLookatY = cameraLookatY = 0;
    initialLookatZ = cameraLookatZ = 30;
    initialPositionX = cameraPositionX = 0;
    initialPositionY = cameraPositionY = 28;
    initialPositionZ = cameraPositionZ = -28;

    camera.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);

    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;

    camera.lookAt({x:cameraLookatX, y:cameraLookatY, z:cameraLookatZ});
}

var scene;
function initScene(){
    scene = new THREE.Scene();

}

function initLight(){
    var light = new THREE.DirectionalLight(0xfce685, 10);//设置平行光源
    light.position.set( 0, -10, 0);//设置光源向量
    scene.add(light);// 追加光源到场景

    var ambientLight = new THREE.AmbientLight(0xfce685, 1);//设置颜色
    scene.add(ambientLight);

    createLight(0xfce685,30,18,80,10);
    createLight(0xfce685,-30,18,80,10);
    createLight(0xfce685,15,18,80,10);
    createLight(0xfce685,-15,18,80,10);


    createspotlight(0xffffff,50,100,-10,5,0,20,4);
    createspotlight(0xffffff,-60,80,0,-5,0,20,4);
    createspotlight(0xffffff,-5,100,40,5,0,-10,4);
    createspotlight(0xfce685,60,20,-10,0,40,50,4);
    createspotlight(0xfce685,-70,20,-10,0,40,50,4);

    initSpotLight();

}


function createLight( color ,x,y,z,power) {
    var pointLight = new THREE.PointLight( color, 100,100,3);
    pointLight.power=power;
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 3000;
    // pointLight.shadowCameraVisible = true;
    //pointLight.shadow.bias = 0.01;
    var geometry = new THREE.SphereGeometry( 0.3, 12, 6 );
    var material = new THREE.MeshBasicMaterial( { color: color } );
    var sphere = new THREE.Mesh( geometry, material );
    pointLight.add( sphere );
    scene.add(pointLight);
    pointLight.position.set(x,y,z);
}
function createspotlight(color ,x,y,z ,tx,ty,tz,power){
    var spotLight=new THREE.SpotLight(color,10,150,Math.PI / 8,0.15,1.2);
    spotLight.castShadow = true;
    spotLight.power=power;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.position.set(x,y,z);

    var tmpgeometry = new THREE.BoxGeometry( 0, 0, 0 );
    var tmpmaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var tmpcube = new THREE.Mesh( tmpgeometry, tmpmaterial );
    tmpcube.position.set(tx,ty,tz);
    spotLight.target=tmpcube;

    // var lightHelper = new THREE.SpotLightHelper( spotLight );
    scene.add(tmpcube);
    scene.add(spotLight);
    //scene.add(lightHelper);
    //lightHelpers.push(lightHelper);
}

function changeArea(k){

    var area = k - 1;

    if (area == -1){
        spotLight[currentArea].position.y = -50;
        spotLight[currentArea].target.position.y = -50;
        currentArea = area;
        return;
    }

    if (currentArea > -1){
        spotLight[currentArea].position.y = -50;
        spotLight[currentArea].target.position.y = -50;
    }


    currentArea = area;

    spotLight[currentArea].position.y = 25;
    spotLight[currentArea].target.position.y = 15;
}



var spotLight = new Array();
function initSpotLight(){


    var geometry = new THREE.CylinderGeometry( 0, 0, 0.01, 400 );
    var material = new THREE.MeshLambertMaterial( { color: 0xFFFF66 } );
    //material.transparent = true;
    //material.opacity = 0.4


    var spotLight1 = new THREE.SpotLight(0xFFFF66, 5.0);
    spotLight1.position.set(23,25, 20);
    spotLight1.castShadow = true;
    spotLight1.angle = 0.42;

    var cube1 = new THREE.Mesh( geometry, material );
    cube1.position.set(23,15, 20);
    spotLight1.target = cube1;
    spotLight1.penumbra = 0.01;
    spotLight1.decay = 2;
    spotLight1.distance = 50;
    scene.add(spotLight1);

    scene.add(spotLight1.target);
    spotLight.push(spotLight1);

    var spotLight2 = new THREE.SpotLight(0xFFFF66, 5.0);
    spotLight2.position.set(0,25,28.5);
    spotLight2.castShadow = true;
    spotLight2.angle = 0.55;;

    var cube2 = new THREE.Mesh( geometry, material );
    cube2.position.set(0,15,28.5);
    spotLight2.target = cube2;
    spotLight2.penumbra = 0.05;
    spotLight2.decay = 2;
    spotLight2.distance = 50;
    scene.add(spotLight2);
    scene.add(spotLight2.target);
    spotLight.push(spotLight2);

    var spotLight3 = new THREE.SpotLight(0xFFFF66, 5.0);
    spotLight3.position.set(-23,25,20);
    spotLight3.castShadow = true;
    spotLight3.angle = 0.35;;

    var cube3 = new THREE.Mesh( geometry, material );
    cube3.position.set(-23,15,20);
    spotLight3.target = cube3;
    spotLight3.penumbra = 0.05;
    spotLight3.decay = 2;
    spotLight3.distance = 50;
    scene.add(spotLight3);
    scene.add(spotLight3.target);
    spotLight.push(spotLight3);

    var spotLight4 = new THREE.SpotLight(0xFFFF66, 5.0);
    spotLight4.position.set(0,25,50);
    spotLight4.castShadow = true;
    spotLight4.angle = 0.35;;

    var cube4 = new THREE.Mesh( geometry, material );
    cube4.position.set(0,15,50);
    spotLight4.target = cube4;
    spotLight4.penumbra = 0.05;
    spotLight4.decay = 2;
    spotLight4.distance = 80;
    scene.add(spotLight4);
    scene.add(spotLight4.target);
    spotLight.push(spotLight4);

    //console.log(spotLight);

    var i;
    for(i = 0; i < 4; i++){
        spotLight[i].position.y = -50;
        spotLight[i].target.position.y = -50;
    }
}

var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
};
var onError = function ( xhr ) {
    alert(xhr);

};

const initObject = co.wrap(function*(){
    yield initPeople();
    yield initHuanjing();
    initArrows();
});

function initPeople(){
    return new Promise((resolve, reject) => {
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath(pathPrefix);
        mtlLoader.load('output013.mtl', function(materials){
            materials.preload();
            //alert(materials);
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(pathPrefix);
            objLoader.load('output013.obj',function(object){
                //alert(object);
                object.position.y = 0;
                object.position.z = 0;
                object.position.x = 0;
                scene.add(object);
                renderer.render(scene, camera);
                resolve();
            }, onProgress, onError);
        }, onProgress, onError);
    });
}

function initHuanjing(){
    return new Promise((resolve, reject) => {
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath(pathPrefix);
        mtlLoader.load('zhihui+huanjing.mtl', function(materials){
            materials.preload();
            //alert(materials);
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath(pathPrefix);
            objLoader.load('zhihui+huanjing.obj',function(object){
                //alert(object);
                object.position.y = 0;
                object.position.z = 0;
                object.position.x = 0;
                scene.add(object);
                renderer.render(scene, camera);
                resolve();
            }, onProgress, onError);
        }, onProgress, onError);
    });
}

function initArrows(){
    for (var i = 0; i < 4; i++)
        initArrow(i);

    console.log(arrow);
    console.log(arrowMaterials);
}

function initArrow(i){
    var x, y,z;
    switch(i){
            case 0: {
                x = 26; y = 15; z = 13;
            } break;
            case 1: {
                x = 0; y = 8; z = 20;
            } break;
            case 2: {
                x = -26; y = 15; z = 13;
            } break;
            case 3: {
                x = 0; y = 18; z = 40;
            } break;
    }

    var geoArray = getNewArrow();
    var geometry = geoArray[0];
    var upArrow = geoArray[1];
    var downArrow = geoArray[2];

    var arr = new Array();

    var arrowMaterial2 = new THREE.MeshBasicMaterial( { color: 0x00FF66 } );
    arrowMaterial2.transparent = true;
    arrowMaterial2.opacity = 0;
    arrowMaterials.push(arrowMaterial2);

    var arrow3 = new THREE.Mesh(geometry, arrowMaterial2);
    arrow3.position.set(x ,y, z);
    scene.add(arrow3);
    arr.push(arrow3);

    var arrow4 = new THREE.Mesh(downArrow, arrowMaterial2);
    arrow4.position.set(x,y + (arrowHeight + arrowPoint) / 2, z);
    scene.add(arrow4);
    arr.push(arrow4);

    var arrowMaterial1 = new THREE.MeshBasicMaterial( { color: 0x00FF66 } );
    arrowMaterial1.transparent = true;
    arrowMaterial1.opacity = 0;
    arrowMaterials.push(arrowMaterial1);

    var arrow1 = new THREE.Mesh(geometry, arrowMaterial1);
    arrow1.position.set(x ,y, z);
    scene.add(arrow1);
    arr.push(arrow1);

    var arrow2 = new THREE.Mesh(upArrow, arrowMaterial1);
    arrow2.position.set(x,y - (arrowHeight + arrowPoint) / 2, z);
    scene.add(arrow2);
    arr.push(arrow2);
    arrow.push(arr);
}

function getNewArrow(){
    var result = new Array();
    arrowHeight = 5;
    arrowPoint = 1;
    /*
        Put geometries here
     */
    var geometry = new THREE.CylinderGeometry(0.2, 0.2, 5, 400);
    result.push(geometry);

    var cube1 = new THREE.CylinderGeometry(0.6, 0, 1, 400);
    result.push(cube1);

    var cube2 = new THREE.CylinderGeometry(0, 0.6, 1, 400);
    result.push(cube2);

    return result;
}

function initControls(){
    // var geometry = new THREE.BoxGeometry( 0, 0, 0 );
    // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // var cube = new THREE.Mesh( geometry, material );
    // cube.position.set(0,5,30);
    //
    // scene.add(cube);

    //controls = new THREE.OrbitControls( camera, renderer.domElement );

    //controls.addEventListener( 'change', renderer );
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.target = new THREE.Vector3(0, 5, 30);
    controls.rotateSpeed = 0.2;
}

module.exports = function startThree(){
    initThree();
    initCamera();
    initScene();
    initLight();
    const promise = initObject();

    initControls();
    requestAnimationFrame(animate);
    renderer.clear();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.render(scene, camera);
    document.onkeyup = keyUp;
    return promise;
}

function keyUp(e) {
    var currKey=0,e=e||event;
    currKey=e.keyCode||e.which||e.charCode;
    var keyName = String.fromCharCode(currKey);
    switch(currKey){
        case 48:{
            changeArea(0);
        }break;
        case 49: {
            changeArea(1);
        } break;
        case 50:{
            changeArea(2);
        }break;
        case 51:{
            changeArea(3);
        }break;
        case 52:{
            changeArea(4);
        }break;
        case 65:{
            controlHint(1, 1);
        }break;
        case 83:{
            controlHint(2, 1);
        }break;
        case 68:{
            controlHint(3, 1);
        }break;
        case 70:{
            controlHint(4, 1);
        }break;
        case 90:{
            controlHint(1, 2);
        }break;
        case 88:{
            controlHint(2, 2);
        }break;
        case 67:{
            controlHint(3, 2);
        }break;
        case 86:{
            controlHint(4, 2);
        }break;
        case 80:{
            animateCamera(1);
        }
    }
    //alert("按键码: " + currKey + " 字符: " + keyName);
}

function animate () {
    requestAnimationFrame(animate);
    controls.update();
    stats.update();
    render();

}

function animateCamera(k){
    if (animationInterval != null) return;

    switch(k){
        case 1:{

            animationInterval = setInterval(farCloseDownFarBack, 30);
        }break;
    }
}

function render(){
    renderer.render(scene, camera);
}

function controlHint(area, control){
    if (arrowInterval != null) return;


    currentControl = control;
    currentHint = area - 1;
    arrowInterval = setInterval(updateControl, 15);
}

function updateControl(){
    arrowIntervalCount = arrowIntervalCount + 1;
    //console.log(arrowIntervalCount);
    if (arrowIntervalCount > 150){

        clearInterval(arrowInterval);
        arrowInterval = null;
        arrowIntervalCount = 0;
        arrowMaterials[currentHint * 2 + currentControl - 1].opacity = 0;
        return;
    }
    var op = arrowMaterials[currentHint * 2 + currentControl - 1].opacity;
    op = op - 0.02;
    if (op < 0) op = 1;
    arrowMaterials[currentHint * 2 + currentControl - 1].opacity = op;

    //arrow[currentHint].material = arrowMaterial;
    render();

}

var scrollLengthX, scrollLengthY, scrollLengthZ;
var moveLengthX, moveLengthY, moveLengthZ;
var targetPoint;
function farCloseDownFarBack(){
    animationIntervalCount++;

    if (animationIntervalCount == 1){
        scrollLengthZ = (cameraLookatZ - cameraPositionZ) / 3 / 50;
        scrollLengthY = (cameraLookatY - cameraPositionY)  / 3/ 50;
        scrollLengthX = (cameraLookatX - cameraPositionX)  / 3 / 50;;
    }
    if (animationIntervalCount == 51){
        scrollLengthZ = -(cameraLookatZ - cameraPositionZ) / 3 / 50;
        scrollLengthY = -(cameraLookatY - cameraPositionY) / 3 / 50;
        scrollLengthX = -(cameraLookatX - cameraPositionX) / 3 / 50;
    }
    if (animationIntervalCount == 151){
        scrollLengthZ = 0;
        scrollLengthY = 6 / 30;
        scrollLengthX = 0;
    }

    if (animationIntervalCount == 181){
        scrollLengthX = 0;
        scrollLengthY = 0;
        scrollLengthZ = -10 / 30;
    }

    if (animationIntervalCount == 211){
        scrollLengthZ = 10 / 30;
        scrollLengthY = -2 / 30;
        scrollLengthX = 0;
    }
    if (animationIntervalCount == 271){
        scrollLengthX = (cameraPositionX - initialPositionX) / 40;
        scrollLengthY = (cameraPositionY - initialPositionY) / 40;
        scrollLengthZ = (cameraPositionZ - initialPositionZ) / 40;
    }



    if (animationIntervalCount > 300){
        clearInterval(animationInterval);
        animationInterval = null;
        animationIntervalCount = 0;
        controls.autoRotate = false;
        return;
    }
        cameraPositionX -= scrollLengthX ;
        cameraPositionY -= scrollLengthY ;
        cameraPositionZ -= scrollLengthZ ;
        camera.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);



    render();



}
