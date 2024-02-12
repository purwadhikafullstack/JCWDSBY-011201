import { Button, Label, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import API_CALL from '../helpers/API';
import customToast from '../utils/toast';

const CourierArrival = () => {
  const [resi, setResi] = useState(null);
  const updateResi = async (resi) => {
    try {
      const response = await API_CALL.patch('/transaction/courier/arrival', {
        status: 'arrived',
        resi,
      });
      customToast('success', response.data.message);
    } catch (error) {
      console.log(error);
      customToast('error', error.response.data?.message);
    }
  };
  return (
    <div className="max-w-md container mx-auto flex flex-col h-80 justify-center p-7">
      <div className="mb-2 block">
        <Label htmlFor="resi" value="Resi Paket Anda" />
      </div>
      <TextInput
        id="resi"
        type="text"
        placeholder="XXXXXX......"
        required
        onChange={(e) => setResi(e.target.value)}
        helperText={<>Masukkan nomer resi paket</>}
      />
      <Button color="blue" className="mt-3" onClick={() => updateResi(resi)}>
        Send
      </Button>
    </div>
  );
};

export default CourierArrival;
