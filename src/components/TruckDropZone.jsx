import { useDroppable } from '@dnd-kit/core'
import { Button, Image, Select, CloseButton, NumberInput } from '@mantine/core'
import {useNavigate} from 'react-router-dom'
import { DatePickerInput } from '@mantine/dates';
import '../styles/offTruckOrders.css'
import calendarIcon from '../assets/calendar.svg';
import hourglassIcon from '../assets/hourglass-medium.svg';

function TruckDropZone({offTruckOrders, onTruckOrders, removeFromTruck, carrierList, equipmentTypes, setMode, modeList, mode, carrier, setCarrier, equipmentType, setEquipmentType, pickDate, setPickDate, dropDate, setDropDate, totalWeight, setTotalWeight, createShipment, distance, rates, setSelectedRate, spotOnOff, recommendedMode, expiry, setExpiry }) {

    const navigate = useNavigate()

    const { isOver, setNodeRef } = useDroppable({
        id: 'truck-zone'
    })
    


    const sumWeight = onTruckOrders.reduce((sum, order) => sum + Number(order.weight), 0);
    setTotalWeight(sumWeight)

    return (
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            {(onTruckOrders.length > 0) && (equipmentTypes.length > 0) && <div id='shipment-overview'>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', flex: '1 1 0', minWidth: 0 }}>
                    <span style={{ color: 'gray', fontWeight: '750', fontSize: '.8rem' }}>Mode:</span>
                    <Select
                        w='100%'
                        classNames={{ input: 'shipment-overview-select', wrapper: 'shipment-overview-select-wrapper' }}
                        placeholder='...'
                        onChange={(_value) => setMode(_value)}
                        data={modeList.map(m => ({
                            value: m,
                            label: `${m} ${m === recommendedMode ? '(Recommended)' : ''}`
                        }))}
                        styles={{dropdown: {backgroundColor: '#1a1a1a' , borderColor: '#f6a802' , color: 'white'}}}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', flex: '1 1 0', minWidth: 0 }}>
                    <span style={{ color: 'gray', fontWeight: '750', fontSize: '.8rem' }}>Equipment Type:</span>
                    <Select
                        w='100%'
                        classNames={{ input: 'shipment-overview-select', wrapper: 'shipment-overview-select-wrapper' }}
                        placeholder='...'
                        data={equipmentTypes.filter(t => t.mode === mode).map(type => ({
                            value: type.id,
                            label: type.name
                        }))}
                        onChange={(_value) => setEquipmentType(_value)}
                        styles={{dropdown: {backgroundColor: '#1a1a1a' , borderColor: '#f6a802' , color: 'white'}}}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', flex: '1 1 0', minWidth: 0 }}>
                    <span style={{ color: 'gray', fontWeight: '750', fontSize: '.8rem' }}>Pickup:</span>
                    <DatePickerInput
                        w='100%'
                        rightSection={<Image src={calendarIcon} h={20} w={'auto'} />}
                        classNames={{ input: 'date-picker', wrapper: 'date-picker-wrapper' }}
                        valueFormat="YYYY-MM-DD"
                        highlightToday={true}
                        onChange={(date) => setPickDate(date)}
                        popoverProps={{ width: 250, height: 250}}
                        styles={{
                            calendarHeaderControl: {
                                width: 40,
                                height: 40,
                            },
                            calendarHeaderControlIcon: {
                                width: 24,
                                height: 24,
                            },
                            input: {
                                backgroundColor: '#3d3d3d', borderColor: '#555', height: '100%'
                            },
                            wrapper: {
                                height: '100%'
                            },
                            datePickerRoot: {backgroundColor: '#1a1a1a' , borderColor: '#f6a802' , color: 'white'}
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', flex: '1 1 0', minWidth: 0 }}>
                    <span style={{ color: 'gray', fontWeight: '750', fontSize: '.8rem' }}>Dropoff:</span>
                    <DatePickerInput
                        w='100%'
                        rightSection={<Image src={calendarIcon} h={20} w={'auto'} />}
                        classNames={{ input: 'date-picker', wrapper: 'date-picker-wrapper' }}
                        valueFormat="YYYY-MM-DD"
                        highlightToday={true}
                        onChange={(date) => setDropDate(date)}
                        popoverProps={{ width: 250, height: 250 }}
                        styles={{
                            calendarHeaderControl: {
                                width: 40,
                                height: 40,
                            },
                            calendarHeaderControlIcon: {
                                width: 24,
                                height: 24,
                            },
                            input: {
                                backgroundColor: '#3d3d3d', borderColor: '#555', height: '100%'
                            },
                            wrapper: {
                                height: '100%'
                            }
                        }}
                    />
                </div>

                {!spotOnOff && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', flex: '1 1 0', minWidth: 0 }}>
                    <span style={{ color: 'gray', fontWeight: '750', fontSize: '.8rem' }}>Carrier:</span>
                    <Select
                        w='100%'
                        classNames={{ input: 'shipment-overview-select', wrapper: 'shipment-overview-select-wrapper' }}
                        placeholder='...'
                        data={rates?.map(rate => ({
                            value: rate?.id,
                            label: `${rate.carrier} ($${rate.rate.toFixed(2)})`
                        })) || []}
                        onChange={(_value) => setSelectedRate(_value)}
                    />
                </div>}

                {spotOnOff && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', flex: '1 1 0', minWidth: 0 }}>
                    <span style={{ color: 'gray', fontWeight: '750', fontSize: '.8rem' }}>Expires In:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <NumberInput
                            styles={{
                                controls: { color: 'gray', borderLeft: '1px solid #f6a802' },
                                control: { color: 'gray', borderBottom: '1px solid #f6a802' }
                            }}
                            w='100%'
                            leftSection={<Image src={hourglassIcon} h={20} w={'auto'} />}
                            value={expiry}
                            classNames={{ wrapper: 'expires-input-wrapper', input: 'shipment-overview-select' }}
                            onChange={(value) => setExpiry(value)}
                        />
                        <span style={{ width: '50%' }}>Hours</span>
                    </div>
                </div>}

            </div>}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '1rem', padding: '1rem', marginBottom: '2rem', width: '60%' }}>
                    <div
                        ref={setNodeRef}
                        style={{
                            border: isOver ? '2px solid #f6a802' : '2px dashed #444',
                            borderRadius: '8px',
                            padding: '1rem',
                            minHeight: '200px',
                            width: '70%',
                            transition: 'border 0.2s'
                        }}
                    >
                        {onTruckOrders.length === 0 && (
                            <p style={{ color: '#888' }}>Drag orders here to add them to the shipment</p>
                        )}
                        {onTruckOrders.map(order => (
                            <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid #333', color: 'white' }}>
                                <span>{order.order_number}</span>
                                <span>{`Requested Ship Date: ${new Date(order.requested_ship_date.split('Z')[0]).toLocaleDateString()}`}</span>
                               { console.log('order req ship date' , order.requested_ship_date)}
                                <CloseButton onClick={() => removeFromTruck(order.id)} />
                            </div>
                        ))}
                    </div>
                    <Image src={'/truck-cab.png'} alt='truck-cab' h={'auto'} w={'30%'} style={{ transform: 'translateY(15%)', filter: isOver ? 'brightness(2) sepia(1) saturate(17) hue-rotate(324deg)' : 'brightness(1)' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginRight: '5rem' }}>
                    {(mode !== '') && (equipmentType !== '')  && (pickDate) && (dropDate) && onTruckOrders.length > 0 && 
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: '3rem' }}>
                            <Button color='green' radius='md' size='xl' className='tender-btn' onClick={() => createShipment()}>{spotOnOff ? 'Send to Spot Market' : 'Tender Shipment'}</Button>
                        </div>
                    }
                    {onTruckOrders.length === 0 && offTruckOrders.length === 0 &&
                    <div style={{display: 'flex' , flexDirection: 'column' , alignItems: 'center' , gap: '1rem'}}>
                        <span style={{color: '#adadad'}}>No orders left. Where to next?</span>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: onTruckOrders.length === 0 && offTruckOrders.length === 0 ? '' : '3rem', gap: '1rem' }}>
                            <Button color='blue' radius='md' size='sm' className='decision-btn' onClick={() => navigate('/open-orders')}>Open Orders</Button>
                            <Button color='blue' radius='md' size='sm' className='decision-btn' onClick={() => navigate('/shipments')}>Shipments</Button>
                            <Button color='blue' radius='md' size='sm' className='decision-btn' onClick={() => navigate('/spot-market')}>Spot Market</Button>
                        </div> 
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default TruckDropZone;