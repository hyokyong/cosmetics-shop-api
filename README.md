# cosmetics-shop-api

Next.js로 구현했던 화장품 쇼핑몰 백엔드를 NestJS로 재구현한 프로젝트입니다.
동일한 API 스펙을 유지하면서 프레임워크만 교체하여 두 방식의 차이를 학습했습니다.
참고 : cosmetics-shop(next.js) [https://github.com/hyokyong/cosmetics-shop](https://github.com/hyokyong/cosmetics-shop 'cosmetics-shop')

## 기술 스택

- **프레임워크**: NestJS
- **언어**: TypeScript
- **DB**: PostgreSQL (Neon)
- **ORM**: Prisma 7
- **인증**: JWT (accessToken 1시간, refreshToken 7일), bcrypt

## 프로젝트 구조

```
src/
  auth/
    dto/auth.dto.ts          # 요청 타입 정의
    auth.controller.ts       # 라우팅
    auth.service.ts          # 비즈니스 로직
    auth.module.ts           # 모듈 등록
  products/
    dto/product.dto.ts
    products.controller.ts
    products.service.ts
    products.module.ts
  orders/
    dto/order.dto.ts
    orders.controller.ts
    orders.service.ts
    orders.module.ts
  shipping-addresses/
    shipping-addresses.controller.ts
    shipping-addresses.service.ts
    shipping-addresses.module.ts
  reviews/
    reviews.controller.ts
    reviews.service.ts
    reviews.module.ts
  admin/
    admin.controller.ts
    admin.service.ts
    admin.module.ts
  prisma/
    prisma.service.ts        # Prisma 클라이언트 싱글톤
    prisma.module.ts         # 글로벌 모듈
  app.module.ts              # 루트 모듈
  main.ts                    # 서버 진입점 (port 4000)
prisma/
  schema.prisma              # DB 스키마
```

## API 목록

**인증**

| 메서드 | 경로                           | 인증 | 설명             |
| ------ | ------------------------------ | ---- | ---------------- |
| `POST` | `/api/auth/signup`             |      | 회원가입         |
| `POST` | `/api/auth/login`              |      | 로그인           |
| `GET`  | `/api/auth/check-email?email=` |      | 이메일 중복 확인 |
| `POST` | `/api/auth/refresh`            |      | 액세스 토큰 갱신 |

**상품**

| 메서드   | 경로                   | 인증  | 설명                                        |
| -------- | ---------------------- | ----- | ------------------------------------------- |
| `GET`    | `/api/products`        |       | 상품 목록 (page, size, category, brandName) |
| `GET`    | `/api/products/brands` |       | 브랜드 목록                                 |
| `GET`    | `/api/products/:id`    |       | 상품 상세                                   |
| `POST`   | `/api/products`        | ADMIN | 상품 등록                                   |
| `PUT`    | `/api/products/:id`    | ADMIN | 상품 수정                                   |
| `DELETE` | `/api/products/:id`    | ADMIN | 상품 삭제 (소프트)                          |

**주문**

| 메서드   | 경로              | 인증 | 설명         |
| -------- | ----------------- | ---- | ------------ |
| `POST`   | `/api/orders`     | USER | 주문 생성    |
| `GET`    | `/api/orders`     | USER | 내 주문 목록 |
| `GET`    | `/api/orders/:id` | USER | 주문 상세    |
| `DELETE` | `/api/orders/:id` | USER | 주문 취소    |

**배송지**

| 메서드   | 경로                          | 인증 | 설명        |
| -------- | ----------------------------- | ---- | ----------- |
| `GET`    | `/api/shipping-addresses`     | USER | 배송지 목록 |
| `POST`   | `/api/shipping-addresses`     | USER | 배송지 등록 |
| `DELETE` | `/api/shipping-addresses/:id` | USER | 배송지 삭제 |

**리뷰**

| 메서드 | 경로                      | 인증 | 설명             |
| ------ | ------------------------- | ---- | ---------------- |
| `GET`  | `/api/reviews?productId=` |      | 상품별 리뷰 목록 |
| `POST` | `/api/reviews`            | USER | 리뷰 작성        |

**관리자 · 파트너**

| 메서드  | 경로                             | 인증  | 설명               |
| ------- | -------------------------------- | ----- | ------------------ |
| `GET`   | `/api/admin/partners`            | ADMIN | 파트너 목록        |
| `POST`  | `/api/admin/partners`            | ADMIN | 파트너 등록        |
| `PATCH` | `/api/admin/partners/:id/active` | ADMIN | 파트너 활성/비활성 |

## 로컬 실행

```bash
# 패키지 설치
npm install

# 환경변수 설정 (.env)
DATABASE_URL="Neon Connection String"
JWT_SECRET="시크릿 키"
JWT_REFRESH_SECRET="리프레시 시크릿 키"

# DB 테이블 생성
npx prisma db push

# 개발 서버 실행 (port 4000)
npm run start:dev
```

## 학습 내용

### NestJS 구조

Spring을 사용해본 경험이 있어 구조가 익숙했다. NestJS는 `Controller`, `Service`, `Module` 세 가지로 역할이 나뉜다.

| 역할       | 파일                 | 설명                                |
| ---------- | -------------------- | ----------------------------------- |
| Controller | `auth.controller.ts` | 요청 받고 응답 반환 (라우팅만 담당) |
| Service    | `auth.service.ts`    | 실제 비즈니스 로직 처리             |
| Module     | `auth.module.ts`     | Controller, Service 등록 및 조립    |

요청 흐름은 아래와 같다.

```
요청 → Controller (라우팅) → Service (로직) → Prisma (DB) → 응답
```

### Prisma

SQL을 직접 작성하지 않고 TypeScript 코드로 DB를 다루는 ORM이다. Java의 JPA와 동일한 역할을 한다.

`prisma/schema.prisma`에 테이블 구조를 정의하면 Prisma가 자동으로 메서드를 생성해준다.

```ts
// 조회
await prisma.user.findUnique({ where: { email } });

// 생성
await prisma.user.create({ data: { email, password, name } });

// 수정
await prisma.user.update({ where: { id }, data: { name } });

// 삭제
await prisma.user.delete({ where: { id } });
```

TypeScript 타입이 자동으로 지원되어 자동완성과 타입 에러 감지가 가능하다.
