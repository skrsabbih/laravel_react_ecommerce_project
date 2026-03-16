import React, { useEffect, useState } from 'react'
import { apiUrl } from '../common/http';
import Loader from '../common/Loader';
import NoState from '../common/Nostate';
const FeaturedProduct = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // api fetch for featured product
    useEffect(() => {
        const featuredProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${apiUrl}/featured-products`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });

                const result = await res.json();
                // console.log(result);
                if (result.status === 200) {
                    setProducts(result.data || []);
                } else {
                    console.log("Something went wrong");
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        featuredProduct();
    }, []);

    return (
        <section className='section-2 py-5'>
            <div className='container'>
                <h2>Featured Products</h2>
                {loading == true && <Loader />}
                {
                    loading == false && products.length == 0 && <NoState text="No Feaured Product Found" />
                }
                {
                    loading == false && products.length > 0 && (
                        <div className='row mt-4'>
                            {
                                products && products.map((product) => (
                                    <div className='col-md-3 col-6' key={product.id}>
                                        <div className='product card border-0'>
                                            <div className="card-img">
                                                <a href={`/product/${product.id}`}>
                                                    <img src={product.image_url} alt="" className="w-100" srcSet="" />
                                                </a>
                                            </div>

                                            <div className='card-body pt-3'>
                                                <a href={`/product/${product.id}`}>
                                                    {product.title}
                                                </a>
                                                <div className='price'>
                                                    ${product.price} <span className="text-decoration-line-through"> ${product.compare_price}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )
                }
            </div>
        </section>
    )
}

export default FeaturedProduct
