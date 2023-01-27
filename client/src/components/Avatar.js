import { Link } from "react-router-dom";

export default function Avatar({user}){
    return(
        <Link 
        to={`/profile/${user.username}`}
        className="inline-flex items-center"
        >
            <span className="ml-2">
                {user.username}
            </span>
        </Link>
    )
};