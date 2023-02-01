const JWT = require('jsonwebtoken')
const AuthorModel = require("../models/authorModel")

//======================================================CreateAuthor==========================================================//
//### Author APIs /authors


const createAuthor = async function (req, res) {
    try {
        // taking document from body (using destructuring)

        let author = req.body;
        let { fname, lname, title, email, password, ...rest } = req.body;

        // as empty object gives truthy value , so we declarin if there is no keys return nothing found

        if (Object.keys(author) == 0) return res.status(404).send({ status: false, msg: "nothing found from body" });

        // checking all the required fields are present or not(sending error msg according to that)
        if (!fname) return res.status(400).send({ status: false, msg: "First name is required" });
        if (!lname) return res.status(400).send({ status: false, msg: "Last name is required" });
        if (!title) return res.status(400).send({ status: false, msg: "Title is required" });
        if (!email) return res.status(400).send({ status: false, msg: "Email is required" });
        if (!password) return res.status(400).send({ status: false, msg: "Password is required" });


        // validating fields with REGEX formats
        const validateFName = (/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(fname));
        const validateLName = (/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i.test(lname));
        const validateEmail = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
        const validatePassword = (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password))


        if (!validateFName) return res.status(400).send({ status: false, msg: "First Name is invalid, Please check your First Name" });
        if (!validateLName) return res.status(400).send({ status: false, msg: "Last Name is invalid, Please check your Last Name" });
        if (!validateEmail) return res.status(400).send({ status: false, msg: "Email is invalid, Please check your Email address" });
        if (!validatePassword) return res.status(400).send({ status: false, msg: "use a strong password with at least(8) => 1 lowercase & Uppercase & numeric & SpecialCharacter" });

        // creating new author
        let authorCreated = await AuthorModel.create(author);
        res.status(201).send({ status: true, data: authorCreated });
    } catch (err) {

        res.status(500).send({ status: "error", error: err.message });
    }
}

//=======================================================Login author==================================================//
// ### POST /login

const login = async function (req, res) {

    try {

        let credentials = req.body;

        // as empty object gives truthy value , so we declarin if there is no keys return nothing found
        if (Object.keys(credentials) == 0) return res.status(404).send({ status: false, msg: "nothing found from body" });


        // taking EmailId and Password from body and checking both are present
        let authorEmail = credentials.email
        let authorPassword = credentials.password

        if (!authorEmail && !authorPassword) return res.status(404).send({ status: false, msg: "please enter valid EmailId and Password" })
        if (!authorEmail) return res.status(404).send({ status: false, msg: "please enter EmailId" })
        if (!authorPassword) return res.status(404).send({ status: false, msg: "please enter Password" })

        // finding that particular user/author inside AuthorModel  
        let Author = await AuthorModel.findOne({ email: authorEmail, password: authorPassword })
        if (!Author) return res.status(404).send({ status: false, msg: "incorrect emailId or password" });

        // creating token
        let token = JWT.sign(
            {
                userId: Author._id.toString(),
                creationTime: Date.now(),
                type: 'blogging-site-project',
            },

            "-- plutonium-- project-blogging-site -- secret-token --"

        );
        // sending the token in response header
        res.setHeader("x-api-key", token);

        return res.status(201).send({ status: true, token: token })
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}


module.exports = { login, createAuthor }