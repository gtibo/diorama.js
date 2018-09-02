class Scene {
	constructor(name) {
		this.name = name;
		this.loop = true;
		this.init_once = false;
	}
	giveWorld(world){
		this.world = world;
		this.ctx = world.ctx;
		// add default camera
		this.camera = new Camera(this,0,0);
	}
	keyEvents(event) {
		
	}
	init() {

	}
	render() {

	}
	addEntity(){

	}
}