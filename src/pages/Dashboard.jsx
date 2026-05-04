import { useState, useEffect } from 'react';
import UndeliveredShipments from "../components/UndeliveredShipments";
import UnplannedOrders from "../components/UnplannedOrders";
import UnplannedLateOrders from "../components/UnplannedLateOrders";
import { BarChart } from '@mantine/charts';
import {useNavigate} from 'react-router-dom';
import '../styles/dashboard.css'


function Dashboard({ auth, user }) {

    const API_URL = import.meta.env.VITE_API_URL;

    const [undeliveredShipments, setUndeliveredShipments] = useState([]);
    const [unplannedOrders , setUnplannedOrders] = useState([])
    const [unplannedLateOrders , setUnplannedLateOrders] = useState([])
    const [orders, setOrders] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        getUndeliveredShipments()
        getOpenOrders()
        getOrdersByStatus('unplanned')
    }, [])

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
                    'Authorization' : `Bearer ${auth}`
                }
            })

            let result = await response.json();

            if (!result.orders) {
                return alert('No orders found.')
            }

            setOrders(result.orders)

        } catch (error) {
            alert('Error retrieving open order data! Contact administrator.')
        }
    };

    async function getOrdersByStatus(status){
        try{
            let response = await fetch(`${API_URL}/api/shipper/orders?status=${status}` , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${auth}`
                }
            });

            let result = await response.json();

            if(!result.orders){
                return
            }

            setUnplannedOrders(result.orders)

            const o = []

            result.orders.forEach(order => {if(new Date(order.requested_ship_date) < new Date(Date.now())){
                o.push(order)
            }})

            setUnplannedLateOrders(o)
        }catch(error){
            console.log(error)
        }
    }

    async function getUndeliveredShipments() {
        try {
            const response = await fetch(`${API_URL}/api/shipper/shipments?status=delivered`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            const result = await response.json();
            console.log('result:', result)

            if (!result.undeliveredShipments.count) {
                return alert('Error finding undelivered shipments')
            }

            setUndeliveredShipments(result.undeliveredShipments.count)
        } catch (error) {
            console.log(error)
            alert(`Error: ${error}`)
        }
    }
    return (
        <div id='dashboard' style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' , gap: '2rem' }}>
            <div>
                <h1 className='header'>Dashboard</h1>
            </div>
            <div style={{ display: 'flex', color: 'white', width: '100%', height: '50%', flex: 1 , justifyContent: 'space-around' }}>
                <div className='dashboard-card' onClick={()=>navigate('/shipment-tracking')}><UndeliveredShipments undeliveredShipments={undeliveredShipments} user={user} /></div>
                <div className='dashboard-card' onClick={()=>navigate('/open-orders')}><UnplannedOrders unplannedOrders={unplannedOrders} /></div>
                <div className='dashboard-card' onClick={()=>navigate('/open-orders')}><UnplannedLateOrders unplannedLateOrders={unplannedLateOrders} /></div>
              
            </div>
            <div style={{ display: 'flex', color: 'white', height: '50%', width: '100%', flex: 1 , justifyContent: 'center'}}>
                    <BarChart
                        h={300}
                        w={900}
                        data={ordersByDate}
                        dataKey="date"
                        series={[{ name: 'count', color: 'blue' }]}
                    />
            </div>
        </div>
    )
}

export default Dashboard;