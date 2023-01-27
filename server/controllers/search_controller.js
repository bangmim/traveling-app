const { User } = require("../models/model");

exports.username = async (req, res, next)=>{
    try{
       
        const username = req.query.username;
        
        // patt : username으로 '시작'하는 패턴을 만든다
        const patt = new RegExp("^"+ username);

        // 쿼리
        const users = await User.find({    
            username : {$regex : patt}     
        });

        res.json(users);    

    }catch(error){
        next(error)
    }
}