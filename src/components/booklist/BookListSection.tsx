import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import BookInfo from "./BookInfo";
import BookFormModal from "../common/BookFormModal";
import { BookTypes } from "@/dtos/BookDto";

const BookListSection: React.FC = () => {
  const [books, setBooks] = useState<BookTypes[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 열림 상태
  const itemsPerPage = 10; // 페이지당 표시할 책 수 (10개로 설정)

  // 책 데이터 가져오기
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get<BookTypes[]>("/api/books"); // GET 요청
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  // 검색 기능
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      {/* 검색바와 추가 버튼 */}
      <div className="flex justify-between items-center space-x-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={() => setCurrentPage(1)} // 검색 시 첫 페이지로 이동
        />
        <button
          onClick={() => setIsModalOpen(true)} // 추가 모드로 모달 열기
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md w-[80px] h-[45px]"
        >
          추가
        </button>
      </div>

      {/* 책 목록 */}
      <div className="mt-6 space-y-4">
        {paginatedBooks.length > 0 ? (
          paginatedBooks.map((book) => (
            <BookInfo
              key={book.id}
              book={book} // BookTypes 객체를 그대로 전달
            />
          ))
        ) : (
          <p className="text-gray-600">검색 결과가 없습니다.</p>
        )}
      </div>

      {/* 페이지네이션 */}
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

      {/* 추가 모달 */}
      {isModalOpen && (
        <BookFormModal
          isEdit={false} // 추가 모드로 설정
          onClose={() => setIsModalOpen(false)} // 모달 닫기
        />
      )}
    </div>
  );
};

export default BookListSection;
