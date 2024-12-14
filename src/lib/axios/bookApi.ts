import axios from "axios";
import { BookTypes } from "@/dtos/BookDto";

const BASE_URL = "/api/books";

export const uploadImage = async (file: File): Promise<string> => {
  if (!file) throw new Error("No file provided for upload.");

  try {
    // 1. Presigned URL 요청
    const { data: presignedResponse } = await axios.post("/api/s3upload", {
      fileName: file.name,
      fileType: file.type,
    });
    const { uploadUrl, key } = presignedResponse;

    if (!uploadUrl || !key) {
      throw new Error("Failed to get presigned URL or key.");
    }

    // 2. S3에 파일 업로드
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    // 3. 업로드된 S3 파일 URL 반환
    const bucketUrl = process.env.NEXT_PUBLIC_S3_URL;
    return `${bucketUrl}/${key}`;
  } catch (error) {
    console.error("Error during image upload:", error);
    throw new Error("Failed to upload image to S3.");
  }
};

export const createBook = async (payload: Partial<BookTypes>) => {
  return axios.post(BASE_URL, payload);
};

export const updateBook = async (id: number, payload: Partial<BookTypes>) => {
  return axios.put(`${BASE_URL}/${id}`, payload);
};

export const fetchBooks = async (): Promise<BookTypes[]> => {
  const response = await axios.get<BookTypes[]>(BASE_URL);
  return response.data;
};

export const fetchBooksDetail = async (id: number): Promise<BookTypes> => {
  const response = await axios.get<BookTypes>(`${BASE_URL}/${id}`);
  return response.data;
};

export const deleteBook = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
