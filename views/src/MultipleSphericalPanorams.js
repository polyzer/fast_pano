var THREEx = THREEx || {}

THREEx.MultipleSphericalPanorams = function(json_params){
	
	this.update = this.update.bind(this);
			/// 
	this.deviceMotionInterval = 0;
	this.dt = 0.015;
	this.phi = Math.PI/2;
	this.theta = Math.PI/2;
	this.SphereRadius = 1;

	this.Scene = new THREE.Scene();

	// массив текстур, с которыми будут созданы сферы
	this.texturesURLArray = [
		"./images/1.jpg",
		"./images/2.jpg",
		"./images/3.jpg",
		"./images/4.jpg"	
	];

	if(json_params){
		if(json_params.textures)
		{
			this.texturesURLArray = json_params.textures;
		}
		if(json_params.radius)
		{
			this.SphereRadius = json_params.radius;
		}
	}
	// массив сфер
	this.SpheresArray = [];
	//указатель на текущий элемент массива сфер
	this.CurrentSphereObject = null;
	for(var i=0; i<this.texturesURLArray.length; i++)
	{
		var texture360 = new THREE.TextureLoader().load(this.texturesURLArray[i])
		texture360.minFilter = THREE.NearestFilter;
		texture360.format = THREE.RGBFormat;
		texture360.flipY = false;		

		var geometry = new THREE.SphereGeometry( this.SphereRadius, 100, 100).rotateZ(Math.PI);
		var material = new THREE.MeshBasicMaterial( {
			map: texture360,
			// opacity: 0.9,
			side: THREE.DoubleSide,
		});
		var Mesh = new THREE.Mesh(geometry, material);
		Mesh.position.set(0,0,0);
		this.SpheresArray.push({	
			Mesh: Mesh,
			Next: null
		});

		if(this.texturesURLArray.length === 1) {
			this.SpheresArray[i].Next = this.SpheresArray[0];
		}else if(i === this.texturesURLArray.length-1)
		{
			this.SpheresArray[i].Next = this.SpheresArray[0];
			this.SpheresArray[i-1].Next = this.SpheresArray[i];
		} else if (i === 0) {

		} else {
			this.SpheresArray[i-1].Next = this.SpheresArray[i];
		}
	};
	this.CurrentSphereObject = this.SpheresArray[0];
	this.Scene.add(this.CurrentSphereObject.Mesh);


	this.target = new THREE.Vector3();	
	this.SphereRadius *= 5;


	document.body.appendChild(NextSphereButton);
	document.body.appendChild(ChangeControlButton);

	this.Scene = this.Scene;
	this.n = 100;
	this.k = 0;
	this.Camera = new THREE.PerspectiveCamera(45,
    window.innerWidth / window.innerHeight, 0.1, 1000);
	this.Camera.position.set(0,0,0);
	this.Scene.add(this.Camera);
	// accelerometer orientation controller
	this.controls = new THREE.DeviceOrientationControls(this.Camera);
	//mouse/touch controller
	this.hammer = new Hammer(document.body);
	this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
	this.hammer.on("pan", function (event) {

		OrientationParameters.touchRotRadX = THREE.Math.degToRad(event.deltaX/30);
		OrientationParameters.touchRotRadY = THREE.Math.degToRad(event.deltaY/30);
		OrientationParameters.touchDeltaTime = event.deltaTime;

		// this.Camera.rotation.y -= THREE.Math.degToRad(event.deltaX/20);
		// this.Camera.rotation.x -= THREE.Math.degToRad(event.deltaY/20);
	}.bind(this));

	OrientationParameters.x = this.Scene.rotation.x
	OrientationParameters.y = this.Scene.rotation.y
	OrientationParameters.z = this.Scene.rotation.z

	this.px = -this.Scene.position.x / this.n;
	this.py = -this.Scene.position.y / this.n;

	/*if (this.Scene.rotation.x>Math.PI/2)
		this.rx = -(this.Scene.rotation.x-Math.PI/2)/this.n;
	else
		this.rx = (this.Scene.rotation.x+Math.PI/2)/this.n;*/


	this.rx = -(this.Scene.rotation.x-Math.PI/2)/this.n;
	
	//this.ry = -this.Scene.rotation.y/this.n;	
	if (this.Scene.rotation.y > 0)
		this.ry = -this.Scene.rotation.y/this.n;
	else
		this.ry  = this.Scene.rotation.y/this.n;
	
	if (this.Scene.rotation.z > 0)
		this.rz = -this.Scene.rotation.z/this.n;
	else
		this.rz = this.Scene.rotation.z/this.n;


}

THREEx.MultipleSphericalPanorams.prototype.setSphereMeshToNext = function () {
	this.Scene.remove(this.Mesh);

	this.CurrentSphereObject = this.CurrentSphereObject.Next;
	this.Mesh = this.CurrentSphereObject.Mesh;

	this.Scene.add(this.Mesh);

}	

//////////////////////////////////////////////////////////////////////////////
//	                         	update function
//////////////////////////////////////////////////////////////////////////////

THREEx.MultipleSphericalPanorams.prototype.update = function(now, delta) 
{

	delta /= 100;
	if(ControlParameters.Type === CONTROL_PARAMETERS.TYPE.ACCELEROMETER){
		if(ControlParameters.Clicked === true)
		{
			ControlParameters.Clicked = false;
			this.hammer.enable = false;			
		}

		this.controls.update();
	}
	else {
		if(ControlParameters.Clicked === true)
		{
			ControlParameters.Clicked = false;
			this.hammer.enable = true;
		}

		console.log(delta + " " + OrientationParameters.touchRotRadX + " " + OrientationParameters.touchRotRadY);
		this.Camera.rotation.y -= OrientationParameters.touchRotRadX*delta;
		this.Camera.rotation.x -= OrientationParameters.touchRotRadY*delta;	

		if(OrientationParameters.touchRotRadX > 0.7)
		{
			OrientationParameters.touchRotRadX -= OrientationParameters.touchRotRadX/100;			
		} else 
			OrientationParameters.touchRotRadX = 0;

		if(OrientationParameters.touchRotRadY > 0.7)
		{
			OrientationParameters.touchRotRadY -= OrientationParameters.touchRotRadY/100;			
		} else
			OrientationParameters.touchRotRadY = 0;	

	}

	if(OrientationParameters.shakeTimer > 0)
	{
		OrientationParameters.shakeTimer -= OrientationParameters.shakeTimerStep;
	} else {
		OrientationParameters.shakeTimer  = 0;
	}	

};
