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
			this.ctx.strokeRect(this.body.position.x - 0.5, this.body.position.y - 0.5, this.body.size.x, this.body.size.y);
		}
		if (this.sprite !== undefined) {
			this.sprite.display(Math.round(this.body.position.x), Math.round(this.body.position.y));
		}
	}
}
class Sprite {
	constructor(entity, sprite_data) {
		this.entity = entity;
		this.world = this.entity.world;
		this.tile_size = this.world.tile_size;
		this.ctx = this.world.ctx;
		this.image = this.world.assets.image[sprite_data.image].image;
		this.size = sprite_data.size;
		this.current_frame = 0;
		this.animations = {};
		this.current_animation = undefined;
		this.width = this.image.width / this.size.x;
		this.height = this.image.height / this.size.y;
		this.tick = 0;
		this.speed = 0.2;
		this.offset = {
			x: 0,
			y: 0,
		}
		this.setOffset(0.5, 0.5);
		this.addAnimation("none", [0]);
	}
	setOffset(x, y) {
		this.offset.x = x;
		this.offset.y = y;
	}
	addAnimation(name, frames) {
		this.animations[name] = frames;
		this.current_animation = name;
	}
	setState(animation_name) {
		this.current_animation = animation_name;
		this.current_frame = 0;
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
	display(x, y) {
		this.ctx.drawImage(this.image, Math.floor(this.animations[this.current_animation][this.current_frame] % this.width) * this.size.x, Math.floor(this.animations[this.current_animation]
			[this.current_frame] / this.width) * this.size.y, this.size.x, this.size.y, x - (this.size.x / 2) + (this.offset.x * this.entity.body.size.x), y - (this.size.y / 2) + (this.offset.y * this.entity.body.size.y), this.size.x, this.size.y);
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
		this.drag = 0.1;
		this.bounciness = 0.2;
		this.size = {
			x: this.world.tile_size,
			y: this.world.tile_size
		};
		this.half = {
			x: this.size.x / 2,
			y: this.size.y / 2
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
			x: this.size.x / 2,
			y: this.size.y / 2
		};
	}
	setBounciness(value) {
		this.bounciness = value;
	}
	setDrag(value) {
		this.drag = value;
	}
	updateVelocity() {
		let drag = this.velocity.copy();
		drag.mult(-1);
		drag.setMag(this.velocity.mag() * this.drag);
		this.addForce(drag);
		this.velocity.add(this.acceleration);
		this.stepped_velocity = this.velocity.copy();
		this.stepped_velocity.mult(this.step);
		this.next_position = this.position.copy();
		this.next_position.add(this.stepped_velocity);
		this.acceleration.mult(0);
	}
	updatePosition() {
		this.position.add(this.stepped_velocity);
	}
	integration() {
		this.updateVelocity();
		this.updatePosition();
	}
	addForce(force_vector) {
		this.acceleration.add(force_vector);
	}
	getTileCollisionData(layer_id, x, y) {
		let tile_pos = {
			x: Math.floor(x / this.world.tile_size),
			y: Math.floor(y / this.world.tile_size)
		}
		let tile_data = this.world.getTileProperties(this.world.getTile(layer_id, tile_pos.x, tile_pos.y));
		if (tile_data !== undefined && tile_data.collision === true) {
			let neighbors = [{
				x: tile_pos.x - 1,
				y: tile_pos.y
			}, {
				x: tile_pos.x + 1,
				y: tile_pos.y
			}, {
				x: tile_pos.x,
				y: tile_pos.y - 1
			}, {
				x: tile_pos.x,
				y: tile_pos.y + 1
			}].map(tile => {
				let n_data = this.world.getTileProperties(this.world.getTile(layer_id, tile.x, tile.y));
				if (n_data !== undefined && n_data.collision === true) {
					return true;
				} else {
					return false;
				}
			});
			return {
				position: tile_pos,
				neighbors: neighbors
			};
		}
		return false;
	};
	mapCollision(layer) {
		let layer_id = this.world.checkLayerId(layer);
		let tX = this.position.x + this.stepped_velocity.x,
			tY = this.position.y + this.stepped_velocity.y;
		let top_left = this.getTileCollisionData(layer_id, tX, tY);
		let top_right = this.getTileCollisionData(layer_id, tX + this.size.x, tY);
		let bottom_left = this.getTileCollisionData(layer_id, tX, tY + this.size.y);
		let bottom_right = this.getTileCollisionData(layer_id, tX + this.size.x, tY + this.size.y);
		this.collision.left = false;
		this.collision.top = false;
		this.collision.right = false;
		this.collision.bottom = false;
		if (top_left) {
			this.AABB(top_left)
		}
		if (top_right) {
			this.AABB(top_right)
		}
		if (bottom_left) {
			this.AABB(bottom_left)
		}
		if (bottom_right) {
			this.AABB(bottom_right)
		}
	}
	AABB(tile) {
		tile.position.x *= this.world.tile_size;
		tile.position.y *= this.world.tile_size;
		let tile_half = (this.world.tile_size / 2);
		let dist_x = (this.position.x + this.half.x) - (tile.position.x + tile_half),
        dist_y = (this.position.y + this.half.y) - (tile.position.y + tile_half);
    let gap_x = this.half.x + tile_half - Math.abs(dist_x),
        gap_y = this.half.y + tile_half - Math.abs(dist_y);
    if (gap_x > 0 && gap_y > 0) {
      if (gap_x < gap_y) {
        if (dist_x > 0) {
					if (tile.neighbors[1]) return false;
		      this.position.x += gap_x;
		      this.velocity.x *= -this.bounciness;
		      this.collision.left = true;
        } else {
					if (tile.neighbors[0]) return false;
		      this.position.x -= gap_x;
		      this.velocity.x *= -this.bounciness;
		      this.collision.right = true;
        }
      } else {
        if (dist_y > 0) {
					if (tile.neighbors[3]) return false;
		      this.position.y += gap_y;
		      this.velocity.y *= -this.bounciness;
		      this.collision.top = true;
        } else {
					if (tile.neighbors[2]) return false;
		      this.position.y -= gap_y;
		      this.velocity.y *= -this.bounciness;
		      this.collision.bottom = true;
        }
      }
    }
	}
}
