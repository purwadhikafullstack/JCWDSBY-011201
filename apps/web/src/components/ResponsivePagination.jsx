import { Pagination } from "flowbite-react";

const ResponsivePagination = ({
  onPageChange,
  currentPage,
  totalPages,
}) => {
  return <>
    <div className='grid max-w-full overflow-x-auto pb-4 justify-items-center lg:justify-items-end'>
      <Pagination
        className="lg:hidden"
        layout='navigation'
        onPageChange={onPageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        showIcons
      />
      <Pagination
        className="hidden lg:block"
        layout='pagination'
        onPageChange={onPageChange}
        currentPage={currentPage}
        totalPages={totalPages}
        showIcons
      />
    </div>
  </>
};

export default ResponsivePagination;