import React, { useState } from "react";
import SearchBar from "./SearchBar";
import BookInfo from "./BookInfo";

interface Book {
  id: number;
  imageUrl: string;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  description: string;
  quantity: number;
}

const BookListSection: React.FC = () => {
  const books: Book[] = [
    {
      id: 1,
      imageUrl: "/image/default.png",
      title: "JavaScript의 모든 것",
      author: "홍길동",
      publisher: "예제 출판사",
      publishedDate: "2023-01-01",
      description: "JavaScript를 깊이 이해할 수 있는 책입니다.",
      quantity: 5,
    },
    {
      id: 2,
      imageUrl: "/image/default.png",
      title: "React의 정석",
      author: "김코딩",
      publisher: "React 출판사",
      publishedDate: "2022-05-10",
      description: "React를 마스터하기 위한 필독서.",
      quantity: 10,
    },
    {
      id: 3,
      imageUrl: "/image/default.png",
      title: "Node.js 실전 가이드",
      author: "이서버",
      publisher: "백엔드 출판사",
      publishedDate: "2021-08-15",
      description: "Node.js를 사용하여 백엔드 개발에 도전하세요.",
      quantity: 7,
    },
  ];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 2; // 페이지당 표시할 책 수

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
      {/* 검색바 */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={() => setCurrentPage(1)} // 검색 시 첫 페이지로 이동
      />

      {/* 책 목록 */}
      <div className="mt-6 space-y-4">
        {paginatedBooks.length > 0 ? (
          paginatedBooks.map((book, index) => (
            <BookInfo
              key={book.id}
              order={startIndex + index + 1}
              imageUrl={book.imageUrl}
              title={book.title}
              author={book.author}
              publisher={book.publisher}
              publishedDate={book.publishedDate}
              description={book.description}
              quantity={book.quantity}
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
    </div>
  );
};

export default BookListSection;
