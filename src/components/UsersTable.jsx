import { Table , Image} from '@mantine/core';
import '../styles/adminUser.css';
import editIcon from '../assets/note-pencil.svg'

function UsersTable({ userDetails , setSelectedUser , setOpenEdit}) {
   return ( 
        <Table id='users-table'>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th style={{color: 'white'}}>First Name</Table.Th>
                    <Table.Th style={{color: 'white'}}>Last Name</Table.Th>
                    <Table.Th style={{color: 'white'}}>Email</Table.Th>
                    <Table.Th style={{color: 'white'}}>Phone</Table.Th>
                    <Table.Th style={{color: 'white'}}>Location</Table.Th>
                    <Table.Th style={{color: 'white'}}>Role</Table.Th>
                    <Table.Th></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {userDetails.map(user => (
                    <Table.Tr className='user-table-row' style={{borderBottom: '1px solid #adadad'}}key={user.user_id}>
                        <Table.Td>{user.first_name}</Table.Td>
                        <Table.Td>{user.last_name}</Table.Td>
                        <Table.Td>{user.email}</Table.Td>
                        <Table.Td>{user.phone_number}</Table.Td>
                        <Table.Td>{user.location_name}</Table.Td>
                        <Table.Td>{user.role.toUpperCase()}</Table.Td>
                        <Table.Td><Image className='edit-user-btn' src={editIcon} h={20} w={'auto'} onClick={()=>{setOpenEdit(true) ; setSelectedUser(user)}}/></Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    )

}

export default UsersTable;