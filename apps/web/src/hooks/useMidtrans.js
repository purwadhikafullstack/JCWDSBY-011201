import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSnap = () => {
  const navigate = useNavigate();
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
          action.onSuccess(result);
        },
        onPending: (result) => {
          action.onPending(result);
        },
        onClose: (result) => {
          action.onClose(result);
          navigate('/');
        },
        onError: (result) => {
          action.onError(result);
        },
      });
    }
  };
  return { snapEmbed };
};
