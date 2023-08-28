const HomeImage = () => {
  return (
    <div className="flex items-center justify-center max-w-[96rem] mx-auto overflow-hidden home-bg h-[20rem] lg:h-[38rem]">
      <div className="w-80 lg:w-[50rem] bg-white/30 backdrop-blur p-4 rounded text-center flex flex-col justify-center items-center">
        <h1 className="text-lg lg:text-2xl">
          Lorem ipsum dolor sit amet, consectetur adipisicing.
        </h1>
        <p className="mb-4 text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere,
          ipsa. Voluptatibus rerum saepe laudantium dolore repellendus sit
          quibusdam doloribus facere!
        </p>
        <button className="btn-primary lg:w-2/4 pointer-events-none">
          Lorem, ipsum.
        </button>
      </div>
    </div>
  );
};

export default HomeImage;
