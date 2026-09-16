import React from 'react'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'
import { assets } from '../assets/assets'
import { brand } from '../config/brand'

const About = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      {/* Header Section */}
      <div className='text-2xl text-center pt-10 border-t'>
        <Title text1={'ABOUT'} text2={brand.name} />
      </div>

      {/* Brand Story Section */}
      <div className='my-20 flex flex-col md:flex-row gap-12 lg:gap-24 items-center'>
        <img 
          className='w-full md:max-w-[480px] object-cover rounded-md shadow-sm' 
          src={assets.about_img} 
          alt={`${brand.name} brand philosophy`}
        />
        <div className='flex flex-col justify-center gap-8 md:w-1/2 text-gray-600 leading-relaxed'>
          <p>
            Born from a passion for refined aesthetics, <span className='text-gray-800 font-medium'>{brand.name}</span> is more than a clothing brand—it is a celebration of confident, considered style. We curate premium apparel that bridges timeless formal elegance and effortless everyday dressing.
          </p>
          <p>
            From structured formal silhouettes to relaxed contemporary essentials, every piece is selected with an uncompromising eye for detail. High-quality fabrics and thoughtful craftsmanship ensure that {brand.name} garments look refined and feel exceptional.
          </p>
          <div className='pt-4'>
            <b className='text-gray-800 text-xl font-serif'>Our Vision</b>
            <p className='mt-3'>
              To redefine the modern wardrobe with versatile fashion that helps our community move through life with confidence and grace. At {brand.name}, we favour lasting impressions over short-lived trends.
            </p>
          </div>
        </div>
      </div>

      {/* Features Header */}
      <div className='text-xl py-8'>
        <Title text1={'THE'} text2={`${brand.name} PROMISE`} />
      </div>

      {/* Features Grid */}
      <div className='flex flex-col md:flex-row text-sm mb-28'>
        <div className='border px-10 md:px-12 lg:px-16 py-12 md:py-20 flex flex-col gap-6 hover:bg-[#78350F] hover:text-white transition-all duration-300 group'>
          <b className='text-gray-800 group-hover:text-white text-base'>Premium Quality:</b>
          <p className='text-gray-600 group-hover:text-stone-200 leading-relaxed'>Quality is our cornerstone. Each garment undergoes a rigorous selection and inspection process to ensure durability, comfort, and a flawless finish.</p>
        </div>
        <div className='border px-10 md:px-12 lg:px-16 py-12 md:py-20 flex flex-col gap-6 hover:bg-[#78350F] hover:text-white transition-all duration-300 group'>
          <b className='text-gray-800 group-hover:text-white text-base'>Curated Style:</b>
          <p className='text-gray-600 group-hover:text-stone-200 leading-relaxed'>We save you time by meticulously hand-picking collections that balance contemporary fashion with classic appeal for any occasion.</p>
        </div>
        <div className='border px-10 md:px-12 lg:px-16 py-12 md:py-20 flex flex-col gap-6 hover:bg-[#78350F] hover:text-white transition-all duration-300 group'>
          <b className='text-gray-800 group-hover:text-white text-base'>Personalized Concierge:</b>
          <p className='text-gray-600 group-hover:text-stone-200 leading-relaxed'>Our commitment goes beyond checkout. Our concierge team provides attentive support to ensure your journey is as seamless as our clothing.</p>
        </div>
      </div>

      <div className='pb-20'>
        <NewsletterBox />
      </div>
    </div>
  )
}

export default About
