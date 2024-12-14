import React, { useState, useEffect } from "react";
import { BookTypes } from "@/dtos/BookDto";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import BookFormModal from "../common/BookFormModal";

interface BookDetailProps {
  id: number;
}

const BookDetailSection: React.FC<BookDetailProps> = ({ id }) => {
  const [book, setBook] = useState<BookTypes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get<BookTypes>(`/api/books/${id}`);
        setBook(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("책 정보를 불러오지 못했습니다.");
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/books/${id}`);
      alert("책이 성공적으로 삭제되었습니다.");
      router.push("/");
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("책 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-[800px] mx-auto p-6 border rounded-lg shadow-lg bg-white mt-6">
      <div className="flex items-start">
        <div className="w-1/3">
          <Image
            src={book?.image_url || "/image/default.png"}
            alt={book?.title || "기본 이미지"}
            width={160}
            height={240}
            className="object-cover border rounded-md"
            priority
          />
        </div>

        <div className="w-2/3 pl-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">{book?.title}</h1>
            <div className="space-x-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
              >
                삭제
              </button>
            </div>
          </div>

          <p className="text-gray-600 mb-2">저자: {book?.author}</p>
          <p className="text-gray-600 mb-2">출판사: {book?.publisher}</p>
          <p className="text-gray-600 mb-2">
            출간 날짜: {new Date(book?.published_date || "").toLocaleDateString()}
          </p>
          <p className="text-gray-600 mb-2">
            책 수량: <span className="font-semibold">{book?.quantity}</span>권
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">작품 소개</h2>
        <div className="p-4 border rounded-lg bg-gray-50 text-gray-700 whitespace-pre-line">
          {book?.description}
        </div>
      </div>

      {isModalOpen && (
        <BookFormModal
          isEdit={true}
          bookData={book || undefined}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BookDetailSection;
