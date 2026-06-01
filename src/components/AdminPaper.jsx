import {Paper , Title , Text} from '@mantine/core';
import '../styles/adminPaper.css'

function AdminPaper({title , text , nav}){
    return(
        <Paper onClick={nav} className="admin-paper" p="xl" 
            radius="md" 
            style={{ textAlign: 'center', minWidth: 240, height: 160, alignContent: 'center' }}>
            <Title order={1} style={{ justifyContent: 'center' , fontSize: '3rem', color: 'white', lineHeight: 1 }}>
                {title}
            </Title>
            <Text size="m" c="dimmed" mt="xs" style={{fontWeight: 'bold'}}>
                {text}
            </Text>
        </Paper>
    )
}

export default AdminPaper;