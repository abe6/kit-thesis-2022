import React, { useState, useRef, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useFirestore } from '../firebase/firestore'
import { getDoc } from "firebase/firestore";


export default function SendMessage(props) {
    const { addMessageTo, getUserData, getUserSnapshot } = useFirestore()

    const newMessageTextRef = useRef()
    const targetUidRef = useRef()

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
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
                        return <option value={user.id} key={i}>{user.data().data.displayName}</option>
                    })
                    setFriendsOptions(options)
                })
            }).catch( error => setError(error))
        }
    }, [])

    const onShowFunc = props.handleShow ?? (() => {console.log("No handleShow")})
    const onHideFunc = props.handleClose ?? (() => {console.log("No handleClose")})

    function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        const uid = props.uid ?? targetUidRef.current.value
        
        addMessageTo(uid, newMessageTextRef.current.value).then(() => {
            setMessage('Message sent!')
            e.target.reset()
        }).catch(error => {
            setError(error.message)
        }).finally(() => {
            setLoading(false)
        })
        
    }

    function getTitle() { return (props.name) ? `Send a new message to ${props.name}` : "Send a new message"}

    function getTargetPicker() {
        if (props.uid) return

        return (
            <>
                <Form.Label>Who would you like to send a message to?</Form.Label>
                <Form.Control as="select" defaultValue={''} ref={targetUidRef} required className="mb-2">
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
                    <Form onSubmit={handleSubmit}>

                        {getTargetPicker()}

                        <Form.Label>What is your message?</Form.Label>
                        <Form.Control as="textarea" ref={newMessageTextRef} required />

                        <Button type="submit" disabled={loading}>Send!</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            
        </>
    );

}