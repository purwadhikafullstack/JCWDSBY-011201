import { Button, Label, Select, TextInput } from 'flowbite-react';

const FormAddress = ({
  province,
  provinceData,
  city,
  cityData,
  district,
  districtData,
  address,
  postal,
  onProvince,
  onCity,
  onDistrict,
  onAddress,
  onPostal,
  onSubmit,
  isLoading,
}) => {
  return (
    <div className="flex flex-col w-full items-center py-8 px-4 gap-4">
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="province" value="Province *" />
        <Select onChange={onProvince}>
          <option value="">-- Select Province --</option>
          {provinceData &&
            provinceData.map((value) => (
              <option
                key={value.id}
                value={value.id}
                selected={province === value.id ? true : false}
              >
                {value.provinceName}
              </option>
            ))}
        </Select>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="city" value="City *" />
        <Select disabled={province ? false : true} onChange={onCity}>
          <option value="">-- Select City --</option>
          {cityData &&
            cityData.map((value) => (
              <option
                key={value.id}
                value={value.id}
                selected={city === value.id ? true : false}
              >
                {value.cityName}
              </option>
            ))}
        </Select>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="district" value="District *" />
        <Select disabled={city ? false : true} onChange={onDistrict}>
          <option value="">-- Select District --</option>
          {districtData &&
            districtData.map((value) => (
              <option
                key={value.id}
                value={value.id}
                selected={district === value.id ? true : false}
              >
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
          onClick={onSubmit}
          isProcessing={isLoading}
        >
          Save Address
        </Button>
      </div>
    </div>
  );
};

export default FormAddress;
