import { Modal, Select, Button } from '@mantine/core';
import { useState, useEffect } from 'react';
import refreshToken from '../utils/refresh'

function RetenderModal({ shipment, auth, setAuth, navigate, openRetender, setOpenRetender ,retender}) {
    const API_URL = import.meta.env.VITE_API_URL

    const [rates, setRates] = useState([])
    const [selectedRate, setSelectedRate] = useState('')
    const [rate , setRate] = useState(null);
    const [carrier , setCarrier] = useState(null)

    useEffect(() => {
        if (!openRetender) return
        fetchRates(shipment?.distance)
    }, [openRetender, shipment]);

    useEffect(()=>{
        if(selectedRate === '') return
        let matchObject = rates.find(r=>r.id === selectedRate)

        setRate(matchObject.rate)
        setCarrier(matchObject.carrierId)
        
    },[selectedRate])

    async function fetchRates(dist) {
        try {
            let response = await fetch(`${API_URL}/api/shipper/rates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth}`
                },
                body: JSON.stringify({
                    distance: dist
                })
            })

            if (response.status === 401) {
                let newToken = await refreshToken(setAuth, navigate);
                if (newToken) {
                    response = await fetch(`${API_URL}/api/shipper/rates`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({
                            distance: dist
                        })
                    })
                }
            }

            const result = await response.json();


            if (!result.rates) {
                return alert(result.message)
            }

            console.log(result.rates)

            calculateRates(result.rates, dist)

        } catch (error) {
            console.log(error)
            alert(`Error: ${error}`)
        }
    }

    function calculateRates(ratesArray, dist) {
        const availableRates = []

        ratesArray.forEach(function (rate) {
            let rateObject = {
                id: rate.rateid,
                carrier: rate.carrier,
                carrierId: rate.carrierid,
                rate: parseFloat(rate.flat_rate) + (parseFloat(dist) * parseFloat(rate.per_mile_rate)) + (parseFloat(rate.flat_rate) * parseFloat(rate.fuel_surcharge_percentage) / 100)
            }

            availableRates.push(rateObject)
        })

        availableRates.sort((a, b) => a.rate - b.rate);

        console.log('Available rates: ', availableRates)

        setRates(availableRates);
    }

    return (
        <Modal opened={openRetender} onClose={() => setOpenRetender(false)} title={`Retender Shipment #${shipment?.shipment_number}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center' }}>
                <Select
                    styles={{ input: { width: '100%' }, wrapper: { width: '100%' } }}
                    placeholder='...'
                    data={rates?.map(rate => ({
                        value: rate?.id,
                        label: `${rate.carrier} ($${rate.rate.toFixed(2)})`
                    })) || []}
                    onChange={(_value) => setSelectedRate(_value)}
                />
                {selectedRate !== '' &&
                    <Button variant='outline' color='green' onClick={()=>retender('retendered', shipment?.id , shipment?.shipment_number , carrier , rate)}>Tender Shipment</Button>
                }
            </div>
        </Modal>
    )
}

export default RetenderModal