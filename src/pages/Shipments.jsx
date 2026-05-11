import { useState, useEffect } from 'react';
import ShipmentsTable from '../components/ShipmentsTable';
import { Select, Image } from '@mantine/core';
import searchIcon from '../assets/magnifying-glass.svg';

function Shipments({ auth, user }) {

    const API_URL = import.meta.env.VITE_API_URL

    const [shipmentsList, setShipmentsList] = useState([])
    const [filteredShipments, setFilteredShipments] = useState([])
    const [selectedShipment, setSelectedShipment] = useState(null)
    const [searchValue, setSearchValue] = useState('')
    const [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        getShipments();
    }, [])

    useEffect(() => {
        setFilteredShipments(shipmentsList)
    }, [shipmentsList])

    useEffect(() => {
        if (searchValue.length < 3) {
            return
        }
        let timeout = setTimeout(() => {
            handleSearch()
        }, 1000)


        return () => clearTimeout(timeout)
    }, [searchValue])

    const [sortStatus, setSortStatus] = useState({
        columnAccessor: 'requested_pickup_date',
        direction: 'asc'
    })

    function handleStatusFilter(value = '') {

        if (value === '') {
            return setFilteredShipments(shipmentsList)
        }

        setFilteredShipments(shipmentsList.filter(shipment => shipment.status.toLowerCase().includes(value)));
    }

    async function handleSearch() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/shipments/search?value=${searchValue}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            let result = await response.json();

            setSearchResults(result.shipments)
        } catch (error) {
            console.log(error)
        }
    }

    function handleSearchSelect(value) {
        setFilteredShipments(shipmentsList.filter(s => s.id === value))
    }

    async function getShipments() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/shipments?status=${['planned', 'routed', 'in_transit', 'delivered'].join(',')}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            let result = await response.json();

            if (!result.shipments) {
                alert(`${result.err}`)
            }

            setShipmentsList(result.shipments)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDocClick(shipmentId) {
        try {
            let response = await fetch(`${API_URL}/api/shipper/documents/${shipmentId}/bol`, {
                headers: {
                    'Authorization': `Bearer ${auth}`
                }
            });

            let object = await response.blob();

            const objectUrl = URL.createObjectURL(object);
            window.open(objectUrl, '_blank');
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div id='header-div'>
                <h1>Shipments</h1>
                <Select searchable clearable clearSectionMode='both' nothingFoundMessage='No matching shipments.' data={searchResults?.map(result => ({ value: result.id, label: result.shipment_number }))} searchValue={searchValue} 
                dropdownOpened={searchValue.length > 2 ? true : false}
                onSearchChange={setSearchValue} onChange={handleSearchSelect} onClear={getShipments} placeholder='Search...' rightSection={<Image src={searchIcon} h={24} w={'auto'} />} styles={{ input: { backgroundColor: 'transparent' , color: 'white' } }} />
            </div>
            <div>
                <ShipmentsTable sortStatus={sortStatus} setSortStatus={setSortStatus} filteredShipments={filteredShipments} selectedShipment={selectedShipment} setSelectedShipment={setSelectedShipment} handleDocClick={handleDocClick} />
            </div>
        </div>
    )
}

export default Shipments;