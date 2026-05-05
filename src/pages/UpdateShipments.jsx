import { useState, useEffect } from 'react';
import { Table, Button, Drawer, Textarea, Select, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import calendarIcon from '../assets/calendar.svg';
import caretDownIcon from '../assets/caret-down.svg';

import '../styles/updateShipments.css';

function UpdateShipments({ auth, user }) {

    const API_URL = import.meta.env.VITE_API_URL;

    const [shipmentsList, setShipmentsList] = useState([])
    const [filteredShipments, setFilteredShipments] = useState([])
    const [selectedShipment, setSelectedShipment] = useState(null)
    const [opened, { open, close }] = useDisclosure(false);
    const [pickupDate, setPickupDate] = useState(undefined);
    const [deliveryDate, setDeliveryDate] = useState(undefined);
    const [pickInput, setPickInput] = useState(false);
    const [deliveryInput, setDeliveryInput] = useState(false);
    const [message , setMessage] = useState(null)


    useEffect(() => {
        fetchCarrierUndelivered();
    }, []);

    useEffect(() => {
        setFilteredShipments(shipmentsList)
    }, [shipmentsList]);

    async function fetchCarrierUndelivered() {
        try {
            const response = await fetch(`${API_URL}/api/carrier/shipments?status=planned,routed,in_transit`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            const result = await response.json();

            if (!result.shipments) {
                alert(`${result.err}`)
            }

            setShipmentsList(result.shipments)

        } catch (error) {
            console.log(error)
        }
    }

    //add update logic
    async function handleUpdateShipment() {
        try {
            if(message){
                handleSubmitMessage()
            }
            if (!pickupDate && !deliveryDate) {
                notifications.show({
                    title: 'No status update made',
                    message: 'Pickup date/Delivery date not provided'
                })
                return 
            }
            close();
            const response = await fetch(`${API_URL}/api/carrier/shipments/${selectedShipment.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({
                    date: pickupDate ? pickupDate : deliveryDate,
                    userId: user.id,
                    eventType: pickupDate ? 'picked_up' : 'delivered'
                })
            });

            let result = await response.json();

            if (result.error) {
                return alert(result.error)
            }

            notifications.show({
                title: 'Success!',
                message: pickupDate ? `Successfully saved pickup date of ${new Date(pickupDate).toLocaleDateString()}` : `Successfully saved delivery date of ${new Date(deliveryDate).toLocaleDateString()}`,
                position: 'top-center'
            })
            fetchCarrierUndelivered()

           


        } catch (error) {
            console.log(error)
        }
    }

    async function handleSubmitMessage(){
        try{
            let response = await fetch(`${API_URL}/api/shared/conversations?shipmentNumber=${selectedShipment.shipment_number}` , {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json' , 
                    'Authorization' : `Bearer ${auth}`
                },
                body: JSON.stringify({
                    text: message
                })
            });

            let result = await response.json();

            if(result.message){
                notifications.show({
                    title: 'Success!',
                    message: 'New message created',
                    position: 'top-center'
                });
                return;
            } else if(result.conversation){
                notifications.show({
                    title: 'Success!',
                    message: 'New conversation created, message sent',
                    position: 'top-center'
                });
                return;
            }

            //query to see if any conversations exist for shipment
            //if not, create new one and add message
            //if so, just add message
        }catch(error){
            console.log(error)
        }
    }

    function handleStatusFilter(value = '') {

        if (value === '') {
            return setFilteredShipments(shipmentsList)
        }

        setFilteredShipments(shipmentsList.filter(shipment => shipment.status.toLowerCase().includes(value)));
    }

    //add message logic
    return (
        <div>
            <Drawer styles={{ body: { backgroundColor: '#2c2c2c' }, content: { backgroundColor: '#2c2c2c', color: 'white' }, header: { backgroundColor: '#2c2c2c' } }} position='top' closeOnClickOutside='true' opened={opened} onClose={close} title={`Update Shipment: #${selectedShipment?.shipment_number} \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 CURRENT STATUS: ${selectedShipment?.status.toUpperCase().replaceAll('_', ' ')} \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ${selectedShipment?.origin} ➔ ${selectedShipment?.destination}`}>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '3rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '3rem' }}>
                        <span>Requested Pickup Date: {new Date(selectedShipment?.requested_pickup_date).toLocaleDateString()} {!selectedShipment?.actual_pickup_date ?
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <Button style={{ backgroundColor: "#f6bd02", color: 'black' }} onClick={() => setPickInput(true)}>Mark as picked up</Button>
                                {pickInput && <DateInput
                                    rightSection={<Image src={calendarIcon} />}
                                    value={pickupDate}
                                    onChange={setPickupDate}
                                    fullWidth='false'
                                    size='xs'
                                    w={200}
                                    popoverProps={{ width: 250, height: 250 }}
                                    styles={{
                                        calendarHeaderControl: {
                                            width: 40,
                                            height: 40,
                                        },
                                        calendarHeaderControlIcon: {
                                            width: 24,
                                            height: 24,
                                        },
                                        input: {
                                            backgroundColor: '#3d3d3d', borderColor: '#555', height: '100%'
                                        },
                                        wrapper: {
                                            height: '100%'
                                        }
                                    }}

                                />}

                            </div> :
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <span>Actual Pickup Date: {`${new Date(selectedShipment?.actual_pickup_date).toLocaleDateString()}`}</span>
                                <Button style={{ backgroundColor: "#f6bd02", color: 'black' }}>Edit</Button>
                            </div>}
                        </span>
                        {selectedShipment?.actual_pickup_date &&
                            <span>Requested Delivery Date: {new Date(selectedShipment?.requested_delivery_date).toLocaleDateString()} {!selectedShipment?.actual_delivery_date ?
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <Button style={{ backgroundColor: "#f6bd02", color: 'black' }} onClick={() => setDeliveryInput(!deliveryInput)}>{deliveryInput ? 'Hide' : 'Mark as delivered'}</Button>
                                    {deliveryInput && <DateInput
                                        rightSection={<Image src={calendarIcon} />}
                                        value={deliveryDate}
                                        onChange={setDeliveryDate}
                                        fullWidth='false'
                                        size='xs'
                                        w={200}
                                        popoverProps={{ width: 250, height: 250 }}
                                        styles={{
                                            calendarHeaderControl: {
                                                width: 40,
                                                height: 40,
                                            },
                                            calendarHeaderControlIcon: {
                                                width: 24,
                                                height: 24,
                                            },
                                            input: {
                                                backgroundColor: '#3d3d3d', borderColor: '#555', height: '100%'
                                            },
                                            wrapper: {
                                                height: '100%'
                                            }
                                        }}

                                    />}

                                </div> :
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <span>Actual delivery date: {`${selectedShipment?.actual_delivery_date}`}</span>
                                    <Button style={{ backgroundColor: "#f6bd02", color: 'black' }}>Edit</Button>
                                </div>
                            }
                            </span>}
                    </div>
                    <div>
                        <Textarea styles={{ input: { backgroundColor: '#3d3d3d', borderColor: '#555' , color: 'white' } }} label="Add comment" description="(optional)" value={message} onChange={(e)=>setMessage(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'right' }}>
                        <Button style={{ backgroundColor: "#f6bd02", color: 'black' }} onClick={() => handleUpdateShipment()}>Confirm</Button>
                    </div>

                </div>
            </Drawer>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: '1rem', marginRight: '1rem' }}>
                <h1 className='header'>Update Shipments</h1>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ display: 'block', color: 'white' }}><b>Status: </b></span>
                        <Select
                            rightSection={<Image h={20} w={'auto'} src={caretDownIcon} />}
                            styles={{ input: { backgroundColor: 'black', color: 'white', borderColor: "white" } }}
                            data={[{ label: 'All', value: '' }, { label: 'Planned', value: 'planned' }, { label: 'In transit', value: 'in_transit' }]}
                            defaultValue=''
                            onChange={(_value, option) => handleStatusFilter(_value)} />
                    </div>

                    <Button className={`update-button ${selectedShipment ? 'visible' : ''}`} variant="outline" color="white" onClick={() => open()}>Update</Button>
                </div>

            </div>

            <Table className='table'>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Td>Shipment #</Table.Td>
                        <Table.Td>Origin</Table.Td>
                        <Table.Td>Origin City</Table.Td>
                        <Table.Td>Origin State</Table.Td>
                        <Table.Td>Origin Zip</Table.Td>
                        <Table.Td>Destination</Table.Td>
                        <Table.Td>Destination City</Table.Td>
                        <Table.Td>Destination State</Table.Td>
                        <Table.Td>Destination Zip</Table.Td>
                        <Table.Td>Req. Pick</Table.Td>
                        <Table.Td>Req. Del</Table.Td>
                        <Table.Td>Status</Table.Td>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {filteredShipments?.map(shipment => (
                        <Table.Tr key={shipment.id} onClick={selectedShipment?.id === shipment.id ? () => setSelectedShipment(null) : () => setSelectedShipment(shipment)} className={`update-shipment-row  ${shipment.id === selectedShipment?.id ? 'selected-shipment-row' : ''}`}>
                            <Table.Td>{shipment.near_destination ? <span style={{ cursor: 'pointer', marginRight: '1rem' }} onClick={() => console.log('near destination click')}>❗</span> : ''}{shipment.shipment_number}</Table.Td>
                            <Table.Td>{shipment.origin}</Table.Td>
                            <Table.Td>{shipment.origin_city}</Table.Td>
                            <Table.Td>{shipment.origin_state}</Table.Td>
                            <Table.Td>{shipment.origin_zip}</Table.Td>
                            <Table.Td>{shipment.destination}</Table.Td>
                            <Table.Td>{shipment.destination_city}</Table.Td>
                            <Table.Td>{shipment.destination_state}</Table.Td>
                            <Table.Td>{shipment.destination_zip}</Table.Td>
                            <Table.Td>{new Date(shipment.requested_pickup_date).toLocaleDateString()}</Table.Td>
                            <Table.Td>{new Date(shipment.requested_delivery_date).toLocaleDateString()}</Table.Td>
                            <Table.Td>{shipment.status.toUpperCase().replaceAll('_', ' ')}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </div>

    )
}

export default UpdateShipments;