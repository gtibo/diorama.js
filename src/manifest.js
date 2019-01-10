function Manifest() {
	this.start_screen = undefined;
	this.size = {
		x: 128,
		y: 128
	};
	this.tile_size = 16;
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
			this.start_screen = value;
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
		tile_size: (value) => {
			this.tile_size = value;
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
		tilemap: (name,path) =>{
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
