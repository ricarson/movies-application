const utils = require("./utils.js");
const templateName = 'movie-listings';

let template =`
    <div class="row">
        <div class="col">
            <form method="post" action="/api/movies">
                <div id="addMovieNameRow" class="row">
                    <input type="text" id="addMovieName" name="title">
                </div>
                <div id="addMovieRatingRow" class="row">
                    <input type="text" id="addMovieRating" name="rating">
                </div>
                <div id="addMovieGenresRow" class="row">
                    <input type="text" id="addMovieGenres" name="genres">
                </div>
                
                <div id="addMovieSubmitRow" class="row">
                    <button type="submit" class="btn btn-dark" id="addMovieSubmit">
                </div>
            </form>
        </div>
    </div>
`