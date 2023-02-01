const JWT = require('jsonwebtoken')
const AuthorModel = require('../models/authorModel')
const BlogModel = require('../models/blogModel')

//=============================================================authentication======================================//

// ### Authentication


const authenticateAuthor = async function(req, res, next) {
    try {
        // extracting the token from request's headers
        let token = req.headers['x-api-key']
        // checking if not token ..
        if (!token) return res.status(404).send({ status: false, msg: "token must be present" })

        // else verifying that token
        // verify takes two parameter
        // jwt.verify(<token from header>, "secret <used to create that token>")
        let validateToken = JWT.verify(token, "-- plutonium-- project-blogging-site -- secret-token --")

        // checking if not decodedToken .i.e. given token is not a valid token
        if (!validateToken) return res.status(404).send({ status: false, msg: "invalid token" })

        // setting validateToken in the response headers and passing the value of this function's data stored in decodedToken
        req.validateToken = validateToken

        next()
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}

//=============================================================authorisation=================================================//

// ### Authorisation

const authoriseAuthor = async (req, res, next) => {

    try {

        // extracting the userId from the validateToken's sent data( req.validateToken.AuthorId )
        let loggedInAuthor = req.validateToken.userId
        // taking the author from path params (who is requesting route)
        let requestingAuthor = req.params.authorId

        // checking with two id's that author who is requesting route and whose data in token are the same
        if (loggedInAuthor != requestingAuthor) return res.status(404).send({ status: false, msg: 'user is not authorised' })

        // taking blogId from params and checking that it's present
        let blogId = req.params.blogId

        // finding the blog with blogId inside BlogModel
        let validateBlogId = await BlogModel.findById(blogId)
        if (!validateBlogId) return res.status(404).send({ status: false, msg: "invalid blogId" });

        // sending values
        // userId found from token
        req.loggedInAuthor = loggedInAuthor
        // userId from params
        req.requestingAuthor = requestingAuthor
        // the blog found
        req.foundBlog = validateBlogId
        // id of the blog
        req.blogId = blogId

        next()

    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}

module.exports = { authenticateAuthor, authoriseAuthor }