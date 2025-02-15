"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import TiltedCard from "./TiltedCard";

interface ResponsiveImageProps {
  imageSrc: string;
  altText: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  imageSrc,
  altText,
  captionText,
  containerHeight = "300px",
  containerWidth = "400px",
  imageHeight = "250px",
  imageWidth = "300px",
}) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // Tailwind `lg:` breakpoint
    };

    checkScreenSize(); // Run initially
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="bg-zinc-900/00 relative h-full">
      <div className="w-full h-auto max-w-[404px] max-h-[400px]">
        {isDesktop ? (
          <TiltedCard
            imageSrc={imageSrc}
            altText={altText}
            captionText={captionText || ""}
            containerHeight={containerHeight}
            containerWidth={containerWidth}
            imageHeight={imageHeight}
            imageWidth={imageWidth}
            showTooltip={true}
          />
        ) : (
          <Image
            src={imageSrc}
            alt={altText}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default ResponsiveImage;
