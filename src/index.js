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
const ratingStars = require('./movie-info.js');
const templates = utils.Template.templates;
let moviesData;
let genreList=["all"];

console.log(utils.Template.templates);








$(document).on('keypress',(e)=>{
  // console.log($("#movieSearch input").val());
  if($("#movieListing").length) {
    $("#movieSearch input").focus();
  }
});

$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});

$(document).on('click','.movie',(e)=> {
  let buffer = templates["movie-listings"].unload(templates["movie-info"],[e.target,moviesData]);
  $("#main").html(buffer);
});




$(document).on('input','#movieSearch input',(e)=>{
  let buffer = templates["movie-listings"].unload(templates["movie-listings"],moviesData);
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

  let buffer = templates["movie-listings"].load(moviesData);
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

  genreList = genreList.slice(1).sort(function(a, b) {
    let textA = a.toUpperCase();
    let textB = b.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  genreList.unshift("All");

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

$(document).on('click','#closeEditMovie',(e)=> {
  let buffer = templates["movie-info"].unload(templates["movie-listings"],moviesData);
  console.log(buffer);
  $("#main").html(buffer);
});


$(document).on('click','#deleteMovieButton',(e)=> {

  let id = $("#movieID").text();

  $.ajax({
    type: 'DELETE',
    url: `/api/movies/${id}`,
    contentType: "application/json; charset=utf-8"
  }).then().catch();

  moviesData = moviesData.reduce((accumulator,movie)=>{
    if(movie.id!=id){
      accumulator.push(movie);
    }
    return accumulator;
  },[]);
  console.log(moviesData);

  processMovieData(moviesData);

  e.preventDefault();
});

$(document).on('input','#editMovieForm',(e)=>{
  console.log("test");
  let genres = $("#editMovieGenres").val().split(",");
  genres = genres.map(genre=>{
    return genre.trim().toLowerCase();
  });
  let title = $("#editMovieName").val();
  let rating = $("#editMovieRating").val();

  if (rating > 5) rating = 5;
  if (rating < 1) rating = 1;

  let poster = $("#editMoviePoster").val();
  let id = $("#movieID").text();

  let buffer="";
  buffer += `<div class="row"><div class="col-12"><img src="${poster}"></img></div></div>`;
  buffer += `<div class="row"><div class="col-12"><strong>${title}</strong></div></div>`;

  let curRating = ratingStars.split('></label>');
  curRating[parseInt(rating) - 1] += ' checked';
  curRating = curRating.join("></label>");
  buffer += `<div class="row rating"><div class="col-12">${curRating}</div></div>`;
  buffer += `<span hidden>${id}</span>`;

  $(".movie").html(buffer);
});

$(document).on('click','#editMovieSubmit',(e)=> {
  let genres = $("#editMovieGenres").val().split(",");
  genres = genres.map(genre=>{
    return genre.trim().toLowerCase();
  });
  let title = $("#editMovieName").val();
  let rating = $("#editMovieRating").val();
  let poster = $("#editMoviePoster").val();

  if (rating > 5) rating = 5;
  if (rating < 1) rating = 1;
  if(title && genres && rating){
    let id = $("#movieID").text();
    let data={
      title,
      rating,
      genres,
      poster,
      id
    };
    moviesData = moviesData.map(movie=>{
      if(movie.id==id){
        return data;
      }
      return movie;
    });
    processMovieData(moviesData);

    $.ajax({
      type: 'DELETE',
      url: `/api/movies/${id}`,
      contentType: "application/json; charset=utf-8"
    }).then().catch();

    $.ajax({
      type: 'POST',
      url: `/api/movies/`,
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8"
    }).then().catch();
  }
  e.preventDefault();
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

    let tdata = data;

    tdata.id = parseInt(moviesData.slice(-1)[0].id)+1;
    moviesData.push(tdata);

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

// KOONAMI CODE
$(document).keyup(function(e){
  console.log(e.keyCode);
});

const buttons = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  65: 'a',
  66: 'b',
  13: 'enter'
};

var konamiCheats = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a', 'enter'];

var konamiCodePosition = 0;


$(document).keydown(function (e) {
  var key = buttons[e.keyCode];
  var requiredKey = konamiCheats[konamiCodePosition];

  if (key === requiredKey) {
    konamiCodePosition++;


    if (konamiCodePosition === konamiCheats.length) {
      cheater();
      konamiCodePosition = 0;
    }
  }else {
    konamiCodePosition = 0;
  }

});

function cheater() {
  let id = $("#movieID").text();

  let tempMoviesData = moviesData.reduce((accumulator, curMovie) => {
    if (curMovie.id == id) {
      accumulator = curMovie;
    }
    return accumulator;
  }, 0);
  if(tempMoviesData.movie !=="") {
    window.open(tempMoviesData.movie);
  }
  // var body = $('body');
  // var colors = ['red', 'green', 'blue', 'yellow', 'pink', 'purple'];
  // var currentIndex = 0;
  // setInterval(function () {
  //   body.css({
  //     backgroundColor: colors[currentIndex]
  //   });
  //   if (!colors[currentIndex]) {
  //     currentIndex = 0;
  //   } else {
  //     currentIndex++;
  //   }
  // }, 100);
  // $("h1").css("font-size", "200px");
  // $("object").css("visibility", "visible");
}
