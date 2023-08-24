import React, { useEffect, useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const images = [
  {
    link: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    alt: "image from unsplash",
  },
  {
    link: "https://images.unsplash.com/photo-1626446636985-c583c1d5b237?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHBob25lJTIwYWR2ZXJ0aXNlbWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    alt: "image from unsplash",
  },
  {
    link: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    alt: "image from unsplash",
  },
  {
    link: "https://images.unsplash.com/photo-1573868388390-2739872961e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    alt: "image from unsplash",
  },
  {
    link: "https://images.unsplash.com/photo-1529336953128-a85760f58cb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    alt: "image from unsplash",
  },
  {
    link: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    alt: "image from unsplash",
  },
  {
    link: "https://images.unsplash.com/photo-1513595086754-ae9ec42d7e90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    alt: "image from unsplash",
  },
];

const Carousel = () => {
  const [currImg, setNextImg] = useState(0);

  const prevSlide = () => {
    setNextImg(currImg === 0 ? 6 : currImg - 1);
  };
  const nextSlide = () => {
    setNextImg(currImg === 6 ? 0 : currImg + 1);
  };
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setNextImg(currImg === 6 ? 0 : currImg + 1);
    }, 3000);
    return () => clearTimeout(timeOut);
  }, [currImg]);
  return (
    <div className="relative max-w-[1536px] mx-auto overflow-hidden">
      <div className={`w-[700%] flex relative`}>
        {images.map((image, i) => (
          <img
            key={i}
            src={image.link}
            alt={image.alt}
            className="transition-all w-full blur"
            style={{
              transform: `translateX(-${currImg * 100}%)`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-center gap-6 absolute right-12 top-2/4">
        <button className="btn-primary backdrop-blur" onClick={prevSlide}>
          <MdNavigateBefore className="text-xl" />
        </button>
        <button className="btn-primary backdrop-blur" onClick={nextSlide}>
          <MdNavigateNext className="text-xl" />
        </button>
      </div>
      <div className="absolute left-12 top-1/4 w-96 h-80 bg-white/30 backdrop-blur p-4 rounded">
        <h1>Lorem ipsum dolor sit amet, consectetur adipisicing.</h1>
        <p className="mb-4">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere,
          ipsa. Voluptatibus rerum saepe laudantium dolore repellendus sit
          quibusdam doloribus facere!
        </p>
        <button className="btn-primary disabled:pointer-events-none" disabled>
          Lorem, ipsum.
        </button>
      </div>
    </div>
  );
};

export default Carousel;
