import { Paper, Text, Title } from '@mantine/core'

function DashboardUpcomingCard({ stat, statValue }) {
    return (
        <div style={{ width: '100%' , height: '100%'}}>
            <Paper
                p="xl"
                radius="md"
                style={{
                    backgroundColor: '#1a1a1a', textAlign: 'center', width: '100%', height: 160, alignContent: 'center', boxShadow: '5px 5px 16px rgba(255, 255, 255, 0.25)',
                    border: '.1px solid #333'
                }}
            >
                <Title order={6} style={{ color: '#f6bd02', lineHeight: 1 }}>
                    {stat}
                </Title>
                {statValue?.map(s => 
                    <Text size="m" c="dimmed" mt="xs" style={{color: '#adadad' , fontWeight: 'bold'}}>{s.order_number || s.shipment_number}</Text>
                )}
            </Paper>
        </div>
    )
}

export default DashboardUpcomingCard;