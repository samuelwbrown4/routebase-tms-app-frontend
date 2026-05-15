import { Outlet } from 'react-router-dom';
import { AppShell, Burger, Image, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link , useNavigate} from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { NotificationContext } from '../contexts/NotificationsContext';
import '../styles/appShell.css';
import signOutIcon from '../assets/sign-out.svg';
import ordersIcon from '../assets/credit-card.svg';
import shipmentIcon from '../assets/truck-trailer.svg';
import dashboardIcon from '../assets/speedometer.svg';
import scrollIcon from '../assets/scroll.svg';
import adminIcon from '../assets/identification-card.svg';
import chatsIcon from '../assets/chats.svg';
import routeIcon from '../assets/map.svg';
import leftArrow from '../assets/caret-left.svg';
import rightArrow from '../assets/caret-right.svg';

function AppShellLayout({ user, setAuth }) {

    const API_URL = import.meta.env.VITE_API_URL
    const navigate = useNavigate() 

    const [opened, { toggle }] = useDisclosure(true);

    const data = useContext(NotificationContext);
    const fetchNotifications = data?.fetchMessages;
    const notifications = data?.notifications;
    const pendingContractsCount = data?.pendingContractsCount;
    const fetchPendingContracts = data?.fetchPendingContracts;

    useEffect(() => {
        fetchNotifications()
        fetchPendingContracts()
    }, [])

    async function handleSignout() {
        try {
            await fetch(`${API_URL}/api/users/logout`, {
                method: 'POST',
                credentials: 'include' 
            });
            setAuth(null);
            navigate('/');
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <AppShell
            className='shell'
            padding="md"
            header={{ height: 60 }}
            navbar={{
                width: opened ? 220 : 20,
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
            <AppShell.Navbar className={opened ? 'shell-navbar' : 'collapsed'}>
                <div style={{ display: 'flex', justifyContent: opened ? 'space-between' : 'center', height: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', paddingTop: '1rem', paddingBottom: '1rem' }}>
                        {user.client === 'shipper' && opened && <div id='links-container'>
                            <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/dashboard'><Image id='dashboard-icon' src={dashboardIcon} h={20} w='auto' /><span>Dashboard</span></Link>

                            <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/open-orders'><Image id='orders-icon' src={ordersIcon} h={20} w='auto' /><span>Open Orders</span></Link>

                            <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/shipments'><Image id='shipment-icon' src={shipmentIcon} h={20} w='auto' /><span>Shipments</span></Link>

                            <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/shipment-tracking'><Image id='shipment-icon' src={routeIcon} h={20} w='auto' /><span>Route Tracking</span></Link>

                            <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/manage-carriers'><Image id='scroll-icon' src={scrollIcon} h={20} w='auto' /><span>Contracts</span>{(pendingContractsCount > 0) && <Badge color='blue'>{pendingContractsCount}</Badge>}</Link>

                            <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/conversations'><Image id='chats-icon' src={chatsIcon} h={20} w='auto' /><span>Conversations</span>{(notifications > 0) && <Badge color='blue'>{notifications}</Badge>}</Link>

                            <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/admin'><Image id='scroll-icon' src={adminIcon} h={20} w='auto' /><span>Admin</span></Link>
                        </div>}
                        {user.client === 'carrier' && opened && <div id='links-container'>
                            <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/shipment-tracking'><Image id='shipment-icon' src={routeIcon} h={20} w='auto' /><span>Shipment Routing</span></Link>

                            <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/update-shipments'><Image id='shipment-icon' src={shipmentIcon} h={20} w='auto' /><span>Update Shipments</span></Link>

                            <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/carrier/packages'><Image id='orders-icon' src={ordersIcon} h={20} w='auto' /><span>Rate Packages</span></Link>

                            <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/conversations'><Image id='chats-icon' src={chatsIcon} h={20} w='auto' /><span>Conversations</span>{(notifications > 0) && <Badge color='blue'>{notifications}</Badge>}</Link>
                        </div>}



                        {opened && <Link style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} to='/' onClick={() => { handleSignout() }}><Image id='sign-out-icon' src={signOutIcon} h={20} w='auto' /><span>Sign Out</span></Link>}
                    </div>
                    <div onClick={toggle} className='toggle-nav' style={{ display: 'flex', alignItems: 'center' }}>
                        <Image src={opened ? leftArrow : rightArrow} h={16} w={16} />
                    </div>
                </div>
            </AppShell.Navbar>
            <AppShell.Main className='app-shell-main'>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}

export default AppShellLayout;