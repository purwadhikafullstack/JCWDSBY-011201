import { Button, Label, Modal, TextInput, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react'
import { Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { customButton } from '../../helpers/flowbiteCustomTheme';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^([a-zA-Z]|\.| |-|')+$/, 'Invalid name format')
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

const ModalAdminStore = ({ onSubmit, show, onClose, onEdit, initialValue }) => {

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    },
  });

  return <>
    <Modal show={show} onClose={onClose} size='sm' dismissible>
      <ModalHeader>{onEdit ? 'Edit Admin Store' : 'Add Admin Store'}</ModalHeader>
      <form onSubmit={formik.handleSubmit}>
        <ModalBody>
          <div className='space-y-4'>
            <div>
              <Label className='font-bold'>Name</Label>
              <TextInput
                placeholder='name'
                name='name'
                type='text'
                autoComplete='name'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && <span className='text-red-500'>{formik.errors.name}</span>}
            </div>
            <div>
              <Label className='font-bold'>Email</Label>
              <TextInput
                placeholder='email'
                name='email'
                type='email'
                autoComplete='username'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && <span className='text-red-500'>{formik.errors.email}</span>}
            </div>
            <div>
              <Label className='font-bold'>Password</Label>
              <TextInput
                placeholder='password'
                name='password'
                type='password'
                autoComplete='new-password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && <span className='text-red-500'>{formik.errors.password}</span>}
            </div>
            <div>
              <Label className='font-bold'>Confirm Password</Label>
              <TextInput
                placeholder='confirm password'
                name='confirmPassword'
                type='password'
                autoComplete='new-password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && <span className='text-red-500'>{formik.errors.confirmPassword}</span>}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className='justify-end'>
          <Button theme={customButton} type='submit' color='primary'>{onEdit ? 'Save' : 'Add'}</Button>
          <Button theme={customButton} onClick={() => { onClose(); formik.handleReset(); }} color='secondary'>{onEdit ? 'Cancel' : 'Close'}</Button>
        </ModalFooter>
      </form>
    </Modal>
  </>
}

export default ModalAdminStore;