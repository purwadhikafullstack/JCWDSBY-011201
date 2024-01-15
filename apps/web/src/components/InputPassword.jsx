import { Button } from 'flowbite-react';
import { useState } from 'react';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';

const InputPassword = ({
  id,
  name,
  onChange,
  onBlur,
  value,
  placeholder,
  HelperText,
}) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className="flex gap-1 border focus-within:ring-blue-500 focus-within:border-blue-500 rounded-lg border-gray-300 bg-gray-50">
        <input
          type={show ? 'text' : 'password'}
          id={id}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          placeholder={placeholder}
          className="focus:outline-none text-gray-900 text-sm bg-transparent block w-full p-2.5"
        />
        <button className="p-2" onClick={() => setShow((prev) => !prev)}>
          {show ? (
            <HiEye className="h-6 w-6" />
          ) : (
            <HiEyeSlash className="h-6 w-6" />
          )}
        </button>
      </div>
      {HelperText}
    </>
  );
};

export default InputPassword;
