import React from 'react'
import Layout from '../common/Layout'
import CustomerSidebar from '../common/CustomerSidebar'

const Dashboard = () => {
    return (
        <Layout>
            <div className='container'>
                <div className="row">
                    <div className='d-flex justify-content-between mt-5 pb-3'>
                        <h4 className='h4 pb-0 mb-0'>My Account</h4>
                        {/* <a className='btn btn-primary' href="http://">Button</a> */}
                    </div>
                    <div className="col-md-3">
                        <CustomerSidebar />
                    </div>
                    <div className="col-md-9">
                        <div className="card shadow">
                            <div className="card-body p-4">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
