import { Button, Label, Modal, TextInput, ModalBody, ModalFooter, ModalHeader, FileInput } from 'flowbite-react'
import { MdModeEditOutline } from "react-icons/md";

const ModalCategory = ({
    error,
    onAdd,
    onEdit,
    onSave,
    src,
    refImage,
    categoryName,
    onChangeFile,
    onEditImage,
    onChangeCategory,
    show,
    onClose
}) => {
    const handleErrorFile = () => {
        if (error.size) {
            return 'Maximum upload size exceeds'
        }
        if (error.ext) {
            return 'Only JPG, JPEG, PNG, and GIF files are allowed'
        }
        if (error.requiredFile) {
            return 'File is required'
        }
        return 'JPG, JPEG, PNG or GIF (MAX. 1MB)'
    }

    const handleErrorName = () => {
        if(error.requiredName){
            return 'Name is required'
        }
        if (error.duplicate){
            return 'Category already exists'
        }
    };

    const handleImage = () => {
        if (onEdit) {
            return <div className='h-48 w-full m-auto rounded relative'>
                <img className='w-full h-full object-cover rounded' src={src} />
                <FileInput
                    className='hidden'
                    accept='image/jpeg, image/jpg, image/png, image/gif'
                    ref={refImage}
                    onChange={onChangeFile}
                />
                <div className='absolute right-0 bottom-0 p-2 text-xl'>
                    <MdModeEditOutline color='orange' className='cursor-pointer' onClick={onEditImage} />
                </div>
                {error.size || error.ext ? <p className='text-red-500 text-xs'>{handleErrorFile()}</p> : <p className='text-xs'>{handleErrorFile()}</p>}
            </div>
        }
        return <FileInput
            color={error.size || error.ext || error.requiredFile ? 'failure' : 'gray'}
            helperText={handleErrorFile()}
            onChange={onChangeFile}
            accept='image/jpeg, image/jpg, image/png, image/gif'
            required
        />
    }

    return <>
        <Modal show={show} onClose={onClose} size='sm' dismissible>
            <ModalHeader>{onEdit ? 'Edit Category' : 'Add Category'}</ModalHeader>
            <ModalBody>
                <div className='space-y-4'>
                    <div>
                        <div className='mb-2 block'>
                            <Label value='Category Name' />
                        </div>
                        <TextInput
                            color={error.requiredName || error.duplicate ? 'failure' : 'gray'}
                            helperText={handleErrorName()}
                            placeholder='Snack'
                            value={categoryName}
                            onChange={onChangeCategory}
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
                <Button onClick={onEdit ? onSave : onAdd} color='blue'>{onEdit ? 'Save' : 'Add'}</Button>
                <Button onClick={onClose} color='blue'>{onEdit ? 'Cancel' : 'Close'}</Button>
            </ModalFooter>
        </Modal>
    </>
};

export default ModalCategory;