import React, { useEffect, useState, useRef, useMemo } from 'react'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { adminToken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'
import JoditEditor from 'jodit-react';

const Create = ({ placeholder }) => {

  const editor = useRef(null);
  const [content, setContent] = useState('');

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || ''
    }),
    [placeholder]
  );

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm()

  // const selectSize = watch("sizes");
  // console.log("selected Sizes", selectSize);

  const navigate = useNavigate();

  const saveProduct = async (data) => {
    const formData = { ...data, "description": content, "gallery": gallery };
    console.log(formData);
    // return
    // disabled just loading name likhe rekhechi
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/products`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken()}`
        },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      // console.log(result);
      if (result.status == 201) {
        toast.success(result.message);
        navigate('/admin/products');
      } else {
        const formErrors = result.errors;
        Object.keys(formErrors).forEach((field) => {
          setError(field, { message: formErrors[field][0] });
        })
        // toast.error(result.message || "Something went wrong");
      }

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  // fetch the category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${apiUrl}/categories`, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${adminToken()}`
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
    fetchCategory();
  }, []);

  // fetch the brand data
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await fetch(`${apiUrl}/brands`, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${adminToken()}`
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
    fetchBrand();
  }, []);

  // fetch the product size data
  useEffect(() => {
    const fetchSize = async () => {
      try {
        const res = await fetch(`${apiUrl}/sizes`, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${adminToken()}`
          }
        });

        const result = await res.json();
        console.log(result);

        if (result.status === 200) {
          setSizes(result.data || []);
        } else {
          console.log("Something went wrong");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchSize();
  }, []);


  // save image with temporary file and then attached in original product file
  const handleFile = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("image", file);
    setLoading(true);

    // create first temp image in backend temp_images table
    const res = await fetch(`${apiUrl}/temp-images`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${adminToken()}`
      },
      body: formData
    });

    const result = await res.json();
    gallery.push(result.data.id);
    setGallery(gallery);
    galleryImages.push(result.data.image_url);
    setGalleryImages(galleryImages);
    console.log(result);

    setLoading(false);

    e.target.value = ""

  }

  // delete the selected method
  const deleteImage = (image) => {
    const newGallery = galleryImages.filter(gallery => gallery != image);
    setGalleryImages(newGallery);
  }


  return (
    <Layout>
      <div className='container'>
        <div className="row">
          <div className='d-flex justify-content-between mt-5 pb-3'>
            <h4 className='h4 pb-0 mb-0'>Products / Create</h4>
            <Link className='btn btn-primary' to="/admin/products">Back</Link>
          </div>
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <form onSubmit={handleSubmit(saveProduct)}>
              <div className="card shadow">
                <div className="card-body p-4">
                  <div className='mb-3'>
                    <label htmlFor="" className="form-label">Title</label>
                    <input name="title"
                      type="text"
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      placeholder="Title"
                      {...register("title", {
                        required: "The title field is required."
                      })
                      }
                    />
                    {errors.title && (<p className='invalid-feedback'>{errors.title.message}</p>)}
                  </div>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='mb-3'>
                        <label htmlFor="" className='form-label'>Category</label>
                        <select name="" id="" className={`form-control ${errors.category_id ? 'is-invalid' : ''}`}
                          {...register('category_id', {
                            required: "Please select a category."
                          })
                          }
                        >
                          <option value="">Select a Category</option>
                          {/* <option value="">Mobiles</option> */}
                          {
                            categories && categories.map((category) => {
                              return (
                                <option key={category.id} value={category.id}>{category.name}</option>
                              )
                            })
                          }
                        </select>
                        {errors.category_id && (<p className='invalid-feedback'>{errors.category_id.message}</p>)}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='mb-3'>
                        <label htmlFor="" className='form-label'>Brand</label>
                        <select name="" id="" className='form-control'
                          {...register('brand_id')}
                        >
                          <option value="">Select a Brand</option>
                          {/* <option value="">Oppo</option> */}
                          {
                            brands && brands.map((brand) => {
                              return (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                              )
                            })
                          }
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className='mb-3'>
                    <label htmlFor="" className="form-label">Short Description</label>
                    <textarea name="short_description" type="text" className="form-control" placeholder="Short Description" rows={3}
                      {...register('short_description')}
                    ></textarea>
                  </div>
                  <div className='mb-3'>
                    <label htmlFor="" className="form-label">Description</label>
                    <JoditEditor
                      ref={editor}
                      value={content}
                      config={config}
                      tabIndex={1} // tabIndex of textarea
                      onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    />
                  </div>
                  <h3 className='py-3 border-bottom mb-3'>Pricing</h3>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='mb-3'>
                        <label htmlFor="" className='form-label'>Price</label>
                        <input name="price" className={`form-control ${errors.price ? 'is-invalid' : ''}`} type="text" placeholder="Price"
                          {...register('price', {
                            required: "The price field is required."
                          })
                          }
                        />
                        {errors.price && (<p className='invalid-feedback'>{errors.price.message}</p>)}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='mb-3'>
                        <label htmlFor="" className='form-label'>Compare Price</label>
                        <input name="compare_price" type="text" placeholder="Compare Price" className="form-control"
                          {...register('compare_price')}
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="py-3 border-bottom mb-3">Inventory</h3>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='mb-3'>
                        <label htmlFor="" className='form-label'>SKU</label>
                        <input name="sku" className={`form-control ${errors.sku ? 'is-invalid' : ''}`} type="text" placeholder="Sku"
                          {...register('sku', {
                            required: "The sku field is required."
                          })
                          }
                        />
                        {errors.sku && (<p className='invalid-feedback'>{errors.sku.message}</p>)}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='mb-3'>
                        <label htmlFor="" className='form-label'>Barcode</label>
                        <input name="barcode" type="text" placeholder="Barcode" className={`form-control ${errors.barcode ? 'is-invalid' : ''}`}
                          {...register('barcode', {
                            required: "The barcode field is required."
                          })
                          }
                        />
                        {errors.barcode && (<p className='invalid-feedback'>{errors.barcode.message}</p>)}
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-md-6'>
                      <div className='mb-3'>
                        <label htmlFor="" className='form-label'>Qty</label>
                        <input name="qty" className="form-control undefined" type="text" placeholder="Qty"
                          {...register('qty')}
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='mb-3'>
                        <label htmlFor="" className='form-label'>Status</label>
                        <select name="" id="" className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                          {...register('status', {
                            required: "The status field is required."
                          })
                          }
                        >
                          <option value="">Select a Status</option>
                          <option value="1">Active</option>
                          <option value="0">Block</option>
                        </select>
                        {errors.status && (<p className='invalid-feedback'>{errors.status.message}</p>)}
                      </div>
                    </div>
                  </div>
                  <div className='mb-3'>
                    <label htmlFor="" className='form-label'>Featured</label>
                    <select name="" id="" className={`form-control ${errors.is_featured ? 'is-invalid' : ''}`}
                      {...register('is_featured', {
                        required: "The featured field is required."
                      })
                      }
                    >
                      <option value="">Select Featured</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {errors.is_featured && (<p className='invalid-feedback'>{errors.is_featured.message}</p>)}
                  </div>
                  <h3 className="py-3 border-bottom mb-3">Sizes</h3>
                  <div className='mb-3'>
                    {
                      sizes && sizes.map((size) => {
                        return (
                          <div className='form-check-inline ps-2' key={size.id}>
                            <input
                              name="sizes"
                              className="form-check-input"
                              type="checkbox"
                              id={`size-${size.id}`}
                              value={size.id}
                              {...register('sizes')}
                            />
                            <label htmlFor={`size-${size.id}`} className='form-check-label ps-2'>{size.name}</label>
                          </div>
                        )
                      })
                    }
                  </div>
                  <h3 className="py-3 border-bottom mb-3">Gallery</h3>
                  <div className='mb-3'>
                    <label htmlFor="" className="form-label">Image</label>
                    <input onChange={handleFile}
                      type="file" className="form-control" />
                  </div>
                  <div className='mb-3'>
                    <div className='row'>
                      {
                        galleryImages && galleryImages.map((image, index) => {
                          return (
                            <div className='col-md-3' key={`image-${index}`}>
                              <div className='card shadow'>
                                <img src={image} alt="" className='w-100' />
                              </div>
                              <button type='button' className='btn btn-danger mt-3 w-100'
                                onClick={() => { deleteImage(image) }}
                              >Delete</button>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3  mb-5" disabled={loading}>
                {loading ? "Creating..." : 'Create'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Create
