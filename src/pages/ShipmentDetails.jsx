import { useParams } from "react-router"
import {useEffect , useState} from 'react';

function ShipmentDetails({auth , user}){

    const API_URL = import.meta.env.VITE_API_URL

    const [shipment , setShipment] = useState(null)

    const {shipmentId} = useParams();

    useEffect(()=>{
        fetch(`${API_URL}/api/shipper/shipments/${shipmentId}` , {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${auth}`
            }
        })
        .then(response => response.json())
        .then(result => setShipment(result.shipment))

    },[])    

    useEffect(()=>{
        fetch(`${API_URL}/api/shipper/shipments/af8fbf32-a980-45bd-abe4-4825054372ea` , {
           headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${auth}`
            } 
        })
        .then(response => response.json())
        .then(result => console.log(result.shipment))
    },[])

    return (
        <div style={{color: 'white'}}>
            {shipment?.shipment_number}
        </div>
    )
}

export default ShipmentDetails;