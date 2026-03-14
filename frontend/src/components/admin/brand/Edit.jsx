import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { adminToken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'

const Edit = () => {

    const navigate = useNavigate();

    const [updating, setUpdating] = useState(false);

    // from validation use useForm hook
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm()

    const { id } = useParams();

    // first fetch api for old data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${apiUrl}/brands/${id}`, {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${adminToken()}`
                    }
                })

                const result = await res.json();
                if (result.status == 200) {
                    const brand = result.data;
                    reset({
                        name: brand.name,
                        status: String(brand.status)
                    });
                } else {
                    console.log("Something went wrong");
                    navigate('/admin/brands');
                }

            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [id, navigate, setValue]);

    // update the api data
    const updateBrand = async (data) => {
        setUpdating(true);
        try {
            const res = await fetch(`${apiUrl}/brands/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.status == 200) {
                toast.success(result.message);
                navigate('/admin/brands');
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
                        <h4 className='h4 pb-0 mb-0'>Your Title</h4>
                        <Link className='btn btn-primary' to="/admin/brands">Back</Link>
                    </div>
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        <form onSubmit={handleSubmit(updateBrand)}>
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
                            <button type='submit' className='btn btn-primary mt-3' disabled={updating}>
                                {updating ? 'Updating...' : 'Update'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Edit
