import { Table , Button} from '@mantine/core';

function CustomerLocationsTable({ customerLocations }) {
   return ( 
   <div>
        <Table style={{ color: 'white' }}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Location Name</Table.Th>
                    <Table.Th>Address</Table.Th>
                    <Table.Th>City</Table.Th>
                    <Table.Th>State</Table.Th>
                    <Table.Th>Zip Code</Table.Th>
                    <Table.Th></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {customerLocations.map(c => (
                    <Table.Tr key={c.id}>
                        <Table.Td>{c.customer_name}</Table.Td>
                        <Table.Td>{c.cust_loc_name}</Table.Td>
                        <Table.Td>{c.cust_loc_address}</Table.Td>
                        <Table.Td>{c.cust_loc_city}</Table.Td>
                        <Table.Td>{c.cust_loc_state}</Table.Td>
                        <Table.Td>{c.cust_loc_zip_code}</Table.Td>
                        <Table.Td><Button>Edit</Button></Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    </div>
    )

}

export default CustomerLocationsTable;