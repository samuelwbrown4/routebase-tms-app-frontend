import AdminPaper from "../components/AdminPaper";
import {Image} from '@mantine/core';
import addUserIcon from '../assets/users-three.svg';

function ShipperAdmin() {
    return (
        <div>
            <h1 className="header">Admin</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '12rem' }}>
                <AdminPaper title={<Image style={{display: 'inline-block'}} src={addUserIcon} h={50} w={'auto'}/>} text={'Add User'} />
                <AdminPaper title={'title'} text={'text'} />
                <AdminPaper title={'title'} text={'text'} />
            </div>
        </div>

    )
}

export default ShipperAdmin;