# 쿠팡 상품 검색 웹사이트

쿠팡 파트너스 API를 활용한 상품 검색 웹사이트입니다.

## 기능

- **상품 검색**: 키워드로 쿠팡 상품 검색
- **골드박스**: 쿠팡 베스트셀러/추천 상품 조회
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **로켓배송/무료배송 표시**: 배송 옵션 한눈에 확인

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Coupang Partners Open API

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 쿠팡 파트너스 API 키를 설정하세요:

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열고 API 키를 입력하세요:

```env
COUPANG_ACCESS_KEY=your_access_key_here
COUPANG_SECRET_KEY=your_secret_key_here
```

> 쿠팡 파트너스 API 키는 [쿠팡 파트너스](https://partners.coupang.com/)에서 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   └── products/
│   │       ├── search/
│   │       │   └── route.ts      # 상품 검색 API
│   │       └── goldbox/
│   │           └── route.ts      # 골드박스 API
│   ├── layout.tsx
│   ├── page.tsx                  # 메인 페이지
│   └── globals.css
├── components/
│   ├── ProductCard.tsx           # 상품 카드 컴포넌트
│   └── SearchBar.tsx             # 검색바 컴포넌트
└── lib/
    └── coupang.ts                # 쿠팡 API 유틸리티
```

## API 엔드포인트

### GET /api/products/search

상품 검색 API

**Parameters:**
- `keyword` (required): 검색어
- `limit` (optional): 결과 개수 (기본값: 20)

**Example:**
```
GET /api/products/search?keyword=노트북&limit=10
```

### GET /api/products/goldbox

골드박스(베스트셀러) 상품 조회 API

**Example:**
```
GET /api/products/goldbox
```

## 배포

### Vercel 배포

```bash
npm run build
```

또는 [Vercel](https://vercel.com)에 직접 배포하세요.

## 주의사항

- 이 사이트는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
- 쿠팡 파트너스 API 이용약관을 준수해주세요.

## 라이선스

MIT
