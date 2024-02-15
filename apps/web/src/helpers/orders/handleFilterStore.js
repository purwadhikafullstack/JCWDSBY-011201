export const handleFilterStore = (value,searchParams,setSearchParams) => {
    if (value === 'all') {
      searchParams.delete('store');
      searchParams.set('page', 1);
      return setSearchParams(searchParams);
    }
    searchParams.set('store', value);
    searchParams.set('page', 1);
    setSearchParams(searchParams);
  };