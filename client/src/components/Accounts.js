// 파일명과 컴포넌트의 이름을 일치시켜서 export를 만들어둔다
import {useState, useContext} from "react";
import AuthContext from "./AuthContext";

export default function Accounts(){
    const auth = useContext(AuthContext);
    const {user, setUser}= auth;       
    // user >> AuthProvider에서 value로 전달받은 parameter
    
    console.log(user)

    function uploadImage(e){
        const files = e.target.files;

        const formData = new FormData();
        formData.append("image", files[0]);

        fetch(`${process.env.REACT_APP_SERVER}/accounts/edit/image`,{
            method: "POST",
            headers:{"Authorization":`Bearer ${localStorage.getItem("token")}`},
            body: formData      // 데이터를 전송할 때에는 body를 이용한다
        })
        .then(res=>{
            if(!res.ok){
                throw res
            }
            return res.json();
        })
        .then(data=>{
            const editedUser={...user, imge:data};
            setUser(editedUser);
            alert("Image is uploaded!");
        })
        .catch(error=>{
            alert("Something1s broken")
        })
    }

    function deleteImage(){
        fetch(`${process.env.REACT_APP_SERVER}/accounts/edit/image`,{
            method:"DELETE",
            headers:{"Authorization":`Bearer ${localStorage.getItem("token")}`}
        })
        .then(res=>{
            if(!res.ok){
                throw res;
            }

            const editedUser={...user, image:null};
            setUser(editedUser);
        })
        .catch(error=>{
            alert("Something's broken")
        })

    }

    function editBio(bio, setBio){
        const formData= {bio};

        console.log(formData)

        fetch(`${process.env.REACT_APP_SERVER}/accounts/edit`,{
            method:"POST",
            headers:{"Authorization" : `Bearer ${localStorage.getItem("token")}`,
            "Content-Type" : "application/json"},
            body: JSON.stringify(formData)  // 서버에 bio를 전송한다
        })      // promise를 return 한다. (비동기 작업 >> 특징 : 가장 마지막에 실행된다)
        .then(res=>{
            if(!res.ok){
                throw res;
            }
            return res.json();  // promise를 return 한다. >> 이후에 .then이 사용되는 이유
        })
        .then(data=>{
            const editedUser = {...user, bio:data};

            setUser(editedUser)
            alert("account is updated")
            setBio("")      // 서버에 요청이 끝나고 bio State를 업데이트해야한다. >> Form 컴포넌트에서 setBio 하지 않는 이유이다.
        })
        .catch(error=>{
            alert("Something's broken")
            console.log(error)
        })
        
    }

    return(
        <div className="">
            <Image
            user={user}
            uploadImage={uploadImage}
            deleteImage={deleteImage}
            />
            <Form
            user={user}
            editBio={editBio}
            />
        </div>
    )
};

function Image({user, uploadImage, deleteImage}){
    return(
        <div className="mb-4">
            <img
            src={`${process.env.REACT_APP_SERVER}/data/users/${user.image || "avatar.jpeg"}`}
            className="w-24 h-24 object-cover rounded-full"
            accept="image/*"
            />
            {user.image ? (
                <button
                type="button"
                className="text-red-400"
                onClick={deleteImage}
                >
                    Delete image
                </button>
            ) : (
                <input
                type="file"
                onChange={uploadImage}
                />
            )}
        </div>
    )
}

function Form({user, editBio}){
    const[bio, setBio] = useState("");

    function handleSubmit(e){
        e.preventDefault();

        editBio(bio,setBio);
        // setBio("")   : 서버에 요청하기도 전에 업데이트가 되면 안된다.
    }

    return(
        <form onSubmit={handleSubmit}>
            <div className="mb-2">
                <label >Username</label>
                <input 
                type="text"
                className="w-full border px-2 py-1"
                value={user.username}
                disabled={true}
                />
            </div>
            <div className="mb-2">
                <label >Email</label>
                <input 
                type="text"
                className="w-full border px-2 py-1"
                value={user.email}
                disabled={true}
                />
            </div>
            <div className="mb-2">
                <label >Bio</label>
                <textarea
                rows="3"
                className="w-full border px-2 py-1"
                defaultValue={user.bio}
                onChange={(e)=>setBio(e.target.value)}
                />
            </div>
            <div>
                <button
                type="submit"
                className="border border-black px-2 disabled:opacity-[0.2]"
                disabled={!bio.trim()}>
                    Submit
                </button>
            </div>
        </form>
    )
}