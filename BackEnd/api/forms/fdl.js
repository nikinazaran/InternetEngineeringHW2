var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const formFolder = './forms';
const fs = require('fs');

router.use(bodyParser.urlencoded({ extended: true }));

// var formDescList = {
//     "forms":
//         [
//             {
//                 "url": "/forms/form1",
//                 "name": "Form 1"
//             },
//             {
//                 "url": "/forms/form2",
//                 "name": "Form 2"
//             },
//             {
//                 "url": "/forms/form3",
//                 "name": "Form 3"
//             },
//             {
//                 "url": "/forms/form4",
//                 "name": "Form 4"
//             },
//             {
//                 "url": "/forms/form5",
//                 "name": "Form 5"
//             },
//             {
//                 "url": "/forms/form6",
//                 "name": "Form 6"
//             }
//         ]
// }

/* GET form descriptors list. */
router.get('/', function (req, res, next) {
    var formDescList = {
        "forms": [{ "url": "", "name": "" }]
    }
    formDescList.forms.pop();
    fs.readdirSync(formFolder).forEach(file => {
        console.log(file.toString().lastIndexOf('.'));
        let x = file.toString().lastIndexOf('.')
        if (file !== "fdl.js") {
            formDescList.forms.push(
                { url: ("/forms/" + file.slice(0, x)), name: file.slice(0, x) }
            );
        }
    });
    res.send(formDescList);
});

// router.get('/form1', function (req, res, next) {
//     res.send(form1);
// });

router.get('/:id', function (req, res) {
    res.send(require('./' + req.params.id));
});

router.post('/', express.json(), (req, res) => {
    console.log(req.body);

    res.send("Posted!");
});

module.exports = router;