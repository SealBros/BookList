import axios from "axios";
import { BookTypes } from "@/dtos/BookDto";

const BASE_URL = "/api/books";

export const uploadImage = async (base64Data: string, filename: string): Promise<string> => {
  const response = await axios.post("/api/upload", { base64Data, filename });
  return response.data.filePath;
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