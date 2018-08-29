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
