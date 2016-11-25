var sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, stars = [];

var canvas = document.getElementById("main");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//renderer
renderer = new THREE.WebGLRenderer({
	canvas
});
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.setClearColor(0x000000, 0.9);

//scene
scene = new THREE.Scene();

//camera
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(-200, 50, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

init();
function init(){
//	sun = initPlanet('sun',0,0,'rgb(255,255,0)',0,16);
	var sunSkinPic = THREE.ImageUtils.loadTexture('img/sun.jpg',{},function(){
		renderer.render(scene,camera)
	})
	
	sun = new THREE.Mesh(new THREE.SphereGeometry(12,16,16),new THREE.MeshLambertMaterial({
		emissive:0xdd4422,
		map:sunSkinPic
	}))
	
	scene.add(sun);
	
	mercury = initPlanet('mercury',0.02,0,'rgb(121,131,203)',20,2);
	stars.push(mercury);
	
	venus = initPlanet('venus',0.03,0,'rgb(190,138,44)',30,4);
	stars.push(venus);
	
	earth = initPlanet('earth',0.04,0,'rgb(46,69,119)',40,5);
	stars.push(earth);
	
	mars = initPlanet('mars',0.05,0,'rgb(210,81,16)',50,4);
	stars.push(mars);
	
	jupiter = initPlanet('jupiter',0.08,0,'rgb(254,208,101)',70,9);
	stars.push(jupiter);
	
	saturn = initPlanet('saturn',0.01,0,'rgb(210,140,39)',100,7);
	stars.push(saturn);
	
	uranus = initPlanet('uranus',0.06,0,'rgb(49,168,218)',120,4);
	stars.push(uranus);
	
	neptune = initPlanet('neptune',0.07,0,'rgb(84,125,204)',150,3);
	stars.push(neptune);
	
}

/**
 * 初始化行星
 * @param name  行星名字
 * @param color  颜色
 * @param distance  距离原点（太阳中心）的距离
 * @param volume  体积
 * @returns {{name: *, distance: *, volume: *, Mesh: THREE.Mesh}}
 */
function initPlanet(name, speed,angle,color, distance, volume) {
	var mesh = new THREE.Mesh(new THREE.SphereGeometry(volume, 16, 16),
		new THREE.MeshLambertMaterial({
			color: color,
			emissive: color
		})
	);
	mesh.position.z = -distance;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	mesh.name = name;
	var star = {
		name,
		speed,
		angle,
		distance,
		volume,
		Mesh: mesh,
		
	}
	star.moveEachStar = function(){
		this.angle += this.speed;
		if( this.angle > Math.PI*2){
			this.angle -= Math.PI*2;
		}
		this.Mesh.position.set(this.distance*Math.sin(this.angle),0,this.distance*Math.cos(this.angle));
	}
	scene.add(mesh);
	var track = new THREE.Mesh(new THREE.RingGeometry(distance-0.2,distance+0.2,64,1),new THREE.MeshBasicMaterial({color:0x888888,side:THREE.DoubleSide}));
	track.rotation.x = - Math.PI/2;
	scene.add(track);
	return star;
}
var ambient = new THREE.AmbientLight(0x999999);
scene.add(ambient);

var sunLight = new THREE.PointLight(0xddddaa,1.5,500);
scene.add(sunLight);

var control;
var clock = new THREE.Clock();
control = new THREE.FirstPersonControls(camera,canvas);
control.movementSpeed = 1;
control.lookSpeed = 0.125;
control.lookVertical = true;

var stat = new Stats();
stat.domElement.style.positon = 'absolute';
stat.domElement.style.rigth = '0px';
stat.domElement.style.top = '0px';
document.body.appendChild(stat.domElement);

renderer.render(scene, camera);
requestAnimationFrame(move);




function move(){
	control.update(clock.getDelta());
	stat.update();
	for(var i = 0;i < stars.length;i++){
		stars[i].moveEachStar();
	}
	renderer.render(scene,camera);
	requestAnimationFrame(move);
}



renderer.render(scene, camera);