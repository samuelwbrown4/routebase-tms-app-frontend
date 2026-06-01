import AdminPaper from "../components/AdminPaper";
import {Image} from '@mantine/core';
import usersIcon from '../assets/users-three.svg';
import customerIcon from '../assets/shopping-cart.svg';
import truckIcon from '../assets/truck-trailer.svg'
import {useNavigate} from 'react-router-dom';

function ShipperAdmin() {

    const navigate = useNavigate()

    return (
        <div>
            <h1 className="header" style={{color: 'white'}}>Admin</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '12rem' }}>
                <AdminPaper nav={()=>navigate('/admin/users')} title={<Image style={{display: 'inline-block'}} src={usersIcon} h={50} w={'auto'}/>} text={'Users'} />
                <AdminPaper nav={()=>navigate('/admin/carriers')} title={<Image style={{display: 'inline-block'}} src={truckIcon} h={50} w={'auto'} />} text={'Carriers'} />
            </div>
        </div>

    )
}

export default ShipperAdmin;