import {useState , useEffect} from 'react';

function Conversations({auth , user}){
    const API_URL = import.meta.env.VITE_API_URL

    const [conversations , setConversations] = useState([])

    useEffect(()=>{
        fetchConversations();
    },[])

    useEffect(()=>{
        console.log(conversations);
    },[conversations])

    async function fetchConversations(){
        try{
            let response = await fetch(`${API_URL}/api/shared/conversations` , {
                headers: {
                    'Content-Type' : 'appliction/json',
                    'Authorization' : `Bearer ${auth}`
                }
            });

            let result = await response.json();

            setConversations(result.conversations)
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div style={{color: 'white'}}>
            <h1 id='header'>Conversations</h1>
            {conversations?.length <= 0 ? 'No conversations yet.' : 
            <div>
                conversations here
            </div>}
        </div>
    )
}

export default Conversations;