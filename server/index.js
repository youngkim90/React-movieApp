const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/key');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {User} = require('./models/user');
const {auth} = require('./middleware/auth');
const app = express();
const port = 5000;

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then( () => console.log('MongoDB Connected'))
    .catch(err => console.log(err))

app.listen(port,() => console.log('example app listening on port 5000'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views');

app.post('/api/join', (req, res) => {
    const user = new User(req.body);
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err});
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/login',(req, res) => {
    //요청된 이메일이 DB에 있는지 찾음
    User.findOne({email:req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "해당 이메일에 해당되는 유저가 없습니다."
            });
        }
        //비밀번호가 같은지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch){
                return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."});
            } else {
                user.generateToken((err, user) => {
                    res.cookie("x_auth", user.token)
                        .status(200)
                        .json({loginSuccess: true, userId: user._id});
                })
            }
        });
    })
});

app.get('/api/auth', auth, (req, res) =>{
    console.log('auth');
    // auth 미들웨어를 통과해 왔다는 것은 Authentication이 true  라는 것.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false: true,
        isAuth: true,
        email: req.user.email,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
});

app.get('/api/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id},
        {token: ""}, (err, user) => {
        if(err) return res.json({success: false, err});
        return res.status(200).send({
            success: true
        })
    })
})