import { Button, Modal, Label, Select, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const FormStore = ({
  admin,
  adminData,
  province,
  provinceData,
  city,
  cityData,
  district,
  districtData,
  address,
  postal,
  branch,
  onBranch,
  onAdmin,
  onProvince,
  onCity,
  onDistrict,
  onAddress,
  onPostal,
  onSubmit,
  isLoading,
}) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex flex-col items-center py-8 px-4 gap-4">
      <div className="flex flex-col gap-1 w-full">
        <Label value="Branch Name *" />
        <TextInput
          type="text"
          placeholder="Branch name"
          onChange={onBranch}
          defaultValue={branch}
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label value="Branch Admin *" />
        <Select onChange={onAdmin} value={admin || ''}>
          <option value="">-- Select Admin --</option>
          {adminData &&
            adminData.map((value) => (
              <option key={value.UUID} value={value.UUID}>
                {value.name}
              </option>
            ))}
        </Select>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="province" value="Province *" />
        <Select onChange={onProvince} value={province || ''}>
          <option value="">-- Select Province --</option>
          {provinceData &&
            provinceData.map((value) => (
              <option key={value.id} value={value.id}>
                {value.provinceName}
              </option>
            ))}
        </Select>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="city" value="City *" />
        <Select
          disabled={province ? false : true}
          onChange={onCity}
          value={city || ''}
        >
          <option value="">-- Select City --</option>
          {cityData &&
            cityData.map((value) => (
              <option key={value.id} value={value.id}>
                {value.cityName}
              </option>
            ))}
        </Select>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="district" value="District *" />
        <Select
          disabled={city ? false : true}
          onChange={onDistrict}
          value={district || ''}
        >
          <option value="">-- Select District --</option>
          {districtData &&
            districtData.map((value) => (
              <option key={value.id} value={value.id}>
                {value.districtName}
              </option>
            ))}
        </Select>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="address" value="Address *" />
        <TextInput
          type="text"
          placeholder="Street name"
          defaultValue={address}
          onChange={onAddress}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="postal" value="PostalCode *" />
        <TextInput
          type="number"
          placeholder="Postal Code"
          defaultValue={postal}
          onChange={onPostal}
        />
      </div>
      <div className="w-full">
        <Button
          color="blue"
          fullSized
          onClick={() => setOpenModal(true)}
          isProcessing={isLoading}
        >
          Save Data
        </Button>
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Is the data entered correct?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="blue"
                onClick={() => {
                  setOpenModal(false);
                  onSubmit();
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FormStore;
