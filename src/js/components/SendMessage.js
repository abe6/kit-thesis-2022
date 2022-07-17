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

    
    // Runs once to retrieve the users friends
    useEffect(() => {
        if (!props.uid){
            getUserData().then(resp => {
                Promise.all(Object.values(resp.friends).map(uid => {
                    return getDoc(getUserSnapshot(uid))
                })).then(users => {
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

    function getModalForContact() {
        return (
            <Modal show={props.show} onHide={onHideFunc} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Send a message to {props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message && <Alert variant='success'>{message}</Alert>}
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Label>What is your message?</Form.Label>
                        <Form.Control as="textarea" ref={newMessageTextRef} required />
                        <Button className='w-100 mt-2' type="submit" disabled={loading}>Send!</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }

    function getEmptyModal() {
        return (
            <Modal show={props.show} onHide={onHideFunc} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Send a new message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message && <Alert variant='success'>{message}</Alert>}
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Form onSubmit={handleSubmit}>

                        <Form.Label>Who would you like to send a message to?</Form.Label>
                        <Form.Control as="select" defaultValue={'placeholder'} ref={targetUidRef} required>
                            <option disabled hidden key='placeholder' value='placeholder'>Choose a friend</option>
                            {friendsOptions}
                        </Form.Control>

                        <Form.Label className="mt-2">What is your message?</Form.Label>
                        <Form.Control as="textarea" ref={newMessageTextRef} required />

                        <Button className='w-100 mt-2' type="submit" disabled={loading}>Send!</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }

    const modalToDisplay = (props.uid) ? getModalForContact() : getEmptyModal()

    return (
        <>
            {/* Button to open the dialog only  appears if props.btntext is set */}
            <Button  size="sm" hidden={!props.btntext} onClick={onShowFunc}>{props.btntext}</Button>
            
            {modalToDisplay}
            
        </>
    );

}