import AdminPaper from "../components/AdminPaper";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Modal, Input, Button , Image } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import CarriersTable from "../components/CarriersTable";
import refreshToken from '../utils/refresh';
import plusIcon from '../assets/plus.svg';
import '../styles/adminCarriers.css';

function AdminCarriers({ auth, user, setAuth }) {

    const API_URL = import.meta.env.VITE_API_URL

    const [carriers, setCarriers] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [openNew , setOpenNew] = useState(false)
    const [selectedCarrier, setSelectedCarrier] = useState(null)

    const [editCarrierName, setEditCarrierName] = useState('');
    const [editCarrierScac, setEditCarrierScac] = useState('');
    const [editCarrierAddress, setEditCarrierAddress] = useState('');

    const [newCarrierName, setNewCarrierName] = useState('');
    const [newCarrierScac, setNewCarrierScac] = useState('');
    const [newCarrierAddress, setNewCarrierAddress] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        getAllCarriers()
    }, [])

    useEffect(() => {
        console.log(carriers)
    }, [carriers])

    async function getAllCarriers() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/carriers`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/carriers`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            let result = await response.json();

            if (!result.carriers) {
                return alert('Carriers could not be found')
            }

            setCarriers(result.carriers)
        } catch (error) {
            console.log(error)
        }
    }

    async function addNewCarrier() {
        try {
            const payload = {
                name: newCarrierName,
                scac: newCarrierScac,
                address: newCarrierAddress
            }
            let response = await fetch(`${API_URL}/api/shipper/carriers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({ payload })
            });

            if (response.status === 401) {
                let newToken = refreshToken(setAuth, navigate)
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/carriers`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth}`
                        },
                        body: JSON.stringify({ payload })
                    });
                }
            };

            let result = await response.json();

            if(result.newCarrier){
                getAllCarriers()
                return notifications.show({
                    title: 'Success!',
                    message: `${result.newCarrier.name} created successfully.`
                })
            }

            notifications.show({
                title: 'Error!',
                message: 'Could not create carrier.'
            })

        } catch (error) {
            console.log(error)
        }
    }

    async function editCarrier() {
        try {
            const payload = {
                name: editCarrierName,
                scac: editCarrierScac,
                address: editCarrierAddress
            }
            let response = await fetch(`${API_URL}/api/shipper/carriers/edit/${selectedCarrier.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({ payload })
            });

            if (response.status === 401) {
                let newToken = refreshToken(setAuth, navigate)
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/carriers/edit/${selectedCarrier.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${setToken}`
                        },
                        body: JSON.stringify({ payload })
                    });
                }
            };

            let result = await response.json();

            if (result.editedCarrier) {
                setOpenEdit(false);
                getAllCarriers()
                return notifications.show({
                    title: 'Success',
                    message: `${result.editedCarrier.name} edited successfully.`
                })
            }

            notifications.show({
                title: 'Error!',
                message: 'Could not edit carrier details.'
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' , alignItems: 'center' }}>
            <Modal opened={openEdit} onClose={() => setOpenEdit(false)} title={`Edit Details For ${selectedCarrier?.name}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Input placeholder='Name' value={editCarrierName} onChange={(e) => setEditCarrierName(e.target.value)} />
                        <Input placeholder='SCAC' value={editCarrierScac} onChange={(e) => setEditCarrierScac(e.target.value)} />
                        <Input placeholder='Address' value={editCarrierAddress} onChange={(e) => setEditCarrierAddress(e.target.value)} />
                    </div>
                    {(editCarrierName.length > 0 || editCarrierScac.length > 0 || editCarrierAddress.length > 0) && <Button onClick={()=>editCarrier()}>Submit</Button>}
                </div>
            </Modal>
            <Modal opened={openNew} onClose={() => setOpenNew(false)} title={`Add New Carrier`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Input placeholder='Name' value={newCarrierName} onChange={(e) => setNewCarrierName(e.target.value)} />
                        <Input placeholder='SCAC' value={newCarrierScac} onChange={(e) => setNewCarrierScac(e.target.value)} />
                        <Input placeholder='Address' value={newCarrierAddress} onChange={(e) => setNewCarrierAddress(e.target.value)} />
                    </div>
                    {(newCarrierName.length > 0 && newCarrierScac.length > 0 && newCarrierAddress.length > 0) && <Button onClick={()=>addNewCarrier()}>Submit</Button>}
                </div>
            </Modal>
            <div style={{display: 'flex' , justifyContent: 'space-between' , alignItems: 'center' , width: '90%'}}>
                <h1 style={{ color: 'white' }}>Carriers</h1>
                <Button id='add-carrier-btn'><Image src={plusIcon} h={24} w={'auto'}/><span style={{marginLeft: '.5rem'}}>Add Carrier</span></Button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <CarriersTable carriers={carriers} setOpenEdit={setOpenEdit} openEdit={openEdit} setSelectedCarrier={setSelectedCarrier} />
            </div>
        </div>

    )
}

export default AdminCarriers;