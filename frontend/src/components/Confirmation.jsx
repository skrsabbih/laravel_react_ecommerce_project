import React, { useContext, useEffect, useState } from 'react'
import Layout from './common/Layout'
import { Link, useParams } from 'react-router-dom'
import { apiUrl, customerToken } from './common/http'

const Confirmation = () => {

    // fetch order details id
    const { id } = useParams();

    // state management
    const [order, setOrder] = useState([]);

    // fetch order details 
    const fetchOrder = async () => {
        try {
            const res = await fetch(`${apiUrl}/order-details/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${(customerToken())}`
                }
            })

            // result 
            const result = await res.json();
            console.log(result);

            if (result.status === 200) {
                setOrder(result.data);
            } else {
                console.log("Something went wrong");
            }

        } catch (error) {
            console.log(error);
        }

    }

    // use side effect
    useEffect(() => {
        fetchOrder();
    }, [id]);

    // if order is not then return 
    if (!order) {
        return (
            <Layout>
                <div className='container py-5 text-center'>
                    Loading...
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className='container py-5'>
                <div>
                    <div className="row">
                        <h1 className='text-center fw-bold text-success'>Thank You!</h1>
                        <p className='text-muted text-center'>Your order has been successfully placed.</p>
                    </div>
                    <div className='card shadow'>
                        <div className='card-body'>
                            <h3 className='fw-bold'>Order Summary</h3>
                            <hr />
                            <div className='row'>
                                <div className='col-6'>
                                    <p>
                                        <strong>Order ID: </strong> # {order.id}
                                    </p>
                                    <p>
                                        <strong>Date:  </strong> {new Date(order.created_at).toDateString()}
                                    </p>
                                    <p>
                                        <strong>Status:  </strong>
                                        <span className='badge bg-warning'>{order.status}</span>
                                    </p>

                                    <p>
                                        <strong>Payment Method:  </strong>
                                        <span className='badge bg-warning'>
                                            {order.payment_status === 'not paid' ? 'COD' : 'Stripe'}
                                        </span>
                                    </p>

                                </div>
                                <div className='col-6'>
                                    <p>
                                        <strong>Customer: </strong> {order.name}
                                    </p>
                                    <p>
                                        <strong>Address: </strong> {order.address}, {order.city}, {order.state}, {order.zip}
                                    </p>
                                    <p>
                                        <strong>Contact: :  </strong> {order.mobile}

                                    </p>

                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <table className='table-striped table-bordered table'>
                                        <thead className='table-light'>
                                            <tr>
                                                <th>Item</th>
                                                <th>Quantity</th>
                                                <th width={150}>Price</th>
                                                <th width={150}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                order.order_items && order.order_items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.name}</td>
                                                        <td>{item.qty}</td>
                                                        <td>${item.unit_price}</td>
                                                        <td>${item.price}</td>
                                                    </tr>
                                                ))
                                            }

                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td className='text-end fw-bold' colSpan={3}>Subtotal</td>
                                                <td>${order.subtotal}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-end fw-bold' colSpan={3}>Shipping</td>
                                                <td>${order.shipping}</td>
                                            </tr>
                                            <tr>
                                                <td className='text-end fw-bold' colSpan={3}>Grand Total</td>
                                                <td>${order.grand_total}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div className='text-center'>
                                    <button className='btn btn-primary'>
                                        View Order Details
                                    </button>
                                    <Link className='btn btn-outline-secondary ms-2' to="/">
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    )
}

export default Confirmation
