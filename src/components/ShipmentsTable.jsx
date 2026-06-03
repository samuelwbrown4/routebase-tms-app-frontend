import { DataTable , useDataTableColumns} from "mantine-datatable";
import {useNavigate} from 'react-router-dom';
import { Image , Badge } from "@mantine/core";
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
                accessor: 'shipment_number',
                title: 'Shipment #',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true
            },

            {
                accessor: 'origin',
                title: 'Origin',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true,
                render: ({direction_category , shipper_name , shipper_city , shipper_state , supplier_name , supplier_city , supplier_state}) => direction_category === 'outbound' ? `${shipper_name} - ${shipper_city}, ${shipper_state}` : `${supplier_name} - ${supplier_city}, ${supplier_state}`
            },

            {
                accessor: 'destination',
                title: 'Destination',
                ellipsis: true,
                resizable: true,
                draggable: true,
                sortable: true,
                render: ({direction_category , customer_name , customer_city , customer_state , shipper_name , shipper_city , shipper_state}) => direction_category === 'outbound' ? `${customer_name} - ${customer_city}, ${customer_state}` : `${shipper_name} - ${shipper_city}, ${shipper_state}`
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
            },
            {
                accessor: 'direction_category',
                title: 'Direction',
                render: ({direction_category}) => <Badge color={direction_category === 'outbound' ? 'green' : 'blue'}>{direction_category.toUpperCase()}</Badge>,
                resizable: false,
                width: 120
            },
            {
                accessor: 'actions',
                title: 'Actions',
                render: (shipment) => 
                    <div style={{display: 'flex' , gap: '0.5rem'}}>   
                        <Image id='view-shipment-btn' src={eyeIcon} h={16} w={'auto'} onClick={(e)=>{e.stopPropagation(); navigate(`/shipments/details/${shipment.id}`)}}/>
                        <Image id='bol-btn' src={paperclipIcon} h={16} w={'auto'} onClick={(e)=>{e.stopPropagation(); handleDocClick(shipment.id)}}/>
                        <Image id='chat-btn' src={chatIcon} h={16} w={'auto'} onClick={(e)=>{e.stopPropagation() ; getConversation(shipment.id)}}/>
                    </div>,
                resizable: false,
                width: 100
            }
            
        ]
    })


    return (
        <DataTable id="data-table"
            highlightOnHover
            storeColumnsKey={key}
            columns={effectiveColumns}
            rowBorderColor={'#adadad'}
            records={sortedShipments}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            onRowClick={({ record }) => selectedShipment?.id === record.id ? setSelectedShipment(null) : setSelectedShipment(record)}
            rowClassName={(record) => record.id === selectedShipment?.id ? 'selected-shipment-row' : ''}
            defaultColumnProps={{ width: 120 }}
        />
    )
};

export default ShipmentsTable;