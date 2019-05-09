
const $ = require('jquery');



class Template{
    constructor(name,htmlsource) {
        this.name = name;
        this.html=htmlsource;
        Template.templates[this.name] = this;
    }
    load () {
        this.loadCSS(`css/${this.name}.css`);
        return this.html;
    }
    unload (nextTemplate){
        this.unloadCSS();
        if(nextTemplate)
            return nextTemplate.load();
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
        head.appendChild(link);

        this.css = link
    }
    unloadCSS () {
        $(this.css).remove();
    }
}
Template.templates={};
module.exports={Template};



require('./loadingScreen.js');