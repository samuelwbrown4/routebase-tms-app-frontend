import { Input, Button } from '@mantine/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
                body: JSON.stringify({password: password})
            });

            let result = await response.json();

            if (!result.updatedUser) {
                return alert('Could not set password.')
            }

            navigate('/')

        }catch(error){
            console.log(error)
        }
    }

    return (
        <div>
            <Input label='Email address' value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <Input label='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button onClick={handleSetPass}>Set Password</Button>
        </div>
    )
}

export default SetPassword;