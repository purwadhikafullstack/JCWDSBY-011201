import customToast from "../../utils/toast";

export const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      customToast('success', 'Copied to Clipboard');
    } catch (error) {
      customToast('error', 'Error copying to clipboard');
    }
  };