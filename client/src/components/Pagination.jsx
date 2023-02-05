const Pagination = ({ items, PAGE_SIZE, setCurrentPage, currentPage }) => {
  return (
    <div className="w-full flex gap-2 items-center justify-center">
      {[...Array(Math.ceil(items.length / PAGE_SIZE)).keys()].map((page) => (
        <button
          key={page + 1}
          className={`${
            currentPage === page + 1 ? "text-primary font-bold shadow-md" : ""
          } border py-2 px-4 rounded text-base transition-pagination hover:shadow-md hover:text-primary hover:font-bold`}
          onClick={() => setCurrentPage(page + 1)}
        >
          {page + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
