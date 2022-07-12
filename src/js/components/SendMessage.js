import React, {useState, useRef} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button, Form, Alert} from 'react-bootstrap';
import { useFirestore } from '../firebase/firestore'


export default function SendMessage(props) {
    const { addMessageTo } = useFirestore()

    const newMessageTextRef = useRef()

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

        addMessageTo(props.uid, newMessageTextRef.current.value).then(() => {
            setMessage('Message sent!')
            e.target.reset()
        }).catch(error => {
            setError(error)
        }).finally(() => {
            setLoading(false)
        })
        
    }

    return (
    <>
        <Button className="nextButton mt-2" onClick={handleShow}>{props.btntext}</Button>

        <Modal show={show} onHide={handleClose} centered>
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
    </>
    );

}