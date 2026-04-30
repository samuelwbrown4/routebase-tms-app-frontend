import { Input, Select, Radio, Button } from '@mantine/core'

function CreateLocationForm({ existing, setExisting, existingCustomers, setCustomerId, locName, setLocName, locAddress, setLocAddress, locCity, setLocCity, locState, setLocState, locZip, setLocZip, locCountry, setLocCountry, custName, setCustName, custAddress, setCustAddress, custCity, setCustCity, custState, setCustState, custZip, setCustZip, custCountry, setCustCountry , handleSubmitClick }) {
    return (
        <div style={{ display: 'flex' , flexDirection: 'column' , color: 'white' , width: '50%' , alignItems: 'center' , width: '100%' , gap: '1rem' }}>
            <div >
                <Radio.Group value={existing} onChange={setExisting} style={{ gap: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Radio value={'true'} label='For Existing Customer' />
                        <Select placeholder='Customer name...' onChange={setCustomerId} data={existingCustomers.map(c => (
                            {
                                label: c.name,
                                value: c.id
                            }
                        ))} />
                    </div>

                    <Radio value={'false'} label='For New Customer' />
                </Radio.Group>
            </div>
            {existing === 'false' && (
                <div style={{display: 'flex' , flexDirection: 'column' , gap: '1rem'}}>
                    <h3><u>New Customer Details</u></h3>
                    <Input.Wrapper label='Customer Name'>
                        <Input placeholder="Ash's Ketchup" value={custName} onChange={(e) => setCustName(e.target.value)} />
                    </Input.Wrapper>
                    <Input.Wrapper label='Customer Address'>
                        <Input placeholder='123 Oak Lane' value={custAddress} onChange={(e) => setCustAddress(e.target.value)} />
                    </Input.Wrapper>
                    <Input.Wrapper label='Customer City'>
                        <Input placeholder='Celadon City' value={custCity} onChange={(e) => setCustCity(e.target.value)} />
                    </Input.Wrapper>
                    <Select label='State' value={custState} onChange={(value)=>setCustState(value)} data={["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
                        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
                        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
                        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
                        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]} />
                    <Input.Wrapper label='Zip Code'>
                        <Input placeholder='29464' value={custZip} onChange={(e) => setCustZip(e.target.value)} />
                    </Input.Wrapper>
                    <Select label='Country' value={(value)=>custCountry(value)} onChange={setCustCountry} data={["US"]} />
                </div>
            )}
            <div style={{display: 'flex' , flexDirection: 'column' , gap: '1rem'}}>
                <h3><u>New Customer Location Details</u></h3>
                <Input.Wrapper label='Location Name'>
                    <Input placeholder='Ketchup West' value={locName} onChange={(e) => setLocName(e.target.value)} />
                </Input.Wrapper>
                <Input.Wrapper label='Location Address'>
                    <Input placeholder='456 Birch Ln' value={locAddress} onChange={(e) => setLocAddress(e.target.value)} />
                </Input.Wrapper>
                <Input.Wrapper label='Location City'>
                    <Input placeholder='Lavender Town' value={locCity} onChange={(e) => setLocCity(e.target.value)} />
                </Input.Wrapper>
                <Select label='State' value={locState} onChange={(value)=>setLocState(value)} data={["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
                    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
                    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
                    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
                    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]} />
                <Input.Wrapper label='Zip Code'>
                    <Input placeholder='23116' value={locZip} onChange={(e) => setLocZip(e.target.value)} />
                </Input.Wrapper>
                <Select label='Country' value={locCountry} onChange={(value)=>setLocCountry(value)} data={["US"]} />

            </div>
            <div>
                <Button onClick={handleSubmitClick}>
                    Create Customer/Location
                </Button>
            </div>

        </div>
    )
}

export default CreateLocationForm;