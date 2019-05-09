/**
 * es6 modules and imports
 */
import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */
const {getMovies} = require('./api.js');

const utils = require('./utils.js');

const $ = require('jquery');


// $(document).on('click','#addGenre button',()=>{unloadTemplateCSS('css/loadingScreen.css')});
$(document).on('click','#addGenre button',()=>{$("#main").html(utils.template('loadingScreen').unload())});



$('#main').html(utils.template('loadingScreen').load());

getMovies().then((movies) => {
  console.log('Here are all the movies:');
  movies.forEach(({title, rating, id}) => {
    console.log(`id#${id} - ${title} - rating: ${rating}`);
  });
}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.')
  console.log(error);
});
