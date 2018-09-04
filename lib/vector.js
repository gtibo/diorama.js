class Vector{
	constructor(x,y){
		this.x = x || 0;
		this.y = y || 0;
	}
	set(x,y){
		this.x = x;
		this.y = y;
	}
	fromAngle(angle){
		let x = Math.cos(angle),
			y = Math.sin(angle);
		return new Vector(x,y);
	}
	add(vector){
		this.x += vector.x;
		this.y += vector.y;
	}
	sub(vector){
		this.x -= vector.x;
		this.y -= vector.y;
	}
	mult(scalar){
		this.x *= scalar;
		this.y *= scalar;
	}
	div(scalar){
		this.x /= scalar;
		this.y /= scalar;
	}
	dot(vector){
		return vector.x * this.x + vector.y * this.y;
	}
	limit(limit_value){
		if(this.mag() > limit_value) this.setMag(limit_value);
	}
	mag(){
		return Math.hypot(this.x,this.y);
	}
	setMag(new_mag){
		if(this.mag() > 0){
			this.normalize();
		}else{
			this.x = 1;
			this.y = 0;
		}
		this.mult(new_mag);
	}
	normalize(){
		let mag = this.mag();
		if(mag > 0){
			this.x /= mag;
			this.y /= mag;
		}
	}
	heading(){
		return Math.atan2(this.x,this.y);
	}
	setHeading(angle){
		let mag = this.mag();
		this.x = Math.cos(angle) * mag;
		this.y = Math.sin(angle) * mag;
	}
	dist(vector){
		return new Vector(this.x - vector.x,this.y - vector.y).mag();
	}
	angleBetween(vector){
		return Math.atan2(vector.y - this.y, vector.x - this.x);
	}	
	copy(){
		return new Vector(this.x,this.y);
	}
}