import AdminPaper from "../components/AdminPaper";
import {Image} from '@mantine/core';
import usersIcon from '../assets/users-three.svg';
import customerIcon from '../assets/shopping-cart.svg'
import {useNavigate} from 'react-router-dom';

function ShipperAdmin() {

    const navigate = useNavigate()

    return (
        <div>
            <h1 className="header" style={{color: 'white'}}>Admin</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '12rem' }}>
                <AdminPaper nav={()=>navigate('/admin/users')} title={<Image style={{display: 'inline-block'}} src={usersIcon} h={50} w={'auto'}/>} text={'Users'} />
                <AdminPaper title={<Image style={{display: 'inline-block'}} src={customerIcon} h={50} w={'auto'} />} text={'Customers'} />
                <AdminPaper title={'title'} text={'text'} />
            </div>
        </div>

    )
}

export default ShipperAdmin;