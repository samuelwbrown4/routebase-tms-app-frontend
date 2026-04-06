import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {Link} from 'react-router-dom';

function Home() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
    }}
    >
      <AppShell.Header>
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />

        <div>Transportion Management System</div>
        <div><Link to='/sign-in'>Sign In</Link></div>
       
      </AppShell.Header>

      <AppShell.Navbar>Navbar</AppShell.Navbar>

      <AppShell.Main >Main</AppShell.Main>
    </AppShell>
  );
}

export default Home;