// ----------
// Utility
// ----------
Util = {};
Util.timeStamp = function() {
	return window.performance.now();
};
Util.random = function(min, max){
	return min + Math.random() * (max - min);
};

Util.toDio = function(array) {
	let tab = array.map(x => {
	  if (x !== 0) {
		return x - 1;
	  } else {
		return x;
	  }
	});
	let render = Util.array2D(tab, 16);
	return JSON.stringify(render);
  };
  

Util.array2D = function(tableau, array_width){
	var result = [];
	for (var i = 0; i < tableau.length; i += array_width) result.push(tableau.slice(i, i + array_width));
	return result;
};
Util.map = function(a,b,c,d,e){
	return(a-b)/(c-b)*(e-d)+d;
};
Util.lerp = function(value1, value2, amount) {
	return value1 + (value2 - value1) * amount;
};
Util.linearTween = function(currentTime, start, degreeOfChange, duration) {
	return degreeOfChange * currentTime / duration + start;
};
Util.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
Util.easeInOutExpo = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
	t--;
	return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
};


class Box{
	constructor(world,box_data){
		this.world = world;
		this.ctx = world.ctx;
		this.c_ctx = world.c_ctx;
		this.box_data = box_data;
		this.resolution = box_data.resolution;
		this.image = world.assets.image[box_data.image].image;
	}
	display(x,y,width,height){
		// background
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
