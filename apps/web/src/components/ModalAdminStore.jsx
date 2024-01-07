import { Button, Label, Modal, TextInput, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react'
import { Formik, Form, Field, useFormik } from 'formik'
import * as Yup from 'yup'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const ModalAdminStore = (props) => {
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .matches(/^[A-Z]([a-zA-Z]|\.| |-|')+$/, 'Invalid name format')
            .required('Required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
        password: Yup.string()
            .min(8, 'Minimum password length is 8')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                'Password must contain uppercase letter, lowercase letter, number, and no space',
            )
            .required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Password confirmation not match')
            .required('Required'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            props.onSubmit(values);
        },
    });

    return <>
        <Modal show={props.show} onClose={props.onClose} size='sm' dismissible>
            <ModalHeader>{props.onEdit ? 'Edit Admin Store' : 'Add Admin Store'}</ModalHeader>
            <ModalBody>
                <div className='space-y-4'>
                    <div>
                        <Label>Name</Label>
                        <TextInput
                            name='name'
                            type='text'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                        />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <TextInput
                            name='email'
                            type='email'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                    </div>
                    <div>
                        <Label>Password</Label>
                        <TextInput
                            name='password'
                            type='password'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                    </div>
                    <div>
                        <Label>Confirm Password</Label>
                        <TextInput
                            name='confirmPassword'
                            type='password'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter className='justify-end'>
                <Button onClick={props.onEdit ? props.onSave : props.onAdd} color='blue'>{props.onEdit ? 'Save' : 'Add'}</Button>
                <Button onClick={props.onClose} color='blue'>{props.onEdit ? 'Cancel' : 'Close'}</Button>
            </ModalFooter>
        </Modal>
    </>
}

export default ModalAdminStore;