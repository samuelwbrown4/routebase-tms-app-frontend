import { Table, Button, Input, Indicator, Image, Modal, Accordion } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import '../styles/manageCarriers.css'
import scrollIcon from '../assets/scroll.svg'
import checkIcon from '../assets/check.svg'
import xIcon from '../assets/x.svg'

function ManageCarriers({ auth, user }) {

    const API_URL = import.meta.env.VITE_API_URL

    const [contracts, setContracts] = useState([])
    const [filteredContracts, setFilteredContracts] = useState([])
    const [proposedContracts, setProposedContracts] = useState([])
    const [rates, setRates] = useState([])

    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        fetchContracts('active');
        fetchContracts('pending');
    }, [])

    useEffect(() => {
        if (proposedContracts.length > 0) {
            notifications.show({
                title: 'Alert!',
                message: `${proposedContracts.length} proposed contracts needing attention`
            })
        }
    }, [proposedContracts])

    useEffect(() => {
        console.log(contracts)
        setFilteredContracts(contracts.filter(contract => contract.contract_status === 'active'))
    }, [contracts])

    //fetch all carriers
    async function fetchContracts(status) {
        try {
            let response = await fetch(`${API_URL}/api/shipper/contracts?status=${status}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            let result = await response.json();

            if (!result.contracts) {
                alert(result.message)
            }
            status === 'active' ?
                setContracts(result.contracts) :
                setProposedContracts(result.contracts);
        } catch (error) {
            console.log(error)
            alert(`Error: ${error}`)
        }
    }

    async function updateContract(id , status) {
        try {
            let response = await fetch(`${API_URL}/api/shipper/contracts/${id}?status=${status}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            let result = await response.json();

            if (!result.contract.id === id) {
                return alert('Could not find contract to delete')
            }

            alert(status === 'rejected' ? 'Proposed contract successfully deleted' : 'Contract accepted');

            fetchContracts('active');
            fetchContracts('pending');

        } catch (error) {
            console.log(error);
            alert(`Error: ${error}`)
        }
    }


    return (
        <div id='manage-carriers-container'>
            <Modal opened={opened} onClose={close} title="Authentication">
                <div>
                    <h4>{proposedContracts.length > 0 ? 'Contract Proposals' : 'Nothing to see here!'}</h4>
                    {proposedContracts.length > 0 && (
                        <Accordion>
                            {proposedContracts.map(c => (
                                <Accordion.Item key={c.id} value={c.id}>
                                    <Accordion.Control>{c.carrier} {new Date(c.start_date).toLocaleDateString()}-{new Date(c.end_date).toLocaleDateString()}</Accordion.Control>
                                    <Accordion.Panel>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            {c.rates.map(r => (
                                                <div key={r.rateId} style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                        <div>{r.min_distance}-{r.max_distance}</div>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ display: 'block' }}>Flat Rate: ${r.flat_rate}</span>
                                                            <span style={{ display: 'block' }}>Per Mile Rate: ${r.per_mile_rate}</span>
                                                            <span style={{ display: 'block' }}>Fuel Surcharge: {r.fuel_surcharge_percentage}%</span>
                                                        </div>
                                                    </div>

                                                </div>))}
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                                <Image className='approve-deny-btn' onClick={()=>updateContract(c.id , 'active')} src={checkIcon} h={24} w={'auto'} />
                                                <Image className='approve-deny-btn' onClick={() => updateContract(c.id , 'rejected')} src={xIcon} h={24} w={'auto'} />
                                            </div>
                                        </div>

                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    )}
                </div>
            </Modal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Manage Contracts</h1>
                <div>
                    <Indicator inline label={proposedContracts?.length} size={16} color='red'>
                        <Image id='contracts-button' src={scrollIcon} h={30} w={'auto'} onClick={open} />
                    </Indicator>
                </div>
            </div>

            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Td></Table.Td>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {filteredContracts.map(contract => (
                        <Table.Tr key={contract.id}>
                            <Table.Td>{contract.carrier}</Table.Td>
                            <Table.Td><ul>
                                {contract.rates.map(rate => (
                                    <li key={rate.rateId}><span style={{ marginRight: '2rem' }}>{rate.min_distance} {rate.max_distance ? '-' : ''} {rate.max_distance ? rate.max_distance : '+'} miles</span><span>{`$${rate.flat_rate} + (miles x $${rate.per_mile_rate}) + ($${rate.flat_rate} x ${rate.fuel_surcharge_percentage} / 100)`}</span></li>
                                ))}
                            </ul></Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </div>
    )
}

export default ManageCarriers;