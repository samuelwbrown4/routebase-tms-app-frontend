import { Input, Button , Image} from '@mantine/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import atIcon from '../assets/at-white.svg';
import passIcon from '../assets/password-white.svg';

function SetPassword() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()

    const API_URL = import.meta.env.VITE_API_URL

    async function handleSetPass() {
        if (!email || !password || !confirmPassword) {
            return alert('Must fill out all fields!')
        }
        if (password !== confirmPassword) {
            return alert('Passwords must match!')
        }
        try {
            let response = await fetch(`${API_URL}/api/shipper/shipper-users/${email}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: password })
            });

            let result = await response.json();

            if (!result.updatedUser) {
                return alert('Could not set password.')
            }

            navigate('/')

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div id='create-pass-root' style={{backgroundColor: 'black' , height: '100vH', width: '100%', alignItems: 'center', display: 'flex' , flexDirection: 'column' , gap: '2rem' , justifyContent: 'center'}}>
            
            <div style={{ display: 'flex', flexDirection: 'column' , gap: '1rem' , width: '30%',  backgroundColor: '#1a1a1a' ,borderRadius: '6px' , border: '1px solid #333' , padding: '2rem' , alignItems: 'center' , boxShadow: '0px 0px 16px rgba(255, 255, 255, 0.25)' }}>
            <div style={{display: 'flex' , flexDirection: 'column' , gap: '.5rem' , alignItems: 'center' , marginBottom: '2rem'}}>
                <h3 style={{color: 'white' , margin: '0'}}>Welcome To Routebase</h3>
                <h5 style={{color: '#adadad' , margin: '0'}}>Please set your password.</h5>
            </div>
                <div style={{display: 'flex' , flexDirection: 'column' , width: '70%'}}>
                    <span style={{color: '#adadad'}}>Email Address</span>
                    <Input 
                        styles={{input: {width: '100%'} , wrapper: {width: '100%'}}} 
                        placeholder='john.doe@example.com'
                        leftSection={<Image src={atIcon} h={16} w={'auto'}/>} 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div style={{display: 'flex' , flexDirection: 'column' , width: '70%'}}>
                    <span style={{color: '#adadad'}}>New Password</span>
                    <Input 
                        styles={{input: {width: '100%'} , wrapper: {width: '100%'}}} 
                        placeholder='n3wP@$$w0rd'
                        leftSection={<Image src={passIcon} h={16} w={'auto'}/>}  
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div style={{display: 'flex' , flexDirection: 'column' , width: '70%'}}>
                    <span style={{color: '#adadad'}}>Confirm New Password</span>
                    <Input 
                        styles={{input: {width: '100%'} , wrapper: {width: '100%'}}} 
                        placeholder='n3wP@$$w0rd'
                        leftSection={<Image src={passIcon} h={24} w={'auto'}/>}  
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div style={{width: '50%' , display: 'flex' , flexDirection: 'column' , alignItems: 'center', marginTop: '2rem', gap: '1rem'}}>
                    <Button variant='outline' color="green"  onClick={handleSetPass}>Set Password</Button>
                    <Image src={'/routebase-logo-white.png'} h={50} w={'auto'}/>
                </div>
                
            </div>

        </div>
    )
}

export default SetPassword;