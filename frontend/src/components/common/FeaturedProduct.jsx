import React from 'react'
import FeaturedImage from '../../assets/images/ten.jpg';
import FeaturedImageTwo from '../../assets/images/nine.jpg';
import FeaturedImageThree from '../../assets/images/fivee.jpg';
import FeaturedImageFour from '../../assets/images/twelve.jpg';
const FeaturedProduct = () => {
    return (
        <section className='section-2 py-5'>
            <div className='container'>
                <h2>Featured Products</h2>
                <div className='row mt-4'>
                    <div className='col-md-3 col-6'>
                        <div className='product card border-0'>
                            <div className="card-img">
                                <a href="#fuck">
                                    <img src={FeaturedImage} alt="" className="w-100" srcSet="" />
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
                                    <img src={FeaturedImageTwo} alt="" className="w-100" srcSet="" />
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
                                    <img src={FeaturedImageThree} alt="" className="w-100" srcSet="" />
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
                                    <img src={FeaturedImageFour} alt="" className="w-100" srcSet="" />
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

export default FeaturedProduct
