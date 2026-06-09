import UsersTable from '../components/UsersTable';
import addUserIcon from '../assets/user-plus.svg';
import { useEffect, useState } from 'react';
import { Image, Modal, Input, Select , Button} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import refreshToken from '../utils/refresh';
import UserForm from '../components/UserForm';
import '../styles/adminUser.css';

function AdminUsers({ auth, user , setAuth }) {

    const API_URL = import.meta.env.VITE_API_URL

    const [userDetails, setUserDetails] = useState([])
    const [locationDetails, setLocationDetails] = useState([])
    const [selectedUser, setSelectedUser] = useState(null);


    const [openEdit, setOpenEdit] = useState(false);
    const [openAdd, setOpenAdd] = useState(false)

    const [editFirstName, setEditFirstName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editLocationId, setEditLocationId] = useState('');
    const [editLocationName , setEditLocationName] = useState('');
    const [editErpId , setEditErpId] = useState('')
    const [editRole, setEditRole] = useState('')

    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newLocationId, setNewLocationId] = useState('');
    const [newLocationName , setNewLocationName] = useState('');
    const [newErpId , setNewErpId] = useState('')
    const [newRole, setNewRole] = useState('user')

    const navigate = useNavigate()

    useEffect(() => {
        getAllUsers()
        getAdminDetails()
    }, [])

    useEffect(() => {
        console.log(userDetails)
    }, [userDetails])

    useEffect(() => {
        if(!openAdd) return
        let matchLoc = locationDetails.find(location => location.id === newLocationId);
        if (!matchLoc) {
            return
        }

        setNewLocationName(matchLoc.name)
        setNewErpId(matchLoc.erp_id)
    }, [newLocationId, locationDetails])

    useEffect(() => {
        if(!openEdit) return
        let matchLoc = locationDetails.find(location => location.id === newLocationId);
        if (!matchLoc) {
            return
        }

        setEditLocationName(matchLoc.name)
        setEditErpId(matchLoc.erp_id)
    }, [editLocationId, locationDetails])

    useEffect(() => {
        if (selectedUser === null) return
        setEditFirstName(selectedUser.first_name)
        setEditLastName(selectedUser.last_name)
        setEditEmail(selectedUser.email)
        setEditPhone(selectedUser.phone_number)
        setEditLocationId(selectedUser.location_id)
        setEditRole(selectedUser.role)
    }, [selectedUser])

    async function getAllUsers() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/users`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            let result = await response.json();

            if (!result.users) {
                return alert('Users could not be found')
            }

            setUserDetails(result.users)
        } catch (error) {
            console.log(error)
        }
    }

    async function getAdminDetails() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/locations`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/locations`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            let result = await response.json();

            if (!result.locations) {
                alert(result.error)
            }

            setLocationDetails(result.locations)
        } catch (error) {
            console.log(error)
        }
    }

    async function editUser() {
        
        try {
             let payload = {
                firstName: editFirstName,
                lastName: editLastName,
                locationId: editLocationId,
                email: editEmail,
                phone: editPhone,
                role: editRole,
                erpId: editErpId
            }
            let response = await fetch(`${API_URL}/api/shipper/shipper-users/${selectedUser?.user_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({payload})
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate)
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/shipper-users/${selectedUser?.user_id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth}`
                        },
                        body: JSON.stringify({payload})
                    });
                }
            };

            let result = await response.json();

            if (result.editedUser) {
                setOpenEdit(false);
                getAllUsers();
                return notifications.show({
                    title: 'Success!',
                    message: `Successfully edited user details for ${result.editedUser.name}`
                })
            }

            notifications.show({
                title: 'Error!',
                message: 'Could not edit user.'
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function newUser() {
        if (!newLocationId || !newErpId) {
            return alert('Must select a location for user!')
        }
        if (newFirstName === '' || newLastName === '' || newEmail === '' || newPhone === '') {
            return alert('Must fill in all fields!')
        }
        try {
            let payload = {
                firstName: newFirstName,
                lastName: newLastName,
                locationId: newLocationId,
                email: newEmail,
                phone: newPhone,
                role: newRole,
                erpId: newErpId
            }
            let response = await fetch(`${API_URL}/api/shipper/shipper-users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({
                    payload
                })
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/shipper-users`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({
                            payload
                        })
                    });
                }
            }

            let result = response.json();

            if(result.newUser){
                setOpenAdd(false);
                getAllUsers();
                return notifications.show({
                    title: 'Success!',
                    message: `Created new user ${result.newUser.first_name} ${result.newUser.last_name}`
                })
            }

            return notifications.show({
                title: 'Error!',
                message: 'Failed to create new user.'
            })


        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' , alignItems: 'center' }}>
            <Modal opened={openEdit} onClose={() => setOpenEdit(false)} title={<h4>{`Edit ${selectedUser?.first_name} ${selectedUser?.last_name}'s Details`}</h4>}>
                <UserForm
                    locationDetails={locationDetails}
                    locationId={editLocationId}
                    setLocationId={setEditLocationId}
                    firstName={editFirstName}
                    setFirstName={setEditFirstName}
                    lastName={editLastName}
                    setLastName={setEditLastName}
                    email={editEmail}
                    setEmail={setEditEmail}
                    phone={editPhone}
                    setPhone={setEditPhone}
                    role={editRole}
                    setRole={setEditRole}
                    handleUserFormSubmit={editUser}
                />
            </Modal>
            <Modal opened={openAdd} onClose={() => setOpenAdd(false)} title={<h4>Add User</h4>}>
                <UserForm
                    locationDetails={locationDetails}
                    locationId={newLocationId}
                    setLocationId={setNewLocationId}
                    firstName={newFirstName}
                    setFirstName={setNewFirstName}
                    lastName={newLastName}
                    setLastName={setNewLastName}
                    email={newEmail}
                    setEmail={setNewEmail}
                    phone={newPhone}
                    setPhone={setNewPhone}
                    role={newRole}
                    setRole={setNewRole}
                    handleUserFormSubmit={newUser}
                />
            </Modal>
            <div id='header-div' style={{width: '90%' , justifyContent: 'space-between' , color: 'white'}}>
                <h1>Manage Users</h1>
                <Button style={{backgroundColor: 'transparent'}} id='add-user-btn' onClick={()=>setOpenAdd(true)}><Image  src={addUserIcon} h={24} w={'auto'}/><span style={{marginLeft: '.5rem'}}>Add User</span></Button>
            </div>
            <div style={{display: 'flex' , justifyContent: 'center' , width: '90%'}}>
                {userDetails?.length > 0 && (<UsersTable userDetails={userDetails} setOpenEdit={setOpenEdit} setSelectedUser={setSelectedUser} />)}
            </div>
        </div>
    )
}

export default AdminUsers;