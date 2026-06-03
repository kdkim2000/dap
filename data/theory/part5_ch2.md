# 5과목 2장: 데이터베이스 이용

## 1. 데이터베이스 관리 시스템(DBMS)

**DBMS(Database Management System)** 는 데이터베이스를 생성·관리·운영하는 소프트웨어 시스템.

### 1.1 DBMS 유형

| 유형 | 특징 | 대표 제품 |
|------|------|------|
| 관계형(RDBMS) | 2차원 테이블 구조, SQL 사용, ACID 보장 | Oracle, MySQL, PostgreSQL, SQL Server |
| 객체관계형(ORDBMS) | RDBMS + 객체지향 특성 (상속, 메서드) | Oracle, PostgreSQL |
| 객체지향(OODBMS) | 객체 그대로 저장, 복잡한 데이터 구조 | ObjectDB, db4o |
| NoSQL | 비정형 데이터, 수평 확장, 유연한 스키마 | MongoDB, Cassandra, Redis |
| NewSQL | RDBMS의 ACID + NoSQL의 확장성 | Google Spanner, CockroachDB |

### 1.2 NoSQL 유형

| 유형 | 데이터 모델 | 사용 사례 |
|------|------|------|
| Key-Value | 키-값 쌍 | 세션 관리, 캐싱 (Redis) |
| Document | JSON/BSON 문서 | 콘텐츠 관리 (MongoDB) |
| Column-Family | 열 지향 저장 | 로그 분석 (Cassandra) |
| Graph | 노드·엣지 구조 | SNS, 추천 시스템 (Neo4j) |

> **핵심**: RDBMS는 정형 데이터·트랜잭션 처리에 강하고, NoSQL은 비정형 데이터·수평 확장에 강하다.

---

## 2. 데이터 액세스

### 2.1 SQL(Structured Query Language)

데이터베이스 조작을 위한 표준 언어.

| 분류 | 명령어 | 설명 |
|------|------|------|
| DDL | CREATE, ALTER, DROP, TRUNCATE | 스키마 정의 |
| DML | SELECT, INSERT, UPDATE, DELETE | 데이터 조작 |
| DCL | GRANT, REVOKE | 권한 제어 |
| TCL | COMMIT, ROLLBACK, SAVEPOINT | 트랜잭션 제어 |

### 2.2 데이터 액세스 기술

| 기술 | 설명 | 특징 |
|------|------|------|
| JDBC | Java용 DB 연결 표준 API | 직접 SQL 작성 |
| ODBC | OS 독립적 DB 연결 표준 | C/C++ 기반 |
| ORM | 객체-관계 매핑 프레임워크 | SQL 자동 생성 (Hibernate, JPA) |
| MyBatis | SQL 매퍼 프레임워크 | SQL을 XML/어노테이션으로 관리 |

### 2.3 커서(Cursor)

결과 집합을 행 단위로 처리하는 메커니즘.

- **암묵적 커서**: DML 문장 수행 시 자동 생성
- **명시적 커서**: DECLARE → OPEN → FETCH → CLOSE 단계

```sql
DECLARE cursor_emp CURSOR FOR
  SELECT emp_id, emp_name FROM TB_EMPLOYEE;
OPEN cursor_emp;
FETCH cursor_emp INTO @id, @name;
CLOSE cursor_emp;
```

---

## 3. 트랜잭션

**트랜잭션**은 데이터베이스 작업의 논리적 단위로, 모두 성공하거나 모두 실패해야 한다.

### 3.1 ACID 속성

| 속성 | 설명 |
|------|------|
| **A**tomicity(원자성) | 트랜잭션의 모든 연산이 완전 수행되거나 전혀 수행되지 않아야 함 |
| **C**onsistency(일관성) | 트랜잭션 전후로 데이터베이스가 일관된 상태를 유지해야 함 |
| **I**solation(격리성) | 동시 실행 트랜잭션들이 서로 영향을 주지 않아야 함 |
| **D**urability(지속성) | 커밋된 트랜잭션의 결과는 영구적으로 저장되어야 함 |

### 3.2 동시성 제어

여러 트랜잭션이 동시에 실행될 때 발생하는 문제:

| 문제 | 설명 |
|------|------|
| 갱신 분실(Lost Update) | 두 트랜잭션이 같은 데이터 갱신 시 한 쪽 갱신이 소실 |
| 더티 읽기(Dirty Read) | 커밋되지 않은 데이터를 다른 트랜잭션이 읽음 |
| 반복 불가 읽기(Non-repeatable Read) | 같은 쿼리를 두 번 실행 시 다른 결과 |
| 팬텀 읽기(Phantom Read) | 같은 조건으로 두 번 조회 시 새 행이 나타남 |

### 3.3 잠금(Lock)

| 잠금 유형 | 설명 |
|------|------|
| 공유 잠금(Shared Lock) | 읽기 시 사용, 다른 읽기는 허용, 쓰기는 차단 |
| 배타 잠금(Exclusive Lock) | 쓰기 시 사용, 다른 모든 접근 차단 |
| 의도 잠금(Intent Lock) | 상위 레벨에서 하위 레벨 잠금 의도 표시 |

**잠금 단위**: 데이터베이스 > 테이블 > 페이지 > 행

> **교착상태(Deadlock)**: 두 트랜잭션이 서로의 잠금을 기다려 무한 대기. 해결: 타임아웃, 희생자 선택.

### 3.4 격리 수준(Isolation Level)

| 격리 수준 | Dirty Read | Non-repeatable Read | Phantom Read |
|------|:---:|:---:|:---:|
| READ UNCOMMITTED | 발생 | 발생 | 발생 |
| READ COMMITTED | 없음 | 발생 | 발생 |
| REPEATABLE READ | 없음 | 없음 | 발생 |
| SERIALIZABLE | 없음 | 없음 | 없음 |

---

## 4. 백업 및 복구

### 4.1 백업 유형

| 유형 | 설명 | 장점 | 단점 |
|------|------|------|------|
| 전체 백업(Full) | 모든 데이터 백업 | 복구 단순 | 시간·저장공간 많이 소요 |
| 증분 백업(Incremental) | 마지막 백업 이후 변경분만 | 빠르고 소용량 | 복구 복잡 (여러 백업 필요) |
| 차등 백업(Differential) | 마지막 전체 백업 이후 변경분 | 복구 비교적 단순 | 시간이 갈수록 크기 증가 |
| 트랜잭션 로그 백업 | 로그 파일 백업 | 특정 시점 복구 가능 | 잦은 수행 필요 |

### 4.2 복구 유형

| 복구 유형 | 설명 |
|------|------|
| 완전 복구 | 최신 상태까지 복구 (트랜잭션 로그 적용) |
| 시점 복구(Point-in-Time) | 특정 시점으로 복구 |
| 부분 복구 | 특정 테이블·파일그룹만 복구 |

### 4.3 복구 목표

| 지표 | 설명 |
|------|------|
| RTO(Recovery Time Objective) | 서비스 복구까지 허용되는 최대 시간 |
| RPO(Recovery Point Objective) | 복구 가능한 최근 시점 (허용 데이터 손실 범위) |

> **핵심**: RTO는 복구 시간 목표, RPO는 복구 지점 목표. RTO와 RPO가 짧을수록 고가용성이 필요.

### 4.4 REDO와 UNDO

| 구분 | 설명 |
|------|------|
| REDO 로그 | 커밋된 변경사항 재적용 (장애 후 복구) |
| UNDO 로그 | 롤백 시 변경사항 취소, 읽기 일관성 제공 |

---

## 출제 포인트

1. **ACID 속성**: 원자성·일관성·격리성·지속성
2. **격리 수준 4가지**: READ UNCOMMITTED < READ COMMITTED < REPEATABLE READ < SERIALIZABLE
3. **Dirty Read**: READ UNCOMMITTED에서만 발생
4. **Phantom Read**: SERIALIZABLE에서만 해결됨
5. **공유 잠금 vs 배타 잠금**: 읽기 vs 쓰기
6. **교착상태**: 두 트랜잭션이 서로의 잠금을 기다리는 상태
7. **백업 유형**: 전체·증분·차등·트랜잭션 로그
8. **RTO vs RPO**: 복구 시간 목표 vs 복구 지점 목표
9. **ORM**: 객체-관계 매핑, SQL 자동 생성
10. **NoSQL 4유형**: Key-Value·Document·Column-Family·Graph
11. **REDO**: 커밋 변경사항 재적용, **UNDO**: 롤백·읽기 일관성
