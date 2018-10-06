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
		document.body.appendChild(this.canvas);
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