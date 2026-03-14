import React from 'react'

import HeroSection from './common/HeroSection';
import LatestProduct from './common/LatestProduct';
import FeaturedProduct from './common/FeaturedProduct';
import Layout from './common/Layout';


const home = () => {
    return (
        <>
            <Layout >
                <HeroSection />
                <LatestProduct />
                <FeaturedProduct />
            </Layout>
        </>
    )
}

export default home
