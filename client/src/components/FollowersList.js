import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import fetchData from "../utils/fetchData"
import Avatar from "./Avatar";

export default function FollowersList() {
    const { username } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [follower, setFollowers] = useState([]);

    useEffect(() => {
        fetchData(`${process.env.REACT_APP_SERVER}/profiles/${username}/followers`)
            .then(data => {
                const followers = [...follower, ...data];
                setFollowers(followers);
            })
            .catch(error => {
                console.log(error)
                setError(error)
            })
            .finally(() => setIsLoaded(true))
    }, [])

    console.log(follower)

    const followerList = follower.map(data => (
        <li key={data._id}>
            <Avatar user={data.follower} />
        </li>
    ))

    return (
        <>
            <div className="">
                <h1 className="text-2xl mb-4">Followers</h1>

                <ul>
                    {followerList}
                </ul>

            </div>

            {!isLoaded && <p>fetching to follow data...</p>}
            {error && <p>failed to the fetching data</p>}
        </>
    )

};