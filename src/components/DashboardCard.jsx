import { Paper, Text, Title } from '@mantine/core'

function DashboardCard({ stat, statValue, user }) {
    return (
        <div style={{ width: '100%' }}>
            <Paper
                p="xl"
                radius="md"
                style={{
                    backgroundColor: '#1a1a1a', textAlign: 'center', minWidth: 160, maxWidth: 240, height: 160, alignContent: 'center', boxShadow: '5px 5px 16px rgba(255, 255, 255, 0.25)',
                    border: '.1px solid #333'
                }}
            >
                <Title order={1} style={{ fontSize: '3rem', color: '#f6bd02', lineHeight: 1 }}>
                    {statValue}
                </Title>
                <Text size="m" c="dimmed" mt="xs" style={{color: '#adadad' , fontWeight: 'bold'}}>{stat}</Text>
            </Paper>
        </div>
    )
}

export default DashboardCard;