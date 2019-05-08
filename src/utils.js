
const $ = require('jquery');


const active=[];
const loadCSS = (cssFile)=>{
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

    active.push(link)
};

const unloadCSS = (cssFile)=> {
    let head = document.getElementsByTagName('HEAD')[0];

    let link = active.reduce((accumulator,current)=>{
        if(current.href===cssFile){
            accumulator=cssFile;
        }
        return accumulator;
    });

    $(link).remove();

    active.splice(active.indexOf(link),1);
};
const template = (templateName)=>{
    console.log(templateName);
    const curTemplate = require(`./${templateName}`);
    curTemplate.templateName = templateName;
    console.log(curTemplate);
    return curTemplate;
}

module.exports={active,template,loadCSS,unloadCSS};