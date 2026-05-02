import { useLocation , useNavigate} from 'react-router';
import { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import OffTruckOrdersTable from '../components/OffTruckOrdersTable';
import TruckDropZone from '../components/TruckDropZone';
import '../styles/buildShipments.css'
import { notifications } from '@mantine/notifications';

function BuildShipments({ auth, user }) {

    const API_URL = import.meta.env.VITE_API_URL;

    const { state } = useLocation();
    console.log('state:', state)
    console.log('potentialLoads:', state?.potentialLoads)
    const [offTruckOrders, setOffTruckOrders] = useState(state?.potentialLoads || []);
    const [onTruckOrders, setOnTruckOrders] = useState([]);
    const [carrierList, setCarrierList] = useState([]);
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [modeList, setModeList] = useState([]);
    const [mode, setMode] = useState('');
    const [carrier, setCarrier] = useState('');
    const [equipmentType, setEquipmentType] = useState('');
    const [pickDate, setPickDate] = useState(undefined);
    const [dropDate, setDropDate] = useState(undefined);
    const [totalWeight, setTotalWeight] = useState(0);
    const [distance, setDistance] = useState(0);
    const [rates, setRates] = useState([]);

    const navigate = useNavigate();


    useEffect(() => {
        fetchCarrierList()
        fetchEquipmentTypes()
    }, []);

    useEffect(() => {
        console.log(equipmentTypes)
    }, [equipmentTypes]);

    useEffect(() => {
        console.log('Mode List', modeList)
    }, [modeList]);

    useEffect(() => {
        fetchDistance()
        console.log('distance', distance)
    }, [onTruckOrders]);

    useEffect(()=>{
        fetchRates();
    }, [distance]);

    useEffect(() => {
        navigate('/build-shipments', {
            state: { potentialLoads: offTruckOrders },
            replace: true
        })
}, [offTruckOrders])

    async function fetchCarrierList() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/carriers`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            let data = await response.json();

            if (!data.carriers) {
                return alert(`${data.error}`)
            }

            setCarrierList(data.carriers);
        } catch (error) {
            console.log(error)
            alert(`Error: ${error}`)
        }
    };

    async function fetchEquipmentTypes() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/equipment-types`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            let data = await response.json();

            if (!data.equipmentTypes) {
                alert(`Error: ${data.error}`)
            }

            setEquipmentTypes(data.equipmentTypes)

            const modes = [...new Set(data.equipmentTypes.map(i => i.mode))]

            setModeList(modes);

        } catch (error) {
            console.log(error)
            alert(`Error: ${error}`)
        }
    }

    async function createShipment() {
        console.log('pickDate:', pickDate)
        console.log('dropDate:', dropDate)
        try {
            let response = await fetch(`${API_URL}/api/shipper/shipments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({
                    originId: onTruckOrders[0].origin_id,
                    destinationId: onTruckOrders[0].destination_id,
                    carrier: carrier,
                    equipmentType: equipmentType,
                    status: 'planned',
                    totalWeight: totalWeight,
                    pickDate: pickDate,
                    dropDate: dropDate,
                    userId: user.id,
                    orders: onTruckOrders.map(order => order.id)
                })
            });

            let result = await response.json()

            if (result.error) {
                return alert(`Error: ${result.error}`)
            }

            setOnTruckOrders([])
            setRates([])

            notifications.show({
                title: 'Shipment Created',
                message: `Shipment #${result.shipment.shipment_number} created`,
                autoClose: 5000,
                position: 'top-center'
            })

        } catch (error) {
            console.log(error)
            alert(`Error: ${error}`)
        }
    }

    async function fetchDistance() {
        if (onTruckOrders.length === 0) {
            return setDistance(0);
        }
        try {
            const originLat = onTruckOrders?.[0].origin_lat;
            const originLong = onTruckOrders?.[0].origin_long;
            const destLat = onTruckOrders?.[0].destination_lat;
            const destLong = onTruckOrders?.[0].destination_long;

            const response = await fetch(`${API_URL}/api/shipper/proxy/distance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    originLat,
                    originLong,
                    destLat,
                    destLong
                })
            });


            const result = await response.json();

            console.log(result)

            if (!result.distance) {
                return alert('Distance could not be found')
            }

            setDistance(result.distance);

        } catch (error) {
            console.log(error)
            alert(`Error: ${error}`)
        }
    }

    async function fetchRates() {
        if(!distance > 0){
            return
        }
        try {
            const response = await fetch(`${API_URL}/api/shipper/rates/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({
                    distance: distance
                })
            })

            const result = await response.json();

            if(!result.rates){
                return alert(result.message)
            }

            console.log(result.rates)

            calculateRates(result.rates)
        }catch (error) {
            console.log(error)
            alert(`Error: ${error}`)
        }
    }

    function calculateRates(ratesArray){
        const availableRates = []
        
        ratesArray.forEach(function(rate){
            let rateObject = {
                carrier: rate.carrier,
                rate: parseFloat(rate.flat_rate) + (parseFloat(distance) * parseFloat(rate.per_mile_rate)) + (parseFloat(rate.flat_rate) * parseFloat(rate.fuel_surcharge_percentage) / 100) 
            }

            availableRates.push(rateObject)
        })

        availableRates.sort((a,b)=> a.rate - b.rate);

        console.log('Available rates: ' , availableRates)

        setRates(availableRates);
    }

    function handleDragEnd(event) {
        const { active, over } = event

        if (over && over.id === 'truck-zone') {
            const draggedOrder = offTruckOrders.find(order => order.id === active.id)
            if (draggedOrder) {
                if (onTruckOrders.length > 0) {
                    if ((draggedOrder.origin_id !== onTruckOrders[0].origin_id) || (draggedOrder.destination_id !== onTruckOrders[0].destination_id)) {
                        return alert('Orders must have identical origins and identical destinations!')
                    }
                }

                setOffTruckOrders(prev => prev.filter(order => order.id !== active.id))
                setOnTruckOrders(prev => [...prev, draggedOrder])

            }
        }
    }

    function removeFromTruck(orderId) {
        const order = onTruckOrders.find(order => order.id === orderId)
        setOnTruckOrders(currentState => currentState.filter(o => o.id !== orderId))
        setOffTruckOrders(currentState => [...currentState, order])
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div id='header-div'>
                <h1>Build Shipment</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{display: 'block'}}>Total Weight: </span>
                        <span style={{display: 'block'}}>{`${totalWeight} lbs.`}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{display: 'block'}}>Distance: </span>
                        <span style={{display: 'block'}}>{`${distance} mi.`}</span>
                    </div>
                {(rates.length) > 0 && (
                    <h4>Low Cost Carrier: {rates[0].carrier} {`($${rates?.[0].rate.toFixed(2)})`}</h4>)}
            </div>
            
            <TruckDropZone
                onTruckOrders={onTruckOrders}
                removeFromTruck={removeFromTruck}
                carrierList={carrierList}
                equipmentTypes={equipmentTypes}
                modeList={modeList}
                mode={mode}
                totalWeight={totalWeight}
                setTotalWeight={setTotalWeight}
                setMode={setMode}
                carrier={carrier}
                setCarrier={setCarrier}
                equipmentType={equipmentType}
                setEquipmentType={setEquipmentType}
                pickDate={pickDate}
                setPickDate={setPickDate}
                dropDate={dropDate}
                setDropDate={setDropDate}
                createShipment={createShipment}
                distance={distance}
            />
            <OffTruckOrdersTable offTruckOrders={offTruckOrders} />
        </DndContext>
    )
}

export default BuildShipments;