import '@mantine/core/styles.css';
import 'mantine-datatable/styles.css';
import { MantineProvider } from '@mantine/core';
import { NotificationProvider } from './contexts/NotificationsContext';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import {BrowserRouter , Routes , Route , Navigate} from 'react-router';
import { useState } from 'react';
import SignIn from './pages/SignIn';
import SetPassword from './pages/SetPassword';
import AppShellLayout from './components/AppShellLayout';
import OpenOrders from './pages/OpenOrders';
import Dashboard from './pages/Dashboard';
import BuildShipments from './pages/BuildShipments';
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
import {jwtDecode} from 'jwt-decode';

function App() {

  const [auth, setAuth] = useState(localStorage.getItem('auth') || null)
  const user = auth ? jwtDecode(auth) : null

  return (
    <MantineProvider>
      <Notifications />
      <NotificationProvider user={user} auth={auth}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignIn setAuth={setAuth} user={user}/>}/>
          <Route path='/user/create-password' element={<SetPassword/>} />
          <Route element={auth ? <AppShellLayout user={user} setAuth={setAuth}/> : <Navigate to="/"/>}>
            <Route path='/dashboard' element={<Dashboard auth={auth} user={user}/>}/>
            <Route path='/open-orders' element={<OpenOrders auth={auth} user={user}/>}/>
            <Route path='/build-shipments' element={<BuildShipments auth={auth} user={user}/>}/>
            <Route path='/shipment-tracking' element={<ShipmentTracking auth={auth} user={user}/>}/>
            <Route path='/manage-carriers' element={<ManageCarriers auth={auth} user={user} />}/>
            <Route path='/admin' element={<ShipperAdmin auth={auth} user={user} />}/>
            <Route path='/update-shipments' element={<UpdateShipments auth={auth} user={user} />}/>
            <Route path='/admin/users' element={<UserAdminOptions auth={auth} user={user} />}/>
            <Route path='/admin/customers' element={<CustomerAdminOptions auth={auth} user={user} />}/>
            <Route path='/admin/users/view' element={<ViewUsers auth={auth} user={user}/>}/>
            <Route path='/admin/customers/view' element={<ViewCustomerLocations auth={auth} user={user}/>}/>
            <Route path='/admin/users/create-user' element={<CreateUser auth={auth} user={user}/>} />
            <Route path='/admin/customers/create-customer-location' element={<CreateCustomerLocation auth={auth} user={user}/>} />
            <Route path='/carrier/packages' element={<ManageRatePkgs auth={auth} user={user} />}/>
            <Route path='/conversations' element={<Conversations auth={auth} user={user}/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
      </NotificationProvider>
    </MantineProvider>
  )
}

export default App
