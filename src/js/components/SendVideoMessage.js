import { Container } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

export default function SendVideoMessage(props) {

    const { state } = useLocation();
    const { uid } = state;
    
    return (
        <Container fluid className='w-100 h-100 p-0'>

            SendVideoMessage to {uid}

        </Container>
    )
}
