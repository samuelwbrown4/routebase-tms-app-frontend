import CreateUserForm from "../components/CreateUserForm";
import {Image} from '@mantine/core';
import backIcon from '../assets/arrow-square-left.svg'
import {useNavigate} from 'react-router-dom';
import {useEffect , useState} from 'react';

function CreateUser({user , auth}){

    const navigate = useNavigate()

    const API_URL = import.meta.env.VITE_API_URL;

    const [locationDetails , setLocationDetails] = useState([]);
    const [locationId , setLocationId] = useState(undefined);
    const [locationName , setLocationName] = useState(undefined);
    const [firstName , setFirstName] = useState('');
    const [lastName , setLastName] = useState('');
    const [email , setEmail] = useState('');
    const [phone , setPhone] = useState('');
    const [isAdmin , setIsAdmin] = useState('user')

    useEffect(()=>{
        getAdminDetails()
    },[])

    useEffect(()=>{
        console.log(locationDetails)
    },[locationDetails])

    useEffect(()=>{
        let matchLoc = locationDetails.find(location => location.id === locationId);
        if(!matchLoc){
            return
        }

        setLocationName(matchLoc.name)
    },[locationId , locationDetails])

    async function getAdminDetails(){
        try{
            let response = await fetch(`${API_URL}/api/shipper/locations/${user.id}` , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${auth}`
                }
            });

            let result = await response.json();

            if(!result.locations){
                alert(result.error)
            }

            setLocationDetails(result.locations)
        }catch(error){
            console.log(error)
        }
    }

    return (
        <div style={{display: 'flex' , flexDirection: 'column'}}>
            <div style={{display: 'flex'  , gap: '1.5rem'}}>
                <Image src={backIcon} h={35} w={35} style={{marginTop: '.5rem'}} id="back-btn" onClick={()=>navigate('/admin')}/>
                <h1 className="header">Create User</h1>
            </div>
            <div>
                <CreateUserForm locationDetails={locationDetails} locationId={locationId} setLocationId={setLocationId} locationName={locationName} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} email={email} setEmail={setEmail} phone={phone} setPhone={setPhone} isAdmin={isAdmin} setIsAdmin={setIsAdmin}/>
            </div>
        </div>
    )
}

export default CreateUser;