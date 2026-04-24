import AdminPaper from "../components/AdminPaper";
import {Image} from '@mantine/core';
import addUserIcon from '../assets/users-three.svg';
import {useNavigate} from 'react-router-dom';

function ShipperAdmin() {

    const navigate = useNavigate()

    return (
        <div>
            <h1 className="header">Admin</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '12rem' }}>
                <AdminPaper nav={()=>navigate('/admin/create-user')} title={<Image style={{display: 'inline-block'}} src={addUserIcon} h={50} w={'auto'}/>} text={'Add User'} />
                <AdminPaper title={'title'} text={'text'} />
                <AdminPaper title={'title'} text={'text'} />
            </div>
        </div>

    )
}

export default ShipperAdmin;