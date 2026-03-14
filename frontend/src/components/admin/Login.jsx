import React, { useContext } from 'react'
import Layout from '../common/Layout'
import { useForm } from 'react-hook-form'
import { apiUrl } from '../common/http'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AdminAuthContext } from '../context/AdminAuth'
const Login = () => {
    const { login } = useContext(AdminAuthContext);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const navigate = useNavigate();


    const onSubmit = async (data) => {
        // console.log(data)
        try {
            // fetch the login api
            const res = await fetch(`${apiUrl}/admin/administration`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data)
            })
            const result = await res.json()
            console.log(result)
            if (result.status == 200) {
                const adminInfo = {
                    token: result.token,
                    id: result.id,
                    name: result.name
                }
                localStorage.setItem("adminInfo", JSON.stringify(adminInfo));
                toast.success(result.message);
                login(adminInfo);
                navigate('/admin/dashboard');
            } else {
                toast.error(result.message || "Invalid Email or Password");
            }
        } catch (error) {
            console.log("Error", error)
            toast.error("Something went wrong");
        }
    }
    return (
        <Layout>
            <div className='container d-flex justify-content-center py-5'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='card shadow border-0 login'>
                        <div className='card-body p-4'>
                            <h3>Admin Login</h3>
                            <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''} `}
                                    placeholder='Email'
                                    {
                                    ...register("email", {
                                        required: "The email field is required.",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Please enter a valid email address."
                                        }
                                    })
                                    } />
                                {errors.email && (<p className='invalid-feedback'>{errors.email.message}</p>
                                )}
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="" className='form-label'>Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''} `}
                                    placeholder='Password'
                                    {
                                    ...register("password", {
                                        required: "The password field is required.",
                                        minLength: {
                                            value: 7,
                                            message: "Password must be at least 7 characters."
                                        }
                                    })
                                    }
                                />
                                {errors.password && (<p className='invalid-feedback'>{errors.password.message}</p>)}
                            </div>
                            <button className='btn btn-secondary'>Login</button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default Login
