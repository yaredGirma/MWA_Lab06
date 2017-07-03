var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/newsletter', function (req, res, next) {
    req.assert('email', "email is required.").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
        var Mydata = req.body;
        var Mytxt = "";
        for (var index in Mydata) {
            Mytxt += index + ": " + Mydata[index] + "\n";
        }
        Mytxt += "\n\n";
        fs.appendFile('newsletter.txt', Mytxt, function (err) {
            next(err);
        });
        res.redirect('/thankyou');
    }

    else {

        
        res.render("index",{errmessage :'Invalid input fields!',csrfTokens: req.csrfToken()});
    }
});

module.exports = router;