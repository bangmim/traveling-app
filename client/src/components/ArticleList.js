import { useEffect, useState, Suspense } from "react";
import { Link } from "react-router-dom";
import fetchData from "../utils/fetchData"

const limit = 9;

export default function ArticleList() {
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

console.log(articles)
    {/* 게시물 리스트 */ }
    {/*  */}
    return (
        <>
            {/* 게시물 리스트 */}

            <ul className="grid grid-cols-1  gap-4 mb-20 md:grid-cols-2 lg:grid-cols-3">
            {articles.map(article=>
            <li key={article._id} className="rounded-xl">
            <Link className="" to={`/article/${article._id}`}>
              <div className="h-96 ">
              <img
                src={`${process.env.REACT_APP_SERVER}/data/articles/${article.photos[0]}`}
                className="w-full h-full object-cover"
              />
              </div>
              <div className="mb-2 text-xs">
                <div className="">
                  <span className="font-bold">
                    {article.title}
                  </span>
                </div>
                <div className="">
                  {article.description}
                </div>
                <div className="">
                  <span className="font-bold">
                    &#8361;{article.price}
                  </span>{" "}/박
                </div>

              </div>
            </Link>
          </li>
           )}
</ul>

        

           {/* 더보기 버튼 */}
      <div className="flex justify-center my-2">
        <button className="p-3 px-5 rounded-full bg-gray-600 text-white font-bold " onClick={() => setSkip(skip + limit)} >더보기</button>
      </div>

            {/* 로딩 구현 (스피너) */}
            {!isLoaded && <p>fetching articles...</p>}
            {/* 에러 메시지 출력 */}
            {error && <p>failed to fetch articles</p>}

        </>
    )

};

function Island() {

}
function Best() {

}

