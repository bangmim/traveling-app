const { User } = require("../models/model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");
const fs = require("fs");


// 로그인
exports.login = async(req, res, next)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            const err = new Error("User not found");
            err.status = 401;
            return next(err);
        }

        // 클라이언트로부터 전달받은 비밀번호를 
        // 유저의 salt로 암호화한다.
        const hashedPassword = crypto
        .pbkdf2Sync(password, user.salt, 310000, 32, "sha256")
        .toString("hex")

        if(user.password !== hashedPassword){
            const err = new Error("Password not match");
            err.status = 401;
            return next(err);
        }

        // # 토큰을 발급한다.
        // 토큰에 username을 저장한다.
        // Secret key를 가지고 토큰을 암호화한다.
        const token = jwt.sign({username : user.username}, process.env.SECRET);

        res.json({user, token})     

    } catch(error){
        console.log(error)
        next(error)
    }
}

// 회원가입 로직
exports.register = [

    // callback 1 : 유저 데이터 유효성 검사
    async (req, res, next) => {
        //클라이언트의 데이터는 req.body에 담긴다
        const { username, email, password } = req.body;

        // validate username (유저 네임 중복 검사)
        {
            // 데이터베이스에 쿼리(query)를 전송한다.
            const user = await User.findOne({ username })

            // # custom error
            if(user){
                const err = new Error("이미 가입된 유저입니다");
                err.status=400;
                return next(err);
            }

        }
        // validate email (유저 이메일 중복 검사)
        {
            const user = await User.findOne({email});

            if(user){
                const err = new Error("이미 가입된 이메일 입니다.");
                err.status= 400;
                return next(err);
            }
        }

        // 다음 callback으로 이동한다.
        next();
    },

    // callback 2 : 유저 데이터 저장
    async (req, res, next) => {
        try{
            const {username, email, password} = req.body;

            // # 비밀번호를 암호화 
            // salt : 
            // - 유저 데이터와 함께 저장되는 유니크한 값이다
            // - 비밀번호 암호화와 복호화에 사용된다.
            const salt = crypto.randomBytes(16).toString("hex");

            // 암호화된 비밀번호 (salt 이용)
            const hashedPassword = crypto
            .pbkdf2Sync(password, salt, 310000, 32, "sha256")
            .toString("hex")

            // # 유저 데이터를 DB에 저장한다
            const user= new User({
                username,
                email,
                password:hashedPassword,
                salt    //: salt생략 가능 (key와 name 일치)
            })
            await user.save();

            // 클라이언트에게 user 데이터를 전송한다
            res.json(user)

        }catch(error){
            console.log(error)
            next(error)
        }
    },
]

exports.edit = async(req,res,next)=>{
    try{
        // req.user 를 loginUser 변수에 담는다
        const loginUser= req.user;
        // req.body로부터 유저의 자기소개(bio)를 얻는다
        const bio = req.body.bio;

        // 업데이트 쿼리
        const user= await User.findById(loginUser._id); // ._id(고유 id)를 통해 유저 찾기
        user.bio= bio;  // 유저의 bio 업데이트
        await user.save();  // 저장

        res.json(user.bio);
    }catch(error){
        next(error)
    }
}

exports.upload_image = async(req, res, next)=>{
    // formidable : 파일이 있는 form을 다룰 때 사용되는 모듈(패키지)
    const form = formidable({});

    form.parse(req, async (err, fields, files)=>{
        try {
            if (err){
                return next(err);
            }

            const loginUser= req.user;

            // 이미지에 랜덤 이름을 생성한 뒤 data/users 경로에 저장한다
            const image = files.image;
            const oldPath = image.filepath;
            const ext = image.originalFilename.split(".")[1];
            const newName = image.newFilename + "." + ext;
            const newPath = `${__dirname}/../data/users/${newName}`;
            fs.renameSync(oldPath, newPath);
            // 또는
            // fs.copyFileSync(oldPath, newPath);

            // 데이터베이스에 이미지의 이름을 저장한다
            const user = await User.findById(loginUser._id);
            user.image = newName;
            await user.save();

            res.json(newName);
        }catch(error){
            next(error)
        }
    })
}

exports.delete_image= async (req, res, next) =>{
    try{
        const loginUser= req.user;

        // 유저 이미지 null로 업데이트
        const user = await User.findById(loginUser._id);

        user.image= null;
        await user.save();

        // 서버가 응답을 종료한다. (응답 코드 : 200ok)
        res.end();

    }catch(error){
        next(error)
    }
}