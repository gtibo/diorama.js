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
  this.world.setFont("origami");
  this.world.write("Welcome",this.world.W/2,10,"center");
  this.world.setFont("nano");
  this.world.write("everything's ready !",this.world.W/2,50,"center");
};