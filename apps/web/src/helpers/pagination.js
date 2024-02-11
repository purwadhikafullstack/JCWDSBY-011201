export const onPageChange = (page, setSearchParams) => {
  setSearchParams((prev) => {
    prev.set('page', page);
    return prev;
  });
};