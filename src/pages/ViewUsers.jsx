import UsersTable from '../components/UsersTable';
import backIcon from '../assets/arrow-square-left.svg'
import {useEffect , useState} from 'react';
import {Image} from '@mantine/core'

function ViewUsers({auth , user}){

    const API_URL = import.meta.env.VITE_API_URL

    const [userDetails , setUserDetails] = useState([])

    useEffect(()=>{
        getAllUsers()
    },[])

    useEffect(()=>{
        console.log(userDetails)
    },[userDetails])

    async function getAllUsers(){
        try{
            let response = await fetch(`${API_URL}/api/shipper/users/${user.id}` , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${auth}`
                }
            });

            let result = await response.json();

            if(!result.users){
                return alert('Users could not be found')
            }

            setUserDetails(result.users)
        }catch(error){
            console.log(error)
        }
    }

    return (
         <div style={{display: 'flex' , flexDirection: 'column'}}>
            <div style={{display: 'flex'  , gap: '1.5rem'}}>
                <Image src={backIcon} h={35} w={35} style={{marginTop: '.5rem'}} id="back-btn" onClick={()=>navigate('/admin/users')}/>
                <h1 className="header">Admin / Users / View</h1>
            </div>
            <div>
                {userDetails?.length > 0 && (<UsersTable userDetails={userDetails}/>)}
            </div>
        </div>
    )
}

export default ViewUsers;