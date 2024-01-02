import axios from 'axios';
import { OPENCAGE_API_KEY, OPENCAGE_API_URL } from '../config';
const geocode = async (district, city, province) => {
  const result = await axios.get(OPENCAGE_API_URL, {
    params: {
      q: `${district},${city},${province}`,
      key: `${OPENCAGE_API_KEY}`,
      limit: 1,
      no_annotations: 1,
    },
  });
  if (result.data.results.length > 0) {
    return result.data.results[0].geometry;
  } else {
    return false;
  }
};

export default geocode;
