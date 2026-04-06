import { useDraggable } from '@dnd-kit/core'
import { Table } from '@mantine/core'
import '../styles/offTruckOrders.css'

function DraggableRow({ order }) {

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: order.id
    })

    const style = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab'
    }

    return (
        <Table.Tr ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <Table.Td>{order.order_number}</Table.Td>
            <Table.Td>{order.origin}</Table.Td>
            <Table.Td>{order.destination}</Table.Td>
            <Table.Td>{order.weight}</Table.Td>
        </Table.Tr>
    )
}

function OffTruckOrdersTable({ offTruckOrders }) {
    console.log('offTruckOrders:', offTruckOrders)
    return (
        <Table className='off-truck-table'>
            <Table.Thead>
                <Table.Tr>
                    <Table.Td>Order No.</Table.Td>
                    <Table.Td>Origin</Table.Td>
                    <Table.Td>Destination</Table.Td>
                    <Table.Td>Weight</Table.Td>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {offTruckOrders.map(order => (
                    <DraggableRow key={order.id} order={order} />
                ))}
            </Table.Tbody>
        </Table>
    )
}

export default OffTruckOrdersTable