const moment = require('moment');

// var date = new Date();
//
// console.log(date.getMonth());

// var date = moment();
// date.add(1, 'year');
// console.log( date.format('MMM Do, YYYY') );

var date = moment();
console.log( date.format('h:mm a') );
