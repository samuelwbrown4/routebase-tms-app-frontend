import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'
import { Table, Badge, Modal, Input, Button, Image } from '@mantine/core'
import refreshToken from '../utils/refresh'
import CountdownBadge from '../components/CountdownBadge';
import { notifications } from '@mantine/notifications';
import dollarIcon from '../assets/currency-dollar.svg';
import '../styles/spotMarket.css'

function SpotMarket({ auth, user, setAuth }) {

    const API_URL = import.meta.env.VITE_API_URL
    const navigate = useNavigate()

    const [shipmentsList, setShipmentsList] = useState([]);
    const [selectedShipment, setSelectedShipment] = useState(null)
    const [openMakeOffer, setOpenMakeOffer] = useState(false);
    const [openOffers, setOpenOffers] = useState(false);
    const [offer, setOffer] = useState('')
    const [selectedOffer, setSelectedOffer] = useState(null)

    useEffect(() => {
        getSpotLoads()
    }, []);

    useEffect(() => {
        console.log('spot shipments', shipmentsList)
    }, [shipmentsList])

    async function getSpotLoads() {
        try {
            let response = await fetch(`${API_URL}/api/${user.client}/shipments?status=pending_carrier`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = refreshToken(setAuth, navigate)
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/shipments?status=pending_carrier`, {
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

    async function submitOffer() {
        try {
            let response = await fetch(`${API_URL}/api/carrier/spot-bids/${selectedShipment.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({ offer })
            });

            if (response.status == 401) {
                let newToken = refreshToken(setAuth, navigate)
                if (newToken) {
                    response = fetch(`${API_URL}/api/carrier/spot-bids/${selectedShipment.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({ offer })
                    });
                }
            }

            let result = await response.json()

            if (result.bid) {
                setOpenMakeOffer(false)
                setOffer('')
                getSpotLoads()
                return notifications.show({
                    title: 'Offer Submitted!',
                    message: `Offer of $${result.bid.rate} submitted for ${selectedShipment.shipment_number}`
                })
            }

            notifications.show({
                title: 'Error!',
                message: 'Error submitting offer'
            })

        } catch (error) {
            console.log(error)
        }
    }

    async function acceptOffer() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/spot-bids/${selectedShipment?.id}/${selectedOffer?.offer_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application.json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = refreshToken(setAuth, navigate)
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/spot-bids/$${selectedShipment?.id}/${selectedOffer?.offer_id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application.json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            };

            let result = await response.json();
            if (result.acceptedShipment) {
                getSpotLoads()
                setOpenOffers(false)
                return notifications.show({
                    title: 'Success!',
                    message: `Bid has been accepted.`
                })
                
            }



        } catch (error) {
            console.log(error)
        }
    }

    async function resetBidDeadline(shipmentId) {
        try {
            let response = await fetch(`${API_URL}/api/shipper/shipments/bid-deadline/${shipmentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/shipments/bid-deadline/${shipmentId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                };
            }

            let result = await response.json();

            if(result.updatedShipment){
                getSpotLoads();
                return notifications.show({
                    title: 'Success!',
                    message: `Bid deadline extended by 2 hours for Shipment ${updatedShipment.shipment_number}`
                })
            } else {
                return notifications.show({
                    title: 'Error!',
                    message: `${result.error}`
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'white' }}>
            <Modal opened={openMakeOffer} onClose={() => setOpenMakeOffer(false)} title={`Make offer on ${selectedShipment?.shipment_number}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                    <Input value={offer} leftSection={<Image src={dollarIcon} h={20} w={'auto'} />} onChange={(e) => setOffer(e.target.value)}></Input>
                    <Button className='offer-btn' onClick={() => { submitOffer(); getSpotLoads() }}>Submit Offer</Button>
                </div>
            </Modal>
            <Modal opened={openOffers} onClose={() => { setOpenOffers(false); setSelectedOffer(null) }} title={`Current Offers on Shipment #${selectedShipment?.shipment_number}`}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>
                    <ul id='offer-list'>
                        {selectedShipment?.offers?.map(o =>
                            <li key={o.offer_id} className={`offer-list-item ${o.offer_id === selectedOffer?.offer_id ? 'selected-offer' : ''}`} onClick={o.offer_id === selectedOffer?.offer_id ? () => setSelectedOffer(null) : () => setSelectedOffer(o)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{o.carrier_name}</span>
                                    <span>${o.rate}</span>
                                </div>
                            </li>
                        )}
                    </ul>
                    {selectedOffer && <Button className='offer-btn' onClick={() => acceptOffer()}>Accept Offer?</Button>}
                </div>
            </Modal>
            <div>
                <h1 style={{margin: '0px'}}>Spot Market</h1>
            </div>
            <div id='table-container'>
                <Table id='spot-market-table'>
                    <Table.Thead>
                        <Table.Tr id='header-row'>
                            <Table.Th>Shipment #</Table.Th>
                            <Table.Th>Origin</Table.Th>
                            <Table.Th>Origin City/State</Table.Th>
                            <Table.Th>Destination</Table.Th>
                            <Table.Th>Dest City/State</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}># Offers</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>Action</Table.Th>
                            <Table.Th style={{ textAlign: 'center' }}>Time Remaining</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {shipmentsList.map(s =>
                            <Table.Tr key={s.id} className='row'>
                                <Table.Td>{s.shipment_number}</Table.Td>
                                <Table.Td>{s.direction_category === 'outbound' ? s.shipper_name : s.supplier_name}</Table.Td>
                                <Table.Td>{`${s.direction_category === 'outbound' ? s.shipper_city : s.supplier_city}, ${s.direction_category === 'outbound' ? s.shipper_state : s.supplier_state}`}</Table.Td>
                                <Table.Td>{s. direction_category === 'outbound' ? s.customer_name : s.shipper_name}</Table.Td>
                                <Table.Td>{`${s. direction_category === 'outbound' ? s.customer_city : s.shipper_city}, ${s. direction_category === 'outbound' ? s.customer_state : s.shipper_state}`}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}><span>{s.offers ? s.offers.length : '0'}</span></Table.Td>
                                {user.client === 'shipper' && <Table.Td style={{ textAlign: 'center' }}><Badge className={s.offers ? 'clickable' : ''} color={s.offers ? 'blue' : 'gray'} onClick={s.offers ? () => { setSelectedShipment(s); setOpenOffers(true) } : () => console.log('no offers')}>View Offers</Badge></Table.Td>}
                                {user.client === 'carrier' && <Table.Td style={{ textAlign: 'center' }}><Badge className={new Date(s.bid_deadline).getTime() - Date.now() > 0 ? 'clickable' : ''} color={new Date(s.bid_deadline).getTime() - Date.now() > 0 ? 'blue' : 'gray'} onClick={new Date(s.bid_deadline).getTime() - Date.now() > 0 ? () => { setOpenMakeOffer(true), setSelectedShipment(s) } : () => console.log('expired')}>Make Offer</Badge></Table.Td>}
                                <Table.Td style={{ textAlign: 'center' }}><CountdownBadge deadline={s.bid_deadline} shipmentsList={shipmentsList} user={user} id={s.id} resetBidDeadline={resetBidDeadline} /></Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </div>
        </div>
    )
}

export default SpotMarket;