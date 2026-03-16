import React, { useEffect, useState } from 'react'
import Layout from './common/Layout'
import { apiUrl } from './common/http';
import { Link, useSearchParams } from 'react-router-dom';

const Shop = () => {

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [catChecked, setCatChecked] = useState([]);
  const [brandChecked, setbrandChecked] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterLoaded, setIsFilterLoaded] = useState(false);

  // fetch the category api
  const fetchCategory = async () => {
    try {
      const res = await fetch(`${apiUrl}/shop-getCategories`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const result = await res.json();
      // console.log(result);
      if (result.status === 200) {
        setCategories(result.data || []);
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // fetch the brand api
  const fetchBrand = async () => {
    try {
      const res = await fetch(`${apiUrl}/shop-getBrands`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const result = await res.json();
      // console.log(result);
      if (result.status === 200) {
        setBrands(result.data || []);
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // fetch the product with filter by category and brand
  const fetchProduct = async () => {
    // first checked the category id
    // console.log(catChecked);
    // first checked the brand id
    // console.log(brandChecked);
    let search = [];
    let params = '';

    // for category filter
    if (catChecked.length > 0) {
      search.push(['category', catChecked]);
    }
    // for brand filter
    if (brandChecked.length > 0) {
      search.push(['brand', brandChecked]);
    }
    if (search.length > 0) {
      params = new URLSearchParams(search)
    }
    console.log(params.toString());
    try {
      const res = await fetch(`${apiUrl}/shop-getCatBrProduct?${params}`, {
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
    }
  }
  // make a filter method for category for checkbox checked or uncheck
  const handleCategoryFilter = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setCatChecked(prev => [...prev, value]);
    } else {
      setCatChecked(catChecked.filter(id => id !== value));
      // for better for function update
      // setCatChecked(pre => pre.filter(id => id !== value));
    }
  }

  // make a filter method for brand for checkbox checked or uncheck
  const handleBrandFilter = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setbrandChecked(pre => [...pre, value]);
    } else {
      setbrandChecked(brandChecked.filter(id => id !== value));
    }
  }

  // first load filters from URL for selected category and brand checked after page loaded
  useEffect(() => {
    // to read category id from url
    const categoryParam = searchParams.get('category');
    // to read brand id from url
    const brandParam = searchParams.get('brand');

    const selectedCategory = categoryParam ? categoryParam.split(',') : [];
    const selectedBrand = brandParam ? brandParam.split(',') : [];

    setCatChecked(selectedCategory);
    setbrandChecked(selectedBrand);

    setIsFilterLoaded(true);
  }, [searchParams]);

  // fetch products only after URL filters loaded means selected cat. and brand data after page loaded
  useEffect(() => {
    if (!isFilterLoaded) return;
    fetchProduct(catChecked, brandChecked);
  }, [catChecked, brandChecked, setIsFilterLoaded]);

  // use effect for filter with route parameter into url like shop?category=1&brand=3
  useEffect(() => {
    if (!isFilterLoaded) return;
    const params = {};

    if (catChecked.length > 0) {
      params.category = catChecked.join(',');
    }

    if (brandChecked.length > 0) {
      params.brand = brandChecked.join(',');
    }

    setSearchParams(params);
  }, [catChecked, brandChecked, setSearchParams, isFilterLoaded]);

  // use effect for fetch all api sideeffect
  useEffect(() => {
    fetchCategory();
    fetchBrand();
  }, []);

  return (
    <Layout>
      {/* shop page design start */}
      <div className='container'>
        <nav aria-label="breadcrumb" className='py-4'>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">Shop</li>
          </ol>
        </nav>
        <div className='row mb-5'>
          <div className='col-md-3'>
            <div className='card shadow border-0 mb-3'>
              <div className='card-body p-4'>
                <h3 className='mb-3'>Categories</h3>
                <ul>
                  {
                    categories && categories.map((category) => {
                      return (
                        <li className='mb-2' key={category.id}>
                          <input type="checkbox" value={category.id}
                            checked={catChecked.includes(String(category.id))}
                            onChange={handleCategoryFilter} />
                          <label className='ps-2'>{category.name}</label>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </div>

            <div className='card shadow border-0 mb-3'>
              <div className='card-body p-4'>
                <h3 className='mb-3'>Brands</h3>
                <ul>
                  {
                    brands && brands.map((brand) => {
                      return (
                        <li className='mb-2' key={brand.id}>
                          <input type="checkbox" value={brand.id}
                            checked={brandChecked.includes(String(brand.id))}
                            onChange={handleBrandFilter} />
                          <label className='ps-2'>{brand.name}</label>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </div>
          </div>
          <div className='col-md-9'>
            <div className='row pb-5'>
              {
                products && products.map((product) => {
                  return (
                    <div className='col-md-4 col-6' key={product.id}>
                      <div className='product card border-0'>
                        <div className="card-img">
                          <Link to={`/product/${product.id}`}>
                            <img src={product.image_url} alt="" className="w-100" srcSet="" />
                          </Link>
                        </div>

                        <div className='card-body pt-3'>
                          <Link to={`/product/${product.id}`}>
                            {product.title}
                          </Link>
                          <div className='price'>
                            ${product.price} <span className="text-decoration-line-through"> ${product.compare_price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }

            </div>
          </div>
        </div>
      </div>
      {/* shop page design ened */}
    </Layout>
  )
}

export default Shop
