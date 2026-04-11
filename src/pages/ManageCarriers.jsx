import {Table , Button , Input} from '@mantine/core';
import {useState , useEffect} from 'react';
import '../styles/manageCarriers.css'

function ManageCarriers({auth , user}){

    const API_URL = import.meta.env.VITE_API_URL

    const [contracts , setContracts] = useState([])
    const [filteredContracts , setFilteredContracts] = useState([])
    const [rates , setRates] = useState([])

    useEffect(()=>{
        fetchContracts();
    },[])

    useEffect(()=>{
        console.log(contracts)
        setFilteredContracts(contracts.filter(contract => contract.contract_status === 'active'))
    },[contracts])

    //fetch all carriers
    async function fetchContracts(){
        try{
            let response = await fetch(`${API_URL}/api/shipper-user/users/${user.id}/contracts` , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${auth}`
                }
            });

            let result = await response.json();

            if(!result.contracts){
                alert(result.message)
            }
            
            setContracts(result.contracts)
        }catch(error){
            console.log(error)
            alert(`Error: ${error}`)
        }
    }

    return (
        <div id='manage-carriers-container'>
            <h1>Manage Contracts</h1>
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
                                {contract.rates.map(rate=>(
                                    <li key={rate.rateId}><span style={{marginRight: '2rem'}}>{rate.min_distance} {rate.max_distance ? '-' : ''} {rate.max_distance ? rate.max_distance : '+'} miles</span><span>{`$${rate.flat_rate} + (miles x $${rate.per_mile_rate}) + ($${rate.flat_rate} x ${rate.fuel_surcharge_percentage} / 100)`}</span></li>
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