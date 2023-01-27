import {useState} from "react";

export default function Modal({children}){
  // 모달 윈도우의 가시성을 결정하는 state
  const [active, setActive] = useState(false);
  // console.log(children)

return(
    <>
    <button onClick={()=>setActive(true)} className="p-2">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512" className="w-1">
        <path d="M64 360c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm0-160c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zM120 96c0 30.9-25.1 56-56 56S8 126.9 8 96S33.1 40 64 40s56 25.1 56 56z"/></svg>
    </button>

    {/* active가 true일 때 실행되는 window 부분 */}
    {active && (
        <div className="fixed z-10 inset-0 flex justify-center items-center bg-black/[0.2]">
            <ul className="bg-white w-48 rounded">
                {/* ArticleTemplate 에서 작성한 delete 버튼 */}
                {children}  
            <li>
                <button className="w-full p-1 text-red-400" onClick={()=>setActive(false)}>Close</button>
            </li>
            </ul>
        </div>
    )}

    </>
)
  
};