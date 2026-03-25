import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import CustomerSidebar from '../../common/CustomerSidebar'
import { Link, useParams } from 'react-router-dom'
import Loader from '../../common/Loader'
import { apiUrl, customerToken } from '../../common/http'

const CustomerOrderDetails = () => {


    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState({})
    const [orderItems, setOrderItems] = useState([])

    const { id } = useParams();

    // api data fetch for orders details by id for customer
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${apiUrl}/customer-orders-details/${id}`, {
                    method: "GET",
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${customerToken()}`
                    }
                });

                const result = await res.json();

                if (result.status == 200) {
                    setOrder(result.data || []);
                    setOrderItems(result.data.order_items || []);
                    // setStatus(result.data.status || '');
                    // setPaymentStatus(result.data.payment_status || '');
                    // console.log(result);
                } else {
                    console.log("Something went wrong");
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    return (
        <Layout>
            <div className='container'>
                <div className="row mb-5">
                    <div className='d-flex justify-content-between mt-5 pb-3'>
                        <h4 className='h4 pb-0 mb-0'>Orders</h4>
                        <Link className='btn btn-primary' to="/account/orders">Back</Link>
                    </div>
                    <div className="col-md-3">
                        <CustomerSidebar />
                    </div>
                    <div className="col-md-9">
                        <div className="row">
                            <div className='col-md-12'>
                                <div className='card shadow mb-5'>
                                    <div className='card-body p-4'>
                                        {
                                            loading === true && <Loader />
                                        }
                                        {
                                            loading === false &&
                                            <div>
                                                <div className="row">
                                                    <div className='col-md-4'>
                                                        <h3>Order ID: #{order.id}</h3>
                                                        {
                                                            order.status === 'pending' && (
                                                                <span className='badge bg-warning'>Pending</span>
                                                            )
                                                        }

                                                        {
                                                            order.status === 'shipped' && (
                                                                <span className='badge bg-info'>Shipped</span>
                                                            )
                                                        }

                                                        {
                                                            order.status === 'delivered' && (
                                                                <span className='badge bg-success'>Delivered</span>
                                                            )
                                                        }

                                                        {
                                                            order.status === 'cancelled' && (
                                                                <span className='badge bg-danger'>Cancelled</span>
                                                            )
                                                        }
                                                        {/* <span className='badge bg-success'>Delivered</span> */}
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <div className='text-secondary'>
                                                            Date
                                                        </div>
                                                        <h4 className='pt-2'>{order.created_at}</h4>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <div className='text-secondary'>
                                                            Payment Status
                                                        </div>
                                                        {
                                                            order.payment_status === 'paid' && (
                                                                <span className='badge bg-success'>Paid</span>
                                                            )
                                                        }
                                                        {
                                                            order.payment_status === 'not paid' && (
                                                                <span className='badge bg-danger'>Not Paid</span>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-md-4'>
                                                        <div className='py-5'>
                                                            <strong className='text-secondary'>Customer Name: </strong>{order.name}
                                                            <div className='text-secondary fw-bold'>Customer Phone: </div>{order.mobile}
                                                            <div className='text-secondary fw-bold'>Customer Address: </div>{order.address}, {order.city}, {order.state}, {order.zip}
                                                        </div>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <div className='text-secondary pt-5'>Payment Method</div>
                                                        <p>
                                                            {
                                                                order.payment_method === 'stripe' && (
                                                                    <span className='badge bg-success'>Stripe</span>
                                                                )
                                                            }
                                                            {
                                                                order.payment_method === 'cod' && (
                                                                    <span className='badge bg-warning'>COD</span>
                                                                )
                                                            }
                                                            {
                                                                order.payment_method === 'sslcommerz' && (
                                                                    <span className='badge bg-dark'>SSLCommerz ({order.card_type})</span>
                                                                )
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <h3 className='pb-2 '><strong>Items</strong></h3>
                                                    {
                                                        orderItems && orderItems.map((item) => {
                                                            return (
                                                                <div className='row justify-content-end' key={item.id}>
                                                                    <div className='col-lg-12'>
                                                                        <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
                                                                            <div className='d-flex'>
                                                                                {
                                                                                    item.product.image && (
                                                                                        <img width={70} className='me-3' src={`${item.product.image_url}`} alt="" />
                                                                                    )
                                                                                }

                                                                                <div className='d-flex flex-column'>
                                                                                    <div className='mb-2'>
                                                                                        <span>{item.name}</span>
                                                                                    </div>
                                                                                    <div>
                                                                                        <button className='btn btn-size'>{item.size}</button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='d-flex'>
                                                                                <div>X{item.qty}</div>
                                                                                <div className='ps-3'>${item.price}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                    <div className='row justify-content-end'>
                                                        <div className='col-lg-12'>
                                                            <div className='d-flex  justify-content-between border-bottom pb-2 mb-2'>
                                                                <div>Subtotal (Product Prize)</div>
                                                                <div>${order.subtotal}</div>
                                                            </div>
                                                            <div className='d-flex  justify-content-between border-bottom pb-2 mb-2'>
                                                                <div>Delivery Charge</div>
                                                                <div>${order.shipping}</div>
                                                            </div>
                                                            <div className='d-flex  justify-content-between border-bottom pb-2 mb-2'>
                                                                <div><strong>Grand Total</strong></div>
                                                                <div>${order.grand_total}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* <div className='col-md-3'>
                                <div className='card shadow'>
                                    <div className='card-body p-4'>
                                        <form onSubmit={handleUpdate} action="">
                                            <div className='mb-3'>
                                                <label className='form-label' htmlFor="">Order Status</label>
                                                <select name="" id="" className='form-select'
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                            <div className='mb-3'>
                                                <label className='form-label' htmlFor="">Payment Status</label>
                                                <select name="" id="" className='form-select'
                                                    value={paymentStatus}
                                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                                >
                                                    <option value="paid">Paid</option>
                                                    <option value="not paid">Not Paid</option>
                                                </select>
                                            </div>
                                            <button type='submit' className='btn btn-primary' disabled={updating}>
                                                {updating ? 'Updating...' : 'Update'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CustomerOrderDetails
