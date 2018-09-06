# diorama
Diorama.js is a small Html5 2D game engine, based on canvas with no dependency.

[You can find demos and examples here](https://codepen.io/collection/AevkWM/#)

## installation

Download this repository, and de-zip it. It contain an Empty project with a single scene and basic assets.
To see the result you have to open the Index.html file in a web browser. Then you will only need to refresh your page after any change in the code to see them applied in your game.

## usage
You can use any code editor you want to edit a project.
To display something on the screen diorama require at least one scene, you can find an example 

```javascript
let demo = new Scene("demo");
demo.init = function() {
	// this function is called by default every time a scene is started
	// all the variables written here will be reserved to this scene only
	// to access methods or variables from the parent element (diorama) use "this.world"
	// example > this.world.W to get the width of the canvas
};
demo.render = function() {
	// this function is executed 60 times per secondes by default
};
```

don't forget to add your scenes to your game 
the addScene function link the scene with the world aka "game"

```javascript
let game = new Diorama(parameters);
    game.addScene(demo);
```

By default diorama start with the first added scene, but you can specify in the parameters object by which scene you want your project to start
```javascript
let parameters = {
	start_screen: "demo",
  };
```

Diorama is under the [MIT license](https://opensource.org/licenses/MIT)