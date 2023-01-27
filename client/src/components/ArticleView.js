import {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArticleTemplate from "./ArticleTemplate";
import fetchData from "../utils/fetchData";

export default function ArticleView(){
    const {articleId} = useParams();  // url로 전달된, 파라미터로 전달된 id를 변수에 담은 것
    const [error, setError] = useState(null);
    const [article, setArticle] = useState(null);
    const[isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate(); // 페이지 이동에 필요한 훅

    console.log(articleId)

    // 게시물 가져오기 요청
    useEffect(()=>{
        fetchData(`${process.env.REACT_APP_SERVER}/articles/${articleId}`)
        .then(data=>{
            setArticle(data);
        })
        .catch(error=>{
            console.log(error)
            setError(error)
        })
        .finally(()=>setIsLoaded(true))
    },[])

    // 좋아요
    function favorite(articleId){
        fetch(`${process.env.REACT_APP_SERVER}/articles/${articleId}/favorite`,{
            method: 'POST',
            headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}
        })
        .then(res =>{
            if(!res.ok){
                throw res;
            }
            const editedArticle = {...article, 
                isFavorite: true, 
                favoriteCount:article.favoriteCount +1};
                setArticle(editedArticle);
        })
        .catch(error=>{
            alert("Something's broken")
        })
    };

    // 좋아요 취소
    function unfavorite(articleId){
        fetch(`${process.env.REACT_APP_SERVER}/articles/${articleId}/favorite`,{
            method: 'DELETE',
            headers:{'Authorization': `Bearer ${localStorage.getItem("token")}`},
        })
        .then(res =>{
            if(!res.ok){
                throw res;
            }
            const editedArticle = {...article,
            isFavorite:false,
            favoriteCount : article.favoriteCount -1};
            setArticle(editedArticle);
        })
        .catch(error=>{
            alert("Something's broken")
        })
    };

    // 게시글 삭제
    function deleteArticle(articleId){
        fetch(`${process.env.REACT_APP_SERVER}/articles/${articleId}`,{
            method:'DELETE',
            headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}
        })
        .then(res=>{
            if(!res.ok){
                throw res;
            }
            // 게시물 삭제 후 피드로 이동
            navigate("/", {replace: true})
        })
        .catch(error=>{
            console.log(error)
            alert("Something's broken")
        })
    };

    if(error){
        return <p>failed to fetch article</p>
    }
    if(!isLoaded){
        return <p>fetching article ...</p>
    }

    return(    
        <>
        <ArticleTemplate
            article={article}
            favorite={favorite}
            unfavorite={unfavorite}
            deleteArticle={deleteArticle}
        />
        <hr className="my-4"></hr>
        <div className="mb-2">
        <span className="text-xl font-semibold">숙소 설명</span>
        </div>
        {article.explanation}
        </> 
    )

};