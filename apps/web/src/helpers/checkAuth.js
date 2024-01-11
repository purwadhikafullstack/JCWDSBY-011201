import API_CALL from './API';

export default async function () {
  try {
    if (!localStorage.getItem('authToken')) {
      throw 'Token Not Found';
    }
    const token = localStorage.getItem('authToken');
    const result = await API_CALL.get('/auth/keep-login', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data.result;
  } catch (error) {
    console.log(error);
    return false;
  }
}
