const mammoth = require("mammoth");
mammoth.extractRawText({path: "Reference_images/PRD.docx"})
    .then(function(result){
        console.log(result.value);
    })
    .catch(console.error);
