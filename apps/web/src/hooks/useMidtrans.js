import { useEffect, useState } from 'react';

export const useSnap = () => {
  const [snap, setSnap] = useState(null);
  useEffect(() => {
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl;

    const midtransClientKey = 'SB-Mid-client-Ga-mLubrn6Sfnaxj';
    scriptTag.setAttribute('data-client-key', midtransClientKey);
    scriptTag.onload = () => {
      setSnap(window.snap);
    };

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const snapEmbed = (snapToken, embedId, action) => {
    if (snap) {
      snap.embed(snapToken, {
        embedId,
        onSuccess: (result) => {
          console.log('success', result);
        //   action.onSuccess(result);
        },
        onPending: (result) => {
          console.log('pending', result);
        //   action.onPending(result);
        },
        onClose: (result) => {
          console.log('closed', result);
        //   action.onClose();
        },
        onError: (result) => {
          console.log('fail', result);
        },
      });
    }
  };
  return {snapEmbed}
};
