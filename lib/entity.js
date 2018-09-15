class Entity {
	constructor(scene, x, y) {
		this.scene = scene;
		this.world = scene.world;
		this.ctx = this.world.ctx;
		this.body = new Body(this, x, y);
	}
	setSprite(sprite_data) {
		this.sprite = new Sprite(this, sprite_data);
	}
	display() {
		if (this.sprite === undefined || this.world.debug === true) {
			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = "#000";
			this.ctx.strokeRect(this.body.position.x-0.5, this.body.position.y-0.5, this.body.size.x, this.body.size.y);	
		} 
		if(this.sprite !== undefined) {
			this.sprite.display(this.body.position.x,this.body.position.y);
		}
	}
}
// class for animated sprites !
class Sprite {
	constructor(entity, sprite_data) {
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
			x: 0,
			y: 0,
		}
		this.setOffset(0.5,0.5);
		this.addAnimation("none",[0]);
	}
	setOffset(x,y){
		this.offset.x = this.entity.body.size.x * x;
		this.offset.y = this.entity.body.size.y * y;
	}
	addAnimation(name, frames) {
		this.animations[name] = frames;
		this.current_animation = name;
	}
	animate(animation_name) {
		this.current_animation = animation_name;
		if (this.tick < 1) {
			this.tick += this.speed;
		} else {
			this.tick = 0;
			if (this.current_frame < this.animations[animation_name].length - 1) {
				this.current_frame += 1;
			} else {
				this.current_frame = 0;
			}
		}
	}
	display(x,y) {
		this.ctx.drawImage(
			this.image, Math.floor(this.animations[this.current_animation][this.current_frame] % this.width) * this.size.x, Math.floor(this.animations[this.current_animation]
				[this.current_frame] / this.width) * this.size.y, this.size.x, this.size.y, x - (this.size.x / 2) + this.offset.x, y - (this.size.y / 2) + this.offset.y, this.size.x, this.size.y);
	}
}
class Body {
	constructor(entity, x, y) {
		this.world = entity.world;
		this.step = this.world.FPS.step;
		this.position = new Vector(x, y);
		this.next_position = new Vector(x, y);
		this.velocity = new Vector(0, 0);
		this.stepped_velocity = new Vector(0, 0);
		this.acceleration = new Vector(0, 0);
		this.drag = 0.98;
		this.size = {
			x: this.world.tile_size,
			y: this.world.tile_size
		};
		this.half = {
			x: this.size.x/2,
			y: this.size.y/2
		};
		this.collision = {
			left: false,
			top: false,
			right: false,
			bottom: false,
		}
	}
	setSize(x, y) {
		this.size.x = x;
		this.size.y = y;
		this.half = {
			x: this.size.x/2,
			y: this.size.y/2
		};

	}
	updateVelocity() {
		this.velocity.add(this.acceleration);
		this.velocity.mult(this.drag);
		this.stepped_velocity = this.velocity.copy();
		this.stepped_velocity.mult(this.step);
		this.next_position = this.position.copy();
		this.next_position.add(this.stepped_velocity);
		// reset acceleration
		this.acceleration.mult(0);
	}
	updatePosition() {
		this.position.add(this.stepped_velocity);
	}
	integration() {
		this.updateVelocity();
		this.updatePosition();
	}
	applyForce(force_vector) {
		this.acceleration.add(force_vector);
	}
	AABB(tile) {
		tile.position.x *= this.world.tile_size;
		tile.position.y *= this.world.tile_size;
		
		// Distance from the center of a box
		let tile_half = (this.world.tile_size / 2);
		let distX = Math.abs((this.position.x + this.half.x) - (tile.position.x + tile_half));
		let distY = Math.abs((this.position.y + this.half.y) - (tile.position.y + tile_half));
		// Gap between each boxes
		let gapX = distX - this.half.x - tile_half;
		let gapY = distY - this.half.y - tile_half;
		//collision on the X or Y axis
		let offset = this.world.tile_size;
		if (gapX < 0 || gapY < 0) {
			// prevent equality if square
			if (gapX === gapY) {
				gapY = -1;
			}
			if (gapX < 0 && gapX > gapY) {
				if (this.position.x > tile.position.x) {
					if (tile.neighbors[1]) return false;
					this.position.x -= gapX;
					this.velocity.x *= -0.2;
					this.collision.left = true;
				} else {
				if (tile.neighbors[0]) return false;
					this.position.x += gapX;
					this.velocity.x *= -0.2;
					this.collision.right = true;
				}
			}
			if (gapY < 0 && gapY > gapX) {
				if (this.position.y > tile.position.y) {
					if (tile.neighbors[3]) return false;
					this.position.y -= gapY;
					this.velocity.y *= -0.2;
					this.collision.top = true;					
				} else {
					if (tile.neighbors[2]) return false;
					this.position.y += gapY;
					this.velocity.y *= -0.2;
					this.collision.bottom = true;
				}
			}
		}
	}
}