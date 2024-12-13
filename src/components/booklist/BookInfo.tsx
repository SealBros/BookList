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
    <div className="flex border p-6 rounded-lg shadow-sm max-w-[1200px] mx-auto bg-white">
      <div className="flex items-center space-x-4">
        <div className="bg-green-500 rounded-md w-10 h-10 flex items-center justify-center text-white text-sm font-bold shadow-md">
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

      <div className="flex-grow ml-4">
        <h2 className="text-xl font-bold mb-5">{title}</h2>
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-600">
            저자: {author}, 출판사: {publisher}, 출간 날짜: {publishedDate}
          </p>
          <p className="text-gray-800 font-semibold">
            <span className="text-sm font-normal text-gray-600">수량: </span>
            {quantity}권
          </p>
        </div>

        <div className="text-gray-700 text-sm line-clamp-2">{description}</div>
      </div>
    </div>
  );
};

export default BookInfo;
