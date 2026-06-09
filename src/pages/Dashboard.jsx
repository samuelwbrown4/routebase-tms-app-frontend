import { useState, useEffect } from 'react';
import DashboardCard from "../components/DashboardCard";
import UnplannedOrders from "../components/UnplannedOrders";
import UnplannedLateOrders from "../components/UnplannedLateOrders";
import Newsfeed from '../components/Newsfeed';
import DashboardUpcomingCard from '../components/DashboardUpcomingCard';
import TenderTable from '../components/TenderTable';
import RetenderModal from '../components/RetenderModal';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css'
import refreshToken from '../utils/refresh';


function Dashboard({ auth, user, setAuth }) {

    const API_URL = import.meta.env.VITE_API_URL;

    const [carrierShipments, setCarrierShipments] = useState([]);
    const [carrierInTransit, setCarrierIntransit] = useState([]);
    const [carrierLatePickups, setCarrierLatePickups] = useState([]);
    const [carrierLateDeliveries, setCarrierLateDeliveries] = useState([]);
    const [outToBid, setOutToBid] = useState([])
    const [upcomingPickups, setUpcomingPickups] = useState([]);
    const [upcomingDeliveries, setUpcomingDeliveries] = useState([])
    const [tenderShipments, setTenderShipments] = useState([]);
    const [onTimeDelivery, setOnTimeDelivery] = useState(null);
    const [onTimePickup, setOnTimePickup] = useState(null);

    const [undeliveredShipments, setUndeliveredShipments] = useState([]);
    const [unplannedOrders, setUnplannedOrders] = useState([]);
    const [unplannedLateOrders, setUnplannedLateOrders] = useState([]);
    const [orders, setOrders] = useState([]);
    const [inTransitShipments, setInTransitShipments] = useState([]);
    const [pendingCarrier, setPendingCarrier] = useState([]);
    const [upcomingOrders, setUpcomingOrders] = useState([]);
    const [upcomingShipments, setUpcomingShipments] = useState([]);
    const [rejectedShipments, setRejectedShipments] = useState([])

    const [payload, setPayload] = useState([])
    const [newsLoading, setNewsLoading] = useState(false)
    const [newOrders, setNewOrders] = useState(null)
    const [newShipments, setNewShipments] = useState(null)
    const [newPickups, setNewPickups] = useState(null)
    const [newDeliveries, setNewDeliveries] = useState(null)
    const [newBids, setNewBids] = useState(null)

    const [openRetender, setOpenRetender] = useState(false)
    const [selectedShipment, setSelectedShipment] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        if (user.client === 'shipper') {
            getShipmentsByStatus('in_transit')
            getShipmentsByStatus('pending_carrier')
            getOpenOrders()
            getOrdersByStatus('unplanned')
            getShipmentsByStatus('built')
            fetchNewsfeed()
            getInTransitShipments()
            fetchUpcomingOrders()
            fetchUpcomingShipments()
        }

        getShipmentsByStatus(['in_transit', 'planned', 'routed'])
        getShipmentsByStatus(['pending_carrier'])
        getShipmentsByStatus(['tendered'])



    }, [])

    useEffect(() => {
        if (!carrierShipments) return
        const today = new Date()
        const oneWeekOut = new Date()
        oneWeekOut.setDate(today.getDate() + 7)

        const latePickups = carrierShipments.filter(s => (new Date(s.requested_pickup_date) < new Date()) && !s.actual_pickup_date).length

        const lateDeliveries = carrierShipments.filter(s => (new Date(s.requested_delivery_date) < new Date()) && !s.actual_delivery_date).length

        const upcomingP = carrierShipments.filter(s =>
            today <= new Date(s.requested_pickup_date) &&
            new Date(s.requested_pickup_date) <= oneWeekOut &&
            !s.actual_pickup_date
        ).sort((a, b) => new Date(a.requested_pickup_date) - new Date(b.requested_pickup_date))
        const upcomingD = carrierShipments.filter(s =>
            today <= new Date(s.requested_delivery_date) &&
            new Date(s.requested_delivery_date) <= oneWeekOut &&
            !s.actual_delivery_date
        ).sort((a, b) => new Date(a.requested_delivery_date) - new Date(b.requested_delivery_date))

        let totalDelivered = carrierShipments.filter(s => s.actual_delivery_date).length
        let deliveredOnTimeShipments = carrierShipments.filter(s => (new Date(s.requested_delivery_date) >= new Date(s.actual_delivery_date)) && s.actual_delivery_date).length

        let onTimeDeliveryPercentage = (deliveredOnTimeShipments / totalDelivered) * 100

        let totalPickedUp = carrierShipments.filter(s => s.actual_pickup_date).length
        let pickedUpOnTimeShipments = carrierShipments.filter(s => (new Date(s.requested_pickup_date) >= new Date(s.actual_pickup_date)) && s.actual_pickup_date).length

        let onTimePickupPercentage = (pickedUpOnTimeShipments / totalPickedUp) * 100

        setCarrierLatePickups(latePickups)
        setCarrierLateDeliveries(lateDeliveries)
        setUpcomingPickups(upcomingP)
        setUpcomingDeliveries(upcomingD)
        setOnTimeDelivery(isNaN(onTimeDeliveryPercentage) ? 'N/A' : `${onTimeDeliveryPercentage}%`)
        setOnTimePickup(isNaN(onTimePickupPercentage) ? 'N/A' : `${onTimePickupPercentage}%`)
    }, [carrierShipments])

    useEffect(() => {
        console.log('upcoming orders', upcomingShipments)
    }, [upcomingShipments])

    useEffect(() => {
        console.log('newsfeed', payload)
    }, [payload])

    async function getOpenOrders() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/orders?status=unplanned`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            })

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/orders?status=unplanned`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    })
                }
            }

            let result = await response.json();

            if (!result.orders) {
                return alert('No orders found.')
            }

            setOrders(result.orders)

        } catch (error) {
            alert('Error retrieving open order data! Contact administrator.')
        }
    };

    async function getOrdersByStatus(status) {
        try {
            let response = await fetch(`${API_URL}/api/shipper/orders?status=${status}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/orders?status=${status}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            let result = await response.json();

            if (!result.orders) {
                return
            }

            setUnplannedOrders(result.orders)

            const o = []

            result.orders.forEach(order => {
                if (new Date(order.requested_ship_date) < new Date(Date.now())) {
                    o.push(order)
                }
            })

            setUnplannedLateOrders(o)
        } catch (error) {
            console.log(error)
        }
    }

    async function getShipmentsByStatus(status) {
        try {
            let response = await fetch(`${API_URL}/api/${user.client}/shipments?status=${[status].join(',')}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/shipments?status=${[status].join(',')}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            const result = await response.json();
            console.log('result:', result)

            if (!result.shipments) {
                return alert('Error finding undelivered shipments')
            }

            if (status === 'in_transit' && user.client === 'shipper') {
                setUndeliveredShipments(result.shipments.length)
            } else if (status === 'pending_carrier' && user.client === 'shipper') {
                setPendingCarrier(result.shipments.length)
            } else if (status === 'built' && user.client === 'shipper') {
                setRejectedShipments(result.shipments)
            } else {
                if (status.includes('pending_carrier')) {
                    return setOutToBid(result.shipments.length)
                }
                if (status.includes('tendered')) {
                    return setTenderShipments(result.shipments)
                }
                setCarrierShipments(result.shipments)
            }

        } catch (error) {
            console.log(error)
            alert(`Error: ${error}`)
        }
    }

    async function fetchNewsfeed() {
        setNewsLoading(true)
        try {
            let response = await fetch(`${API_URL}/api/shipper/dashboard`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth}`
                    }
                }
            );

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate)
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/dashboard?since=${since}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${newToken}`
                            }
                        }
                    );
                }
            };

            let result = await response.json()

            let payload = result.payload
            setPayload(payload)
            setNewOrders(payload.newOrders)
            setNewShipments(payload.newShipments)
            setNewPickups(payload.newPickups)
            setNewDeliveries(payload.newDeliveries)
            setNewBids(payload.newBids)

            setNewsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    async function getInTransitShipments() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/shipments/current-position`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate)
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shippers/shipments/current-position`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            };

            let result = await response.json();

            setInTransitShipments(result.inTransitShipments)
        } catch (error) {

        }
    }

    async function fetchUpcomingOrders() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/orders/upcoming`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await Token(setAuth, navigate)
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/orders/upcoming`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            };

            let result = await response.json();
            console.log('upcoming orders result:', result)

            setUpcomingOrders(result.orders)
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchUpcomingShipments() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/shipments/upcoming`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/shipments/upcoming`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            };

            let result = await response.json({});

            setUpcomingShipments(result.shipments)
        } catch (error) {
            console.log(error)
        }
    }

    async function acceptRejectTender(eventType, shipmentId, shipmentNumber, carrierId, rate , expiry = 2) {
        try {
            let response = await fetch(`${API_URL}/api/carrier/shipments/${shipmentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({ eventType, carrierId, rate , expiry })
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate)
                if (newToken) {
                    response = await fetch(`${API_URL}/api/carrier/shipments/${shipmentId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({ eventType, carrierId, rate , expiry })
                    });
                }
            };

            let result = await response.json();

            if (eventType === 'tender_accepted' || eventType === 'tender_rejected') {

                if (result.message === 'Shipment updated successfully') {
                    notifications.show({
                        title: 'Success!',
                        message: `Tender ${eventType === 'tender_accepted' ? 'accepted' : 'rejected'} for Shipment # ${shipmentNumber}`
                    });
                    getShipmentsByStatus(['tendered'])
                    return 
                }

                notifications.show({
                    title: 'Error!',
                    message: `Count not ${eventType === 'tender_accepted' ? 'accept' : 'reject'} tender`
                })

                getShipmentsByStatus(['tendered'])
                return 
            }

            if(result.message === 'Shipment updated successfully'){
                notifications.show({
                    title: 'Success!',
                    message: `Shipment #${shipmentNumber} rerouted successfully.`
                });
                setOpenRetender(false)
                getShipmentsByStatus('built')
                return 
            }

            notifications.show({
                title: 'Error!',
                message: 'Could not reroute shipment!'
            })

            getShipmentsByStatus('built')
            return 
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div id='dashboard' style={{ display: 'flex', flexDirection: 'column', width: '100%', maxHeight: '100%', paddingTop: '.5rem', paddingBottom: '.5rem' }}>
            <RetenderModal openRetender={openRetender} setOpenRetender={setOpenRetender} retender={acceptRejectTender} setAuth={setAuth} auth={auth} shipment={selectedShipment} />

            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '2rem', alignItems: 'center' }}>

                <div style={{ display: 'flex', color: 'white', width: '100%', height: '50%', flex: 1, justifyContent: 'space-around' }}>
                    <div className='dashboard-card' onClick={() => navigate('/shipment-tracking')}><DashboardCard statValue={user.client === 'shipper' ? undeliveredShipments : carrierShipments.filter(s => s.status === 'in_transit').length} stat={'In Transit Shipments'} user={user} /></div>
                    <div className='dashboard-card' onClick={() => navigate('/spot-market')}><DashboardCard statValue={user.client === 'shipper' ? pendingCarrier : carrierLatePickups} stat={user.client === 'shipper' ? 'Pending Carrier' : 'Late Pickups'} user={user} /></div>
                    <div className='dashboard-card' onClick={() => navigate('/open-orders')}><DashboardCard statValue={user.client === 'shipper' ? unplannedOrders.length : carrierLateDeliveries} stat={user.client === 'shipper' ? 'Unplanned Orders' : 'Late Deliveries'} /></div>
                    <div className='dashboard-card' onClick={() => navigate('/open-orders')}><DashboardCard statValue={user.client === 'shipper' ? unplannedLateOrders.length : outToBid} stat={user.client === 'shipper' ? 'Late Orders' : 'Active Spot Loads'} /></div>
                </div>

                <div id='tender-table-container'>
                    <TenderTable shipments={user.client === 'shipper' ? rejectedShipments : tenderShipments} user={user} acceptRejectTender={acceptRejectTender} setOpenRetender={setOpenRetender} setSelectedShipment={setSelectedShipment} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', height: '50%', flex: 1 }}>
                    <div style={{ display: 'flex', width: '60%', justifyContent: 'space-between', gap: '3.3rem' }}>
                        <DashboardUpcomingCard
                            style={{ height: '100%' }}
                            stat={user.client === 'shipper' ? 'Upcoming Orders' : 'Pickups This Week'}
                            statValue={user.client === 'shipper' ? upcomingOrders : upcomingPickups}
                            user={user}
                            pickups={'pickups'}
                        />
                        <DashboardUpcomingCard
                            style={{ height: '100%' }}
                            stat={user.client === 'shipper' ? 'Upcoming Shipments' : 'Deliveries This Week'}
                            statValue={user.client === 'shipper' ? upcomingShipments : upcomingDeliveries}
                            user={user}
                            deliveries={'deliveries'} />
                    </div>
                    <div style={{ display: 'flex', width: '30%', height: 160 }}>
                        <Newsfeed newOrders={newOrders} newShipments={newShipments} newPickups={newPickups} newDeliveries={newDeliveries} newBids={newBids} onTimePickupPercentage={onTimePickup} onTimeDeliveryPercentage={onTimeDelivery} user={user} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;