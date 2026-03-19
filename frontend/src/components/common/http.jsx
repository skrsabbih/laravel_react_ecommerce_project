export const apiUrl = 'http://backend.test/api';
// export const imageBaseUrl = 'http://backend.test/uploads/products/small/';


// for admin bearer token
export const adminToken = () => {
    const data = JSON.parse(localStorage.getItem('adminInfo'));
    return data.token;
}

// for customer bearer token
export const customerToken = () => {
    const data = JSON.parse(localStorage.getItem('customerInfo'));
    return data.token;
}