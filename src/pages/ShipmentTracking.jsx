import RouteMap from "../components/RouteMap";
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { Table, Button, Notification, Loader } from '@mantine/core'
import '../styles/routingTracking.css'
import refreshToken from "../utils/refresh";

function ShipmentTracking({ user, auth, setAuth }) {
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_API_URL

    const [routableShipments, setRoutableShipments] = useState([])
    const [routedShipments, setRoutedShipments] = useState([])
    const [displayedShipment, setDisplayedShipment] = useState(undefined)

    const [loadingId, setLoadingId] = useState(null)

    useEffect(() => {
        if (user.client === 'carrier') {
            getShipments(['planned']);
        }

        getShipments(['routed', 'in_transit']);
    }, [])

    useEffect(() => {
        console.log('routable', routableShipments)
        console.log('routed', routedShipments)
    }, [routableShipments, routedShipments])

    useEffect(() => {
        console.log(displayedShipment)
    }, [displayedShipment])

    useEffect(() => {
        if (!displayedShipment) return;

        const interval = setInterval(async () => {
            let response = await fetch(`${API_URL}/api/shipper/shipments/${displayedShipment.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/shipments/${displayedShipment.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            const result = await response.json();
            console.log(result.shipment)
            setDisplayedShipment(result.shipment);
            console.log('current location', result.shipment.current_position)

        }, 60000);

        return function () {
            console.log('leaving dom')
            clearInterval(interval);
        }
    }, [displayedShipment?.id]);

    async function getShipments(status) {
        try {
            let response = await fetch(`${API_URL}/api/${user.client === 'carrier' ? 'carrier' : 'shipper'}/shipments?status=${status}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/${user.client === 'carrier' ? 'carrier' : 'shipper'}/shipments?status=${status}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            let result = await response.json();

            if (result.shipments && status.includes('planned') && user.client === 'carrier') {
                setRoutableShipments(result.shipments)
            } else if (result.shipments && status.includes('routed') && status.includes('in_transit')) {
                setRoutedShipments(result.shipments)
            } else {
                return alert('No shipments found')
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function routeShipment(shipment, eventType = 'routed') {
        try {
            setLoadingId(shipment.id)
            let response = await fetch(`${API_URL}/api/carrier/shipments/${shipment.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({
                    eventType: eventType
                })
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/carrier/shipments/${shipment.id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({
                            eventType: eventType
                        })
                    });
                }
            }

            let result = await response.json();

            if (result.message) {
                getShipments('planned');
                getShipments(['routed', 'in_transit'])
            } else {
                alert(result.error)
            }

            setLoadingId(null)
        } catch (error) {
            console.log(error)
        }
    }

    async function getShipmentGeometry(shipmentId) {
        try {
            let response = await fetch(`${API_URL}/api/carrier/shipments/geometry/${shipmentId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/carrier/shipments/geometry/${shipmentId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            let result = await response.json();

            if (!result.shipment) {
                return
            }
            setDisplayedShipment(result.shipment)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
            <h1 id='header'>{user.client === 'shipper' ? 'Shipment Tracking' : 'Shipment Routing'}</h1>
            {user.client === 'carrier' && routableShipments.length > 0 && <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Shipment #</Table.Th>
                        <Table.Th>Origin Address</Table.Th>
                        <Table.Th>Origin City</Table.Th>
                        <Table.Th>Origin State</Table.Th>
                        <Table.Th>Dest Address</Table.Th>
                        <Table.Th>Dest City</Table.Th>
                        <Table.Th>Dest State</Table.Th>
                        <Table.Th>Req. Pick</Table.Th>
                        <Table.Th colSpan={2}>Req. Del</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {routableShipments.map(r => (
                        <Table.Tr key={r.id}>
                            <Table.Td>{r.shipment_number}</Table.Td>
                            <Table.Td>{r.origin_address}</Table.Td>
                            <Table.Td>{r.origin_city}</Table.Td>
                            <Table.Td>{r.origin_state}</Table.Td>
                            <Table.Td>{r.destination_address}</Table.Td>
                            <Table.Td>{r.destination_city}</Table.Td>
                            <Table.Td>{r.destination_state}</Table.Td>
                            <Table.Td>{new Date(r.requested_pickup_date).toLocaleDateString()}</Table.Td>
                            <Table.Td>{new Date(r.requested_delivery_date).toLocaleDateString()}</Table.Td>
                            <Table.Td><Button style={{ backgroundColor: "#f6bd02", color: 'black' }} onClick={() => routeShipment(r)} loading={loadingId === r.id} loaderProps={{ type: 'dots', color: 'black' }}>Route</Button></Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>}

            <div style={{ display: 'flex' }}>

                <RouteMap displayedShipment={displayedShipment} />
                <div style={{ width: '30%', display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
                    <h4><u>Routed Shipments</u></h4>
                    {routedShipments.map(r => (
                        <div className={`routed-shipment ${r.id === displayedShipment?.id ? 'displayed-shipment' : ''}`} key={r.id} style={{ justifyContent: 'center', textAlign: 'center', marginLeft: '1rem', borderBottom: '1px solid gray', cursor: 'pointer' }} onClick={() => getShipmentGeometry(r.id)}><span>{r.shipment_number}</span></div>
                    ))}
                </div>
            </div>


        </div>
    )
}

export default ShipmentTracking;