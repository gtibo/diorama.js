class Camera extends Entity{
	constructor(scene,x,y){
		super(scene,x,y);
		this.target = {
			position : new Vector(this.world.W/2,this.world.H/2),
			size : {x:0,y:0},
		};
	}
	setTarget(target){
		this.target = target;
		this.target = {
			position : target.body.position,
			size : (target.sprite == undefined) ? target.body.size : target.sprite.size,
		};
	}
	update(){
		this.body.position.x = this.target.position.x + this.target.size.x/2 - this.world.W/2;
		this.body.position.y = this.target.position.y + this.target.size.x/2 - this.world.H/2;
		this.world.ctx.setTransform(1,0,0,1,-this.body.position.x,-this.body.position.y);
	}
}