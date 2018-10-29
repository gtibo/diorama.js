"use strict";function _slicedToArray(t,i){return _arrayWithHoles(t)||_iterableToArrayLimit(t,i)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(t,i){var e=[],s=!0,n=!1,o=void 0;try{for(var a,r=t[Symbol.iterator]();!(s=(a=r.next()).done)&&(e.push(a.value),!i||e.length!==i);s=!0);}catch(t){n=!0,o=t}finally{try{s||null==r.return||r.return()}finally{if(n)throw o}}return e}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _possibleConstructorReturn(t,i){return!i||"object"!==_typeof(i)&&"function"!=typeof i?_assertThisInitialized(t):i}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _inherits(t,i){if("function"!=typeof i&&null!==i)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(i&&i.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),i&&_setPrototypeOf(t,i)}function _setPrototypeOf(t,i){return(_setPrototypeOf=Object.setPrototypeOf||function(t,i){return t.__proto__=i,t})(t,i)}function _classCallCheck(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,i){for(var e=0;e<i.length;e++){var s=i[e];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}function _createClass(t,i,e){return i&&_defineProperties(t.prototype,i),e&&_defineProperties(t,e),t}function Manifest(){var n=this;this.start_scene=void 0,this.size={x:128,y:128},this.background="white",this.scale=1,this.frame_rate=60,this.assets=[],this.scenes=[],this.maps=[],this.fonts=[],this.boxes=[],this.dom_element=document.body,this.set={container:function(t){n.dom_element=document.getElementById(t)},startScreen:function(t){n.start_scene=t},background:function(t){n.background=t},scale:function(t){n.scale=t},size:function(t,i){n.size={x:t,y:i}},frameRate:function(t){n.frame_rate=t}},this.add={image:function(t,i){n.assets.push({type:"img",name:t,path:i})},audio:function(t,i){n.assets.push({type:"audio",name:t,path:i})},tilemap:function(t,i){n.assets.push({type:"map",name:t,path:i})},scene:function(t){n.scenes.push(t)}},this.create={font:function(t,i,e,s){n.fonts.push({name:t,image:i,size:{x:e,y:s}})},box:function(t,i,e){n.boxes.push({name:t,image:i,resolution:e})}}}function createManifest(){return new Manifest}var Box=function(){function e(t,i){_classCallCheck(this,e),this.world=t,this.ctx=t.ctx,this.c_ctx=t.c_ctx,this.box_data=i,this.resolution=i.resolution,this.image=t.assets.image[i.image].image}return _createClass(e,[{key:"display",value:function(t,i,e,s,n){e=Math.max(2*this.resolution,e),s=Math.max(2*this.resolution,s),this.ctx.fillStyle=n||this.world.background_color,this.ctx.fillRect(t+1,i+1,e-2,s-2);this.ctx.lineWidth=2;for(var o=0;o<4;o++){var a=t+Math.floor(o%2)*(e-this.resolution),r=i+Math.floor(o/2)*(s-this.resolution),h=Math.floor(o%2)*(2*this.resolution),l=Math.floor(o/2)*(2*this.resolution);this.ctx.drawImage(this.image,h,l,this.resolution,this.resolution,a,r,this.resolution,this.resolution)}var c=3*this.resolution;this.ctx.drawImage(this.image,8,0,this.resolution,this.resolution,t+8,i,this.resolution+e-c,this.resolution),this.ctx.drawImage(this.image,8,16,this.resolution,this.resolution,t+8,i+s-this.resolution,this.resolution+e-c,this.resolution),this.ctx.drawImage(this.image,0,8,this.resolution,this.resolution,t,i+8,this.resolution,this.resolution+s-c),this.ctx.drawImage(this.image,16,8,this.resolution,this.resolution,t+e-this.resolution,i+this.resolution,this.resolution,this.resolution+s-c)}}]),e}(),Util={timeStamp:function(){return window.performance.now()},between:function(t,i,e){return(t-i)*(t-e)<0},random:function(t,i){return t+Math.random()*(i-t)},randomInt:function(t,i){return Math.round(this.random(t,i))},map:function(t,i,e,s,n){return(t-i)/(e-i)*(n-s)+s},lerp:function(t,i,e){return t+(i-t)*e},clamp:function(t,i,e){return Math.max(i,Math.min(e,t))},array2D:function(t,i){for(var e=[],s=0;s<t.length;s+=i)e.push(t.slice(s,s+i));return e}},Tween={linear:function(t,i,e,s){return e*t/s+i},easeInOutQuad:function(t,i,e,s){return(t/=s/2)<1?e/2*t*t+i:-e/2*(--t*(t-2)-1)+i},easeInOutExpo:function(t,i,e,s){return(t/=s/2)<1?e/2*Math.pow(2,10*(t-1))+i:(t--,e/2*(2-Math.pow(2,-10*t))+i)}},Scene=function(){function i(t){_classCallCheck(this,i),this.name=t,this.loop=!0,this.init_once=!1}return _createClass(i,[{key:"giveWorld",value:function(t){this.world=t,this.ctx=t.ctx,this.camera=new Camera(this,0,0)}},{key:"keyDown",value:function(t){}},{key:"keyUp",value:function(t){}},{key:"init",value:function(){}},{key:"render",value:function(){}}]),i}(),Vector=function(){function e(t,i){_classCallCheck(this,e),this.x=t||0,this.y=i||0}return _createClass(e,[{key:"set",value:function(t,i){this.x=t,this.y=i}},{key:"add",value:function(t){this.x+=t.x,this.y+=t.y}},{key:"sub",value:function(t){this.x-=t.x,this.y-=t.y}},{key:"mult",value:function(t){this.x*=t,this.y*=t}},{key:"div",value:function(t){this.x/=t,this.y/=t}},{key:"dot",value:function(t){return t.x*this.x+t.y*this.y}},{key:"limit",value:function(t){this.mag()>t&&this.setMag(t)}},{key:"mag",value:function(){return Math.hypot(this.x,this.y)}},{key:"setMag",value:function(t){0<this.mag()?this.normalize():(this.x=1,this.y=0),this.mult(t)}},{key:"normalize",value:function(){var t=this.mag();0<t&&(this.x/=t,this.y/=t)}},{key:"heading",value:function(){return Math.atan2(this.x,this.y)}},{key:"setHeading",value:function(t){var i=this.mag();this.x=Math.cos(t)*i,this.y=Math.sin(t)*i}},{key:"dist",value:function(t){return new e(this.x-t.x,this.y-t.y).mag()}},{key:"angleBetween",value:function(t){return Math.atan2(t.y-this.y,t.x-this.x)}},{key:"copy",value:function(){return new e(this.x,this.y)}},{key:"fromAngle",value:function(t){return new e(Math.cos(t),Math.sin(t))}}]),e}(),Entity=function(){function s(t,i,e){_classCallCheck(this,s),this.scene=t,this.world=t.world,this.ctx=this.world.ctx,this.body=new Body(this,i,e)}return _createClass(s,[{key:"setSprite",value:function(t){this.sprite=new Sprite(this,t)}},{key:"display",value:function(){void 0!==this.sprite&&!0!==this.world.debug||(this.ctx.lineWidth=1,this.ctx.strokeStyle="#000",this.ctx.strokeRect(this.body.position.x-.5,this.body.position.y-.5,this.body.size.x,this.body.size.y)),void 0!==this.sprite&&this.sprite.display(this.body.position.x,this.body.position.y)}}]),s}(),Sprite=function(){function e(t,i){_classCallCheck(this,e),this.entity=t,this.world=this.entity.world,this.tile_size=this.world.tile_size,this.ctx=this.world.ctx,this.image=this.world.assets.image[i.image].image,this.size=i.size,this.current_frame=0,this.animations={},this.current_animation=void 0,this.width=this.image.width/this.size.x,this.height=this.image.height/this.size.y,this.tick=0,this.speed=.2,this.offset={x:0,y:0},this.setOffset(.5,.5),this.addAnimation("none",[0])}return _createClass(e,[{key:"setOffset",value:function(t,i){this.offset.x=t,this.offset.y=i}},{key:"addAnimation",value:function(t,i){this.animations[t]=i,this.current_animation=t}},{key:"setState",value:function(t){this.current_animation=t}},{key:"animate",value:function(t){this.setState(t),this.tick<1?this.tick+=this.speed:(this.tick=0,this.current_frame<this.animations[t].length-1?this.current_frame+=1:this.current_frame=0)}},{key:"display",value:function(t,i){this.ctx.drawImage(this.image,Math.floor(this.animations[this.current_animation][this.current_frame]%this.width)*this.size.x,Math.floor(this.animations[this.current_animation][this.current_frame]/this.width)*this.size.y,this.size.x,this.size.y,t-this.size.x/2+this.offset.x*this.entity.body.size.x,i-this.size.y/2+this.offset.y*this.entity.body.size.y,this.size.x,this.size.y)}}]),e}(),Body=function(){function s(t,i,e){_classCallCheck(this,s),this.world=t.world,this.step=this.world.FPS.step,this.position=new Vector(i,e),this.next_position=new Vector(i,e),this.velocity=new Vector(0,0),this.stepped_velocity=new Vector(0,0),this.acceleration=new Vector(0,0),this.drag=.1,this.bounciness=.2,this.size={x:this.world.tile_size,y:this.world.tile_size},this.half={x:this.size.x/2,y:this.size.y/2},this.collision={left:!1,top:!1,right:!1,bottom:!1}}return _createClass(s,[{key:"setSize",value:function(t,i){this.size.x=t,this.size.y=i,this.half={x:this.size.x/2,y:this.size.y/2}}},{key:"setBounciness",value:function(t){this.bounciness=t}},{key:"setDrag",value:function(t){this.drag=t}},{key:"updateVelocity",value:function(){var t=this.velocity.copy();t.mult(-1),t.setMag(this.velocity.mag()*this.drag),this.addForce(t),this.velocity.add(this.acceleration),this.stepped_velocity=this.velocity.copy(),this.stepped_velocity.mult(this.step),this.next_position=this.position.copy(),this.next_position.add(this.stepped_velocity),this.acceleration.mult(0)}},{key:"updatePosition",value:function(){this.position.add(this.stepped_velocity)}},{key:"integration",value:function(){this.updateVelocity(),this.updatePosition()}},{key:"addForce",value:function(t){this.acceleration.add(t)}},{key:"getTileCollisionData",value:function(e,t,i){var s=this,n={x:Math.floor(t/this.world.tile_size),y:Math.floor(i/this.world.tile_size)},o=this.world.getTileProperties(this.world.getTile(e,n.x,n.y));if(void 0===o||!0!==o.collision)return!1;var a=[{x:n.x-1,y:n.y},{x:n.x+1,y:n.y},{x:n.x,y:n.y-1},{x:n.x,y:n.y+1}].map(function(t){var i=s.world.getTileProperties(s.world.getTile(e,t.x,t.y));return void 0!==i&&!0===i.collision});return{position:n,neighbors:a}}},{key:"mapCollision",value:function(t){var i=this.world.checkLayerId(t),e=this.position.x+this.stepped_velocity.x,s=this.position.y+this.stepped_velocity.y,n=this.getTileCollisionData(i,e,s),o=this.getTileCollisionData(i,e+this.size.x,s),a=this.getTileCollisionData(i,e,s+this.size.y),r=this.getTileCollisionData(i,e+this.size.x,s+this.size.y);this.collision.left=!1,this.collision.top=!1,this.collision.right=!1,this.collision.bottom=!1,n&&this.AABB(n),o&&this.AABB(o),a&&this.AABB(a),r&&this.AABB(r)}},{key:"AABB",value:function(t){t.position.x*=this.world.tile_size,t.position.y*=this.world.tile_size;var i=this.world.tile_size/2,e=this.position.x+this.half.x-(t.position.x+i),s=this.position.y+this.half.y-(t.position.y+i),n=this.half.x+i-Math.abs(e),o=this.half.y+i-Math.abs(s);if(0<n&&0<o)if(n<o)if(0<e){if(t.neighbors[1])return!1;this.position.x+=n,this.velocity.x*=-this.bounciness,this.collision.left=!0}else{if(t.neighbors[0])return!1;this.position.x-=n,this.velocity.x*=-this.bounciness,this.collision.right=!0}else if(0<s){if(t.neighbors[3])return!1;this.position.y+=o,this.velocity.y*=-this.bounciness,this.collision.top=!0}else{if(t.neighbors[2])return!1;this.position.y-=o,this.velocity.y*=-this.bounciness,this.collision.bottom=!0}}}]),s}(),Camera=function(t){function n(t,i,e){var s;return _classCallCheck(this,n),(s=_possibleConstructorReturn(this,_getPrototypeOf(n).call(this,t,i,e))).target={position:new Vector(s.world.W/2,s.world.H/2),size:{x:0,y:0}},s.boundless=!0,s.bounds={x:s.world.W,y:s.world.H},s.angle=0,s}return _inherits(n,Entity),_createClass(n,[{key:"setBounds",value:function(t,i){this.boundless=!1,this.bounds.x=t-this.world.W,this.bounds.y=i-this.world.H}},{key:"setTarget",value:function(t){this.target=t,this.target={position:t.body.position,size:null==t.sprite?t.body.size:t.sprite.size}}},{key:"checkBounds",value:function(){if(this.boundless)return!1;this.body.position.x<0&&(this.body.position.x=0),this.body.position.y<0&&(this.body.position.y=0),this.body.position.x>this.bounds.x&&(this.body.position.x=this.bounds.x),this.body.position.y>this.bounds.y&&(this.body.position.y=this.bounds.y)}},{key:"update",value:function(){this.body.position.x=this.target.position.x+this.target.size.x/2-this.world.W/2,this.body.position.y=this.target.position.y+this.target.size.x/2-this.world.H/2,this.checkBounds(),this.world.ctx.translate(this.world.W/2,this.world.H/2),this.world.ctx.rotate(this.angle),this.world.ctx.translate(-this.body.position.x-this.world.W/2,-this.body.position.y-this.world.H/2)}}]),n}(),Diorama=function(){function i(t){if(_classCallCheck(this,i),!t)throw"A manifest is needed";this.parameters=t,this.debug=!1,this.background_color=this.parameters.background||"#000",this.initCanvas(this.parameters),this.counter=0,this.toLoad=this.parameters.assets.length,this.assets={image:{},audio:{}},this.limit_input=!1,this.keys={},this.scenes={},this.start_screen=this.parameters.start_screen||void 0,this.current_scene="",this.currentFont=void 0,this.alphabet="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ?!:',.()<>[]",this.fonts={},this.tile_size=16,this.maps={},this.boxes={},this.FPS={now:0,delta:0,last:Util.timeStamp(),step:1/(this.parameters.frame_rate||60)},this.requestChange={value:!1,action:""},this.main_loop=void 0,this.full=!1,this.audio_muted=!1,this.loadAssets(this.parameters.assets)}return _createClass(i,[{key:"initCanvas",value:function(){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.W=this.canvas.width=this.parameters.size.x||256,this.H=this.canvas.height=this.parameters.size.y||256,this.scale=this.parameters.scale||1,this.full=!1,this.ctx.imageSmoothingEnabled=!1,this.canvas.classList.add("crisp"),this.parameters.dom_element.appendChild(this.canvas),this.applyScale()}},{key:"loader",value:function(){this.clear("#222"),this.counter+=1;var t=this.W-40,i=this.H-40;this.ctx.fillStyle="#111",this.ctx.fillRect(20,i,t,20),this.ctx.fillStyle="#333",this.ctx.fillRect(20,i,this.counter*t/this.toLoad,20),this.ctx.strokeStyle="#000",this.ctx.lineWidth=4,this.ctx.strokeRect(20,i,t,20),this.counter===this.toLoad&&this.launch()}},{key:"loadAssets",value:function(t){var i=this;0===t.length&&this.launch(),t.map(function(t){return i.checkAssets(t)})}},{key:"checkAssets",value:function(i){var e=this,t=i;switch(i.type){case"img":var s=new Image;s.onload=function(){e.loader()},s.onerror=function(){console.log("can't load Image: "+i.name)},s.src=i.path,t.image=s,this.assets.image[i.name]=t;break;case"audio":var n=new Audio(i.path);n.addEventListener("canplaythrough",this.loader()),n.onerror=function(){console.log("can't load audio: "+i.name)},t.audio=n,this.assets.audio[i.name]=t;break;case"map":fetch(i.path).then(function(t){200===t.status?t.json().then(function(t){e.maps[i.name]=t,e.loader()}):console.log("Looks like there was a problem. Status Code: "+t.status)}).catch(function(t){console.log("can't load map: "+i.name)});break;case void 0:console.log(i.name," doesn't have any type");break;default:console.log(i.name," has a none known type")}}},{key:"launch",value:function(){var i=this;this.parameters.scenes.forEach(function(t){i.addScene(t)}),this.eventSetup(),this.initBoxes(this.parameters.boxes),this.initFonts(this.parameters.fonts),this.startScene(this.start_screen)}},{key:"initBoxes",value:function(t){var i=this;if(void 0===t)return!1;t.map(function(t){i.boxes[t.name]=new Box(i,t)})}},{key:"drawBox",value:function(t,i,e,s,n,o){this.boxes[t].display(i,e,s,n,o)}},{key:"setFont",value:function(t){this.currentFont=t}},{key:"initFonts",value:function(t){var i=this;if(void 0===t&&0<t.length)return!1;t.map(function(t){if(void 0===i.assets.image[t.image])return console.log("can't load font, "+t.image+" doesn't exist"),!1;t.image=i.assets.image[t.image].image,i.fonts[t.name]=t}),this.currentFont=Object.keys(this.fonts)[0]}},{key:"write",value:function(t,i,e,s,n){if(void 0===this.currentFont)return console.log("No bitmap_font"),!1;if("string"==typeof s){switch(s){case"center":i-=t.length*this.fonts[this.currentFont].size.x/2;break;case"right":i-=t.length*this.fonts[this.currentFont].size.x}this.writeLine(t,i,e,n||0)}else this.writeParagraph(t,i,e,s,n||0)}},{key:"writeParagraph",value:function(t,i,e,s,n){for(var o=0,a=this.fonts[this.currentFont].size.y+5,r=this.fonts[this.currentFont].size.x,h=t.split(" "),l="",c=0;c<h.length;c++){l+=h[c]+" ";var u=0,y=h[c+1],f=l.length*r;y&&(u=y.length*r),s<f+u?(this.writeLine(l,i,e+o,n),o+=a,l=""):this.writeLine(l,i,e+o,n)}}},{key:"writeLine",value:function(t,i,e,s){for(var n=this.fonts[this.currentFont].size.x,o=this.fonts[this.currentFont].size.y,a=this.fonts[this.currentFont].image,r=0;r<t.length;r++){var h=n*this.alphabet.indexOf(t.charAt(r)),l=i+r*n;this.ctx.drawImage(a,h,s*o,n,o,l,e,n,o)}}},{key:"eventSetup",value:function(){var i=this;document.addEventListener("keydown",function(t){return i.keyDown(t)},!1),document.addEventListener("keyup",function(t){return i.keyUp(t)},!1)}},{key:"keyDown",value:function(t){this.limit_input&&t.preventDefault(),this.keys[t.key.toLowerCase()]=!0,this.current_scene.keyDown(t)}},{key:"keyUp",value:function(t){this.keys[t.key.toLowerCase()]=!1,this.current_scene.keyDown(t)}},{key:"startScene",value:function(t){return 0==Object.keys(this.scenes).length?(console.warn("Sorry, Your project doesn't have any scenes"),!1):(null==t&&(t=Object.keys(this.scenes)[0]),void 0===this.scenes[t]?(console.warn("Sorry, the scene named '"+t+"' doesn't exist"),!1):void 0!==this.main_loop?(this.requestChange.value=!0,this.requestChange.action=t,!1):(this.requestChange.value=!1,this.requestChange.action="",this.FPS.last=Util.timeStamp(),this.current_scene=this.scenes[t],this.initScene(),void(!0===this.current_scene.loop?this.gameLoop():this.mainRender())))}},{key:"initScene",value:function(){if(this.current_scene.init_once)return!1;this.current_scene.init()}},{key:"addScene",value:function(t){t.giveWorld(this),this.scenes[t.name]=t}},{key:"mainRender",value:function(){this.clear(),this.ctx.save(),this.current_scene.camera.update(),this.current_scene.render(),this.ctx.restore()}},{key:"loopCheck",value:function(){var t=this;!1===this.requestChange.value?this.main_loop=requestAnimationFrame(function(){return t.gameLoop()}):(cancelAnimationFrame(this.main_loop),this.main_loop=void 0,this.startScene(this.requestChange.action))}},{key:"gameLoop",value:function(){for(this.FPS.now=Util.timeStamp(),this.FPS.delta+=Math.min(1,(this.FPS.now-this.FPS.last)/1e3);this.FPS.delta>this.FPS.step;)this.FPS.delta-=this.FPS.step,this.mainRender();this.FPS.last=this.FPS.now,this.loopCheck()}},{key:"soundLevel",value:function(t){for(var i=Object.entries(this.assets.audio),e=0;e<i.length;e++){var s=_slicedToArray(i[e],2);s[0];s[1].audio.volume=t}}},{key:"mute",value:function(){this.audio_muted=!this.audio_muted;for(var t=Object.entries(this.assets.audio),i=0;i<t.length;i++){var e=_slicedToArray(t[i],2);e[0];e[1].audio.muted=this.audio_muted}}},{key:"clear",value:function(t){this.ctx.fillStyle=t||this.background_color,this.ctx.fillRect(0,0,this.W,this.H)}},{key:"applyScale",value:function(){this.canvas.style.maxWidth=this.W*this.scale+"px",this.canvas.style.maxHeight=this.H*this.scale+"px",this.canvas.style.width="100%",this.canvas.style.height="100%"}},{key:"fullScreen",value:function(){this.full=!this.full,this.full?(this.canvas.style.maxWidth="",this.canvas.style.maxHeight="",this.canvas.style.width="",this.canvas.style.height="",this.canvas.style.width="100%",this.canvas.style.height="100%"):this.applyScale()}},{key:"checkLayerId",value:function(e){var s=e;return"string"==typeof e&&this.terrain.layers.forEach(function(t,i){if(t.name===e)return s=i}),s}},{key:"getTile",value:function(t,i,e){var s=this.terrain.layers[this.checkLayerId(t)];return!(i<0||i>s.width-1)&&(!(e<0||e>s.height-1)&&s.data[e][i])}},{key:"getTileProperties",value:function(t){return this.terrain.tileset.tileproperties[t]}},{key:"findTile",value:function(t,i){for(var e=this.terrain.layers[this.checkLayerId(t)],s=[],n=0;n<e.width;n++)for(var o=0;o<e.height;o++){e.data[n][o]===i&&s.push({x:o,y:n})}return s}},{key:"initMap",value:function(t){var i=this;this.terrain=JSON.parse(JSON.stringify(this.maps[t])),this.terrain.layers.forEach(function(t){var i=t.data.map(function(t){return t-1});t.data=Util.array2D(i,t.width)}),this.terrain.tileset=this.terrain.tilesets[0],this.terrain.tileset.image=this.assets.image[this.terrain.tilesets[0].name].image,this.terrain.layers.forEach(function(t){i.terrainCache(t)})}},{key:"terrainCache",value:function(t){t.cache={};var i=t.cache.c=document.createElement("canvas"),e=t.cache.ctx=t.cache.c.getContext("2d");i.width=t.width*this.tile_size,i.height=t.height*this.tile_size,this.drawLayer(e,t)}},{key:"bitMask",value:function(t,i,e){var s=t.data[e][i],n=e-1,o=e+1,a=i-1,r=i+1,h=[0,0,0,0];return-1<n&&s===t.data[n][i]&&(h[0]=1),-1<a&&s===t.data[e][a]&&(h[1]=1),r<t.width&&s===t.data[e][r]&&(h[2]=1),o<t.height&&s===t.data[o][i]&&(h[3]=1),s=1*h[0]+2*h[1]+4*h[2]+8*h[3]}},{key:"marchingSquare",value:function(t,i,e){var s=0,n=0,o=0,a=0;return e+1<t.height&&i+1<t.width&&(1===t.data[e][i]&&(s=1),1===t.data[e][i+1]&&(n=1),1===t.data[e+1][i+1]&&(o=1),1===t.data[e+1][i]&&(a=1)),8*s+4*n+2*o+a}},{key:"drawMap",value:function(){var s=this;this.terrain.layers.forEach(function(t){var i=s.current_scene.camera.body.position.x,e=s.current_scene.camera.body.position.y;s.ctx.drawImage(t.cache.c,i,e,s.W,s.H,i,e,s.W,s.H)})}},{key:"drawLayer",value:function(t,i){for(var e=0;e<i.height;e++)for(var s=0;s<i.width;s++){var n=i.data[e][s],o=s*this.tile_size,a=e*this.tile_size,r=Math.floor(n%this.terrain.tileset.imagewidth)*this.tile_size,h=Math.floor(n/this.terrain.tileset.imagewidth)*this.tile_size;if(this.terrain.tileset.tileproperties[n]&&"bitmask"===this.terrain.tileset.tileproperties[n].look){var l=this.bitMask(i,s,e);r=Math.floor(l)*this.tile_size,h=this.terrain.tileset.tileproperties[n].line*this.tile_size}else if(i.properties&&"square"===i.properties.type){var c=this.marchingSquare(i,s,e);if(1!==n&&15===c)continue;o+=this.tile_size/2,a+=this.tile_size/2,r=16*c,h=i.properties.line*this.tile_size}else if(n<0)continue;t.drawImage(this.terrain.tileset.image,r,h,this.tile_size,this.tile_size,o,a,this.tile_size,this.tile_size)}}}]),i}();