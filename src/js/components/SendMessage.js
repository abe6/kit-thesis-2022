import React, { useState, useRef, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Alert, Image, Stack, Container } from 'react-bootstrap';
import { useFirestore } from '../firebase/firestore'
import { getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


export default function SendMessage(props) {
    const { getUserData, getUserSnapshot } = useFirestore()

    const targetUidRef = useRef()
    const navigate = useNavigate()

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [friendsOptions, setFriendsOptions] = useState([])

    
    useEffect(() => {
        // Runs once to retrieve the users friends if a target uid has not been given
        if (!props.uid){
            getUserData().then(resp => {
                // Map each friends uid to a user data object
                Promise.all(Object.values(resp.friends).map(uid => {
                    return getDoc(getUserSnapshot(uid))
                })).then(users => {
                    // Map each user data object to a dropdown option with their display anme
                    const options = users.map( (user, i) => {
                        const name = user.data().data.displayName
                        return <option value={user.id} key={name}>{name}</option>
                    })
                    setFriendsOptions(options)
                })
            }).catch( error => setError(error))
        }
    }, [])

    const onShowFunc = props.handleShow ?? (() => {console.log("No handleShow")})
    const onHideFunc = props.handleClose ?? (() => {console.log("No handleClose")})

    function handleRedirect(e) {
        e.preventDefault()
        setError('')
        setMessage('')

        const uid = props.uid ?? targetUidRef.current.value

        if (!uid) {
            setError("You must select a user")
            return
        }

        navigate(`${e.target.id}-message`, {state: {
            uid: uid
        }})
        
    }

    function getTitle() { return (props.name) ? `Send a new message to ${props.name}` : "Send a new message"}

    function getTargetPicker() {
        if (props.uid) return

        return (
            <>
                <Form.Label>Who would you like to send a message to?</Form.Label>
                <Form.Control as="select" defaultValue={''} ref={targetUidRef} required className="mb-4">
                    <option disabled hidden key='placeholder' value=''>Choose a friend</option>
                    {friendsOptions}
                </Form.Control>
            </>
        )
    }

    return (
        <>
            {/* Button to open the dialog only  appears if props.btntext is set */}
            <Button  size="sm" hidden={!props.btntext} onClick={onShowFunc}>{props.btntext}</Button>

            <Modal show={props.show} onHide={onHideFunc} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{getTitle()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message && <Alert variant='success'>{message}</Alert>}
                    {error && <Alert variant='danger'>{error}</Alert>}

                    {getTargetPicker()}

                    <Container fluid className='w-100 px-3'>
                        <Stack direction="horizontal">
                            <Image id='video' onClick={handleRedirect} src="video-icon.png" width={125} className='me-auto'/>
                            <Image id='audio' onClick={handleRedirect} src="mic-icon.png" width={125} className='m-auto'/>
                            <Image id='text' onClick={handleRedirect} src="text-icon.png" width={125} className='ms-auto'/>
                        </Stack>
                    </Container>
                    
                </Modal.Body>
            </Modal>
            
        </>
    );

}