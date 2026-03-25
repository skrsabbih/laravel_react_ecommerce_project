import React, { useContext, useEffect, useState } from 'react'
import Layout from './common/Layout'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CartContext } from './context/CartContext';
import { useForm } from 'react-hook-form';
import { apiUrl, customerToken } from './common/http';
import { toast } from 'react-toastify';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
    // react hook form
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            // setLoading(true);

            const res = await fetch(`${apiUrl}/update-customer-profile-details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${customerToken()}`
                }
            });
            const result = await res.json();
            // reset use for old data set
            if (result.status == 200) {
                // console.log(result);
                reset({
                    name: result.data.name,
                    email: result.data.email,
                    address: result.data.address,
                    mobile: result.data.mobile,
                    city: result.data.city,
                    state: result.data.state,
                    zip: result.data.zip
                });
            } else {
                toast.error(result.message || "Something went wrong");
            }
            // setLoading(false);
        }
    })

    const Navigate = useNavigate();
    const location = useLocation();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    //  first pick cartdata from Cartcontext
    const { cartData, subTotal, grandTotal, shipping, clearCart } = useContext(CartContext);
    const [isRedirecting, setIsRedirecting] = useState(false);
    // stripe payment gateway for state
    const [loading, setLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const [paymentStatus, setPaymentStatus] = useState("");

    // sslcommerze callback
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const payment = query.get('payment');

        if (payment === 'failed') {
            setPaymentStatus('SSLCommerz payment failed. Please try again.');
        } else if (payment === 'cancelled') {
            setPaymentStatus('Payment was cancelled.');
        } else if (payment === 'invalid') {
            setPaymentStatus('Invalid payment verification.');
        } else if (payment === 'session_missing') {
            setPaymentStatus('Payment session missing. Please try again.');
        } else if (payment === 'error') {
            setPaymentStatus('Something went wrong while verifying payment.');
        }
    }, [location.search]);

    // make a method for handle payment method
    const handlePaymentMethod = (e) => {
        setPaymentMethod(e.target.value);
        setPaymentStatus("");
    }

    // make a method for process payment and other data
    const processOrder = async (data) => {
        setLoading(true);
        setPaymentStatus("");
        try {
            // payment process for cod
            if (paymentMethod == 'cod') {
                await saveOrder(data, 'not paid');
                return;
            }
            // payment process for sslcommerz
            if (paymentMethod == 'sslcommerz') {
                const newFormData = {
                    ...data,
                    grand_total: grandTotal(),
                    subtotal: subTotal(),
                    shipping: shipping(),
                    discount: 0,
                    payment_status: 'not paid',
                    payment_method: 'sslcommerz',
                    status: 'pending',
                    cart: cartData
                };

                const res = await fetch(`${apiUrl}/sslcommerz/init`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${customerToken()}`
                    },
                    body: JSON.stringify(newFormData)
                });

                const result = await res.json();
                console.log("sslcommerz init response =>", result);

                if (result.status == 200 && result.gateway_url) {
                    setIsRedirecting(true);
                    window.location.href = result.gateway_url;
                    return;
                }

                setLoading(false);
                setPaymentStatus(result.message || "Unable to initialize SSLCommerz payment.");
                return;
            }
            // payment process for stripe
            if (!stripe || !elements) {
                setLoading(false);
                setPaymentStatus("Stripe is not ready. Please try again later.");
                return;
            }

            const cardElement = elements.getElement(CardElement);

            if (!cardElement) {
                setLoading(false);
                setPaymentStatus("Card input not found.");
                return;
            }

            const response = await fetch(`${apiUrl}/create-customer-payment-intent`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${customerToken()}`
                },
                body: JSON.stringify({ amount: Math.round(grandTotal() * 100) }),
            });

            const result = await response.json();
            console.log("payment intent response =>", result);

            if (!result.clientSecret) {
                setPaymentStatus(result.message || "Unable to process payment. Please try again.");
                return;
            }

            const paymentResult = await stripe.confirmCardPayment(result.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: data.name,
                        email: data.email,
                        phone: data.mobile,
                        address: {
                            line1: data.address,
                            city: data.city,
                            state: data.state,
                            postal_code: data.zip,
                        },
                    },
                },
            });

            console.log("paymentResult =>", paymentResult);

            if (paymentResult.error) {
                console.log("Stripe payment error =>", paymentResult.error);
                setPaymentStatus(`Payment failed: ${paymentResult.error.message}`);
                return;
            }

            if (paymentResult.paymentIntent?.status === "succeeded") {
                setPaymentStatus("Payment successful!");
                await saveOrder(data, 'paid');
                return;
            }
            setLoading(false);
            setPaymentStatus(`Payment status: ${paymentResult.paymentIntent?.status}`);
        } catch (error) {
            console.log("processOrder error =>", error);
            setLoading(false);
            setPaymentStatus("Stripe payment failed. Please try again.");
        }
    }

    // make a method for from submit and api send data
    const saveOrder = async (formData, paymentStatus) => {
        try {
            // append data into newFormData
            // console.log(cartData);
            // crate a payload data for api
            const newFormData = {
                ...formData,
                grand_total: grandTotal(),
                subtotal: subTotal(),
                shipping: shipping(),
                discount: 0,
                payment_status: paymentStatus,
                payment_method: paymentMethod,
                status: 'pending',
                cart: cartData
            };
            // console.log(newFormData);
            const res = await fetch(`${apiUrl}/order-place`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${(customerToken())}`
                },
                body: JSON.stringify(newFormData)
            });

            const result = await res.json();
            // console.log(result);
            // if status ok  then navigate to success page (order confirm page)
            setLoading(false);
            if (result.status == 201) {
                setIsRedirecting(true);
                // navigate to order confirm page
                Navigate(`/order/confirmation/${result.order_id}`);
                // remove cart data from localstorage and cartcontext state updted
                setTimeout(() => {
                    clearCart();
                }, 500);
            } else {
                toast.error(result.message || "Something went wrong");
            }
            // console.log(result);
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    // if first cart is empty then continie shopping
    if ((!cartData || cartData.length === 0) && !isRedirecting) {
        return (
            <Layout>
                <div className="container py-5">
                    <div
                        className="d-flex flex-column justify-content-center align-items-center text-center"
                        style={{ minHeight: '60vh' }}
                    >
                        <h3 className="mb-3">No order found</h3>
                        <p className="text-muted mb-4">
                            First add an item to cart and then checkout please.
                        </p>
                        <Link to="/" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </Layout>
        )
    }
    return (
        <div className="container pb-5">
            <div className="row">
                <div className="col-md-12">
                    <nav aria-label="breadcrumb" className='py-4'>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Checkout</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <form onSubmit={handleSubmit(processOrder)} action="">
                <div className="row">
                    <div className="col-md-7">
                        <h3 className='border-bottom pb-3'><strong>Billing Details</strong></h3>
                        <div className="row pt-3">
                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        placeholder='Name'
                                        {
                                        ...register('name', {
                                            required: 'The name field is required.'
                                        }
                                        )
                                        }
                                    />
                                    {errors.name && <p className='invalid-feedback'>{errors.name.message}</p>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        placeholder='Email'
                                        {
                                        ...register('email', {
                                            required: 'The email field is required.',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        }
                                        )
                                        }
                                    />
                                    {errors.email && <p className='invalid-feedback'>{errors.email.message}</p>}
                                </div>
                            </div>
                            <div className='mb-3'>
                                <textarea
                                    {
                                    ...register('address', {
                                        required: 'The address field is required.'
                                    }
                                    )
                                    }
                                    className={`form-control ${errors.address ? 'is-invalid' : ''}`} rows={3} placeholder='Address'>
                                </textarea>
                                {errors.address && <p className='invalid-feedback'>{errors.address.message}</p>}
                            </div>
                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                        placeholder='City'
                                        {
                                        ...register('city', {
                                            required: 'The city field is required.'
                                        }
                                        )
                                        }
                                    />
                                    {errors.city && <p className='invalid-feedback'>{errors.city.message}</p>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                        placeholder='State'
                                        {
                                        ...register('state', {
                                            required: 'The state field is required.'
                                        })
                                        }
                                    />
                                    {errors.state && <p className='invalid-feedback'>{errors.state.message}</p>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        placeholder='Zip'
                                        className={`form-control ${errors.zip ? 'is-invalid' : ''}`}
                                        {...register('zip', {
                                            required: 'Zip is required',
                                            maxLength: {
                                                value: 6,
                                                message: 'Zip must be maximum 6 characters'
                                            }
                                        })}
                                    />
                                    {errors.zip && <p className='invalid-feedback'>{errors.zip.message}</p>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        placeholder='Mobile'
                                        className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                        {...register('mobile', {
                                            required: 'Mobile is required',
                                            maxLength: {
                                                value: 11,
                                                message: 'Mobile must be maximum 11 digits'
                                            },
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: 'Mobile must be numeric'
                                            }
                                        })}
                                    />
                                    {errors.mobile && <p className='invalid-feedback'>{errors.mobile.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <h3 className='border-bottom pb-3'>
                            <strong>Items</strong>
                        </h3>
                        <table className='table'>
                            <tbody>
                                {
                                    cartData && cartData.map((item) => (
                                        <tr key={item.id}>
                                            <td width={100}>
                                                <img src={item.image_url} alt="" srcSet="" width={80} />
                                            </td>
                                            <td width={600}>
                                                <h4>{item.title}</h4>
                                                <div className='d-flex align-items-center pt-3'>
                                                    <span>${item.price}</span>
                                                    <div className='ps-3'>
                                                        {
                                                            item.size_name && <button className='btn btn-size'>{item.size_name}</button>
                                                        }
                                                    </div>
                                                    <div className='ps-5'>
                                                        QTY: {item.qty}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='d-flex justify-content-between border-bottom pb-2'>
                                    <div>Subtotal (Product Prize)</div>
                                    <div>${subTotal()}</div>
                                </div>
                                <div className='d-flex justify-content-between border-bottom py-2'>
                                    <div>Delivery Charge</div>
                                    <div>${shipping()}</div>
                                </div>
                                <div className='d-flex justify-content-between border-bottom py-2'>
                                    <div><strong>Grand Total</strong></div>
                                    <div>${grandTotal()}</div>
                                </div>
                            </div>
                        </div>
                        {/* payment method section */}
                        <h3 className='border-bottom pt-4 pb-3'><strong>Payment Method</strong></h3>
                        <div className='pt-2'>
                            <input
                                type="radio"
                                value={'stripe'}
                                checked={paymentMethod === 'stripe'}
                                onChange={handlePaymentMethod}
                            />
                            <label htmlFor="" className='form-label ps-2'>Stripe</label>
                            <input
                                type="radio"
                                value={'cod'}
                                checked={paymentMethod == 'cod'}
                                onChange={handlePaymentMethod}
                                className='ms-3' />
                            <label htmlFor="" className='form-label ps-2'>Cash On Delivery (COD)</label>
                            <input
                                type="radio"
                                value={'sslcommerz'}
                                checked={paymentMethod == 'sslcommerz'}
                                onChange={handlePaymentMethod}
                                className='ms-3' />
                            <label htmlFor="" className='form-label ps-2'>Bkash / Nagad</label>
                        </div>
                        {
                            paymentMethod == "stripe" && <div className='border p-3'>
                                <CardElement options={{ hidePostalCode: true }} />
                            </div>
                        }
                        {
                            paymentMethod == "sslcommerz" && (
                                <div className="alert alert-secondary mt-3">
                                    You will be go to secure payment page. Please Clicked Pay Now Button.
                                </div>
                            )
                        }
                        {
                            paymentStatus && <div className="alert alert-info mt-3">{paymentStatus}</div>
                        }
                        <div className='d-flex  py-3'>
                            <button className='btn btn-primary' disabled={loading}>
                                {loading ? 'Please wait' : 'Pay Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CheckoutForm
