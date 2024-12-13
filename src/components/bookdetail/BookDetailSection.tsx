import React from "react";
import Image from "next/image";

const BookDetail: React.FC<{
  imageUrl: string;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  quantity: number;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
}> = ({
  imageUrl,
  title,
  author,
  publisher,
  publishedDate,
  quantity,
  description,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 border rounded-lg shadow-sm bg-gray-50">
      <div className="flex">
        <div className="w-1/3">
          <Image
              src={imageUrl}
              alt="책 이미지"
              width={300}
              height={450}
              className="object-cover border rounded-md"
              layout="responsive"
              />
        </div>

        <div className="w-2/3 pl-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="space-x-2">
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                수정
              </button>
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-lg">
              <strong>저자:</strong> {author}
            </p>
            <p className="text-lg">
              <strong>출판사:</strong> {publisher}
            </p>
            <p className="text-lg">
              <strong>출간 날짜:</strong> {publishedDate}
            </p>
            <p className="text-lg">
              <strong>책 수량:</strong> {quantity}권
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">작품 소개</h2>
        <p className="text-gray-700">{description}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">작품 줄거리</h2>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  );
};

export default BookDetail;
