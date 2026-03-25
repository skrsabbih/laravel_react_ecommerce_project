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

export const STRIPE_PUBLIC_KEY = 'pk_test_51TE3skDijESuojZlnfv811mstz2M83RCZUe270tC2HFaJZ6FBEkHq5NmkF1ol98kZI9bQVUuklXXTyIP6WscxfNU00a5BiZU24'