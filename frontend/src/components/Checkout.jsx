import React, { useContext, useState } from 'react'
import Layout from './common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import ProductImg from '../assets/images/cart.jpg';
import { CartContext } from './context/CartContext';
import { useForm } from 'react-hook-form';
import { apiUrl, customerToken } from './common/http';
import { toast } from 'react-toastify';

const Checkout = () => {
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

    const [paymentMethod, setPaymentMethod] = useState('cod');
    //  first pick cartdata from Cartcontext
    const { cartData, subTotal, grandTotal, shipping, clearCart } = useContext(CartContext);

    // make a method for handle payment method
    const handlePaymentMethod = (e) => {
        setPaymentMethod(e.target.value);
    }

    // make a method for process payment and other data
    const processOrder = async (data) => {
        // console.log(data);
        // payment status
        if (paymentMethod == 'cod') {
            await saveOrder(data, 'not paid');
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
                status: 'pending',
                cart: cartData
            };
            // console.log(newFormData);
            const res = await fetch(`${apiUrl}/oder-place`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${(customerToken())}`
                },
                body: JSON.stringify(newFormData)
            });

            const result = await res.json();
            // if status ok  then navigate to success page (order confirm page)
            if (result.status == 201) {
                // remove cart data from localstorage and cartcontext state updted
                clearCart();
                // navigate to order confirm page
                Navigate(`/order/confirmation/${result.order_id}`);
            } else {
                toast.error(result.message || "Something went wrong");
            }
            // console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    // if first cart is empty then continie shopping
    if (!cartData || cartData.length === 0) {
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
        <Layout>
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
                            </div>
                            <div className='d-flex  py-3'>
                                <button className='btn btn-primary'>Pay Now</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default Checkout
