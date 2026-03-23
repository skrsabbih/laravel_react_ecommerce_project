import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { useForm } from 'react-hook-form'
import { adminToken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'

const Shipping = () => {
    // use form hook
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm()

    // saving 
    const [saving, setSaving] = useState(false);

    // first fetch the shipping data from api
    useEffect(() => {
        const shipping = async () => {
            try {
                const res = await fetch(`${apiUrl}/shipping-charges-fetch`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${(adminToken())}`
                    }
                });

                const result = await res.json();
                console.log(result);
                if (result.status === 200) {
                    reset({
                        shipping_charge: result.data.shipping_charge
                    })
                } else {
                    toast.error(result.message || "Something went wrong");
                }
            } catch (error) {
                console.log(error);
            }
        }
        shipping();
    }, [reset])


    // use createorupdate api
    const addShipping = async (data) => {
        // console.log(data);
        setSaving(true);
        try {
            const res = await fetch(`${apiUrl}/shipping-charges-createorupdate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${(adminToken())}`
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            // console.log(result);
            if (result.status === 200) {
                toast.success(result.message);
            } else {
                toast.error(result.message || "Something went wrong");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Layout>
            <div className='container'>
                <div className="row mb-5">
                    <div className='d-flex justify-content-between mt-5 pb-3'>
                        <h4 className='h4 pb-0 mb-0'>Shipping</h4>

                    </div>
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        <form onSubmit={handleSubmit(addShipping)} action="">
                            <div className="card shadow">
                                <div className="card-body p-4">
                                    <div className='mb-3'>
                                        <label htmlFor="" className="form-label">Shipping Charge</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.shipping_charge ? 'is-invalid' : ''}`}
                                            placeholder='Shipping Charge'
                                            {
                                            ...register('shipping_charge', {
                                                required: 'Shipping Charge is required',
                                                pattern: {
                                                    value: /^[0-9]+(\.[0-9]+)?$/,
                                                    message: 'Shipping Charge must be a number'
                                                }
                                            })
                                            }
                                        />
                                        {errors.shipping_charge && <p className='invalid-feedback'>{errors.shipping_charge.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary mt-3">
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Shipping
