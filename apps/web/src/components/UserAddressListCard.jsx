import { HiOutlineTrash, HiPencilSquare } from 'react-icons/hi2';

const UserAddressListCard = ({
  address,
  district,
  city,
  province,
  postal,
  isDefault,
  onDefault,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex flex-col w-full border rounded-xl p-4 shadow-sm">
      <div className="flex justify-between">
        <div className="flex flex-col w-[60%] justify-center">
          <span className="text-xs font-semibold md:text-base">{address}</span>
          <span className="text-xs font-semibold md:text-base">
            {district},{city},{province}
          </span>
          <span className="text-xs font-semibold md:text-base">{postal}</span>
        </div>
        <div className="flex flex-col justify-center gap-2">
          {isDefault ? (
            <span className="font-extrabold text-blue-800">Default</span>
          ) : (
            <span
              className="font-semibold text-blue-500 cursor-pointer underline underline-offset-2"
              onClick={onDefault}
            >
              Set as default
            </span>
          )}
          <div className="flex justify-evenly">
            <div
              className="flex p-2 border-2 rounded-xl cursor-pointer"
              onClick={onEdit}
            >
              <span className="w-6 h-6">
                <HiPencilSquare size={'100%'} />
              </span>
            </div>
            <div
              className={`${
                isDefault ? 'hidden' : 'flex'
              } p-2 border-2 rounded-xl cursor-pointer`}
              onClick={onDelete}
            >
              <span className="w-6 h-6">
                <HiOutlineTrash size={'100%'} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAddressListCard;
