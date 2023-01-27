const { User, Follow, Article } = require("../models/model");

// 프로필 정보
exports.profile = async (req, res, next)=>{
    try{
        const loginUser= req.user;
        const username = req.params.username;
        const user = await User.findOne({username});

        // 유저가 존재하지 않는 경우
        if(!user){
            const err= new Error("User not found");
            err.status =404;
            return next(err);
        }

        // 로그인 유저가 팔로우하는 유저인지 판단한다
        const follow = await Follow.findOne({follower: loginUser._id, following: user._id});
        
        // 프로필 유저의 정보
        const followingCount = await Follow.countDocuments({ follower: user._id});  // .countDocuments : 컬렉션 내의 data(Documents) 수(count)
        const followersCount = await Follow.countDocuments({following : user._id});
        const articlesCount = await Article.countDocuments({user: user._id});

        const profile = {
            username: user.username,
            bio: user.bio,
            image: user.image,
            isFollowing : !!follow,     // follow 데이터를 이용한 true||false
            followersCount,
            followingCount,
            articlesCount
        }

        res.json(profile);

    }catch(error){
        next(error)
    }
}

// 프로필 유저의 게시물
exports.timeline = async (req, res, next)=>{
    try{
        const username = req.params.username;
        const user = await User.findOne({username});

        // 프로필 유저가 존재하지 않는 경우
        if(!user){
            const err = new Error("User net found");
            err.status=404;
            return next(err);
        }

        // 쿼리
        const articles = await Article.find({user : user._id})      // find : array를 return(없으면 빈 array) // findOne || findById : 한 개를 찾기 때문에 object를 return (없으면 null)
        .sort([["created","descending"]])
        .populate("user")
        .skip(req.query.skip)
        .limit(req.query.limit);

        res.json(articles);

    }catch(error){
        next(error)
    }
}

// 팔로우
exports.follow = async (req, res, next)=>{
    try{
        const loginUser = req.user;
        const username = req.params.username;

        // 쿼리
        const user = await User.findOne({username});
        const follow = await Follow
        .findOne({follower : loginUser._id, following : user._id})

        // 로그인 유저가 팔로우 요청을 한 유저를 이미 파로잉 하고 있는 경우
        if(follow){
            const err = new Error ("Already follow");
            err.status = 400;
            return next(err)
        }

        // 새로운 팔로우 데이터를 생성한다
        const newFollow = new Follow({
            follower : loginUser._id,
            following: user._id
        })

        await newFollow.save();

        res.end();

    }catch(error){
        next(error)
    }
}

// 언팔로우
exports.unfollow = async (req, res, next)=>{
    try{
        const loginUser = req.user;
        const username = req.params.username;

        // 쿼리
        const user = await User.findOne({username});
        const follow = await Follow
        .findOne({follower: loginUser._id, following : user._id});

        // 로그인 유저가 언팔하려는 유저가 팔로잉 중인 유저가 아닐 때
        if(!follow){
            const err = new Error("Follow not found");
            err.status = 400;
            return next(err);
        }

        // 팔로우 데이터 삭제
        await follow.delete();

        res.end();

    }catch(error){
        next(error)
    }
}

// 팔로워 리스트
exports.follower_list = async(req, res, next)=>{
    try{
        const username = req.params.username;
        
        const user = await User.findOne({username});
        
        const follows = await Follow
        .find({following : user._id}, "follower")
        .populate("follower")

        res.json(follows)

    }catch(error){
        next(error)
    }
}

// 팔로잉 리스트
exports.following_list = async (req, res, next)=>{
    try{
        const username = req.params.username;       // router의 파라미터에 :username이 필요하다
        const user = await User.findOne({username});
        
        const follows = await Follow
        .find({follower: user._id}, "following")
        .populate("following")

        res.json(follows)

    }catch(error){
        next(error)
    }
}