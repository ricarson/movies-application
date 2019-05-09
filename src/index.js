/**
 * es6 modules and imports
 */
import sayHello from './hello';
sayHello('World');

/**
 * require style imports
 */

const $ = require('jquery');


const {getMovies} = require('./api.js');


const utils = require('./utils.js');
const templates = utils.Template.templates;
let moviesData;
let genreList=["all"];

console.log(utils.Template.templates);

// $(document).on('click','#addGenre button',()=>{unloadTemplateCSS('css/loadingScreen.css')});
$(document).on('click','.genreListing',(e)=>{
  let me=e.target;
  utils.curGenre=me.innerText.toLowerCase();
  console.log(utils.curGenre);
  let buffer = templates["movie-listings"].unload(templates["movie-listings"],moviesData);
  $("#main").html(buffer);
});



$('#main').html(templates["loadingScreen"].load());

const processMovieData=movieData=>{
  moviesData = movieData;

  let buffer = templates["loadingScreen"].unload(templates["movie-listings"],moviesData);
  $("#main").html(buffer);
  genreList=["All"];
  moviesData.forEach(movie=>{
    genreList = [... new Set(genreList.concat(movie.genres))];
  });
  console.log(genreList);
  let genreTemplate =`
    <div class="row genreListing">
        <div class="col">
            <span>{GENRE}</span>
        </div>
    </div>
    `
  let gc=$("#genreContainer>.col");
  buffer="";
  genreList.forEach(genre=>{
    genre = utils.Capitalize(genre);
    buffer+=(genreTemplate.replace("{GENRE}",genre));
  });
  console.log(buffer);
  gc.html(buffer);

}


getMovies().then(processMovieData).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.');
  console.log(error);
});

