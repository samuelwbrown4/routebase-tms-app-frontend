import { DataTable , useDataTableColumns} from "mantine-datatable";
import {useNavigate} from 'react-router-dom';
import { Image } from "@mantine/core";
import eyeIcon from '../assets/eye.svg';
import paperclipIcon from '../assets/paperclip.svg';
import chatIcon from '../assets/chat.svg';

const API_URL = import.meta.env.VITE_API_URL




function ShipmentsTable({ sortStatus , setSortStatus , filteredShipments , selectedShipment , setSelectedShipment , handleDocClick, getConversation}) {

    const navigate = useNavigate()

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
                accessor: 'actions',
                title: 'Actions',
                render: (shipment) => 
                    <div style={{display: 'flex' , gap: '0.5rem'}}>   
                        <Image src={eyeIcon} h={16} w={'auto'} onClick={(e)=>{e.stopPropagation(); navigate(`/shipments/details/${shipment.id}`)}}/>
                        <Image src={paperclipIcon} h={16} w={'auto'} onClick={(e)=>{e.stopPropagation(); handleDocClick(shipment.id)}}/>
                        <Image src={chatIcon} h={16} w={'auto'} onClick={(e)=>{e.stopPropagation() ; getConversation(shipment.id)}}/>
                    </div>
            },
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