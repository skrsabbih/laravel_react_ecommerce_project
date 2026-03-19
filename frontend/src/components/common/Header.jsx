import React, { useContext, useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import { apiUrl } from '../common/http';
import Loader from '../common/Loader';
import { CartContext } from '../context/CartContext';
const Header = () => {
    //state management
    const [productCategory, setProductCategory] = useState([]);
    const [loading, setLoading] = useState(false);

    // use the cartqunatity context data for cart icon count
    const { getQty } = useContext(CartContext);

    // fetch the category for header section dynamic by api
    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${apiUrl}/header-categories`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });

                const result = await res.json();
                // console.log(result);
                if (result.status === 200) {
                    setProductCategory(result.data || []);
                } else {
                    console.log("Something went wrong");
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategory();
    }, []);
    return (
        <header className='shadow'>
            {/* header upper part start */}
            <div className='bg-dark text-center py-3'>
                <span className='text-white'>Your fashion partner</span>
            </div>
            {/* header upper part end */}

            {/* navbar start */}
            <div className='container'>
                <Navbar expand="lg" className="">
                    <Navbar.Brand href="/">
                        <img src={Logo} alt="Logo" srcSet="" width={170} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">

                        <Nav
                            className="ms-auto my-2 my-lg-0"
                            navbarScroll
                        >
                            {
                                loading == true && <Loader />
                            }
                            {
                                loading == false && productCategory.length == 0 && <p className='ms-auto my-2 my-lg-0'>No Category</p>
                            }
                            {
                                loading == false && productCategory.length > 0
                            }
                            {
                                productCategory && productCategory.map((category) => {
                                    return (
                                        <Link
                                            to={`/shop?category=${category.id}`}
                                            className="nav-link"
                                            key={category.id}
                                        >
                                            {category.name}
                                        </Link>
                                    )
                                })
                            }

                        </Nav>
                        <div className='nav-right d-flex'>
                            <Link to="/account/login" className='ms-3'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"></path></svg>
                            </Link>

                            <Link to="/cart" className='ms-3 cart-bucket'>
                                {/* cart icon svg */}
                                <span>{getQty()}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="28" fill="currentColor" className="bi bi-bag" viewBox="0 0 16 16"><path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"></path></svg>
                            </Link>
                        </div>
                        {/* accout icon svg */}

                    </Navbar.Collapse>
                </Navbar>
            </div>
            {/* navbar end */}
        </header>
    )
}

export default Header
