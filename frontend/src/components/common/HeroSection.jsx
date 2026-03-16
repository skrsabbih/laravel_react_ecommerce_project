import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import SliderOneImage from '../../assets/images/banner-1.jpg';
import SliderTwoImage from '../../assets/images/banner-2.jpg';
const HeroSection = () => {
    return (
        <section className='section-1'>
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                breakpoints={{
                    1024: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    }
                }}
            >
                <SwiperSlide>
                    <div className="content" style={{ backgroundImage: `url(${SliderOneImage})` }}>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="content" style={{ backgroundImage: `url(${SliderTwoImage})` }}>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="content" style={{ backgroundImage: `url(${SliderOneImage})` }}>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="content" style={{ backgroundImage: `url(${SliderTwoImage})` }}>
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    )
}

export default HeroSection
