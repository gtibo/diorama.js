let parameters = {
	start_screen: "demo",
	background_color: "white",
	width: 128,
	height: 128,
	scale:2,
	frame_rate:60,
	// assets to load
	assets: [
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
		},{
			type: "img",
			name: "blue_box_texture",
			path: "assets/ui/blue_box.png"
		}, {
			type: "img",
			name: "bonhomme",
			path: "assets/sprites/bonhomme.png"
		},
	],
	// basic font
	fonts: [
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
	// boxes
	boxes:[
		{
			name:"box",
			image:"box_texture",
			resolution:8,
		},{
			name:"blue_box",
			image:"blue_box_texture",
			resolution:8,
		},
	],
};
