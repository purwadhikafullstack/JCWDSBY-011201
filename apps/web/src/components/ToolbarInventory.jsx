import { Button, Select } from 'flowbite-react';
import { FaPlus } from 'react-icons/fa6';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { sortingInventory } from '../constants/sorting';
import { useSelector } from 'react-redux';
import API_CALL from '../helpers/API';
import { useEffect, useState } from 'react';
import { customButton } from '../helpers/flowbiteCustomTheme';

const ToolbarInventory = ({
  onAddInventory,
  searchParams,
  setSearchParams,
  // filterStore,
  // filterCategory,
  setIsLoading,
}) => {
  const currentUser = useSelector(state => state.userReducer);
  const [store, setStore] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    getStore();
    getCategory();
  }, [])

  const getStore = async () => {
    try {
      setIsLoading(true);
      const resStore = await API_CALL.get('store', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setStore(resStore.data.result.raw);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getCategory = async () => {
    try {
      setIsLoading(true);
      const resCategory = await API_CALL.get('category', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setCategory(resCategory.data.result.rows);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const storeOption = () => {
    return store && store.map((item, index) => {
      if (searchParams.get('store') === item.UUID) {
        return <option key={index} value={item.UUID} selected>{item.name}</option>
      }
      return <option key={index} value={item.UUID}>{item.name}</option>
    })
  };

  const categoryOption = () => {
    return category && category.map((item, index) => {
      if (searchParams.get('category') === item.name) {
        return <option key={index} value={item.name} selected>{item.name}</option>
      }
      return <option key={index} value={item.name}>{item.name}</option>
    })
  };

  const handleFilterStore = (value) => {
    if (value === 'all') {
      searchParams.delete('store');
      searchParams.set('page', 1);
      return setSearchParams(searchParams)
    }
    searchParams.set('store', value);
    searchParams.set('page', 1);
    setSearchParams(searchParams)
  };

  const handleFilterCategory = (value) => {
    if (value === 'all') {
      searchParams.delete('category');
      searchParams.set('page', 1);
      return setSearchParams(searchParams)
    }
    searchParams.set('category', value);
    searchParams.set('page', 1);
    setSearchParams(searchParams)
  };

  return <div className='mb-2'>
    <div className='grid grid-cols-1 grid-row-2 items-start gap-3 lg:justify-between'>
      <div className='flex flex-col gap-3 justify-between lg:items-center lg:flex-row'>
        <div>
          <Button theme={customButton} size={'responsive'} color='secondary' onClick={onAddInventory} ><FaPlus className='mr-1' /> Add Inventory</Button>
        </div>
        <div>
          <div className='flex rounded-xl border-2 border-gray-500 focus-within:border-gray-700 p-1 overflow-hidden items-center gap-1'>
            <span className='w-6 h-6'>
              <HiMagnifyingGlass size={'100%'} />
            </span>
            <input
              type='search'
              defaultValue={searchParams.get('q')}
              placeholder='Search product name'
              onChange={(e) => {
                setTimeout(() => {
                  setSearchParams((prev) => {
                    if (e.target.value) {
                      prev.set('q', e.target.value);
                      searchParams.set('page', 1);
                    } else {
                      prev.delete('q');
                      searchParams.set('page', 1);
                    }
                    return prev;
                  });
                }, 1000);
              }}
              className=' outline-none bg-transparent'
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4 lg:flex-row'>
        <div className={`flex justify-between items-center lg:gap-2 ${currentUser.role !== 'super' && 'hidden'}`}>
          <span className='font-bold'>Store : </span>
          <Select onChange={(e) => handleFilterStore(e.target.value)}>
            <option value={'all'}>All</option>
            {storeOption()}
          </Select>
        </div>
        <div className={`flex justify-between items-center lg:gap-2`}>
          <span className='font-bold'>Category : </span>
          <Select onChange={(e) => handleFilterCategory(e.target.value)}>
            <option value={'all'}>All</option>
            {categoryOption()}
          </Select>
        </div>
        <div className={`flex justify-between items-center lg:gap-2`}>
          <span className='font-bold'>Sort : </span>
          <Select onChange={(e) => { searchParams.set('sort', e.target.value); searchParams.set('page', 1); setSearchParams(searchParams); }}>
            {sortingInventory.map((value, index) => {
              if (searchParams.get('sort') === value.value) {
                return <option key={index} value={value.value} selected>{value.sortName}</option>
              }
              return <option key={index} value={value.value}>{value.sortName}</option>
            })}
          </Select>
        </div>
      </div>
    </div>
  </div>
}

export default ToolbarInventory;