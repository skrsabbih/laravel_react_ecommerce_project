export const apiUrl = 'http://backend.test/api';
// export const imageBaseUrl = 'http://backend.test/uploads/products/small/';

export const adminToken = () => {
    const data = JSON.parse(localStorage.getItem('adminInfo'));
    return data.token;
}
