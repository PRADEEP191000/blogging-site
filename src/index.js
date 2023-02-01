const express= require('express');
const bodyParser = require('body-parser');
const route = require('./route.js');
const {default: mongoose} = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Project-1:6H3EsS0qOKLtWR0B@cluster0.hln3nud.mongodb.net/BloggingSite",{
    useNewUrlParser: true
})
.then(()=>console.log("mongoDB Connected"))
.catch(err => console.log(err));


app.use('/',route)

app.use((req,res,next)=>{
    const error = new Error('/Path not found /');
    return res.status(404).send({status: 'ERROR', error: error.message})
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log('Express app listenig on port' + -(process.env.PORT || 3000) )
});