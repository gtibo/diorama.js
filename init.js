let parameters = {
	name: "Title",
	start_screen: "demo",
	background_color: "white",
	width: 128,
	height: 128,
	assets: [
		// Images
    {
			type: "img",
			name: "origami_font",
			path: "assets/origami_font.png"
		},{
			type: "img",
			name: "nano_font",
			path: "assets/nano_font.png"
		}, {
			type: "img",
			name: "box_texture",
			path: "assets/box.png"
		}, {
			type: "img",
			name: "bonhomme",
			path: "assets/bonhomme.png"
		}, {
			type: "img",
			name: "guy",
			path: "assets/guy.png"
		}, {
			type: "img",
			name: "cursor",
			path: "assets/cursor.png"
		}, {
			type: "img",
			name: "demo_tileset",
			path: "assets/demo_tileset.png"
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
		{name:"walls",id:3,collision:false,look:"bitmask",line:1},

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
					],
				},
				{
					name: "walls",
					offset: {
						x: 0,
						y: -4
					},
					geometry: [
						[0, 0, 0],
						[0, 0, 0],
						[0, 0, 3],
					],
				},
			],
		},
	],
};
