let parameters = {
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
		},
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
};
