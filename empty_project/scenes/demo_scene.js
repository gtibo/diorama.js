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
  this.character.sprite.animate("run");
  this.character.display();
  this.world.drawBox("box",16,30,94,20);
  this.world.setFont("nano");
  this.world.write("Evertyhing's running !",this.world.W/2,38,"center");
};