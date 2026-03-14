import React from 'react'
import Layout from './common/Layout'
import ProductOneImage from '../assets/images/eight.jpg';
import ProductTwoImage from '../assets/images/two.jpg';
import ProductThreeImage from '../assets/images/three.jpg';
import ProductFourImage from '../assets/images/four.jpg';

const Shop = () => {
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
        <div className='row'>
          <div className='col-md-3'>
            <div className='card shadow border-0 mb-3'>
              <div className='card-body p-4'>
                <h3 className='mb-3'>Categories</h3>
                <ul>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>Chicken Rice</label>
                  </li>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>Kids</label>
                  </li>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>Mens</label>
                  </li>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>Mobiles</label>
                  </li>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>Women</label>
                  </li>
                </ul>
              </div>
            </div>

            <div className='card shadow border-0 mb-3'>
              <div className='card-body p-4'>
                <h3 className='mb-3'>Brands</h3>
                <ul>
                  <li className='mb-2'>
                    <input type="checkbox" />
                    <label className='ps-2'>Adidas</label>
                  </li>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>Allen Cooper</label>
                  </li>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>Allen Solly</label>
                  </li>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>Flying Machine</label>
                  </li>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>H&M</label>
                  </li>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>Levis</label>
                  </li>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>Nike</label>
                  </li>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>Levis</label>
                  </li>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>Levis</label>
                  </li>
                  <li className='mb-2'>
                    <input type="checkbox" value={17} />
                    <label className='ps-2'>Zara</label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='col-md-9'>
            <div className='row pb-5'>
              <div className='col-md-4 col-6'>
                <div className='product card border-0'>
                  <div className="card-img">
                    <a href="/product">
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
              <div className='col-md-4 col-6'>
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
              <div className='col-md-4 col-6'>
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
              <div className='col-md-4 col-6'>
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
        </div>
      </div>
      {/* shop page design ened */}
    </Layout>
  )
}

export default Shop
