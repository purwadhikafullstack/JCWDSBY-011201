import { Button, Label, Modal, TextInput, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Required'),
    name: Yup.string()
        .matches(/^[A-Z]([a-zA-Z]|\.| |-|')+$/, 'Invalid name format')
        .required('Required'),
    // name: Yup.string().required('Name is required'),
    // email: Yup.string().required('Email is required'),
    // password: Yup.string().required('Password is required'),
    // confirmPassword: Yup.string().required('Confirm password is required'),
});

const ModalAdminStore = (props) => {
    return <>
        <Modal show={props.show} onClose={props.onClose} size='sm' dismissible>
            <ModalHeader>{props.onEdit ? 'Edit Admin Store' : 'Add Admin Store'}</ModalHeader>
        </Modal>
    </>
}

export default ModalAdminStore;