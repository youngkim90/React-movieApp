const {User} = require('../models/user');

let auth = (req, res, next) => {
    //인증 처리
    // console.log(req);
    let token = req.cookies.x_auth;
    User.findByToken(token, (err, user) =>{
        if(err) throw err;
        if(!user){
            return res.json({isAuth:false, error:true})
        } else {
            req.token = token;
            req.user = user;
            next();
        }
    });
}

module.exports = {auth};