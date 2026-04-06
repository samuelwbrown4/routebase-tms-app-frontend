import { useDroppable } from '@dnd-kit/core'
import { Button, Image, Select , CloseButton } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates';
import '../styles/offTruckOrders.css'

function TruckDropZone({ onTruckOrders, removeFromTruck, carrierList, equipmentTypes, setMode, modeList, mode, carrier, setCarrier, equipmentType, setEquipmentType, pickDate, setPickDate, dropDate, setDropDate, totalWeight, setTotalWeight , createShipment }) {

    const { isOver, setNodeRef } = useDroppable({
        id: 'truck-zone'
    })
    console.log('mode:', mode)
    console.log('equipmentTypes:', equipmentTypes)
    console.log('filtered:', equipmentTypes.filter(t => t.mode === mode))

    const sumWeight = onTruckOrders.reduce((sum, order) => sum + Number(order.weight), 0);

    setTotalWeight(sumWeight)

    return (
        <div style={{ display: 'flex', gap: '5rem' }}>
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
                            <CloseButton onClick={() => removeFromTruck(order.id)}></CloseButton>
                        </div>
                    ))}
                </div>
                <Image src={'/truck-cab.png'} alt='truck-cab' h={'auto'} w={'30%'} style={{ transform: 'translateY(15%)', filter: isOver ? 'brightness(2) sepia(1) saturate(17) hue-rotate(324deg)' : 'brightness(1)' }} />
            </div>
            {(onTruckOrders.length > 0) && (equipmentTypes.length > 0) && <div id='shipment-overview'>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ width: '100%' }}>Mode: </span>
                        <Select classNames={{ input: 'shipment-overview-select', wrapper: 'shipment-overview-select-wrapper' }} placeholder='...'
                            onChange={(_value, option) => setMode(_value)}
                            data={modeList} description={(totalWeight < 10000) ? 'LTL recommended' : ''} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ width: '100%' }}>Equipment Type: </span>
                        <Select classNames={{ input: 'shipment-overview-select', wrapper: 'shipment-overview-select-wrapper' }} placeholder='...'
                            data={equipmentTypes.filter(t => t.mode === mode).map(type => ({
                                value: type.id,
                                label: type.name
                            }))} onChange={(_value, option) => setEquipmentType(_value)} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ width: '100%' }}>Carrier: </span>
                        <Select classNames={{ input: 'shipment-overview-select', wrapper: 'shipment-overview-select-wrapper' }} placeholder='...'
                            data={carrierList.map(carrier => ({
                                value: carrier.id,
                                label: carrier.name
                            }))} onChange={(_value, option) => setCarrier(_value)} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ width: '100%' }}>Total Weight: </span>
                        <span style={{ width: '100%' }}>{`${totalWeight} lbs.`}</span>
                    </div>
                    
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ width: '100%' }}>Pickup: </span>
                        <DatePickerInput classNames={{ input: 'date-picker', wrapper: 'date-picker-wrapper' }} valueFormat="YYYY-MM-DD" highlightToday={true}
                            onChange={(date) => setPickDate(date)} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ width: '100%' }}>Dropoff: </span>
                        <DatePickerInput classNames={{ input: 'date-picker', wrapper: 'date-picker-wrapper' }} valueFormat="YYYY-MM-DD" highlightToday='true'
                            onChange={(date) => setDropDate(date)} />
                    </div>
                    {(mode !== '') && (equipmentType !== '') && (carrier !== '') && (pickDate !== '') && (dropDate !== '') && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button onClick={()=>createShipment()}>Tender Shipment</Button>
                    </div>}
                </div>

            </div>}
        </div>
    )
}

export default TruckDropZone;