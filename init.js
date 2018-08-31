let parameters = {
	name: "Title",
	start_screen: "demo",
	background_color: "white",
	width: 128,
	height: 128,
	scale:2,
	assets: [
		// Images
    {
			type: "img",
			name: "origami_font",
			path: "assets/fonts/origami.png"
		},{
			type: "img",
			name: "nano_font",
			path: "assets/fonts/nano.png"
		}, {
			type: "img",
			name: "box_texture",
			path: "assets/ui/box.png"
		}, {
			type: "img",
			name: "bonhomme",
			path: "assets/sprites/bonhomme.png"
		}, {
			type: "img",
			name: "guy",
			path: "assets/sprites/guy.png"
		}, {
			type: "img",
			name: "cursor",
			path: "assets/ui/cursor.png"
		}, {
			type: "img",
			name: "demo_tileset",
			path: "assets/tilesets/demo_tileset.png"
		},
		// Audio
		{
			type: "audio",
			name: "jingle",
			path: "assets/jingle.wav"
		},
		// Bitmap font
	],
	fonts: [
		// basic font
		{
			name: "origami",
			image: "origami_font",
			size: {x: 16,y: 14}
		},
    {
			name: "nano",
			image: "nano_font",
			size: {x: 4,y: 6}
		},
	],
	// box system
	boxes: [
		{
			name: "blue_box",
			resolution: 8,
			image: "box_texture",
		}
	],

	tiles:[
		{name:"empty",id:0,collision:false,visibility:false},
		{name:"water",id:1,collision:false},
		{name:"grass",id:2,collision:false,look:"bitmask",line:1},
		{name:"walls",id:3,collision:false,look:"bitmask",line:2},

	],


	maps:[
		{
			name:"map_1",
			tileset:"demo_tileset",
			// ground
			layers: [
				// ground layer
				{
					name: "ground",
					offset: {
						x: 0,
						y: 0
					},
					geometry: [
						[2, 2, 2],
						[2, 2, 2],
						[2, 2, 2],
						[2, 2, 2],
						[0, 0, 0],
					],
				},
				{
					name: "walls",
					offset: {
						x: 0,
						y: -4
					},
					geometry: [
						[0, 3, 0],
						[1, 3, 0],
						[0, 3, 3],
						[0, 0, 0],
					],
				},
			],
		},
	],
};
