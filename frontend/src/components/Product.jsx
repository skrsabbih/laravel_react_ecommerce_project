import React, { useEffect, useState } from 'react'
import Layout from './common/Layout'
import { Link, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Rating } from 'react-simple-star-rating'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { apiUrl } from './common/http';

const Product = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [rating, setRating] = useState(4)

    // state for single product
    const [product, setProduct] = useState([]);
    const [productImages, setProductImages] = useState([]);

    // use a id params
    const { id } = useParams();

    // single product api fetch
    const singleProduct = async () => {
        try {
            const res = await fetch(`${apiUrl}/product/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            console.log(result);
            if (result.status === 200) {
                setProduct(result.data || []);
                setProductImages(result.data.product_images || []);
            } else {
                console.log("Something went wrong");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // fetch for sideeffect in useEffect with dependency
    useEffect(() => {
        singleProduct();
    }, [id])

    // check the product images is more then one or not for swiper
    const canLoopMain = productImages.length > 1

    return (
        <Layout>
            <div className="container product-detail">
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className='py-4'>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item" aria-current="page"><Link to="/shop">Shop</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Dummy Product Title</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-2">
                                <Swiper
                                    style={{
                                        '--swiper-navigation-color': '#000',
                                        '--swiper-pagination-color': '#000',
                                    }}
                                    onSwiper={setThumbsSwiper}
                                    // loop={true}
                                    loop={false}
                                    direction={`vertical`}
                                    spaceBetween={10}
                                    slidesPerView={Math.min(productImages.length || 1, 6)}
                                    sliderToClickedSlide={true}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="mySwiper mt-2"
                                >

                                    {
                                        productImages && productImages.map((image) => {
                                            return (
                                                <SwiperSlide key={image.id}>
                                                    <div className='content'>
                                                        <img
                                                            src={image.image_url}
                                                            alt=""
                                                            height={100}
                                                            className='w-100' />
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        })
                                    }

                                </Swiper>
                            </div>
                            <div className="col-10">
                                <Swiper
                                    style={{
                                        '--swiper-navigation-color': '#000',
                                        '--swiper-pagination-color': '#000',
                                    }}
                                    // loop={true}
                                    loop={canLoopMain}
                                    spaceBetween={0}
                                    navigation={true}
                                    thumbs={
                                        {
                                            swiper:
                                                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
                                        }
                                    }
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="mySwiper2"
                                >
                                    {
                                        productImages && productImages.map((image) => {
                                            return (
                                                <SwiperSlide key={image.id}>
                                                    <div className='content'>
                                                        <img
                                                            src={image.image_url}
                                                            alt=""
                                                            className='w-100' />
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        })
                                    }

                                </Swiper>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <h2>{product.title}</h2>
                        <div className="d-flex">
                            <Rating
                                size={20}
                                readonly
                                initialValue={rating}
                            />
                            <span className='pt-1 ps-2'>10 Reviews</span>
                        </div>
                        <div className="price h3 py-3">
                            ${product.price}&nbsp; <span className='text-decoration-line-through'>${product.compare_price}</span>
                        </div>
                        <div>{product.short_description}</div>
                        <div className='pt-3'>
                            <strong>Select Size</strong>
                            <div className='size pt-2'>
                                {
                                    product.sizes && product.sizes.map((size) => {
                                        return (
                                            <button className='btn btn-size me-2' key={size.id}>{size.name}</button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="add-to-cart my-4">
                            <button className='btn btn-primary text-uppercase'>Add To Cart</button>
                        </div>
                        <hr />
                        <div>
                            <strong>SKU: </strong>
                            {product.sku}
                        </div>
                    </div>
                </div>
                <div className="row pb-5">
                    <div className="col-md-12">
                        <Tabs
                            defaultActiveKey="description"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                        >
                            <Tab eventKey="description" title="Description">
                                <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
                            </Tab>
                            <Tab eventKey="reviews" title="Reviews (10)">
                                Tab content for Reviews
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Product
