import React, { useState } from "react";
import axios from "axios";
import { BookTypes } from "@/dtos/BookDto";
import Image from "next/image";

interface BookFormProps {
  isEdit: boolean;
  bookData?: Partial<BookTypes>;
  onClose: () => void;
}

const BookFormModal: React.FC<BookFormProps> = ({ isEdit, bookData, onClose }) => {
  const [form, setForm] = useState<Partial<BookTypes>>({
    id: bookData?.id || 0,
    title: bookData?.title || "",
    author: bookData?.author || "",
    publisher: bookData?.publisher || "",
    published_date: bookData?.published_date || "",
    quantity: bookData?.quantity || 1,
    description: bookData?.description || "",
    image_url: bookData?.image_url || "",
  });

  const [preview, setPreview] = useState<string | null>(bookData?.image_url || null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    setForm((prev) => ({
      ...prev,
      quantity: type === "increment" ? (prev.quantity || 1) + 1 : Math.max(1, (prev.quantity || 1) - 1),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setBase64Image(base64);
        setPreview(base64); // 미리보기를 Base64로 설정
        setForm((prev) => ({ ...prev, imageUrl: base64 })); // 이미지 URL 대신 Base64 저장
      };
      reader.readAsDataURL(file); // 파일을 Base64로 읽기
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click(); // 파일 선택 창 열기
  };

  const handleSubmit = async () => {
    if (!base64Image) {
      alert('이미지를 업로드하세요.');
      return;
    }
  
    try {
      const filename = `book_${Date.now()}.png`; // 파일명 생성
      const response = await axios.post('/api/upload', {
        base64Data: base64Image,
        filename,
      });
  
      const imageUrl = response.data.filePath; // 저장된 파일 경로 받기
  
      const payload = {
        title: form.title,
        author: form.author,
        publisher: form.publisher,
        published_date: form.published_date,
        quantity: form.quantity,
        description: form.description,
        image_url: imageUrl,
      };
  
      await axios.post('/api/books', payload);
  
      alert('책이 등록되었습니다.');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('요청 중 오류가 발생했습니다.');
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg overflow-hidden shadow-lg max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">{isEdit ? "책 수정하기" : "책 추가하기"}</h2>
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="flex space-x-6">
            {/* 이미지 미리보기 */}
            <div>
              <Image
                src={preview || "/image/default.png"}
                alt="책 미리보기"
                width={160}
                height={240}
                className="w-40 h-60 object-cover border rounded-md cursor-pointer"
                onClick={handleImageClick}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* 나머지 입력 필드 */}
            <div className="flex-1 space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">책 제목</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="책 제목 입력"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">저자</label>
                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="저자 이름 입력"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">출판사</label>
                <input
                  type="text"
                  name="publisher"
                  value={form.publisher}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="출판사 입력"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">출간 날짜</label>
                <input
                  type="date"
                  name="published_date"
                  value={form.published_date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-center">
                <label className="block text-sm font-medium mr-4">책 수량</label>
                <button
                  type="button"
                  onClick={() => handleQuantityChange("decrement")}
                  className="px-4 py-2 bg-gray-300 text-sm rounded-l"
                >
                  -
                </button>
                <span className="px-4 py-2 border-t border-b">{form.quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange("increment")}
                  className="px-4 py-2 bg-gray-300 text-sm rounded-r"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 줄거리 */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">책 줄거리 내용</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="책 줄거리 내용을 입력하세요"
              rows={4}
            ></textarea>
            <p className="text-right text-sm text-gray-500">
              {form.description?.length || 0} / 500 글자
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-sm rounded mr-2"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white text-sm rounded"
          >
            {isEdit ? "수정하기" : "등록하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookFormModal;
