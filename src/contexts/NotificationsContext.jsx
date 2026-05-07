import { createContext , useState } from "react";

const NotificationContext = createContext();

function NotificationProvider({children , auth , user}){
    const [notifications , setNotifications] = useState([]);
    const [convoNotifications , setConvoNotifications] = useState([])

    const API_URL = import.meta.env.VITE_API_URL

    async function fetchMessages(){
        if(!auth || !user)
        return;
        try{
            let response = await fetch(`${API_URL}/api/shared/conversations?status=false&sender=${user?.client === 'shipper' ? 'carrier' : 'shipper'}` , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${auth}`
                }
            });

            let result = await response.json();

            let totalUnread = 0

            for(let conversation of result.conversations){
                totalUnread += conversation.messages.length
            }

            setNotifications(totalUnread)
            setConvoNotifications(result.conversations)


        }catch(error){
            console.log(error)
        }
    }

    return(
        <NotificationContext.Provider value={{notifications , fetchMessages , convoNotifications}}>
            {children}
        </NotificationContext.Provider>
    )
}



export {NotificationProvider , NotificationContext};