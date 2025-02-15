"use client"
import React, { useState } from 'react';
import DecryptedText from '../components/DecryptedText.js';
import Particles from '../components/Particles.js';
import FadeContent from '../components/FadeContend.js'
import ResponsiveImage from '../components/ResponsiveImage';
import SplashCursor from '../components/SplashCursor'
import RotatingText from '../components/RotatingText'



const Portfolio = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const projects = [
    {
      name: 'Musea',
      image: '/api/placeholder/400/300',
      description: 'Abstract architectural forms with clouds'
    },
    {
      name: 'Elara',
      image: '/api/placeholder/400/300'
    },
    {
      name: 'Verve',
      image: '/api/placeholder/400/300'
    },
    {
      name: 'Zephyr',
      image: '/api/placeholder/400/300'
    }
  ];


  return (

    <div className="relative min-h-screen bg-black text-gray-100 p-6">

      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          className={'absolute inset-0 w-full h-full'}
        />
      </div>

      {/* Main Content */}
      <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-light">
            <span className="font-normal">Bala</span>
          </h1>
          <div className="space-x-6">
            <a href="#projects" className="hover:text-gray-300">PROJECTS</a>
            <a href="#about" className="hover:text-gray-300">ABOUT</a>
            <a href="#contact" className="hover:text-gray-300">CONTACT</a>
          </div>
        </nav>
      </FadeContent>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Hero Section */}
        <FadeContent className="bg-zinc-900/70 rounded-lg p-8 flex flex-col justify-between relative lg:col-span-2" blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <h2 className="text-3xl font-bold mb-2">
            <DecryptedText text="Artist Redefining" />
          </h2>
          <h2 className="text-3xl font-bold italic mb-4">
            <DecryptedText text="Architecture with" />
          </h2>
          <h2 className="text-3xl font-bold">
            <DecryptedText text="AI-Driven Design" />
          </h2>
        </FadeContent>

        {/* Profile Image */}
        <FadeContent
          className="bg-zinc-900/70 rounded-lg overflow-hidden row-span-2 order-last lg:order-none"
          blur={true}
          duration={1000}
          easing="ease-out"
          initialOpacity={0}
        >
          <div className="relative h-full">
            <div className=" bg-zinc-900/0 w-full h-auto max-w-[404px] max-h-[400px]">
              <ResponsiveImage
                imageSrc="/download.jpeg"
                altText="Profile"
                captionText="Delorean go brrrr"
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/10 p-6">
              <div className="mb-4  ">
                <div className="flex flex-row justify-between w-full">
                  <h3 className="text-2xl font-bold mb-2">Contact me</h3>
                  <svg className="w-4 h-4 ml-auto mt-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z" />
                  </svg>
                </div>
                <p className="text-gray-400">Have some questions?</p>
              </div>
              <div className="flex justify-around items-center">
                <a href="#instagram" className="text-gray-300 hover:text-gray-100">INSTAGRAM</a>
                <a href="#twitter" className="text-gray-300 hover:text-gray-100">TWITTER</a>
                <a href="#linkedin" className="text-gray-300 hover:text-gray-100">LINKEDIN</a>
              </div>
            </div>
          </div>
        </FadeContent>


        {/* Projects Section */}
        <FadeContent className="bg-zinc-900/70 rounded-lg p-6 h-64" blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.name}
                className="relative"
                onMouseEnter={() => setHoveredProject(project.name)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="flex justify-between items-center cursor-pointer group">
                  <h3 className="text-xl group-hover:text-pink-400 transition-colors">
                    {project.name}
                  </h3>
                  <svg className="w-4 h-4 group-hover:text-pink-400 transition-colors" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z" />
                  </svg>
                </div>
                {hoveredProject === project.name && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-10">
                    <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-xl">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeContent>

        {/* Bio Section */}
        <FadeContent className="bg-zinc-900/70 rounded-lg p-6 h-64" blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <p className="text-gray-300 text-lg">
            Bala is a skilled backend developer with a passion for creating efficient and scalable server-side applications.
          </p>
        </FadeContent>
      </div>
    </div>
  );
};

export default Portfolio;
