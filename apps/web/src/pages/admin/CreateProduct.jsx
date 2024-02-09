import TopBar from "../../components/TopBar";
import { useNavigate } from "react-router-dom";
import { Button, Label, Select, Textarea, TextInput } from 'flowbite-react';
import BoxAddImage from "../../components/BoxAddImage";
import { useState, useRef, useEffect } from "react";
import { MAX_SIZE, REGEX_FILE_TYPE } from "../../constants/file";
import { MdDelete } from "react-icons/md";
import API_CALL from "../../helpers/API";
import LoadingSpinner from "../../components/LoadingSpinner";
import { customButton, customTextInputTheme } from "../../helpers/flowbiteCustomTheme";
import customToast from "../../utils/toast";
import LayoutDashboard from "../../components/LayoutDashboard";
import CurrencyInput from "react-currency-input-field";

const CreateProduct = () => {
  const navigate = useNavigate();
  const hiddenFileInput = useRef(null);
  const [file, setFile] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState({ size: false, type: false, requiredFieldFile: false });
  const [requiredField, setRequiredField] = useState({ name: false, weight: false, price: false, description: false });
  const [data, setData] = useState({ name: null, price: null, description: null, weight: null, unit: 'g', categoryId: null, image: null });

  useEffect(() => {
    getCategory();
  }, [])

  const getCategory = async () => {
    setIsLoading(true);
    const res = await API_CALL.get('category');
    if (res) {
      setIsLoading(false);
      setData({ ...data, categoryId: res.data.result.rows[0].id })
      setCategory(res.data.result.rows);
    }
  };

  const handleRequiredField = () => {
    if (requiredField.price) return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500 dark:focus:ring-red-500"
    return "p-2.5 text-sm bg-gray-50 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
  };

  const handleHelperText = () => {
    if (error.size) return <p className='text-xs text-red-500'>Size must be less than 1MB</p>;
    if (error.type) return <p className='text-xs text-red-500'>Only jpg, jpeg, png and gif are allowed</p>;
    if (error.requiredFieldFile) return <p className='text-xs text-red-500'>Image is requiredField</p>;
    return <p className='text-xs'>JPG, JPEG, PNG or GIF (MAX. 1MB)</p>;
  };

  const handleOnChangeFile = (event) => {
    if (event) {
      const value = event.target.files[0];
      if (!value.type.match(REGEX_FILE_TYPE)) {
        return setError({ ...error, type: true, size: false });
      }
      if (value.size > MAX_SIZE) {
        return setError({ ...error, size: true, type: false });
      }
      setError({ size: false, type: false, requiredFieldFile: false });
      return setFile([...file, value])
    }
  };

  const previewImage = () => {
    if (file.length > 0) {
      return file.map((image, index) => {
        return <div className='border border-black h-24 w-24 overflow-hidden rounded relative' key={index}>
          <img src={URL.createObjectURL(image)} className='h-24 w-24 rounded object-cover ' />
          <div className='absolute bottom-0 right-0 p-1'>
            <MdDelete color='red' onClick={() => setFile(file.filter((item, idx) => idx !== index))} />
          </div>
        </div>
      });
    }
  };

  const categoryOptions = () => {
    if (category) {
      return category.map((item, index) => {
        return <option key={index} value={item.id}>{item.name}</option>
      })
    }
  };

  const handleCreateButton = async () => {
    if (file.length === 0) return setError({ ...error, requiredFieldFile: true });
    if (!data.name) return setRequiredField({ ...requiredField, name: true });
    if (!data.weight) return setRequiredField({ ...requiredField, weight: true });
    if (!data.price) return setRequiredField({ ...requiredField, price: true });
    if (!data.description) return setRequiredField({ ...requiredField, description: true });
    try {
      setIsLoading(true);
      const postProduct = await API_CALL.post('product', {
        name: data.name,
        price: parseInt(data.price),
        description: data.description,
        weight: parseInt(data.weight),
        unit: data.unit,
        categoryId: parseInt(data.categoryId),
      },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}`, }
        });
      if (postProduct) {
        const formData = new FormData();
        formData.append('productId', postProduct.data.result.id);
        file.forEach((image) => formData.append(`productUpload`, image));
        const postImage = await API_CALL.post('product/image', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (postImage) navigate('/manage/product');
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setIsLoading(false);
        return customToast('error', 'Product already exists');
      }
    }
  };

  return <LayoutDashboard>
    <div className='w-full'>
      <TopBar title='Create Product' prevPage={() => navigate('/manage/product')} />
      <LoadingSpinner size={16} isLoading={isLoading} />
      {/* FORM */}
      <div className="flex flex-col px-2 my-3 py-3 lg:mt-5 lg:w-1/2 border rounded-md m-auto shadow-md">
        <form className={`p-3 ${isLoading && 'hidden'}`}>
          <div className='grid gap-2 mb-3'>
            <Label value='Product Name' />
            <TextInput placeholder='Product Name' onChange={(e) => { setData({ ...data, name: e.target.value }); setRequiredField({ ...requiredField, name: false }) }} color={requiredField.name && 'failure'} helperText={requiredField.name && 'Name is required'} required />
          </div>
          <div className='grid gap-2 mb-3'>
            <Label value='Category' />
            <Select onChange={(e) => setData({ ...data, categoryId: e.target.value })} required >
              {categoryOptions()}
            </Select>
          </div>
          <div className='grid gap-2 mb-3'>
            <Label value='Weight' />
            <div className='flex disabled:cursor-not-allowed disabled:opacity-50 ' >
              <div>
                <TextInput theme={customTextInputTheme} type='number' placeholder='100g' onChange={(e) => { setData({ ...data, weight: e.target.value }); setRequiredField({ ...requiredField, weight: false }) }} color={requiredField.weight && 'failure'} helperText={requiredField.weight && 'Weight is required'} required />
              </div>
              <div>
                <select className='border rounded-r-lg bg-gray-400 p-2.5' onChange={(e) => setData({ ...data, unit: e.target.value })}>
                  <option value={'g'}>g</option>
                  <option value={'ml'}>ml</option>
                </select>
              </div>
            </div>
          </div>
          <div className='grid gap-2 mb-3'>
            <Label value='Price' />
            <CurrencyInput
              className={handleRequiredField()}
              id="input-price"
              name="input-price"
              placeholder="Please enter product price"
              allowDecimals={false}
              allowNegativeValue={false}
              intlConfig={{ locale: 'id-ID', currency: 'IDR' }}
              onValueChange={(value) => { setData({ ...data, price: value }); setRequiredField({ ...requiredField, price: false }) }}
            />
            <p className="text-sm text-red-600" hidden={!requiredField.price}>Price is required!</p>
          </div>
          <div className='grid gap-2 mb-3'>
            <Label value='Description' />
            <Textarea placeholder='Description' className='p-2' rows={4} onChange={(e) => { setData({ ...data, description: e.target.value }); setRequiredField({ ...requiredField, description: false }) }} color={requiredField.description && 'failure'} helperText={requiredField.description && 'Description is required'} required />
          </div>
          {/* IMAGE */}
          <div className='grid gap-2 mb-3'>
            <Label value='Images' />
            <div className='flex-wrap flex gap-8'>
              <BoxAddImage
                refImage={hiddenFileInput}
                onChangeImage={handleOnChangeFile}
                onClick={() => hiddenFileInput.current.click()}
                isHidden={file.length === 3}
              />
              {previewImage()}
            </div>
            {handleHelperText()}
          </div>
          <div className='mt-10 flex gap-16 justify-center'>
            <Button theme={customButton} color='primary' onClick={handleCreateButton}>Create</Button>
            <Button theme={customButton} color='secondary' onClick={() => navigate('/manage/product')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  </LayoutDashboard>
};

export default CreateProduct;