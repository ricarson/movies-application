const utils = require("./utils.js");

const $ = require('jquery');

const templateName = 'movie-listings';
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
    <div class="row curGenre">
        <div class="col-1">
            <h4>{GENRE}</h4>
        </div>
        <div class="col-2 ml-auto addMovie">
            <button type="button" class="btn btn-dark" id="addMovie"><i class="fas fa-plus"></i> Add Movie</button>
        </div>
    </div>
    <div id="movieListing" class="row">
        {INSERT HERE}
    </div>
`
const onload = (data) =>{

    let buffer = "";

    let nameFilter = $("#movieSearch input").val().toLowerCase();
    let tempMoviesData = data.reduce((accumulator, curMovie) => {
        if (curMovie.title.toLowerCase().indexOf(nameFilter) !== -1) {
            accumulator.push(curMovie);
        }
        return accumulator;
    }, []);
    tempMoviesData = tempMoviesData.sort(function(a, b) {
        let textA = a.title.toUpperCase();
        let textB = b.title.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    tempMoviesData.forEach(({title, rating,poster,genres, id}) => {
        if(genres.includes(utils.curGenre) || utils.curGenre ==="all") {
            buffer += "<div class='col-2 movie'>";
            buffer += `<div class="row"><div class="col-12"><img src="${poster}"></img></div></div>`;
            buffer += `<div class="row"><div class="col-12"><strong>${title}</strong></div></div>`;

            let curRating = ratingStars.split('></label>');
            curRating[parseInt(rating) - 1] += ' checked';
            curRating = curRating.join("></label>");
            buffer += `<div class="row rating"><div class="col-12">${curRating}</div></div>`;
            buffer += `<span hidden>${id}</span>`;
            buffer += "</div>";
            // console.log(`id#${id} - ${title} - rating: ${rating}`);
        }
    });
    let newTemplate = template.replace("{INSERT HERE}",buffer).replace("{GENRE}",utils.Capitalize(utils.curGenre));
    return newTemplate;
};



new utils.Template(templateName,template,onload);
