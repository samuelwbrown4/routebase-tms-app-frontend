import { Table , Button} from '@mantine/core';

function UsersTable({ userDetails }) {
   return ( 
   <div>
        <Table style={{ color: 'white' }}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>First Name</Table.Th>
                    <Table.Th>Last Name</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Phone</Table.Th>
                    <Table.Th>Location</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {userDetails.map(user => (
                    <Table.Tr key={user.id}>
                        <Table.Td>{user.first_name}</Table.Td>
                        <Table.Td>{user.last_name}</Table.Td>
                        <Table.Td>{user.email}</Table.Td>
                        <Table.Td>{user.phone_number}</Table.Td>
                        <Table.Td>{user.name}</Table.Td>
                        <Table.Td>{user.role.toUpperCase()}</Table.Td>
                        <Table.Td><Button>Edit</Button></Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    </div>
    )

}

export default UsersTable;