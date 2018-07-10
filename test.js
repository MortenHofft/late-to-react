import "babel-polyfill";

const a = [1,2,3,4];
a.forEach(function(e){e = e + 10;});
let b = a.map(function(e){return e + 1;});
console.log(b);
 // polyfills should now be included and this would work in say ie 8