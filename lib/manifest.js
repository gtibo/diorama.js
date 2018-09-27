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
	this.maps = [];
	this.fonts = [];
	this.boxes = [];
	this.set = {
		start_screen: (value) => {
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
		frame_rate: (value) => {
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
		sound: (name, path) => {
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