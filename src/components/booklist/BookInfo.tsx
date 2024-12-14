import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { BookTypes } from "@/dtos/BookDto";

interface BookInfoProps {
  book: BookTypes;
  displayIndex: number; // 추가된 prop
}

const BookInfo: React.FC<BookInfoProps> = ({ book, displayIndex }) => {
  const router = useRouter();

  const {
    id,
    image_url,
    title,
    author,
    publisher,
    published_date,
    description,
    quantity,
  } = book;

  const handleImageClick = () => {
    router.push(`/books/${id}`);
  };

  return (
    <div className="flex border p-6 rounded-lg shadow-sm max-w-[1200px] mx-auto bg-white">
      <div className="flex items-center space-x-4">
        <div className="bg-green-500 rounded-md w-10 h-10 flex items-center justify-center text-white text-sm font-bold shadow-md">
          {displayIndex}
        </div>
        <Image
          src={image_url || "/image/default.png"}
          alt="책 그림"
          width={160}
          height={240}
          className="w-40 h-60 object-cover border rounded-md cursor-pointer"
          onClick={handleImageClick}
        />
      </div>

      <div className="flex-grow ml-4">
        <h2 className="text-xl font-bold mb-5">{title}</h2>
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-600">
            저자: {author}, 출판사: {publisher}, 출간 날짜:{" "}
            {new Date(published_date).toLocaleDateString()}
          </p>
          <p className="text-gray-800 font-semibold">
            <span className="text-base font-normal text-gray-600">수량: </span>
            {quantity}권
          </p>
        </div>

        <div className="text-gray-700 text-base whitespace-pre-line line-clamp-2">{description}</div>
      </div>
    </div>
  );
};

export default BookInfo;
