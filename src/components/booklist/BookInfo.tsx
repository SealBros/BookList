import React from "react";
import Image from "next/image";

interface BookInfoProps {
  imageUrl: string;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  description: string;
  quantity: number;
  order: number;
}

const BookInfo: React.FC<BookInfoProps> = ({
  imageUrl,
  title,
  author,
  publisher,
  publishedDate,
  description,
  quantity,
  order,
}) => {
  return (
    <div className="flex border p-4 rounded-lg shadow-sm">
      <div className="flex-shrink-0">
        <div className="relative mb-4">
          <div className="absolute top-0 left-0 bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {order}
          </div>
          <Image
            src={imageUrl}
            alt="책 그림"
            width={160}
            height={240}
            className="w-40 h-60 object-cover border rounded-md"
          />
        </div>
      </div>
      <div className="flex-grow ml-4">
        <h2 className="text-xl font-bold mb-2">{title}</h2>

        <p className="text-gray-600 mb-2">
          저자: {author}, 출판사: {publisher}, 출간 날짜: {publishedDate}
        </p>

        <div className="text-gray-700 text-sm mb-4 line-clamp-2">
          {description}
        </div>

        <p className="text-gray-800">
          <span className="font-bold">책 수량:</span> {quantity}권
        </p>
      </div>
    </div>
  );
};

export default BookInfo;
