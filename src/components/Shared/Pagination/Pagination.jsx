const Pagination = ({ totalItems, pageSize, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4">
      <button
        className={`px-3 mx-1 border-none rounded-sm ${
          currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-white"
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={`px-2 mx-1 border-none rounded-sm ${
            currentPage === index + 1
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-200"
          }`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button
        className={`px-3 mx-1 border-none rounded-sm ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-white"
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
