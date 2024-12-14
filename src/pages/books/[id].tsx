import React from "react";
import { useRouter } from "next/router";
import BookDetailSection from "@/components/bookdetail/BookDetailSection";

const BookDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || Array.isArray(id)) {
    return <p>잘못된 접근입니다.</p>;
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <BookDetailSection id={parseInt(id, 10)} />
    </div>
  );
};

export default BookDetailPage;
