import { useState, useEffect, Suspense } from "react";
import ArticleTemplate from "./ArticleTemplate";
import fetchData from "../utils/fetchData"
import { Link } from "react-router-dom";

const limit=5;  // 한 번에 보이는 게시물의 양 (5개씩 화면에 출력 >> more버튼 클릭 >> 5개 추가 출력)

// ArticleTemplate를 활용하여 반복적으로 사용하게 된다
export default function Feed(){
    const[error, setError]= useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [articles, setArticles] = useState([]);
    const [skip, setSkip] = useState(0);

    useEffect(()=>{
        setIsLoaded(false);
        setError(null);

        fetchData(`${process.env.REACT_APP_SERVER}/feed/?limit=${limit}&skip=${skip}`)
        .then(data=>{
            // console.log(data)
            setArticles([...articles, ...data])
        })
        .catch(error=>{
            setError(error)
        })
        .finally(()=>setIsLoaded(true))

    },[skip])   

    function unfavorite(articleId){
        fetch(`${process.env.REACT_APP_SERVER}/articles/${articleId}/favorite`,{
            method: 'DELETE',
            headers:{'Authorization':`Bearer ${localStorage.getItem("token")}`}
        })
        .then(res=>{
            if(!res.ok){
                throw res;
            }

            const editedArticles = articles.map(article=>{
                if(articleId === article._id){
                    return {...article, isFavorite:false,
                    favoriteCount:article.favoriteCount -1};
                }
                return article;
            })

            setArticles(editedArticles)

        })
        .catch(error=>{
            alert("Something's broken")
        });
    };

    function favorite(articleId){
        fetch(`${process.env.REACT_APP_SERVER}/articles/${articleId}/favorite`,{
            method:"POST",
            headers:{"Authorization":`Bearer ${localStorage.getItem("token")}`}
        })
        .then(res=>{
            if(!res.ok){
                throw res;
            }

            const editedArticles = articles.map(article=>{
                if(articleId===article._id){
                    return {...article, isFavorite:true,
                    favoriteCount:article.favoriteCount+1};
                }
                return article;
            })
            setArticles(editedArticles);

        })
        .catch(error=>{
            alert("Something's broken");
        })
    }

    function deleteArticle(articleId){
        fetch(`${process.env.REACT_APP_SERVER}/articles/${articleId}`,{
            method:"DELETE",
            headers:{"Authorization":`Bearer ${localStorage.getItem("token")}`}
        })
        .then(res=>{
            if(!res.ok){
                throw res;
            }
            // article 업데이트
            const updatedArticles = articles.filter(article=> articleId !== article._id);
            setArticles(updatedArticles);
        })
        .catch(error=>{
            alert("Something's broken")
        })
    };

    console.log(articles)

    const articleList = articles.map(article => (
        <li key={article._id} className="mb-4">
          <ArticleTemplate
            article={article}
            favorite={favorite}
            unfavorite={unfavorite}
            deleteArticle={deleteArticle}
          />
        </li>
      ))

    console.log(articles)

    return(
        <>
        {/* 피드 목록 */}
      <ul className="grid grid-cols-1  gap-4 mb-20 md:grid-cols-2 ">
        {articles.map(article =>  (
              <li key={article._id} className="rounded-xl">
                  <Link className="" to={`/article/${article._id}`}>
                  <ArticleTemplate
                    article={article}
                    favorite={favorite}
                    unfavorite={unfavorite}
                    deleteArticle={deleteArticle}
                  />
                </Link>
              </li>
            )
          )}
      </ul>

        {/* 더보기 버튼 */}
      <div className="flex justify-center my-2">
        <button className="p-3 px-5 rounded-full bg-gray-600 text-white font-bold " onClick={() => setSkip(skip + limit)} >더보기</button>
      </div>

        {!isLoaded && <p>fetching feed ...</p>}
        {error && <p>failed to fetch feed</p>}

        </>
    )
};