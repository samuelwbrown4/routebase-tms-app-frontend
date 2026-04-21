import {Paper , Text , Title} from '@mantine/core'

function UndeliveredShipments({undeliveredShipments , user}){
    return(
        <div style={{width: '100%'}}>
            <Paper 
            p="xl" 
            radius="md" 
            style={{ backgroundColor: '#2c2c2c', textAlign: 'center', minWidth: 160, maxWidth: 240 , height: 160, alignContent: 'center' }}
        >
            <Title order={1} style={{ fontSize: '3rem', color: 'white', lineHeight: 1 }}>
                {undeliveredShipments}
            </Title>
            <Text size="s" c="dimmed" mt="xs">Undelivered Shipments</Text>
        </Paper>
        </div>
    )
}

export default UndeliveredShipments;