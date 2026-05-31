import { useState, useEffect } from 'react';
import DashboardCard from "../components/DashboardCard";
import UnplannedOrders from "../components/UnplannedOrders";
import UnplannedLateOrders from "../components/UnplannedLateOrders";
import Newsfeed from '../components/Newsfeed';
import DashboardUpcomingCard from '../components/DashboardUpcomingCard';
import DashboardMap from '../components/DashboardMap';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css'
import refreshToken from '../utils/refresh';


function Dashboard({ auth, user, setAuth }) {

    const API_URL = import.meta.env.VITE_API_URL;

    const [undeliveredShipments, setUndeliveredShipments] = useState([]);
    const [unplannedOrders, setUnplannedOrders] = useState([])
    const [unplannedLateOrders, setUnplannedLateOrders] = useState([])
    const [orders, setOrders] = useState([])
    const [inTransitShipments, setInTransitShipments] = useState([]);
    const [pendingCarrier, setPendingCarrier] = useState([])
    const [upcomingOrders, setUpcomingOrders] = useState([]);
    const [upcomingShipments, setUpcomingShipments] = useState([]);

    const [payload, setPayload] = useState([])
    const [newsLoading, setNewsLoading] = useState(false)
    const [newOrders, setNewOrders] = useState(null)
    const [newShipments, setNewShipments] = useState(null)
    const [newPickups, setNewPickups] = useState(null)
    const [newDeliveries, setNewDeliveries] = useState(null)
    const [newBids, setNewBids] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        getShipmentsByStatus('in_transit')
        getShipmentsByStatus('pending_carrier')
        getOpenOrders()
        getOrdersByStatus('unplanned')
        fetchNewsfeed()
        getInTransitShipments()
        fetchUpcomingOrders()
        fetchUpcomingShipments()
    }, [])

    useEffect(() => {
        console.log('upcoming orders', upcomingOrders)
    }, [upcomingOrders])

    useEffect(() => {
        console.log('newsfeed', payload)
    }, [payload])

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const ordersByDate = (() => {
        const days = []
        for (let i = 0; i <= 4; i++) {
            const d = new Date(today)
            d.setDate(today.getDate() + i)
            days.push({ date: d.toLocaleDateString(), count: 0 })
        }

        orders.forEach(order => {
            const orderDate = new Date(order.requested_ship_date)

            orderDate.setHours(0, 0, 0, 0)

            const diffDays = Math.round((orderDate - today) / (1000 * 60 * 60 * 24))

            if (diffDays < 0 || diffDays > 4) return

            const date = orderDate.toLocaleDateString()
            const existing = days.find(d => d.date === date)

            if (existing) existing.count += 1
        })

        return days
    })()

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
            let response = await fetch(`${API_URL}/api/shipper/shipments?status=${[status].join(',')}`, {
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

            if (status === 'in_transit') {
                setUndeliveredShipments(result.shipments.length)
            } else {
                setPendingCarrier(result.shipments.length)
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
                let newToken = refreshToken(setAuth, navigate)
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
                let newToken = refreshToken(setAuth, navigate)
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
                let newToken = refreshToken(setAuth, navigate)
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
                let newToken = refreshToken(setAuth, navigate);
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
    return (
        <div id='dashboard' style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', gap: '3rem'}}>
            <div>
                <h1 className='header'>Dashboard</h1>
            </div>

            <div style={{ display: 'flex', color: 'white', width: '100%', height: '50%', flex: 1, justifyContent: 'space-around' }}>
                <div className='dashboard-card' onClick={() => navigate('/shipment-tracking')}><DashboardCard statValue={undeliveredShipments} stat={'In Transit Shipments'} user={user} /></div>
                <div className='dashboard-card' onClick={() => navigate('/spot-market')}><DashboardCard statValue={pendingCarrier} stat={'Pending Carrier'} user={user} /></div>
                <div className='dashboard-card' onClick={() => navigate('/open-orders')}><DashboardCard statValue={unplannedOrders.length} stat={'Unplanned Orders'} /></div>
                <div className='dashboard-card' onClick={() => navigate('/open-orders')}><DashboardCard statValue={unplannedLateOrders.length} stat={'Late Orders'} /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', height: '50%', flex: 1 }}>
                <div style={{display: 'flex' , width: '60%', justifyContent: 'space-between', gap: '3.3rem'}}>
                    <DashboardUpcomingCard style={{widht: '100%' , height: '100%'}} stat={'Upcoming Orders'} statValue={upcomingOrders} />
                    <DashboardUpcomingCard style={{widht: '100%' , height: '100%'}} stat={'Upcoming Shipments'} statValue={upcomingShipments} />
                </div>
                <div style={{display: 'flex' , width: '30%', height: 160}}>
                    <Newsfeed newOrders={newOrders} newShipments={newShipments} newPickups={newPickups} newDeliveries={newDeliveries} newBids={newBids} />
                </div>
                
            </div>
            <div style={{display: 'flex' , gap: '2rem' , justifyContent: 'space-around' , width: '100%'}}>
                
            </div>
        </div>
    )
}

export default Dashboard;