import React from 'react'
import { apiUrl, customerToken } from '../common/http';
import Layout from '../common/Layout'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import CustomerSidebar from '../common/CustomerSidebar';

const CusDasPassCng = () => {

    // use form
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const navigate = useNavigate();

    // password change api for customer dashbord
    const changePassword = async (data) => {
        // console.log(data);
        try {
            const res = await fetch(`${apiUrl}/customer-change-password`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${customerToken()}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (result.status == 200) {
                toast.success(result.message);
                navigate('/account/dashboard');
            } else {
                toast.error(result.message || "Something went wrong");
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Layout>
            <div className='container'>
                <div className="row mb-5">
                    <div className='d-flex justify-content-between mt-5 pb-3'>
                        <h4 className='h4 pb-0 mb-0'>Password Changes (Customer)</h4>
                    </div>
                    <div className="col-md-3">
                        <CustomerSidebar />
                    </div>
                    <div className="col-md-9">
                        <form onSubmit={handleSubmit(changePassword)} action="">
                            <div className="card shadow">
                                <div className="card-body p-4">
                                    <div className="mb-3">
                                        <label className='form-label'>Current Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.current_password ? "is-invalid" : ''}`}
                                            placeholder='Enter current password'
                                            {...register('current_password', {
                                                required: "Current password is required."
                                            })}
                                        />
                                        {errors.current_password && (
                                            <p className='invalid-feedback'>
                                                {errors.current_password.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className='form-label'>New Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.new_password ? "is-invalid" : ''}`}
                                            placeholder='Enter new password'
                                            {...register('new_password', {
                                                required: "New password is required.",
                                                minLength: {
                                                    value: 7,
                                                    message: "New password must be at least 7 characters long."
                                                }
                                            })}
                                        />
                                        {errors.new_password && (
                                            <p className='invalid-feedback'>
                                                {errors.new_password.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="" className='form-label'>Confirm New Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.new_password_confirmation ? "is-invalid" : ''}`}
                                            placeholder='Confirm new password'
                                            {...register('new_password_confirmation', {
                                                required: "Confirm password is required.",
                                                validate: (value) =>
                                                    value === watch('new_password') || "Confirm password does not match."
                                            })
                                            }
                                        />
                                        {errors.new_password_confirmation && (<p className='invalid-feedback'>{errors.new_password_confirmation.message}</p>)}
                                    </div>
                                </div>
                            </div>
                            <button className='btn btn-secondary mt-3'>
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CusDasPassCng
