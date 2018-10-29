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
