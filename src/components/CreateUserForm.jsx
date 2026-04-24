import {Select , Input , Radio , Group} from '@mantine/core'

function CreateUserForm({locationDetails , locationId , setLocationId , locationName , firstName , setFirstName , lastName , setLastName , email , setEmail , phone , setPhone , isAdmin , setIsAdmin}){


    return (
        <div style={{display: 'flex' , flexDirection: 'column' , gap: '2rem'}}>
            <div style={{display: 'flex' , gap: '1rem' , alignItems: 'center'}}>
                <p style={{color: 'white'}}>User Location:</p>
                <Select placeholder='Location' data={locationDetails.map(location=>({
                    label: location.erp_id,
                    value: location.id
                }))} value={locationId} onChange={setLocationId}/>
                <p style={{color: 'white' , fontSize: '.8rem'}}>{locationName}</p>
            </div>
            <div style={{display: 'flex' , gap: '1rem' , alignItems: 'center'}}>
                <Input value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder='First Name'/>
                <Input value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder='Lasst Name'/>
            </div>
            <div style={{display: 'flex' , gap: '1rem' , alignItems: 'center'}}>
                <Input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Email Address'/>
                <Input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder='Phone No.'/>
            </div>
            <div style={{display: 'flex' , gap: '1rem' , alignItems: 'center'}}>
                <Radio.Group withAsterisk value={isAdmin} onChange={setIsAdmin}>
                    <Group mt="xs">
                        <Radio value="admin" label="Admin" style={{color: 'white'}}/>
                        <Radio value="user" label="User" style={{color: 'white'}}/>
                    </Group>
                 </Radio.Group>
            </div>
        </div>
    )
};

export default CreateUserForm;