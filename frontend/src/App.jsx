import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/home.jsx'
import Shop from './components/Shop.jsx'
import Product from './components/Product.jsx'
import Cart from './components/Cart.jsx'
import Checkout from './components/Checkout.jsx'
import Login from './components/admin/Login.jsx'
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './components/admin/Dashboard.jsx'
import { AdminRequireAuth } from './components/admin/AdminRequireAuth.jsx'
import { default as ShowCategories } from './components/admin/category/Show.jsx'
import { default as CreateCategory } from './components/admin/category/Create.jsx'
import { default as EditCategory } from './components/admin/category/Edit.jsx'
import { default as ShowBrands } from './components/admin/brand/Show.jsx'
import { default as CreateBrands } from './components/admin/brand/Create.jsx'
import { default as EditBrands } from './components/admin/brand/Edit.jsx'
import { default as ShowProducts } from './components/admin/product/Show.jsx'
import { default as CreateProducts } from './components/admin/product/Create.jsx'
import { default as EditProducts } from './components/admin/product/Edit.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/product/:id' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          {/* admin route section */}
          <Route path='/login/administration' element={<Login />} />
          <Route path='/admin/dashboard' element={
            <AdminRequireAuth>
              <Dashboard />
            </AdminRequireAuth>
          } />
          <Route path='/admin/categories' element={
            <AdminRequireAuth>
              <ShowCategories />
            </AdminRequireAuth>
          } />
          <Route path='/admin/categories/create' element={
            <AdminRequireAuth>
              <CreateCategory />
            </AdminRequireAuth>
          } />
          <Route path='/admin/categories/edit/:id' element={
            <AdminRequireAuth>
              <EditCategory />
            </AdminRequireAuth>
          } />
          <Route path='/admin/brands' element={
            <AdminRequireAuth>
              <ShowBrands />
            </AdminRequireAuth>
          } />
          <Route path='/admin/brands/create' element={
            <AdminRequireAuth>
              <CreateBrands />
            </AdminRequireAuth>
          } />
          <Route path='/admin/brands/edit/:id' element={
            <AdminRequireAuth>
              <EditBrands />
            </AdminRequireAuth>
          } />
          <Route path='/admin/products' element={
            <AdminRequireAuth>
              <ShowProducts />
            </AdminRequireAuth>
          } />
          <Route path='/admin/products/create' element={
            <AdminRequireAuth>
              <CreateProducts />
            </AdminRequireAuth>
          } />
          <Route path='/admin/products/edit/:id' element={
            <AdminRequireAuth>
              <EditProducts />
            </AdminRequireAuth>
          } />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
