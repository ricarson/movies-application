
const utils = require('./utils.js');

const templateName = "loadingScreen";
const template=`
<div id="loadingText" class="row">
    <div class="col">
    <h1>Loading...</h1>
</div>
</div>
`


new utils.Template(templateName,template);
