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

$(document).on('input','#movieSearch input',(e)=>{
  let nameFilter = e.target.value.toLowerCase();
  let tempMoviesData = moviesData.reduce((accumulator, curMovie) => {
    if (curMovie.title.toLowerCase().indexOf(nameFilter) != -1) {
      accumulator.push(curMovie);
    }
    return accumulator;
  }, []);
  let buffer = templates["movie-listings"].unload(templates["movie-listings"],tempMoviesData);
  $("#main").html(buffer);
});

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
  gc.html(buffer);
};

$(document).on('click','#addMovie',(e)=> {
  let buffer = templates["movie-listings"].unload(templates["add-movie"]);
  console.log(buffer);
  $("#main").html(buffer);
});

$(document).on('click','#closeAddMovie',(e)=> {
  let buffer = templates["add-movie"].unload(templates["movie-listings"],moviesData);
  console.log(buffer);
  $("#main").html(buffer);
});


$(document).on('click','#addMovieSubmit',(e)=> {
  let genres = $("#addMovieGenres").val().split(",");
  genres = genres.map(genre=>{
    return genre.trim().toLowerCase();
  });
  let title = $("#addMovieName").val();
  let rating = $("#addMovieRating").val();
  let poster = $("#addMoviePoster").val();

  if (rating > 5) rating = 5;
  if (rating < 1) rating = 1;
  if(title && genres && rating){
    let data={
      title,
      rating,
      genres,
      poster
    };

    let tdata = data

    tdata.id = parseInt(moviesData.slice(-1)[0].id)+1
    moviesData.push(tdata)

    processMovieData(moviesData);

    $.ajax({
      type: 'POST', 
      url: '/api/movies', 
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8"
    }).then().catch();
  }
  e.preventDefault();
});

getMovies().then(processMovieData).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.');
  console.log(error);
});

