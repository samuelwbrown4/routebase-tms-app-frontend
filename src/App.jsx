import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import {BrowserRouter , Routes , Route , Navigate} from 'react-router';
import { useState } from 'react';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import AppShellLayout from './components/AppShellLayout';
import OpenOrders from './pages/OpenOrders';
import Dashboard from './pages/Dashboard';
import BuildShipments from './pages/BuildShipments';
import {jwtDecode} from 'jwt-decode';

function App() {

  const [auth, setAuth] = useState(localStorage.getItem('auth') || null)
  const user = auth ? jwtDecode(auth) : null

  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='sign-in' element={<SignIn setAuth={setAuth}/>}/>
          <Route element={auth ? <AppShellLayout user={user}/> : <Navigate to="/sign-in"/>}>
            <Route path='/dashboard' element={<Dashboard auth={auth} user={user}/>}/>
            <Route path='/open-orders' element={<OpenOrders auth={auth} user={user}/>}/>
            <Route path='/build-shipments' element={<BuildShipments auth={auth} user={user}/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
