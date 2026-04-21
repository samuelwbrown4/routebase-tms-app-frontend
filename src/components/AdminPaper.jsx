import {Paper , Title , Text} from '@mantine/core';
import '../styles/adminPaper.css'

function AdminPaper({title , text}){
    return(
        <Paper className="admin-paper" p="xl" 
            radius="md" 
            style={{ backgroundColor: '#2c2c2c', textAlign: 'center', minWidth: 240, height: 160, alignContent: 'center' }}>
            <Title order={1} style={{ justifyContent: 'center' , fontSize: '3rem', color: 'white', lineHeight: 1 }}>
                {title}
            </Title>
            <Text size="sm" c="dimmed" mt="xs">
                {text}
            </Text>
        </Paper>
    )
}

export default AdminPaper;