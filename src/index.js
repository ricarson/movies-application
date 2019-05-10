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
const omdbAPIKEY = require('./keys.js');


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
  // console.log(utils.curGenre);
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
  // console.log(genreList);
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
  // console.log(buffer);
  $("#main").html(buffer);
});

$(document).on('click','#closeAddMovie',(e)=> {
  let buffer = templates["add-movie"].unload(templates["movie-listings"],moviesData);
  // console.log(buffer);
  $("#main").html(buffer);
});

$(document).on('click','#closeEditMovie',(e)=> {
  let buffer = templates["movie-info"].unload(templates["movie-listings"],moviesData);
  // console.log(buffer);
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
  // console.log(moviesData);

  processMovieData(moviesData);

  e.preventDefault();
});

$(document).on('input','#editMovieForm',(e)=>{
  // console.log("test");
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

$(document).on('click','#addMovieSearch',(e)=> {
  e.preventDefault();

  let searchTitle = $("#addMovieName").val();
  if(searchTitle !=="") {
    $.ajax({
      type: 'GET',
      url: `http://www.omdbapi.com/?apikey=${omdbAPIKEY}&t=${searchTitle}`,
    }).then(data => {
      // console.log(data);
      let title = data.Title;
      let poster = data.Poster;
      let rating = data.Ratings[0].Value;
      let genres = data.Genre;

      if (rating.indexOf("/") !== -1) {
        rating = rating.split("/");
        rating = (parseFloat(rating[0]) / parseFloat(rating[1])) * 5;
      } else if (rating.indexOf("%") !== -1) {
        rating = rating.replace("%","");
        rating = (rating / 100) * 5;
      }
      rating = rating.toFixed(1);

      $("#addMovieName").val(title);
      $("#addMoviePoster").val(poster);
      $("#addMovieRating").val(rating);
      $("#addMovieGenres").val(genres);


      let buffer="";
      buffer += `<div class="row"><div class="col-12"><img src="${poster}"></img></div></div>`;
      buffer += `<div class="row"><div class="col-12"><strong>${title}</strong></div></div>`;

      let curRating = ratingStars.split('></label>');
      curRating[parseInt(rating) - 1] += ' checked';
      curRating = curRating.join("></label>");
      buffer += `<div class="row rating"><div class="col-12">${curRating}</div></div>`;

      $(".movie").html(buffer);

    }).catch();
  }
});

$(document).on('click','#addMovieSubmit',(e)=> {
  let genres = $("#addMovieGenres").val().split(",");
  genres = genres.map(genre=>{
    return genre.trim().toLowerCase();
  });
  let title = $("#addMovieName").val();
  let rating = $("#addMovieRating").val();
  let poster = $("#addMoviePoster").val();

  let foundMovie = false;
  moviesData.forEach(movie=>{
    if(movie.title.indexOf(title) !== -1){
      console.log(movie.title);
      console.log(title);
      foundMovie = true;
      return;
    }
  });

  if(!foundMovie) {
    if (rating > 5) rating = 5;
    if (rating < 1) rating = 1;
    if (title && genres && rating) {
      let data = {
        title,
        rating,
        genres,
        poster
      };

      let tdata = data;

      tdata.id = parseInt(moviesData.slice(-1)[0].id) + 1;
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
  }
});

getMovies().then(processMovieData).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.');
  console.log(error);
});

// KOONAMI CODE
$(document).keyup(function(e){
  // console.log(e.keyCode);
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


function arraysEqual(arr1, arr2) {
  if(arr1.length !== arr2.length)
    return false;
  for(var i = arr1.length; i--;) {
    if(arr1[i] !== arr2[i])
      return false;
  }
  return true;
}
let cheatCodes = [{name:"Konami",fn:cheater,code:[38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13]}];

var keyArr=[];
$(document).keydown(function (e) {

  // Add to end of array
  keyArr.push(event.keyCode);
  // Don't let array get longer than 50 keyCodes
  if (keyArr.length>11){
    keyArr.shift();
  }
  // console.log(keyArr);

  // If the key combos match what's in our cheatCodes array, call the function specified
  cheatCodes.forEach(function(cheatOBJ){
    if (arraysEqual(keyArr.slice(-(cheatOBJ.code.length)),cheatOBJ.code)){
      cheatOBJ.fn();
    }
  })
});

function cheater() {
  let id = $("#movieID").text();

  let tempMoviesData = moviesData.reduce((accumulator, curMovie) => {
    if (curMovie.id == id) {
      accumulator = curMovie;
    }
    return accumulator;
  }, 0);
  console.log(tempMoviesData);
  if(tempMoviesData !== 0) {
    if (tempMoviesData.movie !== "" && tempMoviesData.movie !==undefined) {
      window.open(tempMoviesData.movie);
    }
  }else{
    window.open("https://getpopcorntime.is/");
  }
}
