import AdminPaper from "../components/AdminPaper";
import {useNavigate} from 'react-router-dom';
import addLocationIcon from '../assets/map-pin-plus.svg';
import { Image } from "@mantine/core";
import viewEditIcon from '../assets/note-pencil.svg';
import backIcon from '../assets/arrow-square-left.svg';

function CustomerAdminOptions() {

    const navigate = useNavigate()

    return (
        <div>
            <div style={{display: 'flex'  , gap: '1.5rem'}}>
                            <Image src={backIcon} h={35} w={35} style={{marginTop: '.5rem'}} id="back-btn" onClick={()=>navigate('/admin')}/>
                            <h1 className="header">Admin / Customers</h1>
                        </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '12rem' }}>
                <AdminPaper title={<Image style={{display: 'inline-block'}} src={viewEditIcon} h={50} w={'auto'}/>} text={'View/Edit'}  nav={()=>navigate('/admin/customers/view')}/>
                <AdminPaper nav={()=>navigate('/admin/users/add-customer-location')} title={<Image style={{display: 'inline-block'}} src={addLocationIcon} h={50} w={'auto'}/>} text={'Add Customer Location'} />
                
            </div>
        </div>

    )
}

export default CustomerAdminOptions;