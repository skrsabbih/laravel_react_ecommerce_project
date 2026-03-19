import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import Layout from './common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { apiUrl } from './common/http'
import { CustomerAuthContext } from './context/CustomerAuth'
import { toast } from 'react-toastify'

const Login = () => {

    // use login from customerAuth context so for call is here need
    const { login } = useContext(CustomerAuthContext)


    // use form hook for form validation
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    // navigate
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        // console.log(data)
        try {
            // fetch the login api
            const res = await fetch(`${apiUrl}/customer-login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data)
            })
            const result = await res.json()
            // console.log(result)
            if (result.status == 200) {
                const customerInfo = {
                    token: result.token,
                    id: result.id,
                    name: result.name,
                    role: result.role
                }
                localStorage.setItem("customerInfo", JSON.stringify(customerInfo));
                toast.success(result.message);
                login(customerInfo);
                navigate('/account/dashboard');
            } else {
                toast.error(result.message || "Invalid Email or Password");
            }
        } catch (error) {
            console.log("Error", error)
            toast.error("Something went wrong");
        }
    }

    return (
        <Layout >
            <div className='container  d-flex justify-content-center py-5'>
                <form onSubmit={handleSubmit(onSubmit)} action="">
                    <div className='card shadow border-0 login'>
                        <div className='card-body p-4'>
                            <h3 className='border-bottom pb-2 mb-3'>Login</h3>
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
                            <button type='submit' className='btn btn-secondary w-100'>Login</button>
                            <div className='d-flex justify-content-center pt-4 pb-2'>
                                Don't have an account? &nbsp;
                                <Link to="/account/registration">Sign Up</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default Login
