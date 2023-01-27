import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom"
import AuthContext from "./AuthContext"
import fetchData from "../utils/fetchData";

export default function Profile() {
    const { username } = useParams();

    return (
        <>
            <Details username={username} />
            <Timeline username={username} />
        </>
    )
};

function Details({ username }) {
    const [profile, setProfile] = useState(null);
    const auth = useContext(AuthContext);
    const isMaster = auth.user.username === username;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    console.log(profile)

    useEffect(() => {
        setIsLoaded(false);

        fetchData(`${process.env.REACT_APP_SERVER}/profiles/${username}`)
            .then(data => {
                // profile 업데이트
                setProfile(data);
            })
            .catch(error => {
                setError(error)
            })
            .finally(() => setIsLoaded(true))

    }, [username])

    function follow() { 
        fetch(`${process.env.REACT_APP_SERVER}/profiles/${profile.username}/follow`,{
            method:"POST",
            headers:{"Authorization":`Bearer ${localStorage.getItem("token")}`}
        })
        .then(res=>{
            if(!res.ok){
                throw res;
            }

            const editedProfile = {...profile, isFollowing:true}
            setProfile(editedProfile);
        })
        .catch(error=>{
            alert("Something's broken")
        })
    };

    function unfollow() {
        fetch(`${process.env.REACT_APP_SERVER}/profiles/${profile.username}/follow`,{
            method:"DELETE",
            headers:{"Authorization":`Bearer ${localStorage.getItem("token")}`}
        })
        .then(res=>{
            if(!res.ok){
                throw res;
            }

            const editedProfile = {...profile, isFollowing:false}
            setProfile(editedProfile)
        })
        .catch(error=>{
            alert("Something's broken")
        })
     };

    //  error와 isLoaded가 해결되지 않으면 돔이 리턴되지 않는다.
    // 프로필 데이터가 완전히 가져와져야 돔을 리턴하는 부분도 error가 나지 않는다.
    // return 부분에 profile.username 등 >> profile의 초기 state는 null이기 때문에 에러처리를 먼저하지 않으면 돔을 리턴하고 에러가 난다.
    //  null인경우 return하면 안된다 >> null 오브젝트에 접근하면 안된다
    if (error) {
        return <p>failed to fetch profile</p>
    }
    if (!isLoaded) {
        return <p>fetching profile ...</p>
    }

    return (
        <>
            <div className="mb-4 px-2">
                {/* 프로필 정보, 정보수정/로그아웃 버튼 */}
                <div className="flex items-center flex-col">
                    <img
                        src={`${process.env.REACT_APP_SERVER}/data/users/${profile.image || "avatar.jpeg"}`}
                        className="w-36 h-36 object-cover rounded-full"
                    />
                    <h3 className="font-bold">{profile.username}</h3>
                    <p>{profile.bio}</p>

                    {isMaster && (
                        <div className="">
                            <Link to="/accounts/edit" className="">
                                Edit profile
                            </Link>{" "}
                            <button className="text-xs text-red-500" onClick={auth.signOut}>Logout</button>
                        </div>
                    )}
                </div>

                {/* 팔로우 버튼 */}
                {!isMaster && (
                    <button
                        className={"mt-2 border p-1 w-full " + (profile.isFollowing ? "border-black before:content-['Following']" : "border-blue-500 text-blue-500 before:content-['Follow']")}
                        onClick={profile.isFollowing ? unfollow : follow}></button>
                )}


                {/* 팔로워, 팔로잉, 게시물 개수 */}
                <div className="mb-4">
                    <ul className="flex border-y">
                        <li className="flex flex-col items-center w-1/3">
                            <div>Follower</div>
                            <Link to={`/profile/${username}/followers`}>
                                {profile.followersCount}
                            </Link>
                        </li>
                        <li className="flex flex-col items-center w-1/3">
                            <div>Following</div>
                            <Link to={`/profile/${username}/following`}>
                                {profile.followingCount}
                            </Link>
                        </li>
                        <li className="flex flex-col items-center w-1/3">
                            <div>Articles</div>
                            <div>
                                {profile.articlesCount}
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </>
    )

}

function Timeline({ username }) {
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(()=>{
        setIsLoaded(false);

        fetchData(`${process.env.REACT_APP_SERVER}/profiles/${username}/articles`)
        .then(data=>{
            setArticles(data)
        })
        .catch(error=>{
            setError(error)
        })
        .finally(()=> setIsLoaded(true))

    }, [username])

    // useEffect보다 먼저 실행된다.
    // 빈 array를 순회해도 error는 발생하지 않는다
    const articleList = articles.map(article=>(
        <li key={article._id} className="h-40">
            <Link key={article._id} to={`/article/${article._id}`}>
                <img
                src={`${process.env.REACT_APP_SERVER}/data/articles/${article.photos[0]}`}            
                className="w-full h-full object-cover"
                />
            </Link>
        </li>
    ))

    return(
        <>
        <ul className="grid grid-cols-3 gap-1 mb-2">
            {articleList}
        </ul>

        {/* 돔을 우선 리턴한다 >> 더보기 버튼을 만들 수 있다. */}
        {/* 주로 list 형태일 때 사용한다*/}
        {!isLoaded && <p>fetching Timeline...</p>}
        {error && <p>failed to fetch timeline</p>}
        </>
    )
}