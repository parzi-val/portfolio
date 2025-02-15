"use client"

import React, { useState } from 'react';
import DecryptedText from '../components/DecryptedText.js';
import Particles from '../components/Particles.js';
import FadeContent from '../components/FadeContend.js'
import ResponsiveImage from '../components/ResponsiveImage';
import TextPressure from '../components/TextPressure'
import ShinyText from '../components/ShinyText'
import RotatingText from '../components/RotatingText'
import MagnetLines from '../components/MagneticLines'
import { Github } from "lucide-react";


const Portfolio = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const projects = [
    {
      name: 'DeMESP',
      image: '/demesp.png',
      url: 'https://github.com/coderman400/de-mesp'
    },
    {
      name: 'FFCS',
      image: '/ffcs.png',
      url: 'https://github.com/coderman400/ffcs'
    },
    {
      name: 'Fuzzy Querying',
      image: '/fuzzy.png',
      url: 'https://github.com/parzi-val/fuzzy-querying'
    },

  ];


  return (

    <div className="relative min-h-screen bg-black text-gray-100 p-6">
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <Particles
          particleColors={["#ffffff", "#99eaff"]}
          particleCount={500}
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
            <span className="font-normal">
              <ShinyText text="kr balasubramanian" disabled={false} speed={3} className='custom-class' />
            </span>
          </h1>
          <div className="space-x-6">
            <a href="https://github.com/parzi-val" className="hover:text-gray-300"><Github className="w-7 h-7 text-white" /></a>
          </div>
        </nav>
      </FadeContent>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Hero Section */}
        <FadeContent className="bg-zinc-900/70 rounded-lg p-8 flex flex-col justify-between relative lg:col-span-2" blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <div className='flex items-center gap-6 flex-wrap lg:flex-nowrap'>

            <div>
              <h2 className="text-3xl font-bold mb-2">
                <DecryptedText text="let’s build something groundbreaking."
                  animateOn='view'
                  revealDirection='center'
                  speed={150} />
              </h2>
              <h2 className="text-xl sm:text-xl md:text-2xl italic mb-4 text-white/60">
                <DecryptedText text="or at least something that doesn’t crash immediately."
                  animateOn='view'
                  revealDirection='center'
                  speed={150} />
              </h2>
            </div>
            <MagnetLines
              rows={5}
              columns={5}
              containerSize="20vmin"
              lineColor="cyan"
              lineWidth="0.3vmin"
              lineHeight="3.5vmin"
              baseAngle={0}
              style={{ margin: "2rem auto" }}
            />
          </div>
        </FadeContent>

        {/* Profile Image */}
        <FadeContent
          className="bg-zinc-900/70 rounded-lg overflow-hidden row-span-2 order-last lg:order-none flex flex-col items-center p-6"
          blur={true}
          duration={1000}
          easing="ease-out"
          initialOpacity={0}
        >
          <div className="w-full flex justify-center">
            <div className=" bg-zinc-900/0 w-full h-auto max-w-[504px] max-h-[500px]">
              <ResponsiveImage
                imageSrc="/download.jpeg"
                altText="Profile"
                captionText="Delorean go brrrr"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/70 p-6">
              <div className="mb-8">
                <a href="mailto:krbala1511@gmail.com" className="group">
                  <div className="flex flex-row justify-between w-full">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400">
                      Contact me
                    </h3>
                    <svg className="w-4 h-4 ml-auto mt-2 group-hover:text-cyan-400 transition-colors" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400">Have some questions?</p>
                </a>

              </div>
              <div className="flex justify-around items-center">
                <a href="https://github.com/parzi-val" className="text-gray-300 hover:text-gray-100">
                  <TextPressure
                    text="GITHUB"
                    flex={true}
                    alpha={false}
                    stroke={false}
                    width={true}
                    weight={true}
                    italic={true}
                    textColor="#ffffff"
                    strokeColor="#ff0000"
                    minFontSize={36}
                  /></a>
                <a href="https://x.com/_balalalala_" className="text-gray-300 hover:text-gray-100">
                  <TextPressure
                    text="TWITTER"
                    flex={true}
                    alpha={false}
                    stroke={false}
                    width={true}
                    weight={true}
                    italic={true}
                    textColor="#ffffff"
                    strokeColor="#ff0000"
                    minFontSize={36}
                  /></a>
                <a href="https://www.linkedin.com/in/balasubramanian-kr-7424a5222/" className="text-gray-300 hover:text-gray-100">
                  <TextPressure
                    text="LINKEDIN"
                    flex={true}
                    alpha={false}
                    stroke={false}
                    width={true}
                    weight={true}
                    italic={true}
                    textColor="#ffffff"
                    strokeColor="#ff0000"
                    minFontSize={36}
                  /></a>
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
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="flex justify-between items-center cursor-pointer group">
                    <h3 className="text-xl group-hover:text-cyan-400 transition-colors">
                      {project.name}
                    </h3>
                    <svg className="w-4 h-4 group-hover:text-cyan-400 transition-colors" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z" />
                    </svg>
                  </div>
                </a>
                {hoveredProject === project.name && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-10">
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-xl">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeContent>

        <FadeContent className="bg-zinc-900/70 rounded-lg p-6 min-h-64"
          blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
          <p className="text-gray-300 text-lg mb-6 text-justify">
            I'm Bala, a computer science student in VIT. I love building things that make life easier. I'm a backend developer skilled at building scalable and efficient web applications.
          </p>
          <RotatingText
            texts={['Python', 'Django', 'Flask', 'FastAPI', 'Node.js', 'Express.js', 'MongoDB', 'Docker', 'AWS', 'GCP', 'Gemini']}
            mainClassName="w-40 sm:w-40 md:w-48 px-4 sm:px-5 md:px-6 text-white/90 text-lg sm:text-xl md:text-2xl font-bold overflow-hidden py-2 sm:py-3 md:py-4 justify-center rounded-lg mx-auto flex items-center justify-center mt-4
 whitespace-nowrap border border-white/20 shadow-lg shadow-white/10"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-1 sm:pb-1.5 md:pb-2"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </FadeContent>
      </div>
    </div>
  );
};

export default Portfolio;
