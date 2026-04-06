import { Outlet } from 'react-router-dom';
import { AppShell, Burger, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import '../styles/appShell.css';
import signOutIcon from '../assets/sign-out.svg';
import ordersIcon from '../assets/credit-card.svg';
import shipmentIcon from '../assets/truck-trailer.svg';
import dashboardIcon from '../assets/speedometer.svg';

function AppShellLayout({ user }) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            className='shell'
            padding="md"
            header={{ height: 60 }}
            navbar={{
                width: 220,
                breakpoint: 'sm',
                collapsed: { mobile: !opened }
            }}
            withBorder={false}
        >
            <AppShell.Header className='shell-header'>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <Image src='/routebase-logo-white.png' fit='contain' h={40} w='auto' />
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <h3>Welcome, {user.firstName}</h3>
                    <Image src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=f6bd02&color=0B1F3A`} alt="Profile" h={40} w={40} radius="xl" />
                </div>
            </AppShell.Header>
            <AppShell.Navbar className='shell-navbar'>
                <div id='links-container'>
                    <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/dashboard'><Image id='dashboard-icon' src={dashboardIcon} h={20} w='auto' /><span>Dashboard</span></Link>

                    <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/open-orders'><Image id='orders-icon' src={ordersIcon} h={20} w='auto' /><span>Open Orders</span></Link>

                    <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/open-orders'><Image id='shipment-icon' src={shipmentIcon} h={20} w='auto' /><span>Shipment Tracking</span></Link>
                </div>


                <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/sign-in'><Image id='sign-out-icon' src={signOutIcon} h={20} w='auto' /><span>Sign Out</span></Link>
            </AppShell.Navbar>
            <AppShell.Main className='app-shell-main'>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}

export default AppShellLayout;