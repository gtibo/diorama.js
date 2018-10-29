class Scene {
	constructor(name) {
		this.name = name;
		this.loop = true;
		this.init_once = false;
	}
	giveWorld(world){
		this.world = world;
		this.ctx = world.ctx;
		this.camera = new Camera(this,0,0);
	}
	keyDown(event) {

	}
	keyUp(event){

	}
	init() {

	}
	render() {

	}
}
