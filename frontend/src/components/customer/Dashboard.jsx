import React, { useState } from 'react'
import Layout from '../common/Layout'
import CustomerSidebar from '../common/CustomerSidebar'
import { useForm } from 'react-hook-form'
import { apiUrl, customerToken } from '../common/http'
import { toast } from 'react-toastify'
import Loader from '../common/Loader'

const Dashboard = () => {

    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(false);

    // react hook form
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            setLoading(true);

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
            setLoading(false);
        }
    })

    // customerProfileUpdate api
    const customerProfileUpdate = async (data) => {
        setUpdating(true);
        try {
            // console.log(data);
            const res = await fetch(`${apiUrl}/update-customer-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${customerToken()}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            // console.log(result);

            if (result.status == 200) {
                toast.success(result.message);
            } else {
                toast.error(result.message || "Something went wrong");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setUpdating(false);
        }
    }

    return (
        <Layout>
            <div className='container'>
                <div className="row">
                    <div className='d-flex justify-content-between mt-5 pb-3'>
                        <h4 className='h4 pb-0 mb-0'>My Account</h4>
                        {/* <a className='btn btn-primary' href="http://">Button</a> */}
                    </div>
                    <div className="col-md-3">
                        <CustomerSidebar />
                    </div>
                    <div className="col-md-9">
                        {
                            loading === true && <Loader />
                        }
                        {
                            loading === false &&
                            <form onSubmit={handleSubmit(customerProfileUpdate)} action="">
                                <div className="card shadow">
                                    <div className="card-body p-4">
                                        <div className='row'>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="name" className="form-label">Name</label>
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
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="email" className="form-label">Email</label>
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
                                        <div className='row'>
                                            <div className='mb-3'>
                                                <label htmlFor="address" className="form-label">Address</label>
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
                                        </div>
                                        <div className='row'>
                                            <div className=" mb-3 col-md-6">
                                                <label htmlFor="mobile" className="form-label">Mobile</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                                    placeholder='Mobile'
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
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="city" className="form-label">City</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                                    placeholder='City'
                                                    {
                                                    ...register('city', {
                                                        required: 'The city field is required.'
                                                    })
                                                    }
                                                />
                                                {errors.city && <p className='invalid-feedback'>{errors.city.message}</p>}

                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="state" className="form-label">State</label>
                                                <input
                                                    type="text"
                                                    placeholder='State'
                                                    className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                                    {
                                                    ...register('state', {
                                                        required: 'The state field is required.'
                                                    })
                                                    }
                                                />
                                                {errors.state && <p className='invalid-feedback'>{errors.state.message}</p>}

                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="zip" className="form-label">Zip</label>
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
                                    </div>
                                </div>
                                <button type='submit' className='btn btn-primary mt-4 mb-5'>
                                    {updating ? 'Updating...' : 'Update'}
                                </button>
                            </form>
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
