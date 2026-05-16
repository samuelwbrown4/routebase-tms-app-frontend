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
    const [rateDetails , setRateDetails] = useState(null)

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

    useEffect(()=>{
        getRateDetails()
    },[shipment])

    useEffect(()=>{
        console.log('rate details' , rateDetails)
    },[rateDetails])

    async function getRateDetails(){
        try{
            let response = await fetch(`${API_URL}/api/shipper/rates/${shipment.carrier_id}` , {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${auth}`
                },
                body: JSON.stringify({distance: shipment.distance,
                    originId: shipment.origin_id
                })
            });

            if(response.status === 401){
                let newToken = await refreshToken(setAuth , navigate);
                if(newToken){
                    response = await fetch(`${API_URL}/api/shipper/rates/${shipment.carrier_id}` , {
                        method: 'POST',
                        headers: {
                            'Content-Type' : 'application/json',
                            'Authorization' : `Bearer ${newToken}`
                        },
                        body: JSON.stringify({distance: shipment.distance,
                            originId: shipment.origin_id
                        })
                    })
                }
            };

            let result = await response.json();

             

            setRateDetails(result.rateDetails);
        }catch(error){
            console.log(error)
        }
    }

    return (
        <div style={{ color: 'white' }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1 id='shipment-header'>Shipment Details - #{shipment?.shipment_number}</h1><Badge>{shipment?.status.toUpperCase().replaceAll('_', ' ')}</Badge>
                </div>
                <div id='shipment-details-div'>
                    <div id='shipment-details-top'>
                        <div className='top-left'>
                            <Card withBorder className='top-section-sub'>
                                <h3 className='sub-header'><b>Ship From</b></h3>
                                <div className='sub-details'><span><b>Name:</b></span><span>{shipment?.origin}</span></div>
                                <div className='sub-details'><span><b>Address:</b></span><span>{shipment?.origin_address}</span></div>
                                <div className='sub-details'><span><b>City, State ZIP:</b></span><span>{shipment?.origin_city}, {shipment?.origin_state} {shipment?.origin_zip}</span></div>
                            </Card>
                            <Card withBorder className='top-section-sub'>
                                <h3 className='sub-header'><b>Ship To</b></h3>
                                <div className='sub-details'><span><b>Name:</b></span><span>{shipment?.destination}</span></div>
                                <div className='sub-details'><span><b>Address:</b></span><span>{shipment?.destination_address}</span></div>
                                <div className='sub-details'><span><b>City, State ZIP:</b></span><span>{shipment?.destination_city}, {shipment?.destination_state} {shipment?.destination_zip}</span></div>
                            </Card>
                        </div>
                        <div className='top-right'>
                            <Card withBorder className='top-section-sub'>
                                <h3 className='sub-header'><b>Carrier Info</b></h3>
                                <div className='sub-details'><span><b>Carrier Name:</b></span><span>{shipment?.carrier_name}</span></div>
                                <div className='sub-details'><span><b>SCAC:</b></span><span>{shipment?.carrier_scac}</span></div>
                                <div className='sub-details'><span><b>Freight Cost:</b></span><span>${shipment?.rate}</span></div><Spoiler style={{color: 'white' , display: 'inline'}} 
                                maxHeight={0}
                                showLabel="Show breakdown"
                                    hideLabel="Hide breakdown" expanded={visibleBreakdown} onExpandedChange={()=>setVisibleBreakdown(!visibleBreakdown)}>
                                        hello
                                </Spoiler>
                                
                                
                            </Card>
                        </div>
                    </div>
                    <div id='orders-section'>
                        <h2>Orders on Shipment</h2>
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
                                {shipment?.orders.map(o =>
                                    <Table.Tr key={o.id}>
                                        <Table.Td>{o?.order_number}</Table.Td>
                                        <Table.Td>{o?.customer_po}</Table.Td>
                                        <Table.Td>{o?.weight}</Table.Td>
                                        <Table.Td></Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShipmentDetails;