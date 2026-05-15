import CreateLocationForm from "../components/CreateLocationForm";
import backIcon from '../assets/arrow-square-left.svg'
import { Image } from '@mantine/core'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import refreshToken from "../utils/refresh";

function CreateCustomerLocation({ user, auth, setAuth }) {

    const API_URL = import.meta.env.VITE_API_URL

    const navigate = useNavigate();

    const [existingCustomers, setExistingCustomers] = useState([])
    const [existing, setExisting] = useState('true')

    const [customerId, setCustomerId] = useState('');
    const [locName, setLocName] = useState('')
    const [locAddress, setLocAddress] = useState('')
    const [locCity, setLocCity] = useState('')
    const [locState, setLocState] = useState('')
    const [locZip, setLocZip] = useState('')
    const [locCountry, setLocCountry] = useState('')

    const [custName, setCustName] = useState('')
    const [custAddress, setCustAddress] = useState('')
    const [custCity, setCustCity] = useState('')
    const [custState, setCustState] = useState('')
    const [custZip, setCustZip] = useState('')
    const [custCountry, setCustCountry] = useState('')

    useEffect(() => {
        getExistingCustomers()
    }, [])

    useEffect(() => {
        console.log(existingCustomers)
    }, [existingCustomers])

    useEffect(() => {
        console.log(locState, locCountry)
    }, [locState, locCountry])

    useEffect(() => {
        if (existing === 'true') {
            setCustName('')
            setCustAddress('')
            setCustCity('')
            setCustState('')
            setCustZip('')
            setCustCountry('')
        } else {
            setCustomerId('')
        }
    }, [existing])

    useEffect(() => {
        if (customerId === '') {
            setCustName('')
            setCustAddress('')
            setCustCity('')
            setCustState('')
            setCustZip('')
            setCustCountry('')
            return
        }
        let matchCustomer = existingCustomers.find(c => c.id === customerId)
        if (!matchCustomer) {
            return
        }
        setCustName(matchCustomer.name)
        setCustAddress(matchCustomer.address)
        setCustCity(matchCustomer.city)
        setCustState(matchCustomer.state)
        setCustZip(matchCustomer.zip_code)
        setCustCountry(matchCustomer.country)
    }, [customerId])

    //get all customers by userid
    async function getExistingCustomers() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/customers`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/customers`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            let result = await response.json();

            if (!result.customers) {
                return alert('No existing customers found!')
            }

            setExistingCustomers(result.customers)
        } catch (error) {
            console.log(error)
        }
    }

    function handleSubmitClick() {
        createNewCustomerLocation();
        setCustomerId('')
        setCustName('')
        setCustAddress('')
        setCustCity('')
        setCustState('')
        setCustZip('')
        setCustCountry('')
        setLocName('')
        setLocAddress('')
        setLocCity('');
        setLocState('');
        setLocZip('')
        setLocCountry('')

    }

    async function createNewCustomerLocation() {
        try {
            let response = await fetch(`${API_URL}/api/shipper/customer-locations?existingCustomer=${existing ? 'true' : 'false'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({
                    customerId,
                    locName,
                    locAddress,
                    locCity,
                    locState,
                    locZip,
                    locCountry,
                    custName,
                    custAddress,
                    custCity,
                    custState,
                    custZip,
                    custCountry
                })
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/customer-locations?existingCustomer=${existing ? 'true' : 'false'}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({
                            customerId,
                            locName,
                            locAddress,
                            locCity,
                            locState,
                            locZip,
                            locCountry,
                            custName,
                            custAddress,
                            custCity,
                            custState,
                            custZip,
                            custCountry
                        })
                    });
                }
            }

            let result = await response.json()

            if (!result.newCustomerLocation) {
                return alert('Location not created')
            } else {
                return alert('Location created')
            }
        } catch (error) {
            console.log(error)
        }
    }
    //radio to select "from existing customer" or "new customer"
    //conditional rendering of customer create form if "new customer selected"
    //else, select from existing customers
    //inputs to fill out customer info
    //on post, await call out to get lat long, then post to db


    return (
        <div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <Image src={backIcon} h={35} w={35} style={{ marginTop: '.5rem' }} id="back-btn" onClick={() => navigate('/admin/customers')} />
                <h1 className="header">Admin / Customers / Create Customer Location</h1>
            </div>
            <CreateLocationForm
                customerId={customerId}
                setCustomerId={setCustomerId}
                locName={locName}
                setLocName={setLocName}
                locAddress={locAddress}
                setLocAddress={setLocAddress}
                locCity={locCity}
                setLocCity={setLocCity}
                locState={locState}
                setLocState={setLocState}
                locZip={locZip}
                setLocZip={setLocZip}
                locCountry={locCountry}
                setLocCountry={setLocCountry}
                custName={custName}
                setCustName={setCustName}
                custAddress={custAddress}
                setCustAddress={setCustAddress}
                custCity={custCity}
                setCustCity={setCustCity}
                custState={custState}
                setCustState={setCustState}
                custZip={custZip}
                setCustZip={setCustZip}
                custCountry={custCountry}
                setCustCountry={setCustCountry}
                existing={existing}
                setExisting={setExisting}
                existingCustomers={existingCustomers}
                handleSubmitClick={handleSubmitClick}

            />
        </div>

    )
}

export default CreateCustomerLocation;