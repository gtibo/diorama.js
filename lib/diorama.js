class Diorama {
	constructor(parameters) {
		this.parameters = parameters;
		// Game and author's name
		this.game_info = {
			name: parameters.name || "Untitled",
			author: parameters.author || "Anonymous",
		};
		// canvas
		this.background_color = parameters.background_color || "#000";
		this.initCanvas(parameters);
		// Assets
		this.counter = 0;
		this.toLoad = parameters.assets.length;
		this.assets = {
			image: {},
			audio: {},
		};
		this.audio_muted = false;
		// keyboard event
		this.limit_input = false;
		this.keys = {};
		// Scenes
		this.scenes = {};
		this.start_screen = parameters.start_screen || undefined;
		this.current_scene = "";
		// Bitmap font Data
		this.alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ?!:',.()<>[]";
		this.fonts = {};
		// Maps
		this.tile_size = parameters.tile_size || 16;
		this.tiles_data = {};
		if (parameters.tiles !== undefined) {
			parameters.tiles.map(tile => {
				this.tiles_data[tile.id] = tile;
			});
		}
		this.mapsMax = parameters.maps.length;
		this.maps = {};
		if (parameters.maps !== undefined) {
			parameters.maps.map(map => {
				this.maps[map.name] = map;
			});
		}
		// Box system
		this.boxes = {};
		// By default the current font is the first font you create
		this.currentFont = undefined;
		// Game loop Data
		this.FPS = {
			now: 0,
			delta: 0,
			last: Util.timeStamp(),
			step: 1 / (parameters.frame_rate || 60),
		};
		this.requestChange = {
			value: false,
			action: ""
		};
		this.main_loop = undefined;
		this.setScale();
	}
	// ---
	// Setup & Loading
	// ---
	ready() {
		this.loadAssets(this.parameters.assets);
	}
	initCanvas(parameters) {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext('2d');
		this.W = this.canvas.width = parameters.width || 256;
		this.H = this.canvas.height = parameters.height || 256;
		this.scale = parameters.scale || 1;
		this.full = false;
		this.ctx.imageSmoothingEnabled = false;
		this.canvas.classList.add("crisp");
		document.body.appendChild(this.canvas);
		// cache canvas
		this.cache = document.createElement("canvas");
		this.c_ctx = this.cache.getContext("2d");
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
		if (assets === undefined) console.log("Nothing to load");
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
			case undefined:
				console.log(obj.name, " doesn't have any type");
				break;
			default:
				console.log(obj.name, " has a none known type");
		}
	}
	launch() {
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
	drawBox(box_name, x, y, width, height) {
		this.boxes[box_name].display(x, y, width, height);
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
		if (this.keys.f) {
			this.fullScreen();
		}
		if (this.keys.m) {
			this.mute();
		}
		this.current_scene.keyEvents(event);
	}
	keyUp(event) {
		this.keys[event.key.toLowerCase()] = false;
	}
	// ---
	// Scene Manager
	// ---
	startScene(scene_name) {
		// check if the scene exist
		if (this.scenes[scene_name] === undefined) return scene_name + " - doesn't exist";
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
	setScale() {
		this.canvas.style.maxWidth = this.W * this.scale + "px";
		this.canvas.style.maxHeight = this.H * this.scale + "px";
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
	}
	fullScreen() {
		this.full = !this.full;
		if (!this.full) {
			this.setScale();
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
	getTile(layer_id, x, y) {
		if (x < 0 || x > this.terrain.layers[layer_id].size.x - 1) return false;
		if (y < 0 || y > this.terrain.layers[layer_id].size.y - 1) return false;
		return this.terrain.layers[layer_id].geometry[y][x];
	}
	findTile(layer_id, tile_id) {
		let layer = this.terrain.layers[layer_id];
		let result = [];
		for (let y = 0; y < layer.size.y; y++) {
			for (let x = 0; x < layer.size.x; x++) {
				let id = layer.geometry[y][x];
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
		// give size to layers
		for (var i = 0; i < this.terrain.layers.length; i++) {
			this.terrain.layers[i].size = {
				x: this.terrain.layers[i].geometry[0].length,
				y: this.terrain.layers[i].geometry.length,
			}
		}
		this.terrain.size = this.terrain.layers[0].size;
		this.terrain.tileset = this.assets.image[this.maps[map_name].tileset].image;
		this.terrain.tileset_size = {
			width: (this.terrain.tileset.width / this.tile_size),
			height: (this.terrain.tileset.height / this.tile_size) + 1,
		};
		this.terrain.layers.forEach((layer, index) => {
			this.marchingSquare(layer);
			this.bitMasking(layer);
			// create a cache for reducing draw call in the gameLoop
			this.terrainCache(layer);
			// prepare animated tiles
			layer.animated = [];
			for (var id in this.tiles_data) {
				if (this.tiles_data[id].animated === true) {
					let tiles = this.findTile(index, parseInt(id));
					layer.animated.push({
						id: id,
						spritesheet: this.assets.image[this.tiles_data[id].spritesheet].image,
						positions: tiles,
						current: 0,
						steps: this.tiles_data[id].steps,
						max_frame: this.assets.image[this.tiles_data[id].spritesheet].image.width / this.tile_size,
					});
				}
			}
		});
		this.clear("black");
	}
	terrainCache(layer) {
		layer.cache = {};
		let c = layer.cache.c = document.createElement("canvas");
		let ctx = layer.cache.ctx = layer.cache.c.getContext('2d');
		let W = c.width = layer.size.x * this.tile_size,
			H = c.height = layer.size.y * this.tile_size;
		// Draw on cache
		this.drawLayer(ctx, layer);
	}
	marchingSquare(layer) {
		layer.square = [];
		for (let y = 0; y < layer.size.y; y++) {
			for (let x = 0; x < layer.size.x; x++) {
				let p1 = 0,
					p2 = 0,
					p3 = 0,
					p4 = 0;
				if (y + 1 < layer.size.y && x + 1 < layer.size.x) {
					p1 = layer.geometry[y][x];
					p2 = layer.geometry[y][x + 1];
					p3 = layer.geometry[y + 1][x + 1];
					p4 = layer.geometry[y + 1][x];
				}
				let id = (p1 * 8) + (p2 * 4) + (p3 * 2) + p4;
				layer.square.push(id);
			}
		}
		layer.square = Util.array2D(layer.square, layer.size.x);
	}
	bitMasking(layer) {
		layer.bitMask = [];
		for (let y = 0; y < layer.size.y; y++) {
			for (let x = 0; x < layer.size.x; x++) {
				let id = layer.geometry[y][x];
				let neighbor = [0, 0, 0, 0];
				if (y - 1 > -1) {
					if (id === layer.geometry[y - 1][x]) {
						//top
						neighbor[0] = 1;
					}
				} else {
					neighbor[0] = 1;
				}
				if (x - 1 > -1) {
					if (id === layer.geometry[y][x - 1]) {
						// left
						neighbor[1] = 1;
					}
				} else {
					neighbor[1] = 1;
				}
				if (x + 1 < layer.size.x) {
					if (id === layer.geometry[y][x + 1]) {
						// right
						neighbor[2] = 1;
					}
				} else {
					neighbor[2] = 1;
				}
				if (y + 1 < layer.size.y) {
					if (id === layer.geometry[y + 1][x]) {
						//down
						neighbor[3] = 1;
					}
				} else {
					neighbor[3] = 1;
				}
				id = 1 * neighbor[0] + 2 * neighbor[1] + 4 * neighbor[2] + 8 * neighbor[3];
				layer.bitMask.push(id);
			}
		}
		layer.bitMask = Util.array2D(layer.bitMask, layer.size.x);
	}
	renderMap() {
		this.terrain.layers.forEach(layer => {
			this.ctx.drawImage(layer.cache.c, 0, 0);
			// draw animated layer
			layer.animated.forEach(tile => {
				if (tile.current < tile.max_frame - 1) {
					tile.current += tile.steps;
				} else {
					tile.current = 0;
				}
				// render animated tiles
				tile.positions.forEach(position => {
					let x = position.x * this.tile_size,
						y = position.y * this.tile_size;
					this.ctx.drawImage(tile.spritesheet, Math.floor(tile.current) * this.tile_size, 0, this.tile_size, this.tile_size, x, y, this.tile_size, this.tile_size)
				});
			});
		});
	}
	drawLayer(ctx, layer) {
		for (let y = 0; y < layer.size.y; y++) {
			for (let x = 0; x < layer.size.x; x++) {
				// ID of the tile
				let id = layer.geometry[y][x];
				// Don't draw invisible tiles
				// Position of the tile :)
				let positionX = (x * this.tile_size) + layer.offset.x,
					positionY = (y * this.tile_size) + layer.offset.y;
				let sourceX = Math.floor(id % this.terrain.tileset_size.width) * this.tile_size,
					sourceY = Math.floor(id / this.terrain.tileset_size.width) * this.tile_size;
				if (this.tiles_data[id] && this.tiles_data[id].visibility === false) {
					continue;
				}
				if (this.tiles_data[id] && this.tiles_data[id].look === "bitmask") {
					sourceX = Math.floor(layer.bitMask[y][x]) * this.tile_size;
					sourceY = this.tiles_data[id].line * this.tile_size;
				}
				if (layer.look === "square") {
					if (layer.square[y][x] === 0) continue;
					positionX += this.tile_size / 2;
					positionY += this.tile_size / 2;
					sourceX = Math.floor(layer.square[y][x] % 16) * 16;
					sourceY = (7 * this.tile_size);
				}
				if (this.tiles_data[id] && this.tiles_data[id].animated === true) {
					// hide animated sprites on the cache
					continue;
				}
				// render tile
				ctx.drawImage(this.terrain.tileset, sourceX, sourceY, this.tile_size, this.tile_size, positionX, positionY, this.tile_size, this.tile_size);
			}
		}
	}
}