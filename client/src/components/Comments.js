import {useState, useEffect, useContext} from "react";
import {Link, useParams} from "react-router-dom";
import AuthContext from "./AuthContext"
import Modal from "./Modal";
import Avatar from "./Avatar";
import fetchData from "../utils/fetchData"

export default function Comments(){
    const {articleId} = useParams();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [comments, setComments] = useState([]);

    console.log(comments)


    // 서버에 요청 >> 댓글 목록 가져오기
    useEffect(()=>{
        fetchData(`${process.env.REACT_APP_SERVER}/articles/${articleId}/comments`)
        .then(data=>{
            setComments(data)
        })
        .catch(error=>{
            console.log(error)
            setError(error)
        })
        .finally(()=>setIsLoaded(true))
    },[])

    function createComment(text, setText){
        const formData = JSON.stringify({content : text});

        fetch(`${process.env.REACT_APP_SERVER}/articles/${articleId}/comments`,{
            method:"POST",
            headers:{
                "Authorization" : `Bearer ${localStorage.getItem("token")}`,
                "Content-Type" : "application/json",
            },
            body: formData
        })
        .then(res=>{
            if(!res.ok){
                throw res;
            }
            return res.json();
        })
        .then(newComment=>{
            // comments 업데이트
            const updatedComments = [newComment, ...comments]
            setComments(updatedComments)
            // comment 폼을 비운다
            setText("")
        })
        .catch(error=>{
            alert("Somehting's broken")
        })
    }

    function deleteComment(commentId){
        fetch(`${process.env.REACT_APP_SERVER}/comments/${commentId}`,{
            method:'DELETE',
            headers:{"Authorization":`Bearer ${localStorage.getItem("token")}`},
        })
        .then(res=>{
            if(!res.ok){
                throw res;
            }
            const updatedComments = comments.filter(comment => commentId !== comment._id)
            setComments(updatedComments)
        })
        .catch(error=>{
            console.log(error)
            alert("Something's broken")
        })
    }

    function unfavorite(commentId){
        fetch(`${process.env.REACT_APP_SERVER}/comments/${commentId}/favorite`,{
            method:"DELETE",
            headers:{"Authorization":`Bearer ${localStorage.getItem("token")}`}
        })
        .then(res=>{
            if(!res.ok){
                throw res;
            }

            const editedCommentList = comments.map(comment=>{
                if(commentId === comment._id){
                    return {...comment, isFavorite:false,
                    favoriteCount:comment.favoriteCount-1}
                }
                return comment;
            })
            setComments(editedCommentList);
        })
        .catch(error=>{
            alert("Something's broken")
        })
    }

    function favorite(commentId){
        fetch(`${process.env.REACT_APP_SERVER}/comments/${commentId}/favorite`,{
            method:"POST",
            headers:{'Authorization' : `Bearer ${localStorage.getItem("token")}`}
        })
        .then(res=>{
            if(!res.ok){
                throw res;
            }

            const editedCommentList = comments.map(comment=>{
                if(commentId === comment._id){
                    return {...comment, isFavorite:true,
                    favoriteCount:comment.favoriteCount+1}
                }
                return comment;
            })
            setComments(editedCommentList);
        })
        .catch(error=>{
            alert("Something's broken")
        })
    }

    const commentList = comments.map(comment=>(
        // Comment 컴포넌트
        <Comment
        key={comment._id}
        comment={comment}
        favorite={favorite}
        unfavorite={unfavorite}
        deleteComment={deleteComment}
        />
    ))

    return(
        // 3개의 component가 합성된다
        <div className="px-2">
            {/* 댓글 폼 >> Form 컴포넌트 */}
            <Form createComment={createComment}/>

            {/* 댓글 목록 */}
            <ul>
                {commentList}
            </ul>

            {!isLoaded && <p>fetching comments ...</p>}
            {error && <p>failed to fetch comments</p>}
        </div>
    )
};

function Form({createComment}){
    const [text, setText]= useState("");

    function handleSubmit(e){
        e.preventDefault();
        createComment(text, setText);
    }

    function handleChange(e){
        setText(e.target.value);
    }

    return(
        <form onSubmit={handleSubmit} className="mb-3">
            <textarea
            row="3"
            className="border w-full px-2 py-1"
            value={text}
            onChange={handleChange}
            />
            <button
            type="submit"
            className="px-2 border border-black disabled:opacity-[0.2]"
            disabled={!text.trim()}
            >Submit</button>
        </form>
    )
}

// comment는 하나의 댓글 객체
function Comment({comment, favorite, unfavorite, deleteComment}){
    const auth = useContext(AuthContext);
    const isMaster = auth.user.username === comment.user.username;
    const created = new Date(comment.created).toLocaleDateString();

    function toggleFavorite(){
        if(comment.isFavorite){
            unfavorite(comment._id)
        }else{
            favorite(comment._id)
        }
    }

    return(
        <li className="mb-4 border-b">
            <div className="flex justify-between items-center">
                {/* 아바타 */}
                <Avatar user={comment.user}/>

                {/* 모달 */}
                {isMaster && (
                    <Modal>
                        <li className="border-b">
                            <button
                            className="w-full p-1"
                            onClick={()=> deleteComment(comment._id)}
                            >Delete</button>
                        </li>
                    </Modal>
                )}
            </div>
            
            {/* 댓글 내용 */}
            <p className="mb-4">{comment.content}</p>

            {/* 좋아요 버튼 */}
            <div className="flex">
                <button onClick={toggleFavorite}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" 
                        className={"w-3 " + (comment.isFavorite ? "fill-red-500" : "fill-gray-200")}> 
                        <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                          </svg>
                </button>
                <div className="ml-1 text-xs">{comment.favoriteCount} likes</div>
            </div>

            <small className="font-xs text-gray-400">{created} </small>


        </li>
    )
}