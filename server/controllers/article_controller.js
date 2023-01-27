const { Follow, Article, Favorite } = require("../models/model");
const formidable = require("formidable");
const fs = require("fs");

// 게시물 등록
exports.create = async (req, res, next) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        try {
            const loginUser = req.user;

            if (err) {
                return next(err);
            }

            // key == images
            const images = files.images instanceof Array ? files.images : new Array(files.images);

            if (!images[0].originalFilename){
                const err = new Error("image must be specified");
                err.status = 400;
                return next(err);
              }
              
            const photos = images.map(photo => {
                const oldPath = photo.filepath;
                const ext = photo.originalFilename.split(".")[1]
                const newName = photo.newFilename + "." + ext;
                const newPath = `${__dirname}/../data/articles/${newName}`;
                fs.renameSync(oldPath, newPath);
                return newName;
            })

            const article = new Article({
                description : fields.description,
                title:fields.title,
                photos,
                user: loginUser._id
            })
            await article.save();

            res.json(article);

        } catch (error) {
            next(error)
        }
    })
}

exports.article_list = async (req, res, next)=>{
    try{

        const articles = await Article.find()
        .sort([["created","descending"]])     
        .populate("user")   
        .skip(req.query.skip)
        .limit(req.query.limit);

        res.json(articles);

    }catch(error){
        next(error)
    }
}

exports.article = async(req, res, next)=>{
    try{
        const loginUser = req.user;

        const id = req.params.id;
        const article = await Article
        .findById(id)
        .populate("user")
        .lean();

        console.log(article)
        if(!article){
            const err= new Error("Article not found");
            err.status = 404;
            return next(err);
        }
        
        const favorite = await Favorite
        .findOne({user: loginUser._id, article:article._id});
        article.isFavorite = !!favorite    

        res.json(article)

    }catch (error){
        console.log(error)
        next(error)
    }
}

//게시물 삭제
exports.delete = async (req, res, next)=>{
    try{

        const id = req.params.id;
        const article = await Article
        .findById(id);

        if(!article){
            const err = new Error("Article not Found")
            err.status = 404;
            return next(err);
        }

        await article.delete();

        res.end();     

    }catch(error){
        next(error)
    }
}

// 좋아요 표시
exports.favorite = async (req, res, next)=>{
    try{
        const loginUser = req.user;
        const id = req.params.id;

        const article = await Article.findById(id);

        const favorite = await Favorite
        .findOne({user: loginUser._id, article: article._id})

        if(favorite){
            const err = new Error("Already favorite article");
            err.status = 400;
            return next(err)
        }

        const newFavorite = new Favorite({
            user: loginUser._id,
            article: article._id
        })
        await newFavorite.save();

        article.favoriteCount++;
        await article.save();

        res.end();

    }catch (error){
        next(error)
    }
}

// 좋아요 취소
exports.unfavorite = async (req, res, next)=>{
    try{
        const loginUser = req.user;
        const id = req.params.id;

        const article = await Article.findById(id)

        const favorite = await Favorite
        .findOne(({user: loginUser._id, article: article._id}));

        if(!favorite){
            const err = new Error("No article to unfavorite");
            err.status=400;
            return next(err);
        }

        await favorite.delete();

        article.favoriteCount --;
        await article.save();

        res.end();

    }catch(error){
        next(error)
    }
}

// 피드 가져오기
exports.feed = async(req, res, next)=>{
    try{
        const loginUser = req.user;

        const follows = await Follow.find({follower:loginUser._id});
        const users = [...follows.map(follow => follow.following), loginUser._id];   
        const articles = await Article
        .find({ user : {$in: users}})         
        .sort([["created","descending"]])       
        .populate("user")
        .skip(req.query.skip)
        .limit(req.query.limit)
        .lean();

        for(let article of articles){
            const favorite = await Favorite
            .findOne({user: loginUser._id, article: article._id});

            article.isFavorite = !!favorite;
        }
        
        
        res.json(articles)
        
    }catch(error){
        next(error)
    }
}