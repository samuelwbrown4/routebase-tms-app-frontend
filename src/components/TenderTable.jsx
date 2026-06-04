import {useState} from 'react'
import {Table , Image , Button} from '@mantine/core';
import acceptIcon from '../assets/check.svg';
import rejectIcon from '../assets/x.svg';
import '../styles/dashboard.css';

function TenderTable({shipments , acceptRejectTender , user , setOpenRetender , setSelectedShipment}){

    

    return(
        <Table id='tender-table'>
            <Table.Thead>
                <Table.Tr id='header-row'>
                    <Table.Th>Shipment #</Table.Th>
                    <Table.Th>Origin</Table.Th>
                    <Table.Th>Origin City/State</Table.Th>
                    <Table.Th>Destination</Table.Th>
                    <Table.Th>Dest City/State</Table.Th>
                    <Table.Th>Requested Ship Date</Table.Th>
                    <Table.Th>Requested Delivery Date</Table.Th>
                    {user.client === 'carrier' && <Table.Th>Rate</Table.Th>}
                    <Table.Th style={{ textAlign: 'center' }}>Action</Table.Th>
                        </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                   {shipments.length === 0 && 
                    <Table.Tr>
                        <Table.Td colSpan={9}><h2 style={{textAlign: 'center'}}>{user?.client === 'shipper' ? 'No Rejected Tenders' : 'No Pending Tenders'}</h2></Table.Td>
                    </Table.Tr>}
                {shipments.length > 0 && shipments.map(s=>
                    <Table.Tr key={s.id} className='row'>
                        <Table.Td>{s.shipment_number}</Table.Td>
                        <Table.Td>{s.direction_category === 'outbound' ? s.shipper_name : s.supplier_name}</Table.Td>
                        <Table.Td>{`${s.direction_category === 'outbound' ? s.shipper_city : s.supplier_city}, ${s.direction_category === 'outbound' ? s.shipper_state : s.supplier_state}`}</Table.Td>
                        <Table.Td>{s.direction_category === 'outbound' ? s.customer_name : s.shipper_name}</Table.Td>
                        <Table.Td>{`${s.direction_category === 'outbound' ? s.customer_city : s.shipper_city}, ${s.direction_category === 'outbound' ? s.customer_state : s.shipper_state}`}</Table.Td>
                        <Table.Td>{new Date(s.requested_pickup_date).toLocaleDateString()}</Table.Td>
                        <Table.Td>{new Date(s.requested_delivery_date).toLocaleDateString()}</Table.Td>
                        {user.client === 'carrier' && <Table.Td>{`$${s.rate}`}</Table.Td>}
                        <Table.Td>
                            {user?.client === 'carrier' && <div style={{display: 'flex' , gap: '.5rem'}}>
                                <Image onClick={()=>acceptRejectTender('tender_accepted',s.id,s.shipment_number)}id='tender-accept-btn' src={acceptIcon} h={24} w={'auto'}/>
                                <Image onClick={()=>acceptRejectTender('tender_rejected',s.id,s.shipment_number)} id='tender-reject-btn' src={rejectIcon} h={24} w={'auto'}/>
                            </div>}
                            {user?.client === 'shipper' && 
                                <div style={{display: 'flex' , gap: '.5rem'}}>
                                    <Button variant='outline' size='xs' color='#f6bd02' onClick={()=>{setSelectedShipment(s) ; setOpenRetender(true)}}>Retender</Button>
                                    <Button variant='outline' size='xs' color='blue' onClick={(()=>acceptRejectTender('spot_reroute' , s.id , s.shipment_number))}>Send to Spot</Button>
                                </div>
                            }
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    )
}

export default TenderTable;