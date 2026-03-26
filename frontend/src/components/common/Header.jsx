import React, { useContext, useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import { apiUrl } from '../common/http';
import Loader from '../common/Loader';
import { CartContext } from '../context/CartContext';
import { CustomerAuthContext } from '../context/CustomerAuth';
const Header = () => {
    // user user context for login or not 
    const { user } = useContext(CustomerAuthContext);
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
            {/* <div className='bg-dark text-center py-2'>
                <span className='text-white'>Your fashion partner</span>
            </div> */}
            <div className="header-top-bar py-2">
                <div className="container">
                    <div className="header-top-content d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div className="top-left-text">
                            গ্রামবাংলার ঐতিহ্য (পরিচিত পণ্য)
                        </div>

                        <div className="top-center-text">
                            <span className="welcome-animated">স্বাগতম</span>
                        </div>

                        <div className="top-social-icons d-flex align-items-center gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-icon-link facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M16 8.049C16 3.604 12.418 0 8 0S0 3.604 0 8.049C0 12.07 2.926 15.393 6.75 16v-5.625H4.719V8.049H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.875 0 1.79.157 1.79.157v1.98h-1.008c-.994 0-1.304.621-1.304 1.258v1.51h2.219l-.354 2.326H9.25V16C13.074 15.393 16 12.07 16 8.049z" />
                                </svg>
                            </a>

                            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-icon-link instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.087 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.269.087 3.85.048 4.703.01 5.556 0 5.829 0 8c0 2.171.01 2.444.048 3.297.039.853.174 1.434.372 1.943.205.527.478.974.923 1.417.443.445.89.718 1.417.923.509.198 1.09.333 1.943.372C5.556 15.99 5.829 16 8 16c2.171 0 2.444-.01 3.297-.048.853-.039 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.417-.923 3.9 3.9 0 0 0 .923-1.417c.198-.509.333-1.09.372-1.943C15.99 10.444 16 10.171 16 8c0-2.171-.01-2.444-.048-3.297-.039-.853-.174-1.434-.372-1.943a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.509-.198-1.09-.333-1.943-.372C10.444.01 10.171 0 8 0m0 1.441c2.136 0 2.389.008 3.232.046.78.035 1.204.166 1.485.275.372.145.638.317.917.596.278.279.45.545.596.917.109.281.24.705.275 1.485.038.843.046 1.096.046 3.232s-.008 2.389-.046 3.232c-.035.78-.166 1.204-.275 1.485a2.46 2.46 0 0 1-.596.917 2.46 2.46 0 0 1-.917.596c-.281.109-.705.24-1.485.275-.843.038-1.096.046-3.232.046s-2.389-.008-3.232-.046c-.78-.035-1.204-.166-1.485-.275a2.46 2.46 0 0 1-.917-.596 2.46 2.46 0 0 1-.596-.917c-.109-.281-.24-.705-.275-1.485C1.449 10.389 1.441 10.136 1.441 8s.008-2.389.046-3.232c.035-.78.166-1.204.275-1.485.145-.372.317-.638.596-.917.279-.278.545-.45.917-.596.281-.109.705-.24 1.485-.275.843-.038 1.096-.046 3.232-.046" />
                                    <path d="M8 3.892A4.108 4.108 0 1 0 8 12.108 4.108 4.108 0 0 0 8 3.892m0 6.857A2.749 2.749 0 1 1 8 5.251a2.749 2.749 0 0 1 0 5.498m4.271-6.96a.96.96 0 1 1-1.92 0 .96.96 0 0 1 1.92 0" />
                                </svg>
                            </a>

                            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="social-icon-link youtube">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8.051 1.999h-.003C6.347 1.99 4.645 1.95 3.09 2.164 1.55 2.374.603 3.324.39 4.861.173 6.43.173 9.57.39 11.139c.213 1.537 1.16 2.487 2.7 2.697 1.555.214 3.256.174 4.958.165h.003c1.701.009 3.403.049 4.958-.165 1.54-.21 2.487-1.16 2.7-2.697.217-1.569.217-4.708 0-6.278-.213-1.537-1.16-2.487-2.7-2.697-1.555-.214-3.257-.174-4.958-.165M6.4 10.2V5.8l4.2 2.2z" />
                                </svg>
                            </a>

                            <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                                className="social-icon-link linkedin">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zM4.943 13.5V6H2.542v7.5h2.401zM3.743 5.002c.837 0 1.358-.554 1.358-1.248-.015-.709-.521-1.248-1.343-1.248-.822 0-1.358.54-1.358 1.248 0 .694.521 1.248 1.328 1.248h.015zM13.458 13.5v-4.188c0-2.24-1.195-3.282-2.788-3.282-1.285 0-1.86.707-2.182 1.203v-1.032H6.086c.03.684 0 7.299 0 7.299h2.401v-4.075c0-.218.016-.436.08-.593.174-.436.57-.887 1.235-.887.871 0 1.22.669 1.22 1.65V13.5h2.436z" />
                                </svg>
                            </a>

                            <a href="https://wa.me/your-number" target="_blank" rel="noreferrer"
                                className="social-icon-link whatsapp">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.01 0C5.39 0 .02 5.37.02 12c0 2.11.55 4.18 1.6 6.01L0 24l6.16-1.61A11.95 11.95 0 0 0 12.01 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.49-8.52zM12.01 21.8c-1.86 0-3.69-.5-5.3-1.44l-.38-.22-3.65.95.98-3.56-.25-.37A9.78 9.78 0 0 1 2.2 12c0-5.41 4.4-9.8 9.81-9.8 2.62 0 5.08 1.02 6.93 2.87A9.75 9.75 0 0 1 21.8 12c0 5.41-4.4 9.8-9.79 9.8zm5.39-7.34c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.22-.65.07-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.48.71.3 1.27.48 1.7.61.71.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.12-.27-.2-.57-.35z" />
                                </svg>
                            </a>
                            <a href="https://x.com" target="_blank" rel="noreferrer"
                                className="social-icon-link twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.53 2H21l-7.19 8.21L22 22h-6.9l-5.4-6.98L3.9 22H.43l7.7-8.8L2 2h7.05l4.9 6.36L17.53 2zm-1.21 18h1.91L7.05 3.92H5.01L16.32 20z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
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
                                            className="nav-link category-link"
                                            key={category.id}
                                        >
                                            <span>{category.name}</span>
                                        </Link>
                                    )
                                })
                            }

                        </Nav>
                        <div className='nav-right d-flex'>
                            <Link to={user ? '/account/dashboard' : '/account/login'} className='ms-3'>
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
