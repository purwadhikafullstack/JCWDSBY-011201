import API_CALL from './API';

export default async function () {
  try {
    if (!localStorage.getItem('authToken')) {
      throw 'Token Not Found';
    }
    const token = localStorage.getItem('authToken');
    const result = await API_CALL.get('/auth/login/keep-login', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data.result;
  } catch (error) {
    return false;
  }
}
