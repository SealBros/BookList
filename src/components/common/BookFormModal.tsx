import React, { useState } from "react";
import Image from "next/image";
import { uploadImage, createBook, updateBook } from "@/lib/axios/bookApi";
import { BookTypes } from "@/dtos/BookDto";

interface BookFormProps {
  isEdit: boolean;
  bookData?: Partial<BookTypes>;
  onClose: (updated: boolean) => void;
}

const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return "";
  const parsedDate = new Date(date);
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const BookFormModal: React.FC<BookFormProps> = ({ isEdit, bookData, onClose }) => {
  const [form, setForm] = useState<Partial<BookTypes>>({
    id: bookData?.id || 0,
    title: bookData?.title || "",
    author: bookData?.author || "",
    publisher: bookData?.publisher || "",
    published_date: formatDate(bookData?.published_date) || "",
    quantity: bookData?.quantity || 1,
    description: bookData?.description || "",
    image_url: bookData?.image_url || "",
  });

  const [preview, setPreview] = useState<string | null>(bookData?.image_url || null);
  const [file, setFile] = useState<File | null>(null);
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
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    const requiredFields: { [key: string]: string } = {
      title: "책 제목",
      author: "저자",
      publisher: "출판사",
      published_date: "출간 날짜",
      quantity: "책 수량",
      description: "책 줄거리",
      image_url: "책 이미지",
    };
  
    const missingFields = Object.keys(requiredFields).filter((key) => {
      if (key === "image_url" && !file && !form.image_url) return true;
      return !form[key as keyof BookTypes];
    });
  
    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map((field) => requiredFields[field]).join(", ");
      alert(`다음 항목을 입력하세요: ${missingFieldNames}`);
      return;
    }
  
    try {
      let imageUrl = form.image_url;
  
      if (file) {
        imageUrl = await uploadImage(file);
      }
  
      const payload = {
        title: form.title,
        author: form.author,
        publisher: form.publisher,
        published_date: form.published_date,
        quantity: form.quantity,
        description: form.description,
        image_url: imageUrl,
      };
  
      if (isEdit && bookData?.id) {
        await updateBook(bookData.id, payload);
        alert("책 정보가 수정되었습니다.");
      } else {
        await createBook(payload);
        alert("책이 등록되었습니다.");
      }
  
      onClose(true);
    } catch (error) {
      console.error("Error:", error);
      alert("요청 중 오류가 발생했습니다.");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg overflow-hidden shadow-lg max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">{isEdit ? "책 수정하기" : "책 추가하기"}</h2>
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="flex space-x-6">
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
            onClick={() => onClose(false)} // 수정 취소 시 알림
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
