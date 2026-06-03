import { Paper, Text, Title } from '@mantine/core'
import '../styles/dashboard.css'

function DashboardUpcomingCard({ stat, statValue , user }) {
    return (
        <div style={{ width: '100%' , height: '100%'}}>
            <Paper
                p="xl"
                radius="md"
                style={{
                    backgroundColor: '#1a1a1a', textAlign: 'center', width: '100%', height: 160, alignContent: 'center', boxShadow: '5px 5px 16px rgba(255, 255, 255, 0.25)',
                    border: '.1px solid #333', overflowY: 'scroll', paddingTop: '0rem'
                }}
            >
                <Title order={6}>
                    {<div style={{display: 'flex'  , alignItems: 'center' , justifyContent: 'center' , flexDirection: 'column' , borderBottom: '1px solid #333', paddingBottom: '1rem'}}><span style={{color: '#f6bd02' , fontSize: '1.8rem'}}>{statValue.length}</span><span style={{color: '#adadad' }}>{stat}</span></div>}
                </Title>
                {statValue?.map(s => 
                    <Text key={s.id} size="m" c="dimmed" mt="xs" style={{color: 'white' , fontWeight: 'bold' }}>{`${s.order_number || s.shipment_number} - ${new Date(s.requested_ship_date || user?.client === 'shipper' ? s.requested_pickup_date : s.requested_delivery_date).toLocaleDateString()}`}</Text>
                )}
            </Paper>
        </div>
    )
}

export default DashboardUpcomingCard;