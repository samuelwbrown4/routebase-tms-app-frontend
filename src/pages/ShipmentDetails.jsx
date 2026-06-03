import { useParams, useNavigate } from "react-router"
import { useEffect, useState } from 'react';
import { Table, Badge, Card, Spoiler } from '@mantine/core'
import '../styles/shipmentDetails.css'
import refreshToken from "../utils/refresh";

function ShipmentDetails({ auth, user, setAuth }) {

    const API_URL = import.meta.env.VITE_API_URL
    const navigate = useNavigate()

    const [shipment, setShipment] = useState(null)
    const [visibleBreakdown, setVisibleBreakdown] = useState(false)
    const [rateDetails, setRateDetails] = useState(null)

    const { shipmentId } = useParams();

    useEffect(() => {
        console.log(shipment)
    }, [shipment])

    useEffect(() => {
        async function fetchShipment() {
            try {
                let response = await fetch(`${API_URL}/api/shipper/shipments/${shipmentId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth}`
                    }
                });

                if (response.status === 401) {
                    let newToken = await refreshToken(setAuth, navigate);
                    if (newToken) {
                        response = await fetch(`${API_URL}/api/shipper/shipments/${shipmentId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${newToken}`
                            }
                        });
                    }
                }

                const result = await response.json();

                setShipment(result.shipment)
            } catch (error) {
                console.log(error)
            }
        }
        fetchShipment()
    }, [])

    useEffect(() => {
        getRateDetails()
    }, [shipment])

    useEffect(() => {
        console.log('rate details', rateDetails)
    }, [rateDetails])

    async function getRateDetails() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/rates/${shipment.carrier_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({
                    distance: shipment.distance
                })
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/rates/${shipment.carrier_id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({
                            distance: shipment.distance
                        })
                    })
                }
            };

            let result = await response.json();



            setRateDetails(result.rateDetails);
        } catch (error) {
            console.log(error)
        }
    }

    return (
            <div style={{display: 'flex' , flexDirection: 'column' , gap: '.2rem', alignItems:  'center'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' , color: 'white', width: '95%' }}>
                    <h1 id='shipment-header'>Shipment Details - #{shipment?.shipment_number}</h1><Badge>{shipment?.status.toUpperCase().replaceAll('_', ' ')}</Badge><Badge sixe='xxl' color={shipment?.direction_category === 'outbound' ? 'green' : 'blue'}>{shipment?.direction_category.toUpperCase()}</Badge>
                </div>
                <div id='shipment-details-div'>
                    <div id='shipment-details-top'>
                            <Card withBorder className='top-section-sub'>
                                <h3 className='sub-header'><b>Ship From</b></h3>
                                <div className='sub-details'><span style={{color: 'white'}}><b>Name:</b></span><span>{shipment?.direction_category === 'outbound' ? shipment?.shipper_name : shipment?.supplier_name}</span></div>
                                <div className='sub-details'><span style={{color: 'white'}}><b>Address:</b></span><span>{shipment?.direction_category === 'outbound' ? shipment?.shipper_address : shipment?.supplier_address}</span></div>
                                <div className='sub-details' style={{borderBottom: '1px solid #333' , paddingBottom: '1rem'}}>
                                    <span style={{color: 'white'}}><b>City, State ZIP:</b></span>
                                    <span>{shipment?.direction_category === 'outbound' ? shipment?.shipper_city : shipment?.supplier_city}, {shipment?.direction_category === 'outbound' ? shipment?.shipper_state : shipment?.supplier_state} {shipment?.direction_category === 'outbound' ? shipment?.shipper_zip : shipment?.supplier_zip}</span>
                                </div>
                                <div className='sub-details'>
                                    <span style={{color: 'white'}}><b>Requested Ship Date:</b></span>
                                    <span>{new Date(shipment?.requested_pickup_date).toLocaleDateString()}</span>
                                </div>
                                <div className='sub-details'>
                                    <span style={{color: 'white'}}><b>Actual Ship Date:</b></span>
                                    <span>{shipment?.actual_pickup_date ? new Date(shipment?.actual_pickup_date).toLocaleDateString() : 'TBD'}</span>
                                    <Badge color={(shipment?.actual_pickup_date ? new Date(shipment?.actual_pickup_date) : new Date() )> new Date(shipment?.requested_pickup_date) ? 'red' : 'green'}>{(shipment?.actual_pickup_date ? new Date(shipment?.actual_pickup_date) : new Date() )> new Date(shipment?.requested_pickup_date) ? 'Late' : 'On Time'}</Badge>
                                </div>
                            </Card>
                            <Card withBorder className='top-section-sub'>
                                <h3 className='sub-header'><b>Ship To</b></h3>
                                <div className='sub-details'><span style={{color: 'white'}}><b>Name:</b></span><span>{shipment?.direction_category === 'outbound' ? shipment?.customer_name : shipment?.shipper_name}</span></div>
                                <div className='sub-details'><span style={{color: 'white'}}><b>Address:</b></span><span>{shipment?.direction_category === 'outbound' ? shipment?.customer_address : shipment?.shipper_address}</span></div>
                                <div className='sub-details' style={{borderBottom: '1px solid #333' , paddingBottom: '1rem'}}><span style={{color: 'white'}}><b>City, State ZIP:</b></span><span>{shipment?.direction_category === 'outbound' ? shipment?.customer_city : shipment?.shipper_city}, {shipment?.direction_category === 'outbound' ? shipment?.customer_state : shipment?.shipper_state} {shipment?.direction_category === 'outbound' ? shipment?.customer_zip : shipment?.shipper_zip}</span></div>
                                <div className='sub-details'>
                                    <span style={{color: 'white'}}><b>Requested Delivery Date:</b></span>
                                    <span>{new Date(shipment?.requested_delivery_date).toLocaleDateString()}</span>
                                </div>
                                <div className='sub-details'>
                                    <span style={{color: 'white'}}><b>Actual Delivery Date:</b></span>
                                    <span>{shipment?.actual_delivery_date ? new Date(shipment?.actual_delivery_date).toLocaleDateString() : 'TBD'}</span>
                                    <Badge color={(shipment?.actual_delivery_date ? new Date(shipment?.actual_delivery_date) : new Date() )> new Date(shipment?.requested_delivery_date) ? 'red' : 'green'}>{(shipment?.actual_delivery_date ? new Date(shipment?.actual_delivery_date) : new Date() )> new Date(shipment?.requested_delivery_date) ? 'Late' : 'On Time'}</Badge>
                                </div>
                            </Card>
                            <Card withBorder className='top-section-sub'>
                                <h3 className='sub-header'><b>Carrier Info</b></h3>
                                <div className='sub-details'><span style={{color: 'white'}}><b>Carrier Name:</b></span><span>{shipment?.carrier_name}</span></div>
                                <div className='sub-details'><span style={{color: 'white'}}><b>SCAC:</b></span><span>{shipment?.carrier_scac}</span></div>
                                <div className='sub-details'><span style={{color: 'white'}}><b>Freight Cost:</b></span><span>${shipment?.rate}</span><Badge>{shipment?.shipment_type?.toUpperCase()}</Badge></div>
                                {shipment?.shipment_type === 'contract' && <Spoiler style={{ color: 'white', display: 'inline' }}
                                    maxHeight={0}
                                    showLabel="Show breakdown"
                                    hideLabel="Hide breakdown" expanded={visibleBreakdown} onExpandedChange={() => setVisibleBreakdown(!visibleBreakdown)}>
                                    <span>{`($${rateDetails?.flat_rate} + ($${rateDetails?.per_mile_rate} x ${shipment?.distance})) x ${rateDetails?.fuel_surcharge_percentage}`}</span>
                                </Spoiler>}
                            </Card>
                    </div>
                    <div id='orders-section'>
                        <h3 style={{color: '#f6bd02' , marginTop: '0rem'}}>Orders on Shipment</h3>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Order #</Table.Th>
                                    <Table.Th>Customer PO #</Table.Th>
                                    <Table.Th>Weight</Table.Th>
                                    <Table.Th>Notes</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {shipment?.orders?.map(o =>
                                    <Table.Tr key={o.id}>
                                        <Table.Td>{o?.order_number}</Table.Td>
                                        <Table.Td>{o?.customer_po_number}</Table.Td>
                                        <Table.Td>{o?.weight}</Table.Td>
                                        <Table.Td></Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </div>
                </div>
            </div>  
    )
}

export default ShipmentDetails;