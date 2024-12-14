import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "@/lib/axios/bookApi";
import SearchBar from "./SearchBar";
import BookInfo from "./BookInfo";
import BookFormModal from "../common/BookFormModal";
import { BookTypes } from "@/dtos/BookDto";

const BookListSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const itemsPerPage = 10;

  const { data: books = [], isLoading, error, refetch } = useQuery<BookTypes[], Error>({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p className="text-red-500">책 목록을 불러오는 중 오류가 발생했습니다.</p>;

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    refetch();
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
          paginatedBooks.map((book, index) => (
            <BookInfo
              key={book.id}
              book={book}
              displayIndex={index + 1} // 현재 페이지에 따른 순번 부여 (1부터 시작)
            />
          ))
        ) : (
          <p className="text-gray-600">검색 결과가 없습니다.</p>
        )}
      </div>

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
        {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => (
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

      {isModalOpen && (
        <BookFormModal
          isEdit={false}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default BookListSection;
