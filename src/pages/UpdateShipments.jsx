import { useState, useEffect } from 'react';
import { DataTable, useDataTableColumns } from 'mantine-datatable';
import { Table, Button, Drawer, Textarea, Select, Image } from '@mantine/core';
import { useNavigate } from 'react-router';
import { useDisclosure } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import ChatModal from '../components/ChatModal';
import calendarIcon from '../assets/calendar.svg';
import caretDownIcon from '../assets/caret-down.svg';
import refreshToken from '../utils/refresh';
import arrowRight from '../assets/arrow-circle-right.svg';
import eyeIcon from '../assets/eye.svg';
import paperclipIcon from '../assets/paperclip.svg';
import chatIcon from '../assets/chat.svg';

import '../styles/updateShipments.css';

function UpdateShipments({ auth, user, setAuth }) {
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_API_URL;

    const [shipmentsList, setShipmentsList] = useState([])
    const [filteredShipments, setFilteredShipments] = useState([])
    const [selectedShipment, setSelectedShipment] = useState(null)
    const [opened, { open, close }] = useDisclosure(false);
    const [pickupDate, setPickupDate] = useState(undefined);
    const [deliveryDate, setDeliveryDate] = useState(undefined);
    const [pickInput, setPickInput] = useState(false);
    const [deliveryInput, setDeliveryInput] = useState(false);
    const [message, setMessage] = useState(null)
    const [conversation , setConversation] = useState(null)

    const [visibleModal , setVisibleModal] = useState(false)

    const [sortStatus, setSortStatus] = useState({
        columnAccessor: 'requested_pickup_date',
        direction: 'asc'
    })


    useEffect(() => {
        fetchCarrierUndelivered();
    }, []);

    useEffect(() => {
        setFilteredShipments(shipmentsList)
    }, [shipmentsList]);

    const sortedShipments = [...filteredShipments].sort((a, b) => {
        const { columnAccessor, direction } = sortStatus;
        if (a[columnAccessor] < b[columnAccessor]) return direction === 'asc' ? -1 : 1;
        if (a[columnAccessor] > b[columnAccessor]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const key = 'shipments-table';
    const { effectiveColumns } = useDataTableColumns({
        key,
        columns: [
            {
                accessor: 'shipment_number',
                title: 'Shipment #',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true
            },

            {
                accessor: 'origin',
                title: 'Origin',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true,
                render: ({ direction_category, shipper_name, shipper_city, shipper_state, supplier_name, supplier_city, supplier_state }) => direction_category === 'outbound' ? `${shipper_name} - ${shipper_city}, ${shipper_state}` : `${supplier_name} - ${supplier_city}, ${supplier_state}`
            },

            {
                accessor: 'destination',
                title: 'Destination',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true,
                render: ({ direction_category, customer_name, customer_city, customer_state, shipper_name, shipper_city, shipper_state }) => direction_category === 'outbound' ? `${customer_name} - ${customer_city}, ${customer_state}` : `${shipper_name} - ${shipper_city}, ${shipper_state}`
            },

            {
                accessor: 'requested_pickup_date',
                title: 'Req. Pickup Date',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true,
                render: ({ requested_pickup_date }) => new Date(requested_pickup_date).toLocaleDateString()
            },
            {
                accessor: 'requested_delivery_date',
                title: 'Req. Delivery Date',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true,
                render: ({ requested_delivery_date }) => new Date(requested_delivery_date).toLocaleDateString()
            },
            {
                accessor: 'status',
                title: 'Status',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true,
                render: ({ status }) => status.toUpperCase().replaceAll('_', ' ')
            },
            {
                accessor: 'actions',
                title: 'Actions',
                render: (shipment) =>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Image id='view-shipment-btn' src={eyeIcon} h={16} w={'auto'} onClick={(e) => { e.stopPropagation(); navigate(`/shipments/details/${shipment.id}`) }} />
                        <Image id='bol-btn' src={paperclipIcon} h={16} w={'auto'} onClick={(e) => { e.stopPropagation(); handleDocClick(shipment.id) }} />
                        <Image id='chat-btn' src={chatIcon} h={16} w={'auto'} onClick={(e) => { e.stopPropagation(); getConversation(shipment.id) }} />
                    </div>,
                resizable: false,
                width: 100
            }
        ]
    })



    async function fetchCarrierUndelivered() {
        try {
            let response = await fetch(`${API_URL}/api/carrier/shipments?status=planned,routed,in_transit,delivered`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/carrier/shipments?status=planned,routed,in_transit`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

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
    async function handleUpdateShipment(eventType) {
        try {
            if (message) {
                handleSubmitMessage()
            }
            console.log('pu date', pickupDate)
            if (eventType !== 'routed' && !pickupDate && !deliveryDate) {
                notifications.show({
                    title: 'No status update made',
                    message: 'Pickup date/Delivery date not provided'
                })
                return
            }

            let response = await fetch(`${API_URL}/api/carrier/shipments/${selectedShipment.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({
                    date: eventType === 'routed' ? null : (pickupDate ? new Date(pickupDate).toISOString().split('T')[0]
                        : new Date(deliveryDate).toISOString().split('T')[0]),
                    userId: user.id,
                    eventType: eventType ? eventType : (pickupDate ? 'picked_up' : 'delivered')
                })
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/carrier/shipments/${selectedShipment.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({
                            date: eventType === 'routed' ? null : (pickupDate ? new Date(pickupDate).toISOString().split('T')[0]
                                : new Date(deliveryDate).toISOString().split('T')[0]),
                            userId: user.id,
                            eventType: eventType ? eventType : (pickupDate ? 'picked_up' : 'delivered')
                        })
                    });
                }
            }

            let result = await response.json();

            if (result.error) {
                return alert(result.error)
            }
            if (eventType === 'routed') {
                return notifications.show({
                    title: 'Success!',
                    message: `${selectedShipment?.shipment_number} has been routed`
                })
            }
            notifications.show({
                title: 'Success!',
                message: pickupDate ? `Successfully saved pickup date of ${new Date(pickupDate).toISOString().split('T')[0]}` : `Successfully saved delivery date of ${new Date(deliveryDate).toISOString().split('T')[0]}`,
                position: 'top-center'
            })


            fetchCarrierUndelivered()




        } catch (error) {
            console.log(error)
        }
    }

    async function handleSubmitMessage() {
        try {
            let response = await fetch(`${API_URL}/api/shared/conversations?shipmentNumber=${selectedShipment.shipment_number}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({
                    text: message
                })
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shared/conversations?shipmentNumber=${selectedShipment.shipment_number}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({
                            text: message
                        })
                    });
                }
            }

            let result = await response.json();

            if (result.message) {
                notifications.show({
                    title: 'Success!',
                    message: 'New message created',
                    position: 'top-center'
                });
                return;
            } else if (result.conversation) {
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

        async function getConversation(shipmentId) {
        try {
            let response = await fetch(`${API_URL}/api/shared/conversations/${shipmentId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shared/conversations/${shipmentId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            let result = await response.json();

            console.log('conversation fetched', result)

            setConversation(result.conversation)
            setSelectedShipment(filteredShipments.find(s => s.id === shipmentId))
            setVisibleModal(true)
        } catch (error) {
            console.log(error)
        }
    }

        async function handleDocClick(shipmentId) {
        try {
            let response = await fetch(`${API_URL}/api/shipper/documents/${shipmentId}/bol`, {
                headers: {
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = refreshToken(setAuth, navigate);
                response = await fetch(`${API_URL}/api/shipper/documents/${shipmentId}/bol`, {
                    headers: {
                        'Authorization': `Bearer ${newToken}`
                    }
                });
            }

            let object = await response.blob();

            const objectUrl = URL.createObjectURL(object);
            window.open(objectUrl, '_blank');
        } catch (error) {
            console.log(error)
        }
    }

    //add message logic
    return (
        <div>
            <ChatModal conversation={conversation} setVisibleModal={setVisibleModal} visibleModal={visibleModal} user={user} auth={auth} getConversation={getConversation} shipment={selectedShipment} setAuth={setAuth} />

            <Drawer styles={{ body: { backgroundColor: '#1a1a1a' }, content: { backgroundColor: '#1a1a1a', color: '#adadad', paddingLeft: '1rem', paddingRight: '1rem' }, header: { backgroundColor: '#1a1a1a' }, root: { backgroundColor: '#1a1a1a' } }} position='top' closeOnClickOutside='true' opened={opened} onClose={close} title={
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8rem' }}>
                    <h3>{`Update Shipment: #${selectedShipment?.shipment_number}`}</h3>
                    <h3>{`${selectedShipment?.direction_category === 'outbound' ? selectedShipment?.shipper_name : selectedShipment?.supplier_name} ➔ ${selectedShipment?.direction_category === 'outbound' ? selectedShipment?.customer_name : selectedShipment?.shipper_name}`}</h3>
                    <h3>{`CURRENT STATUS: ${selectedShipment?.status.toUpperCase().replaceAll('_', ' ')}`}</h3>
                </div>
            }>
                <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '3rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '3rem', alignItems: 'stretch' }}>
                        <div className='update-div'>
                            <span style={{ textAlign: 'center' }}>{selectedShipment?.status === 'planned' ? 'Route Shipment' : 'Shipment Routed'}</span>
                            {selectedShipment?.status === 'planned' &&
                                <Button variant='outline' color='#f6bd02' onClick={() => handleUpdateShipment('routed')}>Route</Button>
                            }
                        </div>
                        <div style={{ flex: .5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image src={arrowRight} h={60} w={'auto'} />
                        </div>
                        <div className='update-div'>
                            <span style={{ textAlign: 'center' }}>Requested Pickup Date: {new Date(selectedShipment?.requested_pickup_date).toLocaleDateString()}</span>
                            {!selectedShipment?.actual_pickup_date && selectedShipment?.status === 'routed' && !pickInput &&
                                <div style={{ width: '70%', display: 'flex', justifyContent: 'center' }}>
                                    <Button variant='outline' color='#f6bd02' onClick={() => setPickInput(true)}>Mark as Picked Up</Button>
                                </div>
                            }
                            {!selectedShipment?.actual_pickup_date && pickInput &&
                                <DateInput
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
                                />
                            }
                            {selectedShipment?.actual_pickup_date &&
                                <span>Actual Pickup Date: {new Date(selectedShipment?.actual_pickup_date).toLocaleDateString()}</span>
                            }
                        </div>
                        <div style={{ flex: .5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image src={arrowRight} h={60} w={'auto'} />
                        </div>
                        <div className='update-div'>
                            <span style={{ textAlign: 'center' }}>Requested Delivery Date: {new Date(selectedShipment?.requested_delivery_date).toLocaleDateString()}</span>
                            {!selectedShipment?.actual_delivery_date && selectedShipment?.status === 'in_transit' && !deliveryInput &&
                                <div style={{ width: '70%', display: 'flex', justifyContent: 'center' }}>
                                    <Button variant='outline' color='#f6bd02' onClick={() => setDeliveryInput(!deliveryInput)}>Mark as Delivered</Button>
                                </div>
                            }
                            {!selectedShipment?.actual_delivery_date && deliveryInput &&
                                <DateInput
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
                                />
                            }
                            {selectedShipment?.actual_delivery_date &&
                                <span>Actual Delivery Date: {new Date(selectedShipment?.actual_delivery_date).toLocaleDateString()}</span>
                            }
                        </div>
                    </div>
                    {selectedShipment?.actual_delivery_date ?

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h2 style={{ color: '#40c057' }}>Shipment has been delivered.</h2>
                        </div>
                        :
                        <div style={{ display: 'flex', width: '100%', height: '10%', alignItems: 'center', gap: '3rem' }}>
                            <div style={{ width: '100%', flex: 1.5 }}>
                                <Textarea className='text-area-update' styles={{ input: { backgroundColor: '#3d3d3d', borderColor: '#555', color: 'white' } }} placeholder='Add comment (optional)' style={{ width: '70%', margin: 0 }} value={message} onChange={(e) => setMessage(e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', width: '100%', flex: .5 }}>
                                <Button size='l' variant='outline' color='green' onClick={() => handleUpdateShipment()}>Confirm</Button>
                            </div>
                        </div>}


                </div>
            </Drawer>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: '1rem', marginRight: '1rem' }}>
                <h1 className='header'>Update Shipments</h1>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ display: 'block', color: 'white' }}><b>Status: </b></span>
                        <Select
                            rightSection={<Image h={20} w={'auto'} src={caretDownIcon} />}
                            styles={{ input: { backgroundColor: 'black', color: 'white', borderColor: "white" }, wrapper: { borderColor: '#f6bd02' } }}
                            data={[{ label: 'All', value: '' }, { label: 'Planned', value: 'planned' }, { label: 'In Transit', value: 'in_transit' }, { label: 'Routed', value: 'routed' }, { label: 'Delivered', value: 'delivered' }]}
                            defaultValue=''
                            onChange={(_value, option) => handleStatusFilter(_value)} />
                    </div>

                    <Button className={`update-button ${selectedShipment ? 'visible' : ''}`} variant="outline" color="#f6bd02" onClick={() => open()}>Update</Button>
                </div>

            </div>
            <div id='update-table-container'>
                <DataTable id="data-table"

                    highlightOnHover
                    storeColumnsKey={key}
                    columns={effectiveColumns}
                    resizableColumns
                    records={sortedShipments}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    onRowClick={({ record }) => selectedShipment?.id === record.id ? setSelectedShipment(null) : setSelectedShipment(record)}
                    rowClassName={(record) => record.id === selectedShipment?.id ? 'selected-shipment-row' : ''}
                />
            </div>

        </div>

    )
}

export default UpdateShipments;