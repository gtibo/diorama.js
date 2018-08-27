// ----------
// Utility
// ----------
Util = {};
Util.timeStamp = function() {
	return window.performance.now();
};
Util.random = function(min, max){
	return min + Math.random() * (max - min);
};
Util.array2D = function(tableau, largeur){
	var result = [];
	for (var i = 0; i < tableau.length; i += largeur) result.push(tableau.slice(i, i + largeur));
	return result;
};
Util.map = function(a,b,c,d,e){
	return(a-b)/(c-b)*(e-d)+d;
};
Util.lerp = function(value1, value2, amount) {
	return value1 + (value2 - value1) * amount;
};
Util.linearTween = function(currentTime, start, degreeOfChange, duration) {
	return degreeOfChange * currentTime / duration + start;
};
Util.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
Util.easeInOutExpo = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
	t--;
	return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
};

// ----------
// Scene
// ----------
class Scene {
	constructor(name) {
		this.name = name;
		this.loop = true;
		this.init_once = false;
	}
	giveWorld(world){
		this.world = world;
		this.ctx = world.ctx;
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
class Entity{
  constructor(scene,x,y){
		this.scene = scene;
		this.world = scene.world;
		this.ctx = this.world.ctx;
		this.body = new Body(this,x,y);
  }
	setSprite(sprite_data){
		this.sprite = new Sprite(this,sprite_data);
	}
	display(){
		if(this.sprite === undefined){
			this.ctx.strokeStyle = "#000";
			this.ctx.strokeRect(this.body.position.x,this.body.position.y,this.body.size.x,this.body.size.y);
		}else{
			this.sprite.display();
		}
  }
	integration(){
			this.body.integration();
  }
}

// class for animated sprites !
class Sprite{
	constructor(entity,sprite_data){
		this.entity = entity;
		this.world = this.entity.world;
		this.tile_size = this.world.tile_size;
		this.ctx = this.world.ctx;
		// image data
		this.image = this.world.assets.image[sprite_data.image].image;
		// sprite
		this.size = sprite_data.size;
		this.current_frame = 0;
		this.animations = {};
		this.current_animation = undefined;
		this.width = this.image.width / this.size.x;
		this.height = this.image.height / this.size.y;
		// timer
		this.tick = 0;
		this.speed = 0.2;
		// offset
		this.offset = {
			x:0,
			y:0,
		}
	}
	addAnimation(name,frames){
		this.animations[name] = frames;
		this.current_animation = name;
	}
	animate(animation_name){
		this.current_animation = animation_name;
		if(this.tick < 1){
			this.tick += this.speed;
		}else{
			this.tick = 0;
			if(this.current_frame < this.animations[animation_name].length -1){
				this.current_frame += 1;
			}else {
				this.current_frame = 0;
			}

		}
	}
	display(){
		this.ctx.drawImage(this.image,
			Math.floor(this.animations[this.current_animation][this.current_frame] % this.width) * this.size.x,
			Math.floor(this.animations[this.current_animation][this.current_frame] / this.width) * this.size.y,
			this.size.x,
			this.size.y,
			this.entity.body.position.x+(this.tile_size/2-this.size.x/2)+this.offset.x,
			this.entity.body.position.y+(this.tile_size/2-this.size.x/2)+this.offset.y,
			this.size.x,
			this.size.y
		);
	}
}

class Body{
  constructor(entity,x,y){
		this.world = entity.world;
		this.step = this.world.FPS.step;
		this.position = new Vector(x,y);
		this.next_position = new Vector(x,y);
		this.velocity = new Vector(0,0);
		this.stepped_velocity = new Vector(0,0);
    this.acceleration = new Vector(0,0);
    this.drag = 0.98;
    this.size = {
      x:16,
      y:16
    };
  }
	setSize(x,y){
		this.size.x = x;
		this.size.y = y;
	}
	updateVelocity(){
		this.velocity.add(this.acceleration);
		this.velocity.mult(this.drag);
		this.stepped_velocity = this.velocity.copy();
		this.stepped_velocity.mult(this.step);
		this.next_position = this.position.copy();
		this.next_position.add(this.stepped_velocity);
		// reset acceleration
		this.acceleration.mult(0);
	}
	updatePosition(){
		this.position.add(this.stepped_velocity);
	}
  integration(){
		this.updateVelocity();
		this.updatePosition();
  }
  applyForce(force_vector){
    this.acceleration.add(force_vector);
  }

}

class Vector{
	constructor(x,y){
		this.x = x || 0;
		this.y = y || 0;
	}
	set(x,y){
		this.x = x;
		this.y = y;
	}
	add(vector){
		this.x += vector.x;
		this.y += vector.y;
	}
	sub(vector){
		this.x -= vector.x;
		this.y -= vector.y;
	}
	mult(scalar){
		this.x *= scalar;
		this.y *= scalar;
	}
	div(scalar){
		this.x /= scalar;
		this.y /= scalar;
	}
	limit(limit_value){
		if(this.mag() > limit_value) this.setMag(limit_value);
	}
	mag(){
		return Math.hypot(this.x,this.y);
	}
	setMag(new_mag){
		if(this.mag() > 0){
			this.normalize();
		}else{
			this.x = 1;
			this.y = 0;
		}
		this.mult(new_mag);
	}
	dist(vector){
		return new Vector(this.x - vector.x,this.y - vector.y).mag();
	}
	normalize(){
		let mag = this.mag();
		if(mag > 0){
			this.x /= mag;
			this.y /= mag;
		}
	}
	heading(){
		return Math.atan2(this.x,this.y);
	}
	setHeading(angle){
		let mag = this.mag();
		this.x = Math.cos(angle) * mag;
		this.y = Math.sin(angle) * mag;
	}
	copy(){
		return new Vector(this.x,this.y);
	}
}

class Box{
	constructor(world,box_data){
		this.world = world;
		this.ctx = world.ctx;
		this.c_ctx = world.c_ctx;
		this.box_data = box_data;
		this.resolution = box_data.resolution;
		this.image = world.assets.image[box_data.image].image;
	}
	display(x,y,width,height){
		// background
		this.ctx.fillRect(x+1,y+1,width-2,height-2);
		// corners
		this.ctx.lineWidth = 2;
		let coners = [0,2,6,8];
		for (let i = 0; i < 4; i++) {
			let pos_x = x + Math.floor(i%2) * (width - this.resolution),
					pos_y = y + Math.floor(i/2) * (height - this.resolution);
			let clip_x = Math.floor(i%2) * (this.resolution*2),
					clip_y = Math.floor(i/2) * (this.resolution*2);
			this.ctx.drawImage(this.image,
			clip_x,clip_y,
			this.resolution,this.resolution,
			pos_x,pos_y,
			this.resolution,this.resolution);
		}
		let offset = this.resolution*3;
		// top
		this.ctx.drawImage(this.image,
		8,0,
		this.resolution,this.resolution,
		x+8,y,
		this.resolution+width-offset,this.resolution);
		// bottom
		this.ctx.drawImage(this.image,
		8,16,
		this.resolution,this.resolution,
		x+8,y+height-this.resolution,
		this.resolution+width-offset,this.resolution);
		// left
		this.ctx.drawImage(this.image,
		0,8,
		this.resolution,this.resolution,
		x,y+8,
		this.resolution,this.resolution+height-offset);
		// right
		this.ctx.drawImage(this.image,
		16,8,
		this.resolution,this.resolution,
		x+width-this.resolution,y+this.resolution,
		this.resolution,this.resolution+height-offset);

	}
}
