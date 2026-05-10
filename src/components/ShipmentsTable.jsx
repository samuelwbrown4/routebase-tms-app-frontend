import { DataTable , useDataTableColumns} from "mantine-datatable";

function ShipmentsTable({ sortStatus , setSortStatus , filteredShipments , selectedShipment , setSelectedShipment}) {

        const sortedShipments = [...filteredShipments].sort((a, b) => {
        const { columnAccessor, direction } = sortStatus;
        if (a[columnAccessor] < b[columnAccessor]) return direction === 'asc' ? -1 : 1;
        if (a[columnAccessor] > b[columnAccessor]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const key = 'shipments-table';
    const { effectiveColumns } = useDataTableColumns({
        key,
        columns: [
            {
                accessor: 'shipment_number',
                title: 'Shipment #',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true
            },

            {
                accessor: 'origin',
                title: 'Origin Name',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true
            },

            {
                accessor: 'origin_city',
                title: 'Origin City',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true
            },
            {
                accessor: 'origin_state',
                title: 'Origin State',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true
            },
            {
                accessor: 'origin_zip',
                title: 'Origin Zip',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true
            },
            {
                accessor: 'destination',
                title: 'Destination Name',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true
            },

            {
                accessor: 'destination_city',
                title: 'Destination City',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true
            },
            {
                accessor: 'destination_state',
                title: 'Destination State',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true
            },
            {
                accessor: 'destination_zip',
                title: 'Destination Zip',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true
            },
            {
                accessor: 'requested_pickup_date',
                title: 'Req. Pickup Date',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true,
                render: ({ requested_pickup_date }) => new Date(requested_pickup_date).toLocaleDateString()
            },
            {
                accessor: 'requested_delivery_date',
                title: 'Req. Delivery Date',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true,
                render: ({ requested_delivery_date }) => new Date(requested_delivery_date).toLocaleDateString()
            },
            {
                accessor: 'status',
                title: 'Status',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true,
                render: ({ status }) => status.toUpperCase().replaceAll('_', ' ')
            }
        ]
    })


    return (
        <DataTable id="data-table"

            highlightOnHover
            storeColumnsKey={key}
            columns={effectiveColumns}
            resizableColumns
            records={sortedShipments}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            onRowClick={({ record }) => selectedShipment?.id === record.id ? setSelectedShipment(null) : setSelectedShipment(record)}
            rowClassName={(record) => record.id === selectedShipment?.id ? 'selected-shipment-row' : ''}
        />
    )
};

export default ShipmentsTable;