import { Copyright, Facebook, Github, Instagram, Linkedin, Mailbox } from 'lucide-react';
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#1e1e1e] overflow-hidden relative min-h-fit pb-10" id='footer'>
      
      {/* Top Graphic Section - Adjusted margins for mobile */}
      <div className="relative -mt-10 md:-mt-30 w-full h-[200px] md:h-[420px]">
        <img
          src="/GreenBlobShades.png"
          alt="layer 1"
          className="absolute top-0 left-0 w-full h-full object-cover z-40"
        />

        <img
          src="/BlueBlobShades.png"
          alt="layer 4"
          className="absolute top-5 md:top-20 left-0 -mt-6 md:-mt-12 w-full h-full object-cover z-10 opacity-70 md:opacity-100"
        />
      </div>

      {/* Navigation Links - Stacked on Mobile, Row on Desktop */}
      <div className='flex mt-10 md:mt-20 justify-center px-6'>
        <div className='text-center underline text-white flex flex-wrap justify-center gap-6 md:gap-20 text-sm md:text-base'>
          <a className='hover:text-green-400 transition-colors' href="#heropg">home</a>
          <a className='hover:text-green-400 transition-colors' href="#workflow">how its works</a>
          <a className='hover:text-green-400 transition-colors' href="#peers">find peer</a>
          <a className='hover:text-green-400 transition-colors' href="#FAQ">FAQ</a>
        </div>
      </div>

      {/* Main Footer Info - Reorganized for Mobile */}
      <div className='flex flex-col md:flex-row items-center justify-around mt-10 md:mt-15 w-full h-auto px-6 gap-10 md:gap-0'>
        
        {/* Brand Name */}
        <h1 className='text-4xl md:text-5xl text-white font-bold'>SkillSly</h1>

        {/* Social Icons - Wrapped for smaller screens */}
        <div className='flex flex-wrap justify-center gap-4 md:gap-8 text-white'>
          <button className='p-3 md:p-4 rounded-full hover:text-green-400 hover:border-green-400 border border-white transition-all'><Facebook size={20} /></button>
          <button className='p-3 md:p-4 rounded-full hover:text-green-400 hover:border-green-400 border border-white transition-all'><Github size={20} /></button>
          <button className='p-3 md:p-4 rounded-full hover:text-green-400 hover:border-green-400 border border-white transition-all'><Linkedin size={20} /></button>
          <button className='p-3 md:p-4 rounded-full hover:text-green-400 hover:border-green-400 border border-white transition-all'><Instagram size={20} /></button>
          <button className='p-3 md:p-4 rounded-full hover:text-green-400 hover:border-green-400 border border-white transition-all'><Mailbox size={20} /></button>
        </div>

        {/* Copyright Text */}
        <div className='text-white text-xs md:text-sm text-center md:text-right flex flex-col items-center md:items-end gap-2'>
          <div className='flex items-center gap-1'>
            <Copyright size={14} /> <span>2026 Skillsly All rights reserved.</span>
          </div>
          <p className='opacity-60'>Original design by RRK</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;