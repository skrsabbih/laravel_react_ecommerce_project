import React, { useState } from 'react'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { adminToken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'

const Create = () => {

    const navigate = useNavigate();

    const [creating, setCreating] = useState(false);

    // from validation use useForm hook
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    // make a method for from submit and api send data
    const createBrand = async (data) => {
        setCreating(true);
        try {
            console.log(data);
            const res = await fetch(`${apiUrl}/brands`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.status == 201) {
                toast.success(result.message);
                navigate('/admin/brands');
            } else {
                toast.error(result.message || "Something went wrong");
            }
        } catch (error) {
            console.log(error);
        }
        setCreating(false);
    }

    return (
        <Layout>
            <div className='container'>
                <div className="row">
                    <div className='d-flex justify-content-between mt-5 pb-3'>
                        <h4 className='h4 pb-0 mb-0'>Brands / Create</h4>
                        <Link className='btn btn-primary' to="/admin/brands">Back</Link>
                    </div>
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        <form onSubmit={handleSubmit(createBrand)}>
                            <div className="card shadow">
                                <div className="card-body p-4">
                                    <div className='mb-3'>
                                        <label htmlFor="" className='form-label'>Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? "is-invalid" : ''}`}
                                            placeholder="Name"
                                            {...register('name', {
                                                required: 'The Name field is required',
                                                minLength: { value: 3, message: 'The Name field must be at least 3 characters' }
                                            })
                                            }
                                        />
                                        {errors.name && (<p className='invalid-feedback'>{errors.name.message}</p>)}
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="" className='form-label'>Status</label>
                                        <select
                                            name="" id=""
                                            className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                                            {...register('status', {
                                                required: 'The Status field is required'
                                            })}
                                        >
                                            <option value="">Select a Status</option>
                                            <option value="1">Active</option>
                                            <option value="0">Block</option>
                                        </select>
                                        {errors.status && (<p className='invalid-feedback'>{errors.status.message}</p>)}
                                    </div>
                                </div>
                            </div>
                            <button type='submit' className='btn btn-primary mt-3' disabled={creating}>
                                {creating ? 'Creating...' : 'Create'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Create
