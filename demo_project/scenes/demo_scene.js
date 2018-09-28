let demo = new Scene("demo");
demo.init = function() {
  let sprite_data = {
    image:"bonhomme",
    size:{x:16,y:20},
  }
  this.character = new Entity(this,this.world.W/2 - 8,60);
  this.character.setSprite(sprite_data);
  this.character.sprite.addAnimation("run",[16,17,18,19,20,21,22,23]);
  this.character.body.setSize(10,4);
  this.character.sprite.setOffset(0.5,-1.4);
  this.world.initMap("map_demo");
  this.camera.setTarget(this.character);
  this.camera.boundless = false;
  this.camera.setBounds(160,160);
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
  this.character.body.mapCollision("walls");
  this.character.sprite.animate("run");
  this.world.drawMap();
  let ui_offset = {
    x:this.camera.body.position.x,
    y:this.camera.body.position.y
  };
  this.character.display();
  this.world.drawBox("box",ui_offset.x+16,ui_offset.y+this.world.H-30,94,20);
  this.world.setFont("nano");
  this.world.write("Evertyhing's ready !",ui_offset.x+this.world.W/2,ui_offset.y+this.world.H-22,"center");
};