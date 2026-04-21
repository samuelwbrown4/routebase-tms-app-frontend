import {Paper , Text , Title} from '@mantine/core'

function UnplannedLateOrders({unplannedLateOrders , user}){
    return(
        <div style={{width: '100%'}}>
            <Paper 
            p="xl" 
            radius="md" 
            style={{ backgroundColor: '#2c2c2c', textAlign: 'center', minWidth: 240, height: 160, alignContent: 'center' }}
        >
            <Title order={1} style={{ fontSize: '3rem', color: 'white', lineHeight: 1 }}>
                {unplannedLateOrders.length}
            </Title>
            <Text size="sm" c="dimmed" mt="xs">Past Due Orders</Text>
        </Paper>
        </div>
    )
}

export default UnplannedLateOrders;