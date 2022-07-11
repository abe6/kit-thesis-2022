import React, {useState, useRef} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button, Form, Alert} from 'react-bootstrap';
import { useFirestore } from '../firebase/firestore'


export default function AddFriend() {
    const { addFriend } = useFirestore()

    const emailRef = useRef()

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')


        addFriend(emailRef.current.value).then(() => {
            setMessage("Friend added!")
        }).catch(error => {
            setError(error.message)
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
    <>
        <Button className="nextButton mt-2" onClick={handleShow}>Add Friend</Button>

        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add a new friend</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <Alert variant='success'>{message}</Alert>}
                {error && <Alert variant='danger'>{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Label>What is your friends email?</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                    <Button className='w-100 mt-2' type="submit" disabled={loading}>Add</Button>
                </Form>
            </Modal.Body>
        </Modal>
    </>
    );

}