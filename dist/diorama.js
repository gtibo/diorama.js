function Manifest() {
	this.start_scene = undefined;
	this.size = {
		x: 128,
		y: 128
	};
	this.background = "white";
	this.scale = 1;
	this.frame_rate = 60;
	this.assets = [];
	this.scenes = [];
	this.maps = [];
	this.fonts = [];
	this.boxes = [];
	this.dom_element = document.body;
	this.set = {
		container: (dom_element_id) => {
			this.dom_element = document.getElementById(dom_element_id);
		},
		startScreen: (value) => {
			this.start_scene = value;
		},
		background: (value) => {
			this.background = value;
		},
		scale: (value) => {
			this.scale = value;
		},
		size: (width, height) => {
			this.size = {
				x: width,
				y: height
			};
		},
		frameRate: (value) => {
			this.frame_rate = value;
		},
	};
	this.add = {
		image: (name, path) => {
			this.assets.push({
				type: "img",
				name: name,
				path: path
			});
		},
		audio: (name, path) => {
			this.assets.push({
				type: "audio",
				name: name,
				path: path
			});
		},
		map: (name,path) =>{
			this.assets.push({
				type:"map",
				name:name,
				path:path,
			});
		},
		scene:(scene)=>{			
			this.scenes.push(scene);
		},
	};
	this.create = {
		font: (name, path, width, height) => {
			this.fonts.push({
				name: name,
				image: path,
				size: {
					x: width,
					y: height
				}
			});
		},
		box: (name, path, resolution) => {
			this.boxes.push({
				name: name,
				image: path,
				resolution: resolution
			});
		},
	};
}

function createManifest() {
	return new Manifest();
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
	display(x,y,width,height,bg){
		width = Math.max(this.resolution*2,width);
		height = Math.max(this.resolution*2,height);
		// background		
		this.ctx.fillStyle = bg || this.world.background_color;
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
// ----------
// Utility
// ----------
let Util = {};
Util.timeStamp = function() {
	return window.performance.now();
};
Util.between = function(value, min, max) {
	return (value - min) * (value - max) < 0;
  };
Util.random = function(min, max){
	return min + Math.random() * (max - min);
};
Util.randomInt = function(min,max){
	return Math.round(this.random(min,max));
};
Util.map = function(a,b,c,d,e){
	return(a-b)/(c-b)*(e-d)+d;
};
Util.lerp = function(value1, value2, amount) {
	return value1 + (value2 - value1) * amount;
};
Util.clamp = function(value,min,max){
	return Math.max(min, Math.min(max, value));
};
Util.array2D = function(tableau, array_width){
	var result = [];
	for (var i = 0; i < tableau.length; i += array_width) result.push(tableau.slice(i, i + array_width));
	return result;
};
let Tween = {};
Tween.linear = function(currentTime, start, degreeOfChange, duration) {
	return degreeOfChange * currentTime / duration + start;
};
Tween.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
Tween.easeInOutExpo = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
	t--;
	return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
};
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
	keyDown(event) {
		
	}
	keyUp(event){

	}
	init() {

	}
	render() {

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
	dot(vector){
		return vector.x * this.x + vector.y * this.y;
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
	dist(vector){
		return new Vector(this.x - vector.x,this.y - vector.y).mag();
	}
	angleBetween(vector){
		return Math.atan2(vector.y - this.y, vector.x - this.x);
	}	
	copy(){
		return new Vector(this.x,this.y);
	}
	fromAngle(angle){
		let x = Math.cos(angle),
			y = Math.sin(angle);
		return new Vector(x,y);
	}
}
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
			this.sprite.display(this.body.position.x, this.body.position.y);
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
	}
	animate(animation_name) {
		this.setState(animation_name);
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
		// Distance from the center of a box
		let tile_half = (this.world.tile_size / 2);
		let distX = Math.abs((this.position.x + this.half.x) - (tile.position.x + tile_half));
		let distY = Math.abs((this.position.y + this.half.y) - (tile.position.y + tile_half));
		// Gap between each boxes
		let gapX = distX - this.half.x - tile_half;
		let gapY = distY - this.half.y - tile_half;
		//collision on the X or Y axis
		if (gapX < 0 || gapY < 0) {
			// prevent equality if square
			if (gapX === gapY) {
				gapY = -1;
			}
			if (gapX < 0 && gapX > gapY) {
				if (this.position.x > tile.position.x) {
					if (tile.neighbors[1]) return false;
					this.position.x -= gapX;
					this.velocity.x *= -this.bounciness;
					this.collision.left = true;
				} else {
					if (tile.neighbors[0]) return false;
					this.position.x += gapX;
					this.velocity.x *= -this.bounciness;
					this.collision.right = true;
				}
			}
			if (gapY < 0 && gapY > gapX) {
				if (this.position.y > tile.position.y) {
					if (tile.neighbors[3]) return false;
					this.position.y -= gapY;
					this.velocity.y *= -this.bounciness;
					this.collision.top = true;
				} else {
					if (tile.neighbors[2]) return false;
					this.position.y += gapY;
					this.velocity.y *= -this.bounciness;
					this.collision.bottom = true;
				}
			}
		}
	}
}
class Camera extends Entity{
	constructor(scene,x,y){
		super(scene,x,y);
		this.target = {
			position : new Vector(this.world.W/2,this.world.H/2),
			size : {x:0,y:0},
		};
		this.boundless = true;
		this.bounds = {
			x:this.world.W,
			y:this.world.H
		}
		this.angle = 0;
	}
	setBounds(x,y){
		this.boundless = false;
		this.bounds.x = x - this.world.W;
		this.bounds.y = y - this.world.H;
	}
	setTarget(target){
		this.target = target;
		this.target = {
			position : target.body.position,
			size : (target.sprite == undefined) ? target.body.size : target.sprite.size,
		};
	}
	checkBounds(){
		if(this.boundless) return false;
		if(this.body.position.x < 0){this.body.position.x = 0;}
		if(this.body.position.y < 0){this.body.position.y = 0;}
		if(this.body.position.x > this.bounds.x ){this.body.position.x = this.bounds.x}
		if(this.body.position.y > this.bounds.y ){this.body.position.y = this.bounds.y}
	}
	update(){
		this.body.position.x = this.target.position.x + this.target.size.x/2 - this.world.W/2;
		this.body.position.y = this.target.position.y + this.target.size.x/2 - this.world.H/2;
		// bound
		this.checkBounds();
		
		this.world.ctx.translate(this.world.W/2,this.world.H/2);
		this.world.ctx.rotate(this.angle);
		this.world.ctx.translate(-this.body.position.x- this.world.W/2 ,-this.body.position.y - this.world.H/2);

	}
}
class Diorama {
	constructor(manifest) {
		if(!manifest){
			throw "A manifest is needed";
		}
		this.parameters = manifest;
		this.debug = false;
		// canvas
		this.background_color = this.parameters.background || "#000";
		this.initCanvas(this.parameters);
		// Assets
		this.counter = 0;
		this.toLoad = this.parameters.assets.length;
		this.assets = {
			image: {},
			audio: {},
		};
		// keyboard event
		this.limit_input = false;
		this.keys = {};
		// Scenes
		this.scenes = {};
		this.start_screen = this.parameters.start_screen || undefined;
		this.current_scene = "";
		// Bitmap font Data
		// By default the current font is the first font you create
		this.currentFont = undefined;
		this.alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ?!:',.()<>[]";
		this.fonts = {};
		// Maps
		this.tile_size = 16 || this.parameters.tile_size;
		this.maps = {};
		// Box system
		this.boxes = {};
		// Game loop Data
		this.FPS = {
			now: 0,
			delta: 0,
			last: Util.timeStamp(),
			step: 1 / (this.parameters.frame_rate || 60),
		};
		this.requestChange = {
			value: false,
			action: ""
		};
		this.main_loop = undefined;
		// Fullscreen and muted bool
		this.full = false;
		this.audio_muted = false;
		this.loadAssets(this.parameters.assets);
	}
	// ---
	// Setup & Loading
	// ---
	initCanvas() {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext('2d');
		this.W = this.canvas.width = this.parameters.size.x || 256;
		this.H = this.canvas.height = this.parameters.size.y || 256;
		this.scale = this.parameters.scale || 1;
		this.full = false;
		this.ctx.imageSmoothingEnabled = false;
		this.canvas.classList.add("crisp");
		this.parameters.dom_element.appendChild(this.canvas);
		this.applyScale();
	}
	loader() {
		// increment loader
		this.clear("#222");
		this.counter += 1;
		let padding = 20;
		let width = this.W - padding * 2,
			x = padding,
			y = this.H - padding * 2;
		this.ctx.fillStyle = "#111";
		this.ctx.fillRect(x, y, width, 20);
		this.ctx.fillStyle = "#333";
		this.ctx.fillRect(x, y, (this.counter * width / this.toLoad), 20);
		this.ctx.strokeStyle = "#000";
		this.ctx.lineWidth = 4;
		this.ctx.strokeRect(x, y, width, 20);
		if (this.counter === this.toLoad) {
			this.launch();
		}
	}
	loadAssets(assets) {
		if (assets.length === 0) this.launch();
		assets.map(obj => this.checkAssets(obj));
	}
	checkAssets(obj) {
		let subject = obj;
		switch (obj.type) {
			case "img":
				let img = new Image();
				img.onload = () => {
					this.loader();
				};
				img.onerror = () => {
					console.log("can't load Image: " + obj.name);
				};
				img.src = obj.path;
				subject.image = img;
				this.assets.image[obj.name] = subject;
				break;
			case "audio":
				let audio = new Audio(obj.path);
				audio.addEventListener('canplaythrough', this.loader());
				audio.onerror = () => {
					console.log("can't load audio: " + obj.name);
				};
				subject.audio = audio;
				this.assets.audio[obj.name] = subject;
				break;
			case "map":
				fetch(obj.path).then(
					(response) => {
						if (response.status !== 200) {
							console.log('Looks like there was a problem. Status Code: ' + response.status);
							return;
						}
						response.json().then((data) => {
							this.maps[obj.name] = data;
							this.loader();
						});
					}).catch(function(err) {
					console.log("can't load map: " + obj.name);
				});
				break;
			case undefined:
				console.log(obj.name, " doesn't have any type");
				break;
			default:
				console.log(obj.name, " has a none known type");
		}
	}
	launch() {
		this.parameters.scenes.forEach(scene=>{
			this.addScene(scene);
		});
		this.eventSetup();
		this.initBoxes(this.parameters.boxes);
		this.initFonts(this.parameters.fonts);
		this.startScene(this.start_screen);
	}
	initBoxes(boxes_data) {
		if (boxes_data === undefined) return false;
		boxes_data.map(box => {
			this.boxes[box.name] = new Box(this, box);
		});
	}
	drawBox(box_name, x, y, width, height, background_color) {
		this.boxes[box_name].display(x, y, width, height, background_color);
	}
	// ---
	// Font manager
	// ---
	setFont(font_name) {
		this.currentFont = font_name;
	}
	initFonts(fonts_data) {
		if (fonts_data === undefined && fonts_data.length > 0) return false;
		fonts_data.map(font => {
			if (this.assets.image[font.image] === undefined) {
				console.log("can't load font, " + font.image + " doesn't exist");
				return false
			};
			font.image = this.assets.image[font.image].image;
			this.fonts[font.name] = font;
		});
		// set current font to the first font !
		this.currentFont = Object.keys(this.fonts)[0];
	}
	write(text, x, y, justify, colorID) {
		if (this.currentFont === undefined) {
			console.log("No bitmap_font");
			return false;
		}
		if (typeof(justify) === "string") {
			switch (justify) {
				case "center":
					x -= (text.length * this.fonts[this.currentFont].size.x) / 2;
					break;
				case "right":
					x -= (text.length * this.fonts[this.currentFont].size.x);
					break;
				default:
			}
			this.writeLine(text, x, y, colorID || 0);
		} else {
			this.writeParagraph(text, x, y, justify, colorID || 0)
		}
	}
	writeParagraph(text, x, y, justify, colorID) {
		let y_offset = 0,
			line_height = this.fonts[this.currentFont].size.y + 5,
			size_x = this.fonts[this.currentFont].size.x,
			words = text.split(' '),
			line = "";
		for (let i = 0; i < words.length; i++) {
			line += words[i] + " ";
			let nextword_width = 0,
				next_word = words[i + 1],
				line_length = line.length * size_x;
			(next_word) ? nextword_width = next_word.length * size_x: 0;
			if (line_length + nextword_width > justify) {
				this.writeLine(line, x, y + y_offset, colorID);
				y_offset += line_height;
				line = "";
			} else {
				this.writeLine(line, x, y + y_offset, colorID);
			}
		}
	}
	writeLine(text, x, y, colorID) {
		// write line
		let size_x = this.fonts[this.currentFont].size.x,
			size_y = this.fonts[this.currentFont].size.y,
			font_img = this.fonts[this.currentFont].image;
		for (let i = 0; i < text.length; i++) {
			let index = this.alphabet.indexOf(text.charAt(i)),
				clipX = size_x * index,
				posX = x + (i * size_x);
			this.ctx.drawImage(font_img, clipX, (colorID * size_y), size_x, size_y, posX, y, size_x, size_y);
		}
	}
	// -----------------
	// Events
	// -----------------
	eventSetup() {
		document.addEventListener("keydown", event => this.keyDown(event), false);
		document.addEventListener("keyup", event => this.keyUp(event), false);
	}
	keyDown(event) {
		if (this.limit_input) event.preventDefault();
		this.keys[event.key.toLowerCase()] = true;
		this.current_scene.keyDown(event);
	}
	keyUp(event) {
		this.keys[event.key.toLowerCase()] = false;
		this.current_scene.keyDown(event);
	}
	// ---
	// Scene Manager
	// ---
	startScene(scene_name) {
		if (Object.keys(this.scenes).length == 0) {
			console.warn("Sorry, Your project doesn't have any scenes");
			return false;
		}
		if (scene_name == undefined) scene_name = Object.keys(this.scenes)[0];
		// check if the scene exist
		if (this.scenes[scene_name] === undefined) {
			console.warn("Sorry, the scene named '" + scene_name + "' doesn't exist");
			return false;
		}
		// request the change of scene if this.main_loop is active
		if (this.main_loop !== undefined) {
			this.requestChange.value = true;
			this.requestChange.action = scene_name;
			return false;
		}
		this.requestChange.value = false;
		this.requestChange.action = "";
		this.FPS.last = Util.timeStamp();
		this.current_scene = this.scenes[scene_name];
		this.initScene();
		// does this scenes needs a gameloop ?
		if (this.current_scene.loop === true) {
			this.gameLoop();
		} else {
			this.mainRender();
		}
	}
	initScene() {
		if (this.current_scene.init_once) return false;
		this.current_scene.init();
	}
	addScene(scene) {
		// links this world to this scene
		scene.giveWorld(this);
		this.scenes[scene.name] = scene;
	}
	// ---
	// Main Loop
	// ---
	mainRender() {
		this.clear();
		this.ctx.save();
		this.current_scene.camera.update();
		this.current_scene.render();
		this.ctx.restore();
	}
	loopCheck() {
		if (this.requestChange.value === false) {
			this.main_loop = requestAnimationFrame(() => this.gameLoop());
		} else {
			cancelAnimationFrame(this.main_loop);
			this.main_loop = undefined;
			this.startScene(this.requestChange.action);
		}
	}
	gameLoop() {
		this.FPS.now = Util.timeStamp();
		this.FPS.delta += Math.min(1, (this.FPS.now - this.FPS.last) / 1000)
		while (this.FPS.delta > this.FPS.step) {
			this.FPS.delta -= this.FPS.step;
			this.mainRender();
		}
		this.FPS.last = this.FPS.now;
		this.loopCheck();
	}
	// Basic functions
	soundLevel(volume) {
		for (let [k, v] of Object.entries(this.assets.audio)) {
			v.audio.volume = volume;
		}
	}
	mute() {
		this.audio_muted = !this.audio_muted;
		for (let [k, v] of Object.entries(this.assets.audio)) {
			v.audio.muted = this.audio_muted;
		}
	}
	clear(custom_color) {
		this.ctx.fillStyle = custom_color || this.background_color;
		this.ctx.fillRect(0, 0, this.W, this.H);
	}
	applyScale() {
		this.canvas.style.maxWidth = this.W * this.scale + "px";
		this.canvas.style.maxHeight = this.H * this.scale + "px";
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
	}
	fullScreen() {
		this.full = !this.full;
		if (!this.full) {
			this.applyScale();
		} else {
			// reset
			this.canvas.style.maxWidth = "";
			this.canvas.style.maxHeight = "";
			this.canvas.style.width = "";
			this.canvas.style.height = "";
			// set full screen
			this.canvas.style.width = "100%";
			this.canvas.style.height = "100%";
		}
	}
	// ---
	// Tile map
	// ---
	checkLayerId(layer){
		let layer_id = layer;
		if (typeof layer == "string") {
			this.terrain.layers.forEach((l,index) => {
				if(l.name === layer){					
					return layer_id = index;
				}
			});
		}
		return layer_id;
	}
	getTile(searched_layer, x, y) {
		let layer = this.terrain.layers[this.checkLayerId(searched_layer)];
		if (x < 0 || x > layer.width - 1) return false;
		if (y < 0 || y > layer.height - 1) return false;
		return layer.data[y][x];
	}
	getTileProperties(tile_id){
		return this.terrain.tileset.tileproperties[tile_id];
	}
	findTile(searched_layer, tile_id) {
		let layer = this.terrain.layers[this.checkLayerId(searched_layer)];
		let result = [];
		for (let y = 0; y < layer.width; y++) {
			for (let x = 0; x < layer.height; x++) {
				let id = layer.data[y][x];
				if (id === tile_id) {
					result.push({
						x: x,
						y: y
					});
				}
			}
		}
		return result;
	}
	initMap(map_name) {
		this.terrain = JSON.parse(JSON.stringify(this.maps[map_name]));
		this.terrain.layers.forEach(layer => {
			let tab = layer.data.map(x => {
				return x - 1;
			});
			layer.data = Util.array2D(tab, layer.width);
		});
		this.terrain.tileset = this.terrain.tilesets[0];
		this.terrain.tileset.image = this.assets.image[this.terrain.tilesets[0].name].image;
		this.terrain.layers.forEach(layer => {
			this.terrainCache(layer);
		});
	}
	terrainCache(layer) {
		layer.cache = {};
		let c = layer.cache.c = document.createElement("canvas");
		let ctx = layer.cache.ctx = layer.cache.c.getContext('2d');
		c.width = layer.width * this.tile_size;
		c.height = layer.height * this.tile_size;
		// Draw on cache
		this.drawLayer(ctx, layer);
	}
	bitMask(layer, x, y) {
		let id = layer.data[y][x];
		let top = y - 1,
			bottom = y + 1,
			left = x - 1,
			right = x + 1;
		let neighbor = [0, 0, 0, 0];
		if (top > -1 && id === layer.data[top][x]) neighbor[0] = 1;
		if (left > -1 && id === layer.data[y][left]) neighbor[1] = 1;
		if (right < layer.width && id === layer.data[y][right]) neighbor[2] = 1;
		if (bottom < layer.height && id === layer.data[bottom][x]) neighbor[3] = 1;
		id = 1 * neighbor[0] + 2 * neighbor[1] + 4 * neighbor[2] + 8 * neighbor[3];
		return id;
	}
	marchingSquare(layer, x, y) {
		let p1 = 0,p2 = 0,p3 = 0,p4 = 0;

			if (y + 1 < layer.height && x + 1 < layer.width) {
				if(layer.data[y][x] === 1){
					p1 = 1;
				}
				if(layer.data[y][x + 1] === 1){
					p2 = 1;
				}
				if(layer.data[y + 1][x + 1] === 1){
					p3 = 1;
				}
				if(layer.data[y + 1][x] === 1){
					p4 = 1;
				}
			}
			let id = (p1 * 8) + (p2*4) + (p3*2 ) + p4;
			return id;
	  }	
	drawMap() {
		this.terrain.layers.forEach(layer => {
			let start_x = this.current_scene.camera.body.position.x,
				start_y = this.current_scene.camera.body.position.y;
			this.ctx.drawImage(layer.cache.c, start_x, start_y, this.W, this.H, start_x, start_y, this.W, this.H);
		});
	}
	drawLayer(ctx, layer) {
		for (let y = 0; y < layer.height; y++) {
			for (let x = 0; x < layer.width; x++) {
				let id = layer.data[y][x];
				let positionX = (x * this.tile_size),
					positionY = (y * this.tile_size);
				let sourceX = Math.floor(id % this.terrain.tileset.imagewidth) * this.tile_size,
					sourceY = Math.floor(id / this.terrain.tileset.imagewidth) * this.tile_size;
				if (this.terrain.tileset.tileproperties[id] && this.terrain.tileset.tileproperties[id].look === "bitmask") {
					let new_id = this.bitMask(layer, x, y);
					sourceX = Math.floor(new_id) * this.tile_size;
					sourceY = this.terrain.tileset.tileproperties[id].line * this.tile_size;
				}else if (layer.properties && layer.properties.type === "square") {
					let new_id = this.marchingSquare(layer, x, y);
					if (id !== 1 && new_id === 15) continue;
					positionX += this.tile_size/2;
					positionY += this.tile_size/2;
					sourceX = new_id * 16;
					sourceY = layer.properties.line * this.tile_size;
				}else{
					// Prevent invisible tiles to be drawn
					if (id < 0) continue;
				}
				ctx.drawImage(this.terrain.tileset.image, sourceX, sourceY, this.tile_size, this.tile_size, positionX, positionY, this.tile_size, this.tile_size);
			}
		}
	}
}