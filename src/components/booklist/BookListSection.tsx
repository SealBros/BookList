import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import BookInfo from "./BookInfo";
import BookFormModal from "../common/BookFormModal";
import { BookTypes } from "@/dtos/BookDto";
import { fetchBooks } from "@/lib/axios/bookApi";

const BookListSection: React.FC = () => {
  const [books, setBooks] = useState<BookTypes[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
  const itemsPerPage = 10;

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    loadBooks();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="flex justify-between items-center space-x-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={() => setCurrentPage(1)} 
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md w-[80px] h-[45px]"
        >
          추가
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {paginatedBooks.length > 0 ? (
          paginatedBooks.map((book) => (
            <BookInfo
              key={book.id}
              book={book}
            />
          ))
        ) : (
          <p className="text-gray-600">검색 결과가 없습니다.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`py-2 px-4 rounded-md ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`py-2 px-4 rounded-md ${
                page === currentPage
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`py-2 px-4 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            &gt;
          </button>
        </div>
      )}
      
      {isModalOpen && (
        <BookFormModal
          isEdit={false} 
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BookListSection;
