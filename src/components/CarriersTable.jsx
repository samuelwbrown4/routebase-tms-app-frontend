import { Table , Image} from '@mantine/core';
import '../styles/adminCarriers.css'
import editIcon from '../assets/note-pencil.svg'

function CarriersTable({ carriers , setOpenEdit , openEdit , setSelectedCarrier}) {
   return ( 
   <div>
        <Table id='carriers-table'>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th style={{color: 'white'}}>Name</Table.Th>
                    <Table.Th style={{color: 'white'}}>SCAC</Table.Th>
                    <Table.Th style={{color: 'white'}}>Address</Table.Th>
                    <Table.Th></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {carriers.map(carrier => (
                    <Table.Tr className='carriers-table-row'  key={carrier.id}>
                        <Table.Td>{carrier.name}</Table.Td>
                        <Table.Td>{carrier.scac.toUpperCase()}</Table.Td>
                        <Table.Td>{carrier.address}</Table.Td>
                        <Table.Td><Image className='edit-carrier-btn' src={editIcon} h={20} w={'auto'} onClick={()=>{setOpenEdit(!openEdit); setSelectedCarrier(carrier)}}/></Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    </div>
    )

}

export default CarriersTable;