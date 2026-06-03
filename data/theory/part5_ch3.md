# 5과목 3장: 데이터베이스 성능 개선

## 1. 성능 개선 방법론

### 1.0 성능 평가 지표

| 지표 | 설명 | 중요한 업무 유형 |
|------|------|------|
| **처리량(Throughput)** | 주어진 시간에 처리하는 작업량 | 대량 배치 처리 |
| **응답 속도(Response Time)** | 요청 후 화면에 결과를 보여주는 시간 | 온라인 웹 서비스 |

> **성능 저하의 핵심 원인**: 성능 문제의 **90% 이상은 CPU·메모리 부족이 아니라 비효율적 DB I/O(디스크 입출력)** 에서 발생. 하드웨어 증설만으로는 한계가 있음.

### 1.0-1 성능 튜닝 접근 순서

바깥(하드웨어)에서 안쪽(SQL)이 아닌, **안쪽에서 바깥쪽** 순서로 접근해야 효율적.

```
1. SQL 튜닝            ← 가장 먼저, 가장 효과 큼
   ↓
2. DB 오브젝트 튜닝    (인덱스 추가·재구성, 파티셔닝)
   ↓
3. DB 인스턴스 튜닝    (메모리·프로세스 설정)
   ↓
4. 하드웨어/OS 튜닝    ← 가장 마지막 수단
```

> **핵심**: 비효율적 SQL을 그대로 두고 하드웨어를 증설하는 것은 일시적 효과에 불과.

### 1.1 SQL 처리 과정

```
SQL 문장 → 파싱(Parsing) → 최적화(Optimization) → 실행(Execution) → 결과 반환
```

| 단계 | 설명 |
|------|------|
| 파싱 | 문법 검사, 공유 풀 확인(소프트 파싱/하드 파싱) |
| 최적화 | 옵티마이저가 실행 계획 생성 (비용 기반·규칙 기반) |
| 실행 | 실행 계획에 따라 데이터 접근 |

### 1.2 옵티마이저(Optimizer)

| 유형 | 설명 |
|------|------|
| 규칙 기반(RBO) | 미리 정의된 규칙에 따라 실행 계획 선택 (구식) |
| 비용 기반(CBO) | 통계 정보 기반으로 최소 비용 실행 계획 선택 (현대 표준) |

**비용 기반 옵티마이저 입력 정보**:
- 테이블 행 수, 블록 수
- 컬럼 선택도, 히스토그램
- 인덱스 정보
- 시스템 자원 정보

### 1.3 실행 계획(Execution Plan)

옵티마이저가 SQL을 실행하는 구체적 방법.

```sql
EXPLAIN SELECT * FROM TB_EMPLOYEE WHERE dept_id = 10;
-- 결과: 테이블 풀 스캔 or 인덱스 스캔 여부 확인
```

**실행 계획 주요 항목**:
- `TABLE ACCESS FULL`: 테이블 전체 스캔 (인덱스 미사용)
- `INDEX RANGE SCAN`: 인덱스 범위 스캔
- `INDEX UNIQUE SCAN`: 인덱스 단건 스캔 (PK, UNIQUE)
- `NESTED LOOPS`: 중첩 루프 조인
- `HASH JOIN`: 해시 조인
- `SORT MERGE JOIN`: 정렬 병합 조인

### 1.4 SQL 트레이스 (TKPROF)

SQL 실행의 **파싱(Parsing) → 실행(Execution) → 패치(Fetch)** 단계별 소요 시간·블록 읽기 횟수를 분석하는 유틸리티.

```sql
-- Oracle SQL 트레이스 활성화
ALTER SESSION SET SQL_TRACE = TRUE;
-- 실행할 SQL...
ALTER SESSION SET SQL_TRACE = FALSE;
-- TKPROF로 트레이스 파일 분석
-- tkprof trace_file.trc output_file.txt sys=no sort=exeela
```

| 분석 항목 | 설명 |
|------|------|
| Parse | 파싱 횟수·시간 → 하드 파싱 빈번하면 바인딩 변수 도입 |
| Execute | 실행 횟수·시간 |
| Fetch | 결과 행 패치 횟수·시간 |
| Physical Reads | 디스크 I/O 횟수 → 클수록 튜닝 필요 |

### 1.5 동적 SQL vs 정적 SQL

| 구분 | 설명 | 성능 |
|------|------|------|
| **동적(Dynamic) SQL** | 매번 SQL 문자열을 조합하여 실행 | 매번 하드 파싱 → 심각한 성능 저하 |
| **정적(Static) SQL** | 바인딩 변수 사용, 실행 계획 재사용 | 소프트 파싱 → 성능 우수 |

```sql
-- 동적 SQL (비권장) — emp_id 값마다 다른 SQL로 인식, 매번 하드 파싱
String sql = "SELECT * FROM TB_EMPLOYEE WHERE emp_id = " + empId;

-- 정적 SQL (권장) — 한 번 파싱 후 재사용
String sql = "SELECT * FROM TB_EMPLOYEE WHERE emp_id = ?";  -- 바인딩 변수
```

---

## 2. 조인(Join)

### 2.1 조인 유형

| 조인 유형 | 설명 |
|------|------|
| INNER JOIN | 두 테이블의 교집합 (조건에 맞는 행만) |
| LEFT OUTER JOIN | 왼쪽 테이블 전체 + 오른쪽 일치 행 |
| RIGHT OUTER JOIN | 오른쪽 테이블 전체 + 왼쪽 일치 행 |
| FULL OUTER JOIN | 양쪽 테이블 모두 (합집합) |
| CROSS JOIN | 두 테이블의 카티전 곱 |
| SELF JOIN | 같은 테이블 간 조인 (계층 구조 조회) |

### 2.2 조인 알고리즘

| 알고리즘 | 동작 방식 | 적합 상황 |
|------|------|------|
| **Nested Loop Join** | 선행(Driving) 집합에서 후행 집합으로 인덱스를 이용해 건건이 탐침 | OLTP, 소량 데이터, 인덱스 있을 때 (부분 범위 처리) |
| **Sort Merge Join** | 두 테이블을 조인 컬럼으로 각각 정렬 후 병합 | 대량 데이터, 등호 조인, 인덱스 없을 때 |
| **Hash Join** | 작은 집합을 메모리 해시 맵(Build Input)으로 구성 후 큰 집합과 매칭 | 대량 데이터, 배치 처리, 인덱스 없을 때 |
| **Star Join** | 차원(Dimension) 테이블들의 카테시안 곱 먼저 생성 후 대용량 팩트 테이블과 조인 | DW 환경, 차원 테이블이 작을 때 |
| **Hybrid Join** | 랜덤 I/O를 줄이기 위해 ROWID를 정렬 후 탐침 | 랜덤 I/O가 많은 Nested Loop 개선 |

> **핵심**:
> - 소량+인덱스+OLTP → Nested Loop (부분 범위 처리)
> - 대량+등호+인덱스 없음+배치 → Hash Join
> - 대량+이미 정렬됨 → Sort Merge Join
> - DW 스타 스키마 → Star Join

### 2.2-1 조인 알고리즘 선택 기준표

| 조건 | 권장 알고리즘 | 이유 |
|------|------|------|
| 소량(수천 행↓) + 내부 테이블 인덱스 | Nested Loop | 인덱스로 내부 테이블 빠르게 탐색 |
| 대량 + 등호 조인 + 인덱스 없음 | Hash Join | 해시 테이블로 O(n) 매칭 |
| 대량 + 이미 정렬된 데이터 | Sort Merge | 정렬 비용 없이 병합 |
| 조인 조건이 부등호(<,>) | Nested Loop | 해시·정렬 적용 어려움 |

### 2.3 조인 최적화 원칙

1. **조인 컬럼에 인덱스** 생성
2. **드라이빙 테이블**을 작은 테이블로 선택 (Nested Loop)
3. **조인 조건은 인덱스 컬럼에** 적용
4. **불필요한 조인 제거**: 서브쿼리로 대체 검토

---

## 3. 애플리케이션 성능 개선

### 3.1 인덱스 활용

**인덱스가 사용되지 않는 경우**:
```sql
-- 인덱스 미사용 (함수 적용)
WHERE UPPER(emp_name) = 'KIM'  -- 함수기반 인덱스 필요

-- 인덱스 미사용 (묵시적 형변환)
WHERE emp_id = '100'  -- emp_id가 NUMBER일 때

-- 인덱스 미사용 (부정 조건)
WHERE dept_id <> 10

-- 인덱스 미사용 (와일드카드 앞 사용)
WHERE emp_name LIKE '%KIM'  -- 앞에 %

-- 인덱스 미사용 (NULL 비교)
WHERE salary IS NULL  -- 단, IS NOT NULL은 가능한 경우도 있음

-- 인덱스 미사용 (OR 조건)
WHERE dept_id = 10 OR salary > 5000000  -- 각 컬럼에 개별 인덱스 필요
```

### 3.1-1 실행 계획 주요 연산자

실행 계획(Execution Plan)은 옵티마이저가 SQL을 처리하는 순서·방법을 보여준다.

| 연산자 | 설명 | 의미 |
|------|------|------|
| TABLE ACCESS FULL | 테이블 전체 스캔 | 인덱스 미사용 (풀 스캔) |
| INDEX RANGE SCAN | 인덱스 범위 검색 | 범위 조건(BETWEEN, <, >) |
| INDEX UNIQUE SCAN | 인덱스 단건 조회 | PK/UNIQUE 컬럼 등호 조건 |
| INDEX FULL SCAN | 인덱스 전체 스캔 | 인덱스만 읽는 경우 (커버링 인덱스) |
| TABLE ACCESS BY ROWID | ROWID로 직접 접근 | 비클러스터드 인덱스 → 테이블 조회 |
| NESTED LOOPS | 중첩 루프 조인 | 소량 데이터 조인 |
| HASH JOIN | 해시 조인 | 대량 데이터 등호 조인 |

> **EXPLAIN 활용**: `EXPLAIN SELECT ...` 로 실행 계획 확인, TABLE ACCESS FULL이 보이면 인덱스 추가 검토.

### 3.2 SQL 튜닝 기법

| 기법 | 설명 |
|------|------|
| 선택적 인덱스 활용 | 선택도 높은 컬럼에 인덱스 생성 |
| 복합 인덱스 순서 최적화 | 자주 사용되는 컬럼을 앞에 배치 |
| 파티션 프루닝 | 파티션 키를 WHERE 조건에 사용 |
| 통계 정보 갱신 | `ANALYZE TABLE`, `GATHER_STATS` |
| 힌트(Hint) 사용 | 옵티마이저에게 실행 계획 강제 지정 |

### 3.2-1 온라인 프로그램 튜닝: 부분 범위 처리

온라인 서비스는 **응답 속도**가 목표 → 전체 데이터를 다 읽지 않고, 필요한 만큼만 즉시 응답.

```sql
-- 부분 범위 처리 (게시판 목록) — 인덱스로 원하는 범위만 읽음
SELECT * FROM TB_BOARD
WHERE board_type = 'NOTICE'
  AND reg_dt >= TRUNC(SYSDATE - 30)
ORDER BY reg_dt DESC
FETCH FIRST 20 ROWS ONLY;  -- 20건만 읽고 즉시 응답
```

| 구분 | 방식 | 목표 |
|------|------|------|
| **온라인 (부분 범위)** | 인덱스 활용, 필요한 만큼만 즉시 응답 | 응답 속도 최소화 |
| **배치 (전체 범위)** | 전체 데이터 처리, 집합적 SQL | 처리량 최대화 |

> **주의**: 온라인 프로그램에서 불필요한 함수 사용 → 컨텍스트 전환·내부 DB 콜 연쇄 발생 → 성능 저하.

### 3.2-2 배치 프로그램 튜닝: 배열 처리 & 집합적 SQL

배치는 **처리량**이 목표 → 건건이 루프를 도는 절차적 방식 지양, 집합적 처리 도입.

```sql
-- 나쁜 예: 절차적 루프 (삽으로 건물 짓기)
FOR rec IN (SELECT * FROM TB_SOURCE) LOOP
  INSERT INTO TB_TARGET VALUES(rec.id, rec.name, ...);  -- 건건이 DB 콜
END LOOP;

-- 좋은 예: 집합적 SQL (포크레인)
INSERT INTO TB_TARGET (id, name, ...)
SELECT id, name, ... FROM TB_SOURCE;  -- 한 번의 DB 콜

-- 배열 처리 (Array Processing): 수천 건을 배열에 담아 일괄 처리
FORALL i IN 1..data_array.COUNT
  INSERT INTO TB_TARGET VALUES data_array(i);
```

### 3.2-3 분석 함수 (Analytic Functions)

복잡한 절차적 로직을 SQL 단일 문장으로 처리하는 강력한 기능.

#### 집계 분석 함수

```sql
-- ROLLUP: 소계·합계 자동 생성
SELECT dept_id, job, SUM(salary)
FROM TB_EMPLOYEE
GROUP BY ROLLUP(dept_id, job);
-- → 부서별 직종별 합계 + 부서별 합계 + 전체 합계

-- CUBE: 가능한 모든 소계 조합 생성
SELECT dept_id, job, SUM(salary)
FROM TB_EMPLOYEE
GROUP BY CUBE(dept_id, job);
-- → ROLLUP + 직종별 합계까지 모두

-- GROUPING SETS: 원하는 조합만 지정
SELECT dept_id, job, SUM(salary)
FROM TB_EMPLOYEE
GROUP BY GROUPING SETS((dept_id), (job), ());
```

#### 행 간 분석 함수

```sql
-- LAG: 이전 행 값 참조
SELECT emp_id, salary,
       LAG(salary, 1) OVER (ORDER BY hire_date) AS prev_salary
FROM TB_EMPLOYEE;

-- LEAD: 다음 행 값 참조
SELECT emp_id, salary,
       LEAD(salary, 1) OVER (ORDER BY hire_date) AS next_salary
FROM TB_EMPLOYEE;

-- ROW_NUMBER / RANK / DENSE_RANK: 순위
SELECT emp_id, salary,
       RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS salary_rank
FROM TB_EMPLOYEE;

-- 누적 합계 (Running Total)
SELECT emp_id, salary,
       SUM(salary) OVER (ORDER BY hire_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cum_salary
FROM TB_EMPLOYEE;
```

> **핵심**: 분석 함수로 소계·랭킹·이전/다음 행 참조 등을 SQL 한 문장으로 처리 → 애플리케이션 레이어의 반복 DB 콜 제거.

### 3.3 N+1 문제

ORM 사용 시 N개의 부모 엔터티 조회 후 각각 자식을 추가 조회하는 문제.

**해결**: Eager Loading (JOIN FETCH), 배치 로딩, 쿼리 직접 작성

### 3.4 커넥션 풀(Connection Pool)

데이터베이스 연결을 미리 생성하여 재사용하는 기법.
- 연결 생성·해제 비용 절감
- 최대 연결 수 제한으로 DB 보호

---

## 4. 서버 성능 개선

### 4.1 메모리 튜닝

| 메모리 영역 | 설명 |
|------|------|
| 버퍼 풀(Buffer Pool) | 디스크 I/O를 줄이기 위한 데이터 캐시 |
| 공유 풀(Shared Pool) | SQL 파싱 결과, 데이터 딕셔너리 캐시 |
| 정렬 영역 | ORDER BY, GROUP BY 정렬 작업 |
| PGA | 세션별 독립 메모리 (정렬, 해시 등) |

> **핵심**: 버퍼 풀 히트율(Buffer Hit Ratio)을 높이면 디스크 I/O가 감소하여 성능 향상.

### 4.2 I/O 튜닝

- **RAID**: 여러 디스크를 묶어 성능·신뢰성 향상
  - RAID 0: 스트라이핑 (성능↑, 안전성↓)
  - RAID 1: 미러링 (안전성↑, 용량 절반)
  - RAID 5: 패리티 분산 (성능·안전성 균형)
  - RAID 10: RAID 0+1 조합 (고성능·고가용성)
- **SSD vs HDD**: SSD는 랜덤 I/O에 압도적으로 빠름
- **파티셔닝**: 데이터 분산으로 I/O 부하 분산

### 4.2-1 파티션 프루닝 (Partition Pruning)

수억 건의 대용량 테이블을 파티션으로 분할하면, WHERE 조건이 파티션 키와 일치할 때 **해당 파티션만 스캔**하여 I/O 대폭 감소.

```sql
-- 연월 파티셔닝된 테이블
CREATE TABLE TB_SALES (
  sale_id NUMBER,
  sale_date DATE,
  amount NUMBER
) PARTITION BY RANGE(sale_date) (
  PARTITION p_2024_01 VALUES LESS THAN (DATE '2024-02-01'),
  PARTITION p_2024_02 VALUES LESS THAN (DATE '2024-03-01'),
  ...
);

-- 파티션 프루닝 발동 (2024년 1월 파티션만 스캔)
SELECT * FROM TB_SALES WHERE sale_date BETWEEN DATE '2024-01-01' AND DATE '2024-01-31';
```

| 파티셔닝 유형 | 설명 | 사용 예 |
|------|------|------|
| **Range** | 연속적인 값 범위로 분할 | 연월별 판매 데이터 |
| **List** | 특정 값 목록으로 분할 | 지역코드(서울/부산/대구) |
| **Hash** | 해시 함수로 균등 분산 | 균일한 분산이 필요할 때 |
| **Composite** | Range+Hash 등 복합 적용 | 연월+지역 2차원 분할 |

> **추가 효과**: 파티션별 병렬 DML(`PARALLEL`) 처리로 대량 입력·수정·삭제 성능 향상. 백업·복구도 파티션 단위로 가능.

### 4.3 병렬 처리

대용량 쿼리를 여러 프로세스/스레드로 분할 처리.

```sql
SELECT /*+ PARALLEL(TB_SALES, 4) */ *
FROM TB_SALES WHERE sale_date >= '2024-01-01';
```

### 4.4 쿼리 캐시

자주 실행되는 동일 쿼리 결과를 캐시하여 재사용.
- 장점: 반복 쿼리 성능 향상
- 단점: 데이터 변경 시 캐시 무효화 필요

### 4.5 래치 튜닝 (Latch Tuning)

**래치(Latch)**: SGA의 공유 자원(버퍼 캐시·프리리스트 등)에 대한 경량화된 잠금 메커니즘.

OLTP 환경에서 다수의 동시 사용자가 같은 SGA 자원에 접근 → **래치 경합(Latch Contention)** 발생 → 성능 저하.

| 튜닝 방법 | 설명 |
|------|------|
| **프리리스트(Freelist) 확장** | INSERT가 많은 테이블의 여유 공간 목록(Freelist)을 다수 생성 → 동시 INSERT 경합 감소 |
| **버퍼 캐시 조정** | DB 버퍼 캐시 크기 증가 → 물리적 디스크 I/O 감소 |
| **트랜잭션 옵션 조정** | 잠금 유지 시간 최소화, 필요 이상의 잠금 범위 축소 |

```sql
-- 프리리스트 설정 (Oracle)
ALTER TABLE TB_ORDERS STORAGE(FREELISTS 4);  -- 4개 프리리스트
```

> **핵심**: OLTP 동시 접속 환경에서 래치·프리리스트 경합은 심각한 병목 원인. SQL 튜닝으로 해결 안 될 때 인스턴스 튜닝 적용.

---

## 출제 포인트

1. **성능 평가 지표**: 처리량(배치 목표) vs 응답 속도(온라인 목표)
2. **성능 저하 원인**: 90% 이상 비효율적 DB I/O → SQL 튜닝이 최우선
3. **튜닝 접근 순서**: SQL → DB 오브젝트 → DB 인스턴스 → 하드웨어/OS
4. **TKPROF**: SQL 트레이스 파일 분석 — Parse·Execute·Fetch·Physical Reads
5. **동적 SQL vs 정적 SQL**: 동적=매번 하드 파싱(부하), 정적=바인딩 변수로 소프트 파싱(성능 우수)
6. **옵티마이저 유형**: 규칙 기반(RBO) vs 비용 기반(CBO) — CBO가 현대 표준
7. **조인 알고리즘 5가지**: Nested Loop(OLTP/소량) · Sort Merge · Hash Join(배치/대량) · Star Join(DW) · Hybrid Join(랜덤I/O 감소)
8. **Star Join**: DW에서 차원 테이블 카테시안 곱 후 팩트 테이블 조인
9. **부분 범위 처리**: 온라인 응답속도 최적화 — 인덱스로 필요한 만큼만 즉시 응답
10. **배열 처리/집합적 SQL**: 배치 처리량 최적화 — 건건이 루프 대신 집합 SQL 또는 FORALL
11. **분석 함수**: ROLLUP·CUBE·GROUPING SETS (소계/합계), LAG/LEAD (이전/다음 행), RANK/ROW_NUMBER (순위)
12. **파티션 프루닝**: WHERE 조건이 파티션 키이면 해당 파티션만 스캔 → I/O 대폭 감소
13. **파티셔닝 유형**: Range·List·Hash·Composite — 병렬 DML·관리 가용성 향상
14. **래치 튜닝**: OLTP 동시 접속 시 래치 경합 → 프리리스트(Freelist) 확장으로 해소
15. **인덱스 미사용 케이스**: 함수 적용, 묵시적 형변환, 부정 조건, 앞 와일드카드
16. **버퍼 풀 히트율**: 높을수록 디스크 I/O 감소
17. **N+1 문제**: ORM 사용 시 발생, Eager Loading으로 해결
