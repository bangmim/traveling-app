// 서버에 데이터를 요청하는 함수
export default function fetchData(url){
    const promise = fetch(url, {
        // 브라우저 내의 저장장소( # LocalStorage_브라우저가 제공하는 저장소_개발자도구의 Application 탭에서 확인 가능하다)에서 자동으로 토큰을 발급받아 가져온다.
        headers : {'Authorization': `Bearer ${localStorage.getItem("token")}`}
    })
    .then(res=>{
        if(!res.ok){
            throw res;
        }
        return res.json()
    })

    return promise;
}