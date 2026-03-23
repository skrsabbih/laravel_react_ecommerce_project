import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { Link } from 'react-router-dom';
import { adminToken, apiUrl } from '../../common/http';
import Nostate from '../../common/Nostate';
import Loader from '../../common/Loader';

const Order = () => {

    // state management
    const [loading, setLoading] = useState(false);

    // state for mapping brands data
    const [orders, setOrders] = useState([]);

    // api data fetch for orders
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${apiUrl}/admin-orders`, {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${adminToken()}`
                    }
                });

                const result = await res.json();

                if (result.status == 200) {
                    setOrders(result.data || []);
                    console.log(result);
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
                    </div>
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                {
                                    loading == true && <Loader />
                                }
                                {
                                    loading == false && orders.length == 0 && <Nostate text="No Orders Found" />
                                }
                                {orders && orders.length > 0 &&
                                    <table className='table table-striped'>
                                        <thead>
                                            <tr>
                                                <th>Details</th>
                                                <th>Customer</th>
                                                <th>Email</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Payment Status</th>
                                                <th>Order Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order.id}>
                                                    <td>
                                                        <Link to={`/admin/orders/details/${order.id}`}>{order.id}<span className='text-danger'> (Clicked) </span></Link>
                                                    </td>
                                                    <td>{order.name}</td>
                                                    <td>{order.email}</td>
                                                    <td>{order.grand_total} ৳</td>
                                                    <td>{order.created_at}</td>
                                                    <td>
                                                        {
                                                            order.payment_status == 'paid' ?
                                                                <span className='badge bg-success'>Paid</span>
                                                                :
                                                                <span className='badge bg-danger'>Not Paid</span>
                                                        }
                                                    </td>
                                                    <td>
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
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Order
