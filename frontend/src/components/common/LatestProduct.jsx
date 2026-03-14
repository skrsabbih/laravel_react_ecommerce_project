import React from 'react'
import ProductOneImage from '../../assets/images/eight.jpg';
import ProductTwoImage from '../../assets/images/two.jpg';
import ProductThreeImage from '../../assets/images/three.jpg';
import ProductFourImage from '../../assets/images/four.jpg';
const LatestProduct = () => {
    return (
        <section className='section-2 pt-5'>
            <div className='container'>
                <h2>New Arrivals</h2>
                <div className='row mt-4'>
                    <div className='col-md-3 col-6'>
                        <div className='product card border-0'>
                            <div className="card-img">
                                <a href="#fuck">
                                    <img src={ProductOneImage} alt="" className="w-100" srcSet="" />
                                </a>
                            </div>

                            <div className='card-body pt-3'>
                                <a href="#fuck">
                                    New Check Shirt
                                </a>
                                <div className='price'>
                                    $10 <span className="text-decoration-line-through"> $12
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 col-6'>
                        <div className='product card border-0'>
                            <div className="card-img">
                                <a href="#fuck">
                                    <img src={ProductTwoImage} alt="" className="w-100" srcSet="" />
                                </a>
                            </div>

                            <div className='card-body pt-3'>
                                <a href="#fuck">
                                    New Check Shirt
                                </a>
                                <div className='price'>
                                    $10 <span className="text-decoration-line-through"> $12
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 col-6'>
                        <div className='product card border-0'>
                            <div className="card-img">
                                <a href="#fuck">
                                    <img src={ProductThreeImage} alt="" className="w-100" srcSet="" />
                                </a>
                            </div>

                            <div className='card-body pt-3'>
                                <a href="#fuck">
                                    New Check Shirt
                                </a>
                                <div className='price'>
                                    $10 <span className="text-decoration-line-through"> $12
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 col-6'>
                        <div className='product card border-0'>
                            <div className="card-img">
                                <a href="#fuck">
                                    <img src={ProductFourImage} alt="" className="w-100" srcSet="" />
                                </a>
                            </div>

                            <div className='card-body pt-3'>
                                <a href="#fuck">
                                    New Check Shirt
                                </a>
                                <div className='price'>
                                    $10 <span className="text-decoration-line-through"> $12
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LatestProduct
