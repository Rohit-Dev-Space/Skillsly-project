import { Copyright, Facebook, Github, Instagram, Linkedin, Mailbox } from 'lucide-react';
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#1e1e1e] overflow-hidden relative min-h-screen" id='footer'>
      <div className="relative -mt-30 w-full h-[420px]">
        <img
          src="/GreenBlobShades.png"
          alt="layer 1"
          className="absolute top-0 left-0 w-full object-cover z-40"
        />

        <img
          src="/BlueBlobShades.png"
          alt="layer 4"
          className="absolute top-20 left-0 -mt-12 w-full object-cover z-10"
        />
      </div>
      <div className='flex mt-30 ml-10 justify-center'>
        <div className='text-center mt-10 underline  text-white flex gap-20' >
          <a className='hover:text-green-400' href="#heropg">home</a>
          <a className='hover:text-green-400' href="">how its works</a>
          <a className='hover:text-green-400' href="">find peer</a>
          <a className='hover:text-green-400' href="#FAQ">FAQ</a>
        </div>

      </div>
      <div className='flex justify-around mt-15 w-full h-auto'>
        <div className='flex gap-4'>
          <img src="/skillsly.png" alt="" className='h-13 w-10' />
          <h1 className='text-5xl text-white'>SkillSly</h1>
        </div>
        <div className='flex ml-20 gap-15 text-white'>
          <button className='p-4 rounded-full hover:text-green-400 hover:border-green-400 border border-white'><Facebook /></button>
          <button className='p-4 rounded-full hover:text-green-400 hover:border-green-400 border border-white'><Github /></button>
          <button className='p-4 rounded-full hover:text-green-400 hover:border-green-400 border border-white'><Linkedin /></button>
          <button className='p-4 rounded-full hover:text-green-400 hover:border-green-400 border border-white'><Instagram /></button>
          <button className='p-4 rounded-full hover:text-green-400 hover:border-green-400 border border-white'><Mailbox /></button>
        </div>
        <p className='text-white text-sm flex justify-center text-end'><Copyright /> 2025 Skillsly All rights reserverd. <br /> Original design by RRK</p>
      </div>
    </footer>
  );
};

export default Footer;
