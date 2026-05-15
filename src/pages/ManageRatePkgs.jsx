import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDisclosure } from '@mantine/hooks';
import { Card, Spoiler, Button, Image, Modal, Input, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import plusIcon from '../assets/plus-square.svg';
import scrollIcon from '../assets/scroll.svg'
import '../styles/ratePkgs.css'
import refreshToken from '../utils/refresh';

function ManageRatePkgs({ auth, user, setAuth }) {

    const API_URL = import.meta.env.VITE_API_URL;

    const navigate = useNavigate()

    const [packages, setPackages] = useState([]);
    const [shippers, setShippers] = useState([]);

    const [selectedPackage, setSelectedPackage] = useState('')
    const [selectedShipper, setSelectedShipper] = useState('')

    const [contractStartDate, setContractStartDate] = useState(undefined)
    const [contractEndDate, setContractEndDate] = useState(undefined)

    const [pkgName, setPkgName] = useState('');

    const [flatRate1, setFlatRate1] = useState('');
    const [perMileRate1, setPerMileRate1] = useState('');
    const [fuelSurcharge1, setFuelSurcharge1] = useState('');

    const [flatRate2, setFlatRate2] = useState('');
    const [perMileRate2, setPerMileRate2] = useState('');
    const [fuelSurcharge2, setFuelSurcharge2] = useState('');

    const [flatRate3, setFlatRate3] = useState('');
    const [perMileRate3, setPerMileRate3] = useState('');
    const [fuelSurcharge3, setFuelSurcharge3] = useState('');

    const [flatRate4, setFlatRate4] = useState('');
    const [perMileRate4, setPerMileRate4] = useState('');
    const [fuelSurcharge4, setFuelSurcharge4] = useState('');

    const [opened, { open, close }] = useDisclosure(false);
    const [openedContract, { open: openContract, close: closeContract }] = useDisclosure(false);


    useEffect(() => {
        fetchPkgs()
        fetchShippers()
    }, [])

    async function fetchPkgs() {
        try {
            let response = await fetch(`${API_URL}/api/carrier/packages`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/carrier/packages`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            const result = await response.json();

            if (!result.packages) {
                alert(result.message)
            }

            console.log(result.packages)

            setPackages(result.packages)

        } catch (error) {
            console.log(error);
        }
    }

    async function createRatePackage() {
        try {
            let response = await fetch(`${API_URL}/api/carrier/packages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({
                    name: pkgName,
                    minDistance1: 0,
                    maxDistance1: 499.99,
                    flatRate1: Number(flatRate1),
                    perMileRate1: Number(perMileRate1),
                    fuelSurcharge1: Number(fuelSurcharge1),
                    minDistance2: 500,
                    maxDistance2: 749.99,
                    flatRate2: Number(flatRate2),
                    perMileRate2: Number(perMileRate2),
                    fuelSurcharge2: Number(fuelSurcharge2),
                    minDistance3: 750,
                    maxDistance3: 1199.99,
                    flatRate3: Number(flatRate3),
                    perMileRate3: Number(perMileRate3),
                    fuelSurcharge3: Number(fuelSurcharge3),
                    minDistance4: 1200,
                    flatRate4: Number(flatRate4),
                    perMileRate4: Number(perMileRate4),
                    fuelSurcharge4: Number(fuelSurcharge4)
                })
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/carrier/packages`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({
                            name: pkgName,
                            minDistance1: 0,
                            maxDistance1: 499.99,
                            flatRate1: Number(flatRate1),
                            perMileRate1: Number(perMileRate1),
                            fuelSurcharge1: Number(fuelSurcharge1),
                            minDistance2: 500,
                            maxDistance2: 749.99,
                            flatRate2: Number(flatRate2),
                            perMileRate2: Number(perMileRate2),
                            fuelSurcharge2: Number(fuelSurcharge2),
                            minDistance3: 750,
                            maxDistance3: 1199.99,
                            flatRate3: Number(flatRate3),
                            perMileRate3: Number(perMileRate3),
                            fuelSurcharge3: Number(fuelSurcharge3),
                            minDistance4: 1200,
                            flatRate4: Number(flatRate4),
                            perMileRate4: Number(perMileRate4),
                            fuelSurcharge4: Number(fuelSurcharge4)
                        })
                    });
                }
            }

            let result = await response.json();

            if (!result.message) {
                alert('Error creating rate package')
            }

            alert(result.message);

            fetchPkgs();
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchShippers() {
        try {
            let response = await fetch(`${API_URL}/api/carrier/shippers`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                }
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/carrier/shippers`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                }
            }

            let result = await response.json();


            setShippers(result.shippers)


        } catch (err) {
            console.log(err)
        }
    }

    async function createContract() {
        try {
            let response = await fetch(`${API_URL}/api/carrier/contracts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer: ${auth}`
                },
                body: JSON.stringify({
                    startDate: contractStartDate,
                    endDate: contractEndDate,
                    packageId: selectedPackage,
                    shipperId: selectedShipper
                })
            });

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/carrier/contracts`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer: ${newToken}`
                        },
                        body: JSON.stringify({
                            startDate: contractStartDate,
                            endDate: contractEndDate,
                            packageId: selectedPackage,
                            shipperId: selectedShipper
                        })
                    });
                }
            }

            let result = await response.json();

            if (!result.contract) {
                return alert(result.error)
            }

            alert('Successfully proposed contract')
        } catch (err) {
            console.log(err)
        }
    }

    {/* add edit and build package features*/ }
    {/*add contract proposal functionality*/ }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', color: 'white', gap: '2rem' }}>
            <Modal opened={openedContract} size='l' onClose={closeContract} title="Propose New Contract" styles={{
                content: { backgroundColor: '#2c2c2c', color: 'white' },
                header: { backgroundColor: '#2c2c2c', color: 'white' },
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
                        <Select placeholder="Select Shipper" data={shippers.map(s => ({ value: String(s.id), label: s.name }))} value={selectedShipper} onChange={setSelectedShipper} />
                        <Select placeholder="Select Rate Package" data={packages.map(p => ({ value: String(p.pkgid), label: p.pkgname }))} value={selectedPackage} onChange={setSelectedPackage} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', width: '100%', marginLeft: '2rem', marginRight: '2rem', justfiyContent: 'center' }}>
                        <DateInput
                            value={contractStartDate}
                            onChange={setContractStartDate}
                            fullWidth='false'
                            size='xs'
                            w={200}
                            popoverProps={{ width: 250, height: 250 }}
                            styles={{
                                calendarHeaderControl: {
                                    width: 40,
                                    height: 40,
                                },
                                calendarHeaderControlIcon: {
                                    width: 24,
                                    height: 24,
                                },
                            }}

                        />
                        <DateInput
                            value={contractEndDate}
                            onChange={setContractEndDate}
                            fullWidth='false'
                            size='xs'
                            w={200}
                            popoverProps={{ width: 250, height: 250 }}
                            styles={{
                                calendarHeaderControl: {
                                    width: 40,
                                    height: 40,
                                },
                                calendarHeaderControlIcon: {
                                    width: 24,
                                    height: 24,
                                },
                            }}

                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={createContract}>Propose Contract</Button>
                    </div>
                </div>
            </Modal>
            <Modal opened={opened} onClose={close} title="Create Rate Package" styles={{
                content: { backgroundColor: '#2c2c2c', color: 'white' },
                header: { backgroundColor: '#2c2c2c', color: 'white' },
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>Package Name</label>
                    <Input value={pkgName} onChange={(e) => setPkgName(e.target.value)} styles={{ input: { backgroundColor: '#3d3d3d', color: 'white', borderColor: '#555' } }} />
                    <div style={{ borderBottom: '1px solid gray', paddingBottom: '2rem' }}>
                        <h5>0 - 499.99 miles</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>Flat Rate</label>
                                <Input value={flatRate1} onChange={(e) => setFlatRate1(e.target.value)} w={'25%'} leftSection={'$'} styles={{ input: { backgroundColor: '#3d3d3d', color: 'white', borderColor: '#555' } }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>Per Mile Rate</label>
                                <Input value={perMileRate1} onChange={(e) => setPerMileRate1(e.target.value)} w={'25%'} leftSection={'$'} styles={{ input: { backgroundColor: '#3d3d3d', color: 'white', borderColor: '#555' } }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>Fuel Surcharge Percentage</label>
                                <Input value={fuelSurcharge1} onChange={(e) => setFuelSurcharge1(e.target.value)} w={'25%'} rightSection={'%'} styles={{ input: { backgroundColor: '#3d3d3d', color: 'white', borderColor: '#555' } }} />
                            </div>

                        </div>
                    </div>
                    <div style={{ borderBottom: '1px solid gray', paddingBottom: '2rem' }}>
                        <h5>500 - 749.99 miles</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>Flat Rate</label>
                                <Input value={flatRate2} onChange={(e) => setFlatRate2(e.target.value)} w={'25%'} leftSection={'$'} styles={{ input: { backgroundColor: '#3d3d3d', color: 'white', borderColor: '#555' } }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>Per Mile Rate</label>
                                <Input value={perMileRate2} onChange={(e) => setPerMileRate2(e.target.value)} w={'25%'} leftSection={'$'} styles={{ input: { backgroundColor: '#3d3d3d', color: 'white', borderColor: '#555' } }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>Fuel Surcharge Percentage</label>
                                <Input value={fuelSurcharge2} onChange={(e) => setFuelSurcharge2(e.target.value)} w={'25%'} rightSection={'%'} styles={{ input: { backgroundColor: '#3d3d3d', color: 'white', borderColor: '#555' } }} />
                            </div>
                        </div>
                    </div>
                    <div style={{ borderBottom: '1px solid gray', paddingBottom: '2rem' }}>
                        <h5>750 - 1199.99 miles</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>Flat Rate</label>
                                <Input value={flatRate3} onChange={(e) => setFlatRate3(e.target.value)} w={'25%'} leftSection={'$'} styles={{ input: { backgroundColor: '#3d3d3d', color: 'white', borderColor: '#555' } }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>Per Mile Rate</label>
                                <Input value={perMileRate3} onChange={(e) => setPerMileRate3(e.target.value)} w={'25%'} leftSection={'$'} styles={{ input: { backgroundColor: '#3d3d3d', color: 'white', borderColor: '#555' } }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>Fuel Surcharge Percentage</label>
                                <Input value={fuelSurcharge3} onChange={(e) => setFuelSurcharge3(e.target.value)} w={'25%'} rightSection={'%'} styles={{ input: { backgroundColor: '#3d3d3d', color: 'white', borderColor: '#555' } }} />
                            </div>
                        </div>
                    </div>
                    <div style={{ borderBottom: '1px solid gray', paddingBottom: '2rem' }}>
                        <h5>1200+ miles</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>Flat Rate</label>
                                <Input value={flatRate4} onChange={(e) => setFlatRate4(e.target.value)} w={'25%'} leftSection={'$'} styles={{ input: { backgroundColor: '#3d3d3d', color: 'white', borderColor: '#555' } }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>Per Mile Rate</label>
                                <Input value={perMileRate4} onChange={(e) => setPerMileRate4(e.target.value)} w={'25%'} leftSection={'$'} styles={{ input: { backgroundColor: '#3d3d3d', color: 'white', borderColor: '#555' } }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label>Fuel Surcharge Percentage</label>
                                <Input value={fuelSurcharge4} onChange={(e) => setFuelSurcharge4(e.target.value)} w={'25%'} rightSection={'%'} styles={{ input: { backgroundColor: '#3d3d3d', color: 'white', borderColor: '#555' } }} />
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={createRatePackage}>Submit</Button>
                    </div>
                </div>
            </Modal>

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: '3rem', marginRight: '3rem' }}>
                <h1>Rate Packages</h1>
                <Button onClick={open} w={30} h={30} style={{ padding: '0px', backgroundColor: 'transparent' }}><Image src={plusIcon} h={30} width='auto' /></Button>
                <Button onClick={openContract} w={30} h={30} style={{ padding: '0px', backgroundColor: 'transparent' }}><Image src={scrollIcon} h={30} width='auto' /></Button>
            </div>

            <div className='package-card-div'>
                {packages.map(p => (
                    <Card className='package-card' key={p.pkgid}>
                        <h2>{p.pkgname}</h2>
                        <Spoiler styles={{ control: { display: 'block', width: '100%', margin: '0 auto', justifyContent: 'center', textDecoration: 'none', color: 'white' } }} maxHeight={0} showLabel={<span>▼</span>} hideLabel={<span>▲</span>} >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {p.rates.map(r => (
                                    <div key={r.rateId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            {r.min_distance} - {r.max_distance} miles
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <span style={{ display: 'block' }}>Flat Rate: $ {r.flat_rate}</span>
                                            <span style={{ display: 'block' }}>Per Mile Rate: $ {r.per_mile_rate}</span>
                                            <span style={{ display: 'block' }}>Fuel Surcharge Pct: {r.fuel_surcharge_percentage}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Spoiler>

                    </Card>
                ))}
            </div>
        </div>

    )
}

export default ManageRatePkgs;