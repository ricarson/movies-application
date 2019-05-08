
const utils = require('./utils.js');
const templateName = "loadingScreen";

const template=`
<div id="loadingText" class="row">
    <div class="col">
    <h1>Loading...</h1>
</div>
</div>
`



const load= () => {
    utils.loadCSS(`css/${templateName}.css`);
    return template;
};
const unload= (nextTemplate) => {
    utils.unloadCSS(`css/${templateName}.css`);
    if(nextTemplate)
        return nextTemplate.load();
    else
        return'';

};
module.exports={load,unload};