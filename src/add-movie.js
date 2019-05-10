const utils = require("./utils.js");
const templateName = 'add-movie';

let template =`
<div class="row">
    <div class="col-4 mx-auto px-0">
        <form id="addNewMovieForm" action="">
            <div class="row">
                <div class="col-3">
                    <label for="addMovieName">Title: </label>
                </div>
                <div class="col">
                    <input type="text" id="addMovieName" name="title" required>
                </div>
            </div>
            
            <div class="row">
                <div class="col-3">
                    <label for="addMoviePoster">Poster URL: </label>
                </div>
                <div class="col">
                    <input type="text" id="addMoviePoster" name="poster" required>
                </div>
            </div>
            
            <div class="row">
                <div class="col-3">
                    <label for="addMovieRating">Rating: </label>
                </div>
                <div class="col">
                    <input type="text" id="addMovieRating" name="rating" required>
                </div>
            </div>
            
            <div class="row">
                <div class="col-3">
                    <label for="addMovieGenres">Genres: </label>
                </div>
                <div class="col">
                    <input type="text" id="addMovieGenres" name="genres" required>
                </div>
            </div>
            <button type="submit" class="btn btn-dark" id="addMovieSubmit">Submit</button>
        </form>
    </div>
    <div>
        <i id="closeAddMovie" class="far fa-times-circle fa-2x"></i>
    </div>
</div>
`


new utils.Template(templateName,template);
