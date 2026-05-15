import { Table, Button, Input, Indicator, Image, Modal, Accordion, Tabs, Badge } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { NotificationContext } from '../contexts/NotificationsContext';
import '../styles/manageCarriers.css'
import scrollIcon from '../assets/scroll.svg'
import checkIcon from '../assets/check.svg'
import xIcon from '../assets/x.svg'
import refreshToken from '../utils/refresh';

function ManageCarriers({ auth, user, setAuth }) {

    const navigate = useNavigate()

    const API_URL = import.meta.env.VITE_API_URL

    const [contracts, setContracts] = useState([])
    const [currentTab, setCurrentTab] = useState('active')

    const [opened, { open, close }] = useDisclosure(false);

    const contextData = useContext(NotificationContext);
    const fetchProposedContracts = contextData?.fetchPendingContracts;
    const proposedContractsCount = contextData?.pendingContractsCount;

    useEffect(() => {
        fetchContracts('active');
    }, [])

    //fetch all carriers
    async function fetchContracts(status) {
        try {
            let response = await fetch(`${API_URL}/api/shipper/contracts?status=${status}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/contracts?status=${status}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            let result = await response.json();

            if (!result.contracts) {
                alert(result.message)
            }

            setContracts(result.contracts)
        } catch (error) {
            console.log(error)
            alert(`Error: ${error}`)
        }
    }

    async function updateContract(id, status) {
        try {
            let response = await fetch(`${API_URL}/api/shipper/contracts/${id}?status=${status}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/contracts/${id}?status=${status}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            let result = await response.json();

            if (!result.contract.id === id) {
                return alert('Could not find contract to delete')
            }

            alert(status === 'rejected' ? 'Proposed contract successfully deleted' : 'Contract accepted');

            fetchContracts(currentTab)

        } catch (error) {
            console.log(error);
            alert(`Error: ${error}`)
        }
    }


    return (
        <div id='manage-carriers-container'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Manage Contracts</h1>
            </div>
            <Tabs defaultValue='active'>
                <Tabs.List>
                    <Tabs.Tab style={{ width: '33%' }} color='green' value='active' onClick={() => { setCurrentTab('active'); fetchContracts('active') }}><Badge color='green'>Active</Badge></Tabs.Tab>
                    <Tabs.Tab style={{ width: '33%' }} value='pending' onClick={() => { setCurrentTab('pending'); fetchContracts('pending'); fetchProposedContracts() }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}><Badge>Proposed</Badge>{(proposedContractsCount > 0) && <Indicator></Indicator>}</div></Tabs.Tab>
                    <Tabs.Tab style={{ width: '34%' }} color='red' value='expired' onClick={() => { setCurrentTab('expired'); fetchContracts('expired') }}><Badge color='red'>Inactive</Badge></Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value='active'>
                    <Accordion style={{ color: 'white' }}>
                        {contracts.map(contract => (
                            <Accordion.Item key={contract.id} value={contract.id}>
                                <Accordion.Control style={{ color: 'white' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                                        <h3>{contract.carrier}</h3>
                                        <span>Expires in: {Math.floor((new Date(contract.end_date) - Date.now()) / (1000 * 60 * 60 * 24))} days</span>
                                    </div>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Table>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Distance Band</Table.Th>
                                                <Table.Th>Flat Rate</Table.Th>
                                                <Table.Th>Per Mile Rate</Table.Th>
                                                <Table.Th>Fuel Surcharge %</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {contract.rates.map(rate => (
                                                <Table.Tr key={rate.rateId}>
                                                    <Table.Td>{rate.min_distance} {rate.max_distance ? '-' : ''} {rate.max_distance ? rate.max_distance : '+'} miles</Table.Td>
                                                    <Table.Td>${rate.flat_rate}</Table.Td>
                                                    <Table.Td>${rate.per_mile_rate}</Table.Td>
                                                    <Table.Td>{rate.fuel_surcharge_percentage}</Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Tabs.Panel>
                <Tabs.Panel value='pending'>
                    {proposedContractsCount > 0 ? <Accordion style={{ color: 'white' }}>
                        {contracts.map(contract => (
                            <Accordion.Item key={contract.id} value={contract.id}>
                                <Accordion.Control style={{ color: 'white' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                                        <span>{contract.carrier}</span>
                                        <div style={{ display: 'flex', gap: '3rem' }}>
                                            <span>Contract Range: {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}</span>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <Image className='approve-deny-btn' onClick={(e) => { e.stopPropagation(); updateContract(contract.id, 'active'); fetchProposedContracts() }} src={checkIcon} h={24} w={'auto'} />
                                                <Image className='approve-deny-btn' onClick={(e) => { e.stopPropagation(); updateContract(contract.id, 'rejected'); fetchProposedContracts() }} src={xIcon} h={24} w={'auto'} />
                                            </div>

                                        </div>
                                    </div>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Table>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Distance Band</Table.Th>
                                                <Table.Th>Flat Rate</Table.Th>
                                                <Table.Th>Per Mile Rate</Table.Th>
                                                <Table.Th>Fuel Surcharge %</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {contract.rates.map(rate => (
                                                <Table.Tr key={rate.rateId}>
                                                    <Table.Td>{rate.min_distance} {rate.max_distance ? '-' : ''} {rate.max_distance ? rate.max_distance : '+'} miles</Table.Td>
                                                    <Table.Td>${rate.flat_rate}</Table.Td>
                                                    <Table.Td>${rate.per_mile_rate}</Table.Td>
                                                    <Table.Td>{rate.fuel_surcharge_percentage}</Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '6rem' }}><h3>No proposed contracts at this time.</h3></div>}
                </Tabs.Panel>
                <Tabs.Panel value='expired'>
                    <Accordion>
                        {contracts.map(contract => (
                            <Accordion.Item key={contract.id} value={contract.id}>
                                <Accordion.Control style={{ color: 'white' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                                        <h3>{contract.carrier}</h3>
                                        <span>Expired: {-(Math.floor((new Date(contract.end_date) - Date.now()) / (1000 * 60 * 60 * 24)))} days ago</span>
                                    </div>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Table>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Distance Band</Table.Th>
                                                <Table.Th>Flat Rate</Table.Th>
                                                <Table.Th>Per Mile Rate</Table.Th>
                                                <Table.Th>Fuel Surcharge %</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {contract.rates.map(rate => (
                                                <Table.Tr key={rate.rateId}>
                                                    <Table.Td>{rate.min_distance} {rate.max_distance ? '-' : ''} {rate.max_distance ? rate.max_distance : '+'} miles</Table.Td>
                                                    <Table.Td>${rate.flat_rate}</Table.Td>
                                                    <Table.Td>${rate.per_mile_rate}</Table.Td>
                                                    <Table.Td>{rate.fuel_surcharge_percentage}</Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}

export default ManageCarriers;