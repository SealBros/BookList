# 프로젝트 이름
BookList

## 📖 프로젝트 소개
**온라인 서점**을 위한 웹 애플리케이션으로, Next.js를 사용하여 개발되었습니다. Vercel을 통해 배포되며 빠르고 간편한 사용자 경험을 제공합니다.

## 🛠️ 기술 스택

- **프론트엔드**:  
  - React, Next.js, TypeScript, Tailwind CSS


- **백엔드**:  
  - **Supabase**: 데이터베이스와 인증 기능으로 사용자 관리 및 데이터 저장에 사용.  
  - **AWS S3**: 이미지와 정적 파일을 저장하고 URL로 제공.


- **배포**:  
  - Vercel


- **기타**:  
  - Axios, React Query, ESLint, Prettier


## 🚀 설치 및 실행 방법

### 1. 로컬 개발 환경 설정
**프로젝트 클론**
```
git clone <repository_url>
cd <project_name>
```
**의존성 설치**
```
npm install
또는
yarn install
```
**로컬 서버 실행**
```
npm run dev
```
브라우저에서 http://localhost:3000으로 접속합니다.

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 필요한 변수를 추가합니다.

```env
# Supabase 설정
SUPABASE_URL=                  # Supabase 프로젝트의 URL
SUPABASE_SERVICE_ROLE_KEY=     # Supabase 서비스 역할 키

# AWS S3 설정
AWS_REGION=                    # AWS 리전 (예: ap-northeast-2)
AWS_S3_BUCKET_NAME=            # S3 버킷 이름
AWS_ACCESS_KEY_ID=             # AWS 액세스 키 ID
AWS_SECRET_ACCESS_KEY=         # AWS 시크릿 액세스 키

# 퍼블릭 URL 설정
NEXT_PUBLIC_S3_URL=            # S3에서 공개적으로 접근 가능한 URL
```


## 🧩 주요 기능
- 책 목록 페이지
  - 책 목록을 생성할 수 있습니다.
  - 책 목록을 책 제목 또는 저자로 검색할 수 있습니다.
 
- 책 상세 정보 페이지
  - 해당 책에 대한 상세 정보를 볼 수 있습니다.
  - 해당 책에 대한 수정 및 삭제할 수 있습니다.

## 📂 디렉토리 구조
<pre>
├── README.md
├── eslint.config.mjs             # ESLint 설정 파일
├── next.config.ts                # Next.js 설정 파일
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   └── image
│       └── default.png 
├── src
│   ├── components                # 재사용 가능한 UI 컴포넌트
│   │   ├── bookdetail            # 책 세부 정보를 표시하는 컴포넌트
│   │   │   └── BookDetailSection.tsx
│   │   ├── booklist              # 책 목록 관련 컴포넌트
│   │   │   ├── BookInfo.tsx
│   │   │   ├── BookListSection.tsx
│   │   │   └── SearchBar.tsx
│   │   └── common                # 공통적으로 사용되는 컴포넌트
│   │       ├── BookFormModal.tsx
│   │       └── Pagination.tsx
│   ├── dtos                      # 데이터 전송 객체 정의 디렉토리
│   │   └── BookDto.ts
│   ├── lib                       # 비즈니스 로직 및 유틸리티 함수 디렉토리
│   │   ├── axios                 # Axios를 이용한 API 호출 관련 파일
│   │       └── bookApi.ts
│   │   
│   ├── pages                     # Next.js의 페이지 라우팅 디렉토리
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── api                   # API 라우트 디렉토리 (Next.js 서버 함수)
│   │   │   ├── books             # 책 관련 API 라우트
│   │   │   │   ├── [id].ts
│   │   │   │   └── index.ts
│   │   │   └── s3upload.ts
│   │   ├── books                 # 책 관련 클라이언트 라우트 디렉토리
│   │   │   └── [id].tsx
│   │   └── index.tsx 
│   └── styles                    # 스타일 관련 파일 디렉토리
│       └── globals.css
├── tailwind.config.ts
└── tsconfig.json
</pre>

## 구현과정

### 1. **요구사항 분석**

- **책 목록 페이지 구현**:  
  - **페이지네이션 적용**: 한 페이지당 10개 항목이 보여지도록 구현.
  - **검색 기능 구현**: 제목과 저자로 필터링할 수 있도록 구현.


- **책 상세 정보 페이지 구현**:  
  - **책 정보 수정 및 삭제 구현**: 책 상세 정보를 수정 및 삭제할 수 있도록 구현.
  - **책 수량 조절 기능 구현**: 책 상세 정보 수정할 때 책 수량 조절도 같이 할 수 있도록 구현.

### 2. **개발 과정**
- **컴포넌트 설계**:  
  - 책 목록, 상세 정보, 페이지네이션 등을 담당하는 컴포넌트 설계.


- **API 설계**:  
  - 책 관련 RESTful API 설계.

|HTTP Method|Endpoint|설명|
|------|---|---|
|GET|/api/books|책 목록 조회|
|POST|/api/books|책 추가|
|GET|/api/books/:id|책 상세 정보 조회|
|PUT|/api/books/:id|책 정보 수정|
|DELETE|/api/books/:id|책 삭제|

- **데이터 모델링**:  
  - Supabase/SQL 데이터베이스 스키마 설계.
  
  
  ```sql
  -- 책 테이블 (Books)
  CREATE TABLE books (
      id BIGINT PRIMARY KEY,             -- 고유 ID
      title TEXT,              			 -- 책 제목
      author TEXT,           			   -- 저자 이름
      publisher TEXT,                    -- 출판사
      published_date DATE,               -- 출판 날짜
      quantity BIGINT DEFAULT 0,         -- 수량 (기본값: 0)
      description TEXT,                  -- 책 설명
      image_url TEXT,                    -- 이미지 URL
  );
  ```
  
- **프론트엔드**:  
  - Next.js를 사용하여 프론트엔드와 API 서버를 함께 구현.
  - React 기반 컴포넌트로 UI를 구성하고, pages/api 디렉토리에서 Next.js의 내장 API 라우터를 사용하여 백엔드 로직을 처리.
  - Axios를 활용하여 클라이언트와 서버 간의 통신을 구현.
  
- **백엔드**:  
  - Next.js의 API 라우터를 활용해 RESTful API를 구현.
  - 별도의 서버 없이 필요한 모든 API를 Next.js 프로젝트 내부에서 처리.
  - 이미지 업로드는 AWS S3를 사용하여 관리.
  	- `aws-sdk` 또는 `@aws-sdk/client-s3`를 사용하여 Next.js API 라우터에서 S3와 연동.
  	- 업로드된 이미지는 S3 버킷에 저장되며, 반환된 URL은 데이터베이스에 저장하거나 클라이언트에 전달.

## 코드 설명

#### 1) AWS S3 이미지 업로드 헨들러 (pages/api/s3upload.ts)
```javascript
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { fileName, fileType } = req.body;

      if (!fileName || !fileType) {
        return res.status(400).json({ error: 'File name and type are required.' });
      }

      const extension = fileName.split('.').pop();
      const key = `${uuidv4()}.${extension}`;

      const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Expires: 60,
        ContentType: fileType,
      };

      const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);

      res.status(200).json({ uploadUrl, key });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error generating upload URL.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
```

**파일키 생성**
```javascript
const extension = fileName.split('.').pop();
const key = `${uuidv4()}.${extension}`;
```
- 파일 이름에서 확장자를 추출한 후, 업로드될 S3 객체의 고유 키를 UUID와 확장자를 결합하여 생성합니다.( 파일명이 한글이거나 특수 문자가 들어갔을 경우 파일 업로드 시 깨짐을 방지 하기위해 사용함.)

**에러 처리**
```javascript
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error generating upload URL.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
```
- URL 생성 중 에러가 발생하면 500 상태 코드와 함께 에러 메시지를 반환합니다.
- POST가 아닌 요청은 허용되지 않으며, 허용됨 HTTP 메서드 목록을 추가합니다.


#### 2) 검색 필터링 (components/booklist/BookListSection.tsx)

```javascript
const filteredBooks = books.filter(
  (book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
);
```

- `books` 배열의 각 요소를 순회하며 `filter` 함수의 조건을 검사합니다.
- 책의 제목(title)이나 저자(author)가 검색어(searchQuery)를 포함하는지 확인합니다.	
  - `toLowerCase()`: 대소문자 구분 없이 검색을 수행하기 위해 모든 텍스트를 소문자로 변환.
  - `includes()`: 문자열이 특정 검색어를 포함하고 있는지 확인.
- 조건에 일치하는 책만 `filteredBooks` 배열에 포함됩니다.


#### 3) 페이지네이션 (components/booklist/BookListSection.tsx)
```javascript
const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
```
- 책 목록(`filteredBooks`)을 페이지로 나누기 위해 필요한 총 페이지 수를 계산합니다.
- 이후 현재 페이지에 표시할 책들만 추출하여 `paginatedBooks` 배열에 저장합니다.
-` handlePageChange` 핸들러는 사용자가 페이지 번호를 변경했을 때 현재 페이지 상태를 업데이트합니다.
  - 상태가 업데이트가 되면 리렌더링에 의해 `startIndex` 와 `paginatedBooks`가 다시 계산되어 새 페이지 내용이 화면에 표시됩니다.


#### 4) Presigned URL (lib/axios/bookApi.ts)
```javascript
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
```

**파일 존재 여부 확인**
```javascript
if (!file) throw new Error("No file provided for upload.");
```
- 파일이 제공되지 않은 경우 에러를 출력하고 종료합니다.

**Presigned URL 요청**

```javascript
const { data: presignedResponse } = await axios.post("/api/s3upload", {
  fileName: file.name,
  fileType: file.type,
});
const { uploadUrl, key } = presignedResponse;
```
- 서버로 파일 정보를 보내 Presigned URL을 생성합니다.
- `uploadUrl` 또는 `key`값이 없으면 에러가 발생합니다.

**업로드된 파일 URL 생성**
```javascript
const bucketUrl = process.env.NEXT_PUBLIC_S3_URL;
return `${bucketUrl}/${key}`;
```
- 업로드된 파일의 공개 URL을 생성하고 반환합니다.

**에러처리**
```javascript
catch (error) {
  console.error("Error during image upload:", error);
  throw new Error("Failed to upload image to S3.");
}

```
- 업로드 과정에서 에러가 발생하면 콘솔에 기록하고 에러 메시지를 호출한 쪽에서 처리하도록 합니다.


#### 5) API 엔드포인트

**책 정보를 데이터베이스 추가(pages/api/books/index.ts)**
```javascript
try {
    if (req.method === 'POST') {
      const { title, author, publisher, published_date, quantity, description, image_url } = req.body;

      if (!title || !author) {
        return res.status(400).json({ message: 'Title and Author are required.' });
      }

      const { data, error } = await supabase
        .from('books')
        .insert([
          {
            title,
            author,
            publisher,
            published_date,
            quantity: quantity || 0,
            description,
            image_url: image_url || null,
          },
        ])
        .select();

      if (error) {
        console.error('Insert error:', error);
        return res.status(500).json({ message: 'Failed to add book.', error });
      }

      return res.status(201).json({ message: 'Book added successfully!', data });
    }
```
- HTTP `POST` 요청을 처리하며, 책의 제목과 저자등을 포함한 정보를 `supabase`를 사용해 `books` 테이블에 삽입합니다.
- 데이터 삽입 성공/실패 처리:
  - 성공시 삽입된 데이터와 함께 201 응답을 반환합니다.
  - 실패시 에러 로그를 출력하고 500 응답을 반환합니다.

**책 정보를 조회(pages/api/books/index.ts)**
```javascript
if (req.method === 'GET') {
      // 데이터 조회
      const { data, error } = await supabase.from('books').select('*');

      if (error) {
        console.error('Fetch error:', error);
        return res.status(500).json({ message: 'Failed to fetch books.', error });
      }

      return res.status(200).json(data);
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Supabase error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
```
- HTTP `GET` 요청을 처리하며, `supabase`를 사용해 데이터베이스에서 `books` 테이블의 데이터를 가져옵니다.
- 데이터 조회는 `supabase.from('books').select('*')`를 사용해 `books` 테이블의 모든 데이터를 가져옵니다.
- 데이터 조회 성공/실패 처리:
  - 성공시 가져온 데이터를 200 응답을 반환합니다.
  - 허용되지 않은 GET 이외의 요청 메서드는 405 응답을 반환합니다.
  - 실패시 에러 로그를 출력하고 500 응답을 반환합니다.

**책 정보를 업데이트(pages/api/books/[id].ts)**
```javascript
if (req.method === 'PUT') {
      const { title, author, publisher, published_date, quantity, description, image_url } = req.body;
    
      if (!title || !author) {
        return res.status(400).json({ message: 'Title and Author are required.' });
      }
    
      const { data, error } = await supabase
        .from('books')
        .update({
          title,
          author,
          publisher,
          published_date,
          quantity: quantity || 0,
          description,
          image_url: image_url || null,
        })
        .eq('id', id)
        .select();

      if (error) {
        return res.status(404).json({ message: 'Book not found or update failed.' });
      }

      return res.status(200).json({ message: 'Book updated successfully.', data });
    }
```
- HTTP `PUT` 요청을 처리하며, `supabase`를 사용해 `books` 테이블의 특정 레코드를 업데이트합니다.
- 요청 데이터 검증에서 요청 본문에서 필요한 필드를 추출한 후, 필수값이 없으면 400 응답을 반환합니다.
- `supabase.from('books').update({...}).eq('id', id)` 으로 요청된 필드값을 업데이트합니다.
- 에러 성공/실패 처리:
  - 성공시 변경된 데이터를 200 응답을 반환합니다.
  - 업데이트 중 에러가 발생하거나 해당 레코드가 없을 경우에 404 응답 반환합니다.

**책 정보를 삭제(pages/api/books/[id].ts)**
```javascript
if (req.method === 'DELETE') {
      const { error } = await supabase.from('books').delete().eq('id', id);

      if (error) {
        return res.status(404).json({ message: 'Book not found or delete failed.' });
      }

      return res.status(200).json({ message: 'Book deleted successfully.' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
```
- HTTP `DELETE` 요청을 처리하며, `supabase`를 사용해 `books` 테이블에서 특정 레코드를 삭제합니다.
- `supabase.from('books').delete().eq('id', id)` 으로 특정 id 값을 조건으로 삭제합니다.
- 에러 성공/실패 처리:
  - 성공시 200 응답을 반환합니다.
  - 삭제 과정에서 에러가 발생하거나 해당 레코드가 없을 경우에 404 응답 반환합니다.
  - 허용 되지 않은 메서드 같은 경우 405 응답을 반환합니다.

## 기술적 고려사항

### 1) 성능 최적화
- React Query를 사용하여 서버 데이터를 캐싱하여 중복 요청을 줄이고, 데이터가 최신 상태인지 관리하였습니다.
- AWS S3를 사용해 이미지를 CDN처럼 제공해 정적 파일을 최적화 하였습니다.

### 2) 확장성
- React 컴포넌트를 재사용 가능한 단위로 분리하고, API 호출 로직을 lib/axios 폴더안에 관리하여 유지보수를 높였습니다.
- Supabase(PosgtgreSQL)의 테이블 설계를 통해 데이터를 확장성을 높였습니다.
- S3 버킷 설계하여 확장성을 높였습니다.

### 3) 사용자 경험
- 데이터 페칭 중에 로딩 상태와 에러 메시지를 표시해 사용자가 상태를 이해할 수 있도록 구현하였습니다.

## 스크린샷 및 실행 결과


https://github.com/user-attachments/assets/b8010bcf-de9e-42a9-b92f-d865d204ba1e


