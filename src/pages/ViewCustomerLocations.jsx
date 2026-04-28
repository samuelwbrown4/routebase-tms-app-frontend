import CustomerLocationsTable from '../components/CustomerLocationsTable';
import backIcon from '../assets/arrow-square-left.svg'
import {useEffect , useState} from 'react';
import {Image} from '@mantine/core'
import {useNavigate} from 'react-router-dom'

function ViewCustomerLocations({auth , user}){

    const API_URL = import.meta.env.VITE_API_URL

    const [customerLocations , setCustomerLocations] = useState([])

    const navigate = useNavigate()

    useEffect(()=>{
        getAllCustomerLocations()
    },[])

    useEffect(()=>{
        console.log(customerLocations)
    },[customerLocations])

    async function getAllCustomerLocations(){
        try{
            let response = await fetch(`${API_URL}/api/shipper/customer-locations/${user.id}` , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${auth}`
                }
            });

            let result = await response.json();

            if(!result.customerLocations){
                return alert('Customer Locations could not be found')
            }

            setCustomerLocations(result.customerLocations)
        }catch(error){
            console.log(error)
        }
    }

    return (
         <div style={{display: 'flex' , flexDirection: 'column'}}>
            <div style={{display: 'flex'  , gap: '1.5rem'}}>
                <Image src={backIcon} h={35} w={35} style={{marginTop: '.5rem'}} id="back-btn" onClick={()=>navigate('/admin/customers')}/>
                <h1 className="header">Admin / Customers / View</h1>
            </div>
            <div>
                {customerLocations?.length > 0 && (<CustomerLocationsTable customerLocations={customerLocations}/>)}
            </div>
        </div>
    )
}

export default ViewCustomerLocations;