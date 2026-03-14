import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { adminToken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'
import Loader from '../../common/Loader'

const Edit = () => {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm()

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`${apiUrl}/categories/${id}`, {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${adminToken()}`
                    }
                });
                const result = await res.json();
                if (result.status == 200) {
                    const category = result.data;
                    setValue('name', category.name);
                    setValue('status', String(category.status));
                } else {
                    toast.error(result.message || "Category not found");
                    navigate('/admin/categories');
                }
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong");
            }
            setFetching(false);
        };
        fetchCategory();
    }, [id, navigate, setValue]);

    const updateCategory = async (data) => {
        // console.log(data);
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/categories/${id}`, {
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
                navigate('/admin/categories');
            } else {
                toast.error(result.message || "Something went wrong");
            }

        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    }

    return (
        <Layout>
            <div className='container'>
                <div className="row">
                    <div className='d-flex justify-content-between mt-5 pb-3'>
                        <h4 className='h4 pb-0 mb-0'>Your Title</h4>
                        <Link className='btn btn-primary' to="/admin/categories">Back</Link>
                    </div>
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        {fetching == false && (
                            <form onSubmit={handleSubmit(updateCategory)}>
                                <div className="card shadow">
                                    <div className="card-body p-4">
                                        {
                                            fetching == true && <Loader />
                                        }
                                        <div className="mb-3">
                                            <label htmlFor="" className='form-label'>Name</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.name ? "is-invalid" : ''}`}
                                                placeholder='Name'
                                                {...register('name', {
                                                    required: "The name field is required."
                                                })
                                                }
                                            />
                                            {errors.name && (<p className='invalid-feedback'>{errors.name.message}</p>)}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="" className='form-label'>Status</label>
                                            <select
                                                name=""
                                                id=""
                                                className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                                                {...register('status', {
                                                    required: "The status field is required."
                                                })
                                                }
                                            >
                                                <option value="">Select a Status</option>
                                                <option value="1">Active</option>
                                                <option value="0">Block</option>
                                            </select>
                                            {errors.status && (<p className='invalid-feedback'>{errors.status.message}</p>)}
                                        </div>
                                    </div>
                                </div>
                                <button type='submit' className='btn btn-primary mt-3' disabled={loading}>
                                    {loading ? "Updating..." : 'Update'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Edit
