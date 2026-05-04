import { Table, Button, Image, Collapse, Input, Drawer, Skeleton } from "@mantine/core";
import { Fragment } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import filterIcon from '../assets/funnel.svg';
import moreIcon from '../assets/dots-three-circle.svg';
import searchIcon from '../assets/magnifying-glass.svg';
import packageIcon from '../assets/package.svg';
import unselectIcon from '../assets/selection-slash.svg';
import '../styles/openOrders.css';


function OpenOrders({ auth, user }) {

    const API_URL = import.meta.env.VITE_API_URL;

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState({});
    const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
    const [searchValue, setSearchValue] = useState('')

    const [expandedOrder, setExpandedOrder] = useState(null)
    const [opened, { open, close }] = useDisclosure(false);

    const [potentialLoads, setPotentialLoads] = useState([])

    const [loading, setLoading] = useState(true)
    const [sortField, setSortField] = useState(null)
    const [sortDirection, setSortDirection] = useState('asc')

    const navigate = useNavigate();



    useEffect(() => {
        getOpenOrders()
    }, []);

    function handleSort(field) {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    }



    const filteredOrders = orders.filter(order =>
        order.order_number.toLowerCase().includes(searchValue.toLowerCase()) || order.destination.toLowerCase().includes(searchValue.toLowerCase())
    )

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (!sortField) return 0;
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    useEffect(() => {
        console.log(selectedOrderDetails)
    }, [selectedOrderDetails]);

    useEffect(() => {
        console.log(orders)
    }, [orders])

    useEffect(() => {
        if (selectedOrder.id) {
            getOrderLineItems(selectedOrder.id)
        }
    }, [selectedOrder])

    function handleAddToQueue(order) {
        const match = potentialLoads.find(potentialLoad => potentialLoad.id === order.id)

        if (match) {
            setPotentialLoads(potentialLoads.filter(potentialLoad => potentialLoad.id != order.id))
        } else {
            setPotentialLoads([...potentialLoads, order]);
        }
    }


    async function getOpenOrders() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/orders?status=unplanned`, { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${auth}`
                }
            })

            let result = await response.json();

            if (!result.orders) {
                return alert('No orders found.')
            }

            setOrders(result.orders)
            setLoading(false)

        } catch (error) {
            alert('Error retrieving open order data! Contact administrator.')
        }
    };

    async function getOrderLineItems(orderId) {
        try {
            let response = await fetch(`${API_URL}/api/shipper/orders/${orderId}/line-items`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            let result = await response.json();

            console.log('lineitems', result)

            if (!result.lineItems) {
                return alert('No line items found')
            };

            setSelectedOrderDetails(result.lineItems);

        } catch (error) {
            alert('Error retrieving order line item details! Contact administrator.')
        }
    }

    return (
        <div>
            <Drawer position='right' opened={opened} onClose={close} title="Authentication">
                <div>
                    Drawer Here
                </div>
            </Drawer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 id='header'>Open Orders</h1>
                {potentialLoads.length > 0 && (<div className='potential-load-div'>
                    <h4>Orders Selected: {potentialLoads.length}</h4>
                    <Button id='build-btn' onClick={() => navigate('/build-shipments', { state: { potentialLoads } })}><Image src={packageIcon} alt='package-icon' h={20} w={20} />{potentialLoads.length === 1 ? 'Build Shipment' : 'Build Shipments'}</Button>
                    <Button id='unselect-all-btn' onClick={() => setPotentialLoads([])}><Image src={unselectIcon} alt='package-icon' h={20} w={20} />Unselect All</Button>
                </div>)}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Input style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }} classNames={{ input: 'search-input', wrapper: 'search-input-wrapper' }} placeholder='Order, customer, etc...' value={searchValue} onChange={e => setSearchValue(e.target.value)} leftSection={<Image h={20} w={20} src={searchIcon} />} />

                    <Button variant="outline" color="white" style={{ marginTop: '0rem', marginBottom: '1rem' }} onClick={open}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Image src={filterIcon} alt="filter" h={20} w={20} />
                            Filter
                        </span>
                    </Button>
                </div>

            </div>
            <div className='table-container'>
                <Skeleton visible={loading}>
                    <Table className='table'>
                        <Table.Thead>
                            <Table.Tr className='header-row' >
                                <Table.Th onClick={()=>handleSort('order_number')}>Order No.{sortField === 'order_number' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</Table.Th>
                                <Table.Th onClick={()=>handleSort('origin')}>Origin Name{sortField === 'origin' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</Table.Th>
                                <Table.Th onClick={()=>handleSort('origin_address')}>Origin Address{sortField === 'origin_address' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</Table.Th>
                                <Table.Th onClick={()=>handleSort('origin_city')}>Origin City{sortField === 'origin_city' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</Table.Th>
                                <Table.Th onClick={()=>handleSort('origin_state')}>Origin State{sortField === 'origin_state' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</Table.Th>
                                <Table.Th onClick={()=>handleSort('destination')}>Destination Name{sortField === 'destination' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</Table.Th>
                                <Table.Th onClick={()=>handleSort('destination_address')}>Destination Address{sortField === 'destination_address' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</Table.Th>
                                <Table.Th onClick={()=>handleSort('destination_city')}>Destination City{sortField === 'destination_city' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</Table.Th>
                                <Table.Th onClick={()=>handleSort('destination_state')}>Destination State{sortField === 'destination_state' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</Table.Th>
                                <Table.Th onClick={()=>handleSort('weight')}>Weight{sortField === 'weight' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {sortedOrders.map((order) => {
                                return (
                                    <Fragment key={order.id}>
                                        <Table.Tr className={`row${potentialLoads.some(load => load.id === order.id) ? ' selected-row' : ''}`} value={order} onClick={() => handleAddToQueue(order)} >
                                            <Table.Td>{order.order_number}</Table.Td>
                                            <Table.Td>{order.origin}</Table.Td>
                                            <Table.Td>{order.origin_address}</Table.Td>
                                            <Table.Td>{order.origin_city}</Table.Td>
                                            <Table.Td>{order.origin_state}</Table.Td>
                                            <Table.Td>{order.destination}</Table.Td>
                                            <Table.Td>{order.destination_address}</Table.Td>
                                            <Table.Td>{order.destination_city}</Table.Td>
                                            <Table.Td>{order.destination_state}</Table.Td>
                                            <Table.Td>{order.weight}</Table.Td>
                                            <Table.Td><Image src={moreIcon} w={16} h={16} onClick={() => { setSelectedOrder(order); setExpandedOrder(expandedOrder === order.id ? null : order.id) }}></Image></Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Td colSpan={10} style={{ padding: 0, border: 'none' }}>
                                                <Collapse in={expandedOrder === order.id}>
                                                    <div style={{ padding: '1rem' }}>
                                                        <Table style={{ fontSize: '.6rem' }}>
                                                            <Table.Thead>
                                                                <Table.Tr>
                                                                    <Table.Th>No.</Table.Th>
                                                                    <Table.Th>Mat #</Table.Th>
                                                                    <Table.Th>Desc</Table.Th>
                                                                    <Table.Th>Qty</Table.Th>
                                                                    <Table.Th>Total Weight</Table.Th>
                                                                    <Table.Th>Frt Class</Table.Th>
                                                                </Table.Tr>
                                                            </Table.Thead>
                                                            <Table.Tbody>
                                                                {selectedOrderDetails.map((li, idx) => (
                                                                    <Table.Tr key={li.material_number}>
                                                                        <Table.Td>{idx + 1}</Table.Td>
                                                                        <Table.Td>{li.material_number}</Table.Td>
                                                                        <Table.Td>{li.description}</Table.Td>
                                                                        <Table.Td>{li.quantity}</Table.Td>
                                                                        <Table.Td>{`${li.total_weight_lbs} lbs`}</Table.Td>
                                                                        <Table.Td>{li.freight_class}</Table.Td>
                                                                    </Table.Tr>
                                                                ))}
                                                            </Table.Tbody>
                                                        </Table>
                                                    </div>

                                                </Collapse>
                                            </Table.Td>
                                        </Table.Tr>
                                    </Fragment>
                                )
                            })}
                        </Table.Tbody>
                    </Table>
                </Skeleton>
            </div>
        </div>
    )
}

export default OpenOrders;