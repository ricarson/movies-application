
const $ = require('jquery');


let curGenre="all";

const Capitalize=(string)=>{
    let stringArray = string.split(" ");
    let newStrArray=[];
    stringArray.forEach(word=>{
        newStrArray.push(word.charAt(0).toUpperCase() + word.slice(1))
    });
    newStrArray = newStrArray.join(" ");
    // console.log(newStrArray);

    stringArray = newStrArray.split("-");
    newStrArray=[];
    stringArray.forEach(word=>{
        newStrArray.push(word.charAt(0).toUpperCase() + word.slice(1))
    });
    string = newStrArray.join("-");
    return string;
}

class Template{
    constructor(name,htmlsource,onload) {
        this.name = name;
        this.html=htmlsource;
        this.onload = onload;
        this.loaded=false;
        Template.templates[this.name] = this;
    }
    load (data) {
        this.loadCSS(`css/${this.name}.css`);
        this.loaded=true;
        if(this.onload){
            this.html=this.onload(data);
        }
        return this.html;
    }
    unload (nextTemplate,data) {
        if (nextTemplate !== this) {
            this.unloadCSS();
        }
        if(nextTemplate)
            return nextTemplate.load(data);
        else
            return'';
    }
    loadCSS(cssFile){
        // Get HTML head element
        let head = document.getElementsByTagName('HEAD')[0];

        // Create new link Element
        let link = document.createElement('link');

        // set the attributes for link element
        link.rel = 'stylesheet';

        link.type = 'text/css';

        link.href = cssFile;

        // Append link element to HTML head
        if(!this.loaded) {
            head.appendChild(link);
        }

        this.css = link
    }
    unloadCSS () {
        console.log(this.css);
        //$(this.css).remove();
        //this.loaded=false;
    }
}
Template.templates={};
module.exports={Template,curGenre,Capitalize};



require('./loadingScreen.js');
require('./movie-listings.js');
require('./add-movie.js');
require('./movie-info.js');