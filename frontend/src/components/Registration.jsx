import React from 'react'
import Layout from './common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiUrl } from './common/http'
import { toast } from 'react-toastify'

const Registration = () => {

    // use navigate hook
    const navigate = useNavigate();
    // use form hook for form validation
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    // make a method for from submit and api send data
    const registerUser = async (data) => {
        try {
            const res = await fetch(`${apiUrl}/customer-register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.status == 201) {
                toast.success(result.message);
                navigate('/account/login');
            } else {
                toast.error(result.message || "Something went wrong");
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout >
            <div className='container  d-flex justify-content-center py-5'>
                <form onSubmit={handleSubmit(registerUser)} action="">
                    <div className='card shadow border-0 login'>
                        <div className='card-body p-4'>
                            <h3 className='border-bottom pb-2 mb-3'>Register</h3>
                            <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder='Name'
                                    {
                                    ...register('name', {
                                        required: "The Name field is required.",
                                        minLength: {
                                            value: 3,
                                            message: "Name must be at least 3 characters long."
                                        }
                                    })
                                    }
                                />
                                {errors.name && <p className="invalid-feedback">{errors.name.message}</p>}
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Email</label>
                                <input
                                    type="email"
                                    autoComplete='new-email'
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder='Email'
                                    {
                                    ...register('email', {
                                        required: "The email field is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })
                                    }
                                />
                                {errors.email && <p className="invalid-feedback">{errors.email.message}</p>}
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Password</label>
                                <input
                                    type="password"
                                    autoComplete='new-password'
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder='Password'
                                    {
                                    ...register('password', {
                                        required: "The password field is required",
                                        minLength: {
                                            value: 7,
                                            message: "Password must be at least 7 characters long."
                                        }
                                    })
                                    }
                                />
                                {errors.password && <p className="invalid-feedback">{errors.password.message}</p>}
                            </div>
                            <button type='submit' className='btn btn-secondary w-100'>Register</button>
                            <div className='d-flex justify-content-center pt-4 pb-2'>
                                Already have an account? &nbsp;
                                <Link to="/account/login">Login</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default Registration
