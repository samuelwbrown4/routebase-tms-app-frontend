import {useState , useEffect} from 'react';
import UndeliveredShipments from "../components/UndeliveredShipments";

function Dashboard({auth , user}){

    const API_URL = import.meta.env.VITE_API_URL;

    const [undeliveredShipments , setUndeliveredShipments] = useState([]);

    useEffect(()=>{
        getUndeliveredShipments()
    }, [])

    async function getUndeliveredShipments(){
        try{
            const response = await fetch(`${API_URL}/api/shipper-user/get-undelivered` , {
                headers: {
                    'Content-Type' : 'application/json' ,
                    'Authorization' : `Bearer ${auth}`
                }
            });

            const result = await response.json();
            console.log('result:', result)

            if(!result.countUndelivered.count){
                return alert('Error finding undelivered shipments')
            }

            setUndeliveredShipments(result.countUndelivered.count)
        }catch(error){
            console.log(error)
            alert(`Error: ${error}`)
        }
    }
    return (
        <div  id='dashboard' style={{display: 'flex' , flexDirection: 'column' , width: '100%' , height: '100%'}}>
            <div style={{display: 'flex' , color: 'white' , width: '100%' , height: '50%', flex: 1}}>
                <div><UndeliveredShipments undeliveredShipments={undeliveredShipments} user={user}/></div>
                <div>Q2</div>
            </div>
            <div style={{display: 'flex' , color: 'white' , height: '50%' , width: '100%' , flex: 1}}>
                <div>Q3</div>
                <div>Q4</div>
            </div>
        </div>
    )
}

export default Dashboard;