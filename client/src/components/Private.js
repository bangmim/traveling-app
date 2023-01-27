import { useEffect, useState, Suspense } from "react";
import { Link } from "react-router-dom";
import fetchData from "../utils/fetchData"
import ArticleTemplate from "./ArticleTemplate";

const limit = 9;

export default function Private() {
  const [articles, setArticles] = useState([]);
  const [skip, setSkip] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // 게시물 가져오기 요청
  useEffect(() => {
    setIsLoaded(false);
    setError(null);

    // 서버에 요청
    fetchData(`${process.env.REACT_APP_SERVER}/articles/?limit=${limit}&skip=${skip}`)
      .then(data => {
        setArticles([...articles, ...data])
      })
      .catch(error => {
        setError(error)
      })
      .finally(() => setIsLoaded(true))

  }, [skip])

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

  return (
    <div className="">
      {/* 게시물 리스트 */}
      <ul className="grid grid-cols-1  gap-4 mb-20 md:grid-cols-4">
        {articles.map(article => {
          if (article.subject === "private") {
            return (
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
          }
        })}
      </ul>

      {/* 더보기 버튼 */}
      <div className="flex justify-center my-2">
        <button className="p-3 px-5 rounded-full bg-gray-600 text-white font-bold " onClick={() => setSkip(skip + limit)} >더보기</button>
      </div>

      {/* 로딩 구현 (스피너) */}
      {!isLoaded && <p>fetching articles...</p>}
      {/* 에러 메시지 출력 */}
      {error && <p>failed to fetch articles</p>}

    </div>
  )

};
