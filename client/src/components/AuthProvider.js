import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import fetchData from "../utils/fetchData";

export default function AuthProvider ({children}){
    const [error, setError]= useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(()=>{
        // 토큰이 없는 상태 >> 로그인을 하지 않은 상태 >> 서버에 요청을 보내지 않는다
        if(!localStorage.getItem("token")){
            return setIsLoaded(true);   // user : null (기본값)
        }

        // 토큰이 있는 상태 >> 서버에 요청을 보낸다 (유저 찾기)
        fetchData(`${process.env.REACT_APP_SERVER}/user`)
        .then (data =>{         // data : 유저 데이터들 (object)
            setUser(data)       // 유저 state를 업데이트
        })
        .catch(error =>{
            // 에러 출력
            console.log(error)
            setError(error);
        })
        .finally(()=>setIsLoaded(true));    // return()이 출력된다

    },[])

    // 로그인
    function signIn(data, callback){   
        setUser(data.user);
        // 로컬스토리지에 토큰을 저장한다
        localStorage.setItem("token", data.token);
        // Login.js >> navigate("/") : Feed(main, home)로 이동한다
        callback()
    }

    // 로그아웃
    function signOut(){
        setUser(null);
        // 로컬스토리지에서 토큰을 삭제한다
        localStorage.removeItem("token");
    }

    const value = {user, setUser, signIn, signOut}

    if(error){
        return <p>failed to fetch a user</p>
    }
    if(!isLoaded){
        return <p>fetching a user...</p>
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}