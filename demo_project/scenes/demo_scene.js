let demo = new Scene("demo");
demo.init = function() {
  let sprite_data = {
    image:"bonhomme",
    size:{x:16,y:20},
  }
  this.character = new Entity(this,this.world.W/2 - 8,60);
  this.character.setSprite(sprite_data);
  this.character.sprite.addAnimation("idle_left",[1]);
  this.character.sprite.addAnimation("idle_right",[0]);
  this.character.sprite.addAnimation("run_left",[8,9,10,11,12,13,14,15]);
  this.character.sprite.addAnimation("run_right",[16,17,18,19,20,21,22,23]);
  this.direction = "left";
  this.character.body.setSize(10,4);
  this.character.body.setDrag(0.94);
  this.character.sprite.setOffset(0.5,-1.4);
  this.world.initMap("map_demo");
  this.camera.setTarget(this.character);
  this.camera.boundless = false;
  this.camera.setBounds(160,160);
};
demo.render = function() {
  // Update character
  if(this.world.keys.arrowright){
    this.direction = "right";
    this.character.body.applyForce(new Vector(6,0));
  }else if(this.world.keys.arrowleft){
    this.direction = "left";
    this.character.body.applyForce(new Vector(-6,0));
  }
  if(this.world.keys.arrowup){
    this.character.body.applyForce(new Vector(0,-6));
  }else if(this.world.keys.arrowdown){
    this.character.body.applyForce(new Vector(0,6));
  }
  this.character.body.mapCollision("walls");
  this.character.body.velocity.limit(60);
  this.character.body.integration();
  if(this.character.body.velocity.mag() > 8){
    this.character.sprite.animate("run_" + this.direction);
  }else{
    this.character.sprite.setState("idle_" + this.direction);
    this.character.sprite.current_frame = 0;
  }
  this.world.drawMap();
  this.character.display();
  let ui_offset = {
    x:this.camera.body.position.x,
    y:this.camera.body.position.y
  };
  this.world.drawBox("box",ui_offset.x+16,ui_offset.y+this.world.H-30,94,20);
  this.world.setFont("nano");
  this.world.write("Evertyhing's ready !",ui_offset.x+this.world.W/2,ui_offset.y+this.world.H-22,"center");
};