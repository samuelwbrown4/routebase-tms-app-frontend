import { AppShell, Input, Image, Button, Radio, Group } from '@mantine/core';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import atIcon from '../assets/at.svg'
import '../styles/signIn.css'


function SignIn({ setAuth , user }) {

    const API_URL = import.meta.env.VITE_API_URL;

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [radio , setRadio] = useState('shipper')

    const navigate = useNavigate();

    async function signIn(e) {
        e.preventDefault();
        try {
            let response = await fetch(`${API_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email, password: pass, client: radio
                })
            })

            let result = await response.json();

            if (!result.token) {
                return alert(`Error: ${result.error}`)
            }
            localStorage.setItem('auth', JSON.stringify(result.token));
            setAuth(result.token);
            navigate(radio === 'shipper' ? '/dashboard' : '/update-shipments');
        } catch (error) {
            console.log(error)
            alert('Failed to reach backend service. Contact Administrator.')

        }
    }

    return (
        <AppShell
            padding="md"
            header={{ height: 60 }}>

            <div style={{ backgroundImage: 'url(/tms_sign_in_graphic.png)', backgroundSize: 'cover', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#0b1f3ada', gap: '1rem', alignItems: 'center', boxShadow: '0 0 8px 2px #f6a802', color: '#dff4f7', width: '35%', borderRadius: '6px' }}>
                    <h2 id="sign-in-header">Welcome Back!</h2>
                    <h4>Sign in to Routebase</h4>
                    <form id="sign-in-form" onSubmit={signIn}>
                       
                            <Radio.Group value={radio} onChange={setRadio}>
                               <Group gap="xl">
                                    <Radio value='shipper' label="Shipper" />
                                    <Radio value = 'carrier' label="Carrier" />
                             </Group>
                            </Radio.Group>
                      
                        <Input placeholder='email' leftSection={<Image h={16} w={16} src={atIcon} />} classNames={{ input: 'sign-in-input', wrapper: 'sign-in-input-wrapper' }} value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input placeholder='password' classNames={{ input: 'sign-in-input', wrapper: 'sign-in-input-wrapper' }} value={pass} onChange={(e) => setPass(e.target.value)} />
                        <Button type='submit'>Sign In</Button>
                    </form>
                    <span>Don't have an account? Request one from an administrator <Link id='here-link'>here.</Link></span>
                    <Image src='/routebase-logo-white.png' alt='routebase-logo-notext' h={100} fit='contain' />
                </div>
            </div>

        </AppShell>
    );
}

export default SignIn;