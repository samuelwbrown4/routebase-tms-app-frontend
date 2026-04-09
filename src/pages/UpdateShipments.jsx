import { useState, useEffect } from 'react';
import { Table, Button, Drawer, Textarea, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';

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


    useEffect(() => {
        fetchCarrierUndelivered();
    }, []);

    useEffect(() => {
        setFilteredShipments(shipmentsList)
    }, [shipmentsList]);

    async function fetchCarrierUndelivered() {
        try {
            const response = await fetch(`${API_URL}/api/carrier-user/shipments/${user.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            const result = await response.json();

            if (!result.undeliveredShipments) {
                alert(`${result.err}`)
            }

            setShipmentsList(result.undeliveredShipments)

        } catch (error) {
            console.log(error)
        }
    }

    //add update logic
    async function handleUpdateShipment() {
        try {
            if (!pickupDate && !deliveryDate) {
                return alert('No changes made. Please select a date to update')
            }
            const response = await fetch(`${API_URL}/api/carrier-user/shipment-update/${selectedShipment.id}`, {
                method: 'POST',
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

            setSelectedShipment(null);

            return alert(result.message);


        } catch (error) {
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
            <Drawer position='top' closeOnClickOutside='true' opened={opened} onClose={close} title='Update Shipment'>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4>{`Shipment #: ${selectedShipment?.shipment_number}`}</h4>
                        <h4>{`Current Status: ${selectedShipment?.status.toUpperCase()}`}</h4>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <span>{selectedShipment?.origin} ➔ {selectedShipment?.destination}</span>

                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <span>Requested Pickup Date: {new Date(selectedShipment?.requested_pickup_date).toLocaleDateString()} {!selectedShipment?.actual_pickup_date ?
                            <div>
                                <Button onClick={() => setPickInput(true)}>Mark as picked up</Button>
                                {pickInput && <DateInput
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
                                    }}

                                />}

                            </div> :
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <span>Actual Pickup Date: {`${new Date(selectedShipment?.actual_pickup_date).toLocaleDateString()}`}</span>
                                <Button>Edit</Button>
                            </div>}
                        </span>
                        {selectedShipment?.actual_pickup_date &&
                            <span>Requested Delivery Date: {new Date(selectedShipment?.requested_delivery_date).toLocaleDateString()} {!selectedShipment?.actual_delivery_date ?
                                <div>
                                    <Button onClick={() => setDeliveryInput(true)}>Mark as delivered</Button>
                                    {deliveryInput && <DateInput
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
                                        }}

                                    />}

                                </div> :
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <span>Actual delivery date: {`${selectedShipment?.actual_delivery_date}`}</span>
                                    <Button>Edit</Button>
                                </div>
                            }
                            </span>}
                    </div>
                    <div>
                        <Textarea label="Add comment" description="(optional)" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'right' }}>
                        <Button onClick={() => handleUpdateShipment()}>Confirm</Button>
                    </div>

                </div>
            </Drawer>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: '1rem', marginRight: '1rem' }}>
                <h1 className='header'>Update Shipments</h1>
                <Select
                    label='Status'
                    data={[{ label: 'All', value: 'all' }, { label: 'Planned', value: 'planned' }, { label: 'In transit', value: 'in_transit' }]}
                    defaultValue='all'
                    onChange={(_value, option) => handleStatusFilter(_value)} />
                {selectedShipment && (<Button onClick={() => open()}>Update</Button>)}
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
                        <Table.Tr key={shipment.id} onClick={() => setSelectedShipment(shipment)}>
                            <Table.Td>{shipment.shipment_number}</Table.Td>
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
                            <Table.Td>{shipment.status.toUpperCase()}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </div>

    )
}

export default UpdateShipments;