import '@mantine/core/styles.css';
import 'mantine-datatable/styles.css';
import { MantineProvider, Loader } from '@mantine/core';
import { NotificationProvider } from './contexts/NotificationsContext';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import SignIn from './pages/SignIn';
import SetPassword from './pages/SetPassword';
import AppShellLayout from './components/AppShellLayout';
import OpenOrders from './pages/OpenOrders';
import Dashboard from './pages/Dashboard';
import BuildShipments from './pages/BuildShipments';
import Shipments from './pages/Shipments';
import ShipmentDetails from './pages/ShipmentDetails';
import UpdateShipments from './pages/UpdateShipments';
import ManageCarriers from './pages/ManageCarriers';
import ManageRatePkgs from './pages/ManageRatePkgs';
import ShipperAdmin from './pages/ShipperAdmin';
import CreateUser from './pages/CreateUser';
import UserAdminOptions from './pages/UserAdminOptions';
import ViewUsers from './pages/ViewUsers';
import CustomerAdminOptions from './pages/CustomerAdminOptions';
import ViewCustomerLocations from './pages/ViewCustomerLocations';
import CreateCustomerLocation from './pages/CreateCustomerLocation';
import ShipmentTracking from './pages/ShipmentTracking';
import Conversations from './pages/Conversations';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null)
  const user = auth ? jwtDecode(auth) : null
  console.log('auth:', auth)
  console.log('user:', user)

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await fetch(`${API_URL}/api/users/refresh`, {
          method: 'POST',
          credentials: 'include'
        });
        console.log('refresh status:', response.status)
        const result = await response.json();
        console.log('refresh result:', result)
        if (result.token) {
          setAuth(result.token);
        }
      } catch (err) {
        console.log('No active session');
      } finally {
        setLoading(false)
      }
    }
    restoreSession();
  }, []);

  return (
    <MantineProvider>
      <Notifications />
      <NotificationProvider user={user} auth={auth}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<SignIn setAuth={setAuth} user={user} />} />
            <Route path='/user/create-password' element={<SetPassword />} />
            <Route element={loading
              ? <div style={{ backgroundColor: 'black' , display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader color='yellow' />
              </div> : auth ? <AppShellLayout user={user} setAuth={setAuth} /> : <Navigate to="/" />}>
              <Route path='/dashboard' element={<Dashboard auth={auth} setAuth={setAuth} user={user} />} />
              <Route path='/open-orders' element={<OpenOrders auth={auth} setAuth={setAuth} user={user} />} />
              <Route path='/build-shipments' element={<BuildShipments auth={auth} setAuth={setAuth} user={user} />} />
              {user?.client === 'shipper' && <Route path='/shipments' element={<Shipments auth={auth} setAuth={setAuth} user={user} />} />}
              <Route path='/shipments/details/:shipmentId' element={<ShipmentDetails user={user} setAuth={setAuth} auth={auth} />} />
              <Route path='/shipment-tracking' element={<ShipmentTracking auth={auth} setAuth={setAuth} user={user} />} />
              <Route path='/manage-carriers' element={<ManageCarriers auth={auth} setAuth={setAuth} user={user} />} />
              <Route path='/admin' element={<ShipperAdmin auth={auth} setAuth={setAuth} user={user} />} />
              <Route path='/update-shipments' element={<UpdateShipments auth={auth} setAuth={setAuth} user={user} />} />
              <Route path='/admin/users' element={<UserAdminOptions auth={auth} setAuth={setAuth} user={user} />} />
              <Route path='/admin/customers' element={<CustomerAdminOptions auth={auth} setAuth={setAuth} user={user} />} />
              <Route path='/admin/users/view' element={<ViewUsers auth={auth} setAuth={setAuth} user={user} />} />
              <Route path='/admin/customers/view' element={<ViewCustomerLocations auth={auth} setAuth={setAuth} user={user} />} />
              <Route path='/admin/users/create-user' element={<CreateUser auth={auth} setAuth={setAuth} user={user} />} />
              <Route path='/admin/customers/create-customer-location' element={<CreateCustomerLocation auth={auth} setAuth={setAuth} user={user} />} />
              <Route path='/carrier/packages' element={<ManageRatePkgs auth={auth} setAuth={setAuth} user={user} />} />
              <Route path='/conversations' element={<Conversations auth={auth} setAuth={setAuth} user={user} />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </MantineProvider>
  )
}

export default App
