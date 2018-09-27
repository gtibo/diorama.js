let demo = new Scene("demo");
demo.init = function() {
  let sprite_data = {
    image:"bonhomme",
    size:{x:16,y:20},
  }
  this.character = new Entity(this,this.world.W/2 - 8,60);
  this.character.setSprite(sprite_data);
  this.character.sprite.addAnimation("run",[16,17,18,19,20,21,22,23]);
};
demo.render = function() {
  // Update character
  if(this.world.keys.arrowright){
    this.character.body.applyForce(new Vector(2,0));
  }else if(this.world.keys.arrowleft){
    this.character.body.applyForce(new Vector(-2,0));
  }
  if(this.world.keys.arrowup){
    this.character.body.applyForce(new Vector(0,-2));
  }else if(this.world.keys.arrowdown){
    this.character.body.applyForce(new Vector(0,2));
  }
  this.character.body.integration();
  this.character.sprite.animate("run");
  this.character.display();
  this.world.drawBox("box",16,30,94,20);
  this.world.setFont("nano");
  this.world.write("Evertyhing's ready !",this.world.W/2,38,"center");
};