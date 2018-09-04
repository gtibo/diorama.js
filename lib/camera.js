class Camera extends Entity{
	constructor(scene,x,y){
		super(scene,x,y);
		this.target = {
			position : new Vector(this.world.W/2,this.world.H/2),
			size : {x:0,y:0},
		};
		this.boundless = true;
		this.bounds = {
			x:this.world.W,
			y:this.world.H
		}
		this.angle = 0;
	}
	setBounds(x,y){
		this.bounds.x = x - this.world.W;
		this.bounds.y = y - this.world.H;
	}
	setTarget(target){
		this.target = target;
		this.target = {
			position : target.body.position,
			size : (target.sprite == undefined) ? target.body.size : target.sprite.size,
		};
	}
	checkBounds(){
		if(this.boundless) return false;
		if(this.body.position.x < 0){this.body.position.x = 0;}
		if(this.body.position.y < 0){this.body.position.y = 0;}
		if(this.body.position.x > this.bounds.x ){this.body.position.x = this.bounds.x}
		if(this.body.position.y > this.bounds.y ){this.body.position.y = this.bounds.y}
	}
	update(){
		this.body.position.x = this.target.position.x + this.target.size.x/2 - this.world.W/2;
		this.body.position.y = this.target.position.y + this.target.size.x/2 - this.world.H/2;
		// bound
		this.checkBounds();
		
		this.world.ctx.translate(this.world.W/2,this.world.H/2);
		this.world.ctx.rotate(this.angle);
		this.world.ctx.translate(-this.body.position.x- this.world.W/2 ,-this.body.position.y - this.world.H/2);

	}
}