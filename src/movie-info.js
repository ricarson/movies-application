const utils = require("./utils.js");

const $ = require('jquery');
const templateName = 'movie-info';
let ratingStars = `
    <div class="rate">
        <label title="1" class="star"></label>
        <label title="2" class="star"></label>
        <label title="3" class="star"></label>
        <label title="4" class="star"></label>
        <label title="5" class="star"></label>
    </div>
`

let template =`
<div class="row">
    {MOVIEDISPLAY}
    <div class="col-5 mx-auto px-0">
        <form id="editMovieForm" action="">
            <div class="row">
                <div class="col-3">
                    <label for="editMovieName">Title: </label>
                </div>
                <div class="col">
                    <input type="text" id="editMovieName" name="title" value="{TITLE}" required>
                </div>
            </div>
            
            <div class="row">
                <div class="col-3">
                    <label for="editMoviePoster">Poster URL: </label>
                </div>
                <div class="col">
                    <input type="text" id="editMoviePoster" name="poster" value="{POSTER}" required>
                </div>
            </div>
            
            <div class="row">
                <div class="col-3">
                    <label for="editMovieRating">Rating: </label>
                </div>
                <div class="col">
                    <input type="text" id="editMovieRating" name="rating" value="{RATING}" required>
                </div>
            </div>
            
            <div class="row">
                <div class="col-3">
                    <label for="editMovieGenres">Genres: </label>
                </div>
                <div class="col">
                    <input type="text" id="editMovieGenres" name="genres" value="{GENRES}" required>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-6">
                    <button style="overflow: visible !important; height: 0 !important; width: 0 !important; margin: 0 !important; border: 0 !important; padding: 0 !important; display: block !important;" type="submit" value="default action"/>

                    <button class="btn btn-danger" id="deleteMovieButton">DELETE</button>
                </div>
                <div class="col-6">
                    <button class="btn btn-dark" id="editMovieSubmit">Submit</button>
                </div>
            </div>
            <span id="movieID" hidden>{ID}</span>
        </form>
    </div>
    <div>
        <i id="closeEditMovie" class="far fa-times-circle fa-2x"></i>
    </div>
</div>
`

const onload = (data) => {
    let element=data[0];
    let moviesData=data[1];

    // console.log(element);
    // console.log(moviesData);

    element = $(element).closest(".movie");
    let id = $(element).find("span").text();
    // console.log(id);

    let tempMoviesData = moviesData.reduce((accumulator, curMovie) => {
        if (curMovie.id == id) {
            accumulator = curMovie;
        }
        return accumulator;
    }, 0);


    let buffer="";
    buffer += "<div class='col-2 movie'>";
    buffer += `<div class="row"><div class="col-12"><img src="${tempMoviesData.poster}"></img></div></div>`;
    buffer += `<div class="row"><div class="col-12"><strong>${tempMoviesData.title}</strong></div></div>`;

    let curRating = ratingStars.split('></label>');
    curRating[parseInt(tempMoviesData.rating) - 1] += ' checked';
    if(parseInt(tempMoviesData.rating) != parseFloat(tempMoviesData.rating)){
        curRating[parseInt(tempMoviesData.rating) - 1]+=" data-half"
    }
    curRating = curRating.join("></label>");
    buffer += `<div class="row rating"><div class="col-12">${curRating}</div></div>`;
    buffer += `<span hidden>${id}</span>`;
    buffer += "</div>";



    let newTemplate=template;
    if(tempMoviesData !==0){
        newTemplate = newTemplate.replace("{TITLE}",tempMoviesData.title)
            .replace("{POSTER}",tempMoviesData.poster)
            .replace("{RATING}",tempMoviesData.rating)
            .replace("{GENRES}",tempMoviesData.genres.join(", "))
            .replace("{ID}",id)
            .replace("{MOVIEDISPLAY}",buffer);
    }
    return newTemplate;
}

new utils.Template(templateName,template,onload);
module.exports=ratingStars;
