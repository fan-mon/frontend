import button from "bootstrap/js/src/button";
import axios from 'axios';

let ArtistPage = ({artistuuid})=>{
    const handleSubscriptionCheck = async ()=>{
        try{
            const response = await axios.get(`http://localhost:8080/chat/subscribe/${artistuuid}`)
            console.log(response.data);
        }catch (error){
            console.log(error);
        }
    }
    return(
        <button onClick={handleSubscriptionCheck}>Subscription Check!</button>
    )
}

export default ArtistPage;