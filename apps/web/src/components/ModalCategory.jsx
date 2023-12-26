import { Button, Label, Modal, TextInput, ModalBody, ModalFooter, ModalHeader, FileInput } from 'flowbite-react'
import { MdModeEditOutline } from "react-icons/md";

const ModalCategory = (props) => {
    const handleErrorFile = () => {
        if (props.errorSize) {
            return 'Maximum upload size exceeds'
        }
        if (props.errorExt) {
            return 'Only JPG, JPEG, PNG, and GIF files are allowed'
        }
        if (props.errorRequiredFile) {
            return 'File is required'
        }
        return 'JPG, JPEG, PNG or GIF (MAX. 1MB)'
    }

    const handleImage = () => {
        if (props.onEdit) {
            return <div className='h-48 w-full m-auto rounded relative'>
                <img className='w-full h-full object-cover rounded' src={props.src} />
                <FileInput
                    className='hidden'
                    accept='image/jpeg, image/jpg, image/png, image/gif'
                    ref={props.refImage}
                    onChange={props.onChangeFile}
                />
                <div className='absolute right-0 bottom-0 p-2 text-xl'>
                    <MdModeEditOutline color='orange' className='cursor-pointer' onClick={props.onEditImage} />
                </div>
                {props.errorSize || props.errorExt ? <p className='text-red-500 text-xs'>{handleErrorFile()}</p> : <p className='text-xs'>{handleErrorFile()}</p>}
            </div>
        }
        return <FileInput
            color={props.errorSize || props.errorExt || props.errorRequiredFile ? 'failure' : 'gray'}
            helperText={handleErrorFile()}
            onChange={props.onChangeFile}
            accept='image/jpeg, image/jpg, image/png, image/gif'
            required
        />
    }

    return <>
        <Modal show={props.show} onClose={props.onClose} size='sm' dismissible>
            <ModalHeader>{props.onEdit ? 'Edit Category' : 'Add Category'}</ModalHeader>
            <ModalBody>
                <div className='space-y-4'>
                    <div>
                        <div className='mb-2 block'>
                            <Label value='Category Name' />
                        </div>
                        <TextInput
                            color={props.errorRequiredName ? 'failure' : 'gray'}
                            helperText={props.errorRequiredName && 'Category name is required'}
                            placeholder='Snack'
                            value={props.categoryName}
                            onChange={props.onChangeCategory}
                            required
                        />
                    </div>
                    <div>
                        <div className='mb-2 block'>
                            <Label value='Image' />
                        </div>
                        {handleImage()}
                    </div>
                </div>
            </ModalBody>
            <ModalFooter className='justify-end'>
                <Button onClick={props.onEdit ? props.onSave : props.onAdd} color='blue'>{props.onEdit ? 'Save' : 'Add'}</Button>
                <Button onClick={props.onClose} color='blue'>{props.onEdit ? 'Cancel' : 'Close'}</Button>
            </ModalFooter>
        </Modal>
    </>
};

export default ModalCategory;