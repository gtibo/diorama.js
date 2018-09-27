// ----------
// Utility
// ----------
let Util = {};
Util.timeStamp = function() {
	return window.performance.now();
};
Util.between = function(value, min, max) {
	return (value - min) * (value - max) < 0;
  };
Util.random = function(min, max){
	return min + Math.random() * (max - min);
};
Util.randomInt = function(min,max){
	return Math.round(this.random(min,max));
};
Util.map = function(a,b,c,d,e){
	return(a-b)/(c-b)*(e-d)+d;
};
Util.lerp = function(value1, value2, amount) {
	return value1 + (value2 - value1) * amount;
};
Util.clamp = function(value,min,max){
	return Math.max(min, Math.min(max, value));
};
Util.array2D = function(tableau, array_width){
	var result = [];
	for (var i = 0; i < tableau.length; i += array_width) result.push(tableau.slice(i, i + array_width));
	return result;
};
let Tween = {};
Tween.linear = function(currentTime, start, degreeOfChange, duration) {
	return degreeOfChange * currentTime / duration + start;
};
Tween.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
Tween.easeInOutExpo = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
	t--;
	return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
};