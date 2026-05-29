import { useLocation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import OffTruckOrdersTable from '../components/OffTruckOrdersTable';
import TruckDropZone from '../components/TruckDropZone';
import '../styles/buildShipments.css'
import { notifications } from '@mantine/notifications';
import { Loader, Switch, Tooltip } from '@mantine/core';
import refreshToken from '../utils/refresh';

function BuildShipments({ auth, user, setAuth }) {

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
    const [selectedRate, setSelectedRate] = useState(null);
    const [rate, setRate] = useState(null);
    const [spotOnOff, setSpotOnOff] = useState(false);
    const [recommendedMode, setRecommendedMode] = useState('')
    const [expiry, setExpiry] = useState('2')

    const [distanceLoading, setDistanceLoading] = useState(false)
    const [ratesLoading, setRatesLoading] = useState(false)

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

    useEffect(() => {
        if (spotOnOff) {
            return
        }
        setRates([])
    }, [distance, spotOnOff])

    useEffect(() => {
        navigate('/build-shipments', {
            state: { potentialLoads: offTruckOrders },
            replace: true
        })
    }, [offTruckOrders])

    useEffect(() => {
        spotOnOff ? setExpiry('2') : setExpiry(null)
    }, [spotOnOff])

    useEffect(() => {
        console.log('expires in', expiry, 'hrs')
    }, [expiry])

    useEffect(() => {
        if (!selectedRate) {
            return
        }
        const matchRate = rates.find(r => r.id === selectedRate);
        if (matchRate) {
            setCarrier(matchRate.carrierId);
            setRate(matchRate.rate)
        }
    }, [selectedRate])

    useEffect(() => {
        totalWeight > 10000 ? setRecommendedMode('TL') : setRecommendedMode('LTL')
    }, [totalWeight])


    async function fetchCarrierList() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/carriers`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/carriers`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

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

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/equipment-types`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

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
                    companyId : onTruckOrders[0].company_id,
                    directionCategory: onTruckOrders[0].direction_category,
                    carrier: carrier,
                    equipmentType: equipmentType,
                    status: spotOnOff ? 'pending_carrier' : 'planned',
                    totalWeight: totalWeight,
                    pickDate: new Date(pickDate).toISOString().split('T')[0],
                    dropDate: new Date(dropDate).toISOString().split('T')[0],
                    userId: user.id,
                    orders: onTruckOrders.map(order => order.id),
                    distance: distance,
                    rate: rate,
                    shipmentType: spotOnOff ? 'spot' : 'contract',
                    expiry

                })
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate)
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/shipments`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({
                            originId: onTruckOrders[0].origin_id,
                            destinationId: onTruckOrders[0].destination_id,
                            companyId: onTruckOrders[0].company_id,
                            directionCategory: onTruckOrders[0].direction_category,
                            carrier: carrier,
                            equipmentType: equipmentType,
                            status: spotOnOff ? 'pending_carrier' : 'planned',
                            totalWeight: totalWeight,
                            pickDate: new Date(pickDate).toISOString().split('T')[0],
                            dropDate: new Date(dropDate).toISOString().split('T')[0],
                            userId: user.id,
                            orders: onTruckOrders.map(order => order.id),
                            distance: distance,
                            rate: rate,
                            shipmentType: spotOnOff ? 'spot' : 'contract',
                            expiry
                        })
                    });
                }
            }

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
            setDistanceLoading(true)
            setRatesLoading(true);
            const originLat = onTruckOrders?.[0].direction_category === 'outbound' ? onTruckOrders?.[0].shipper_lat : onTruckOrders?.[0].supplier_lat;
            const originLong = onTruckOrders?.[0].direction_category === 'outbound' ? onTruckOrders?.[0].shipper_long : onTruckOrders?.[0].supplier_long;
            const destLat = onTruckOrders?.[0].direction_category === 'outbound' ? onTruckOrders?.[0].customer_lat : onTruckOrders?.[0].shipper_lat;
            const destLong = onTruckOrders?.[0].direction_category === 'outbound' ? onTruckOrders?.[0].customer_long : onTruckOrders?.[0].shipper_long;

            let response = await fetch(`${API_URL}/api/shipper/proxy/distance`, {
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

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/proxy/distance`, {
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
                }
            }

            const result = await response.json();

            console.log(result)

            if (!result.distance) {
                return alert('Distance could not be found')
            }

            setDistance(result.distance);
            setDistanceLoading(false)

            fetchRates(result.distance)


        } catch (error) {
            console.log(error)
            alert(`Error: ${error}`)
        }
    }

    async function fetchRates(dist) {
        if (!(dist > 0) || spotOnOff) {
            return setRates([])
        }
        try {
            setRates([])


            let response = await fetch(`${API_URL}/api/shipper/rates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({
                    distance: dist
                })
            })

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/rates`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({
                            distance: dist
                        })
                    })
                }
            }

            const result = await response.json();

            console.log('Raw backend result:', result.rates); 


            if (!result.rates) {
                return alert(result.message)
            }

            console.log(result.rates)

            calculateRates(result.rates, dist)
            setRatesLoading(false);
        } catch (error) {
            console.log(error)
            alert(`Error: ${error}`)
            setRatesLoading(false)
        }
    }

    function calculateRates(ratesArray, dist) {
        const availableRates = []

        ratesArray.forEach(function (rate) {
            let rateObject = {
                id: rate.rateid,
                carrier: rate.carrier,
                carrierId: rate.carrierid,
                rate: parseFloat(rate.flat_rate) + (parseFloat(dist) * parseFloat(rate.per_mile_rate)) + (parseFloat(rate.flat_rate) * parseFloat(rate.fuel_surcharge_percentage) / 100)
            }

            availableRates.push(rateObject)
        })

        availableRates.sort((a, b) => a.rate - b.rate);

        console.log('Available rates: ', availableRates)

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
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'gray', minHeight: '40px', marginBottom: '.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', borderRight: '3px solid gray', textAlign: 'center', flex: .5, fontSize: '.8rem' }}>
                    <span style={{ fontWeight: '750' }}>Spot Market:</span>
                    <Tooltip label={spotOnOff ? 'Turn Spot Market Off?' : 'Turn Spot Market On?'} refProp="rootRef">
                        <Switch checked={spotOnOff} onChange={(e) => setSpotOnOff(e.target.checked)} onLabel="ON" offLabel="OFF" color='green'></Switch>
                    </Tooltip>


                </div>
                <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', borderRight: '3px solid gray', flex: .5, textAlign: 'center', justifyContent: 'center', fontSize: '.8rem' }}>
                    <span style={{ display: 'block', fontWeight: '750' }}>Total Weight: </span>
                    <span style={{ display: 'block', color: 'white' }}>{`${totalWeight} lbs.`}</span>
                </div>
                <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', borderRight: '3px solid gray', flex: .5, justifyContent: 'center', fontSize: '.8rem' }}>
                    <span style={{ display: 'block', fontWeight: '750' }}>Distance: </span>
                    {distanceLoading && <Loader type='dots' color='yellow' />}
                    <span style={{ display: 'block', color: 'white' }}>{distance > 0 ? `${distance} mi.` : ''}</span>
                </div>
                <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flex: .8, justifyContent: 'center', fontSize: '.8rem' }}>
                    <span style={{ fontWeight: '750' }}>Low Cost Carrier:</span>
                    {ratesLoading && <Loader type='dots' color='yellow' />}
                    <span style={{ color: 'white' }}> {rates.length !== 0 ? `${rates[0].carrier} ($${rates?.[0].rate.toFixed(2)})` : ''}</span>
                </div>


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
                distanceLoading={distanceLoading}
                rates={rates}
                setSelectedRate={setSelectedRate}
                spotOnOff={spotOnOff}
                recommendedMode={recommendedMode}
                expiry={expiry}
                setExpiry={setExpiry}
            />
            <OffTruckOrdersTable offTruckOrders={offTruckOrders} />
        </DndContext>
    )
}

export default BuildShipments;