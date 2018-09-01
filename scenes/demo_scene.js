// demo scene
let demo = new Scene("demo");
demo.init = function() {
  let sprite_data = {
    image:"bonhomme",
    size:{x:16,y:20},
  }
  this.character = new Entity(this,4,40);
  this.character.setSprite(sprite_data);
  this.character.sprite.addAnimation("run",[0,1,2,3,4,5,6,7]);
  // need to init a map first
  this.world.initMap("map_1");
};
demo.render = function() {
  this.character.sprite.animate("run");
  this.character.display();
  this.world.setFont("origami");
  this.world.write("Welcome",this.world.W/2,10,"center");
  this.world.setFont("nano");
  this.world.write("everything's ready !",this.world.W/2,30,"center");
};