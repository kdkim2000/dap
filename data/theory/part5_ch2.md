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

### 1.3 데이터베이스 시작/종료 단계

#### 시작(Startup) 3단계

| 단계 | 동작 |
|------|------|
| **1단계: 인스턴스 기동** | 초기화 매개변수 파일(init.ora) 읽기 → SGA 메모리 할당 + 백그라운드 프로세스 생성 |
| **2단계: 마운트(Mount)** | 컨트롤 파일 점검, 데이터 파일·리두 로그 파일 위치 확인 (사용자 접속 불가) |
| **3단계: 오픈(Open)** | 데이터 파일 오픈, 미완료 트랜잭션 자동 복구(Rollback/Redo) → 일반 사용자 접속 가능 |

#### 종료(Shutdown) 3단계

| 단계 | 동작 |
|------|------|
| **1단계: 닫기(Close)** | 오픈된 데이터 파일·리두 로그 파일 닫기 |
| **2단계: 언마운트(Unmount)** | 컨트롤 파일 언마운트 |
| **3단계: 인스턴스 종료** | SGA 해제, 백그라운드 프로세스 종료 |

> **핵심**: 시작 순서는 인스턴스 기동 → 마운트 → 오픈. 오픈 시점에 자동 복구 수행.

### 1.4 데이터 딕셔너리 (Data Dictionary)

데이터베이스 내 모든 객체(테이블·인덱스·뷰·제약조건·사용자·권한)의 **메타데이터**를 저장하는 **읽기 전용** 저장소.

| 특징 | 설명 |
|------|------|
| 자동 관리 | DDL 실행 시 DBMS가 자동 갱신 |
| 읽기 전용 | 사용자가 직접 수정 불가 (SELECT만 가능) |
| 뷰로 제공 | Oracle: `USER_TABLES`, `ALL_COLUMNS`, `DBA_INDEXES` 등 |

```sql
-- 현재 사용자의 테이블 목록 조회
SELECT table_name FROM USER_TABLES;
-- 컬럼 정보 조회
SELECT column_name, data_type FROM USER_TAB_COLUMNS WHERE table_name = 'TB_EMPLOYEE';
```

### 1.5 물리적 저장구조

| 단위 | 설명 |
|------|------|
| **블록(Block)** | 디스크 I/O의 최소 단위. 업무 특성(OLTP: 소블록, DW: 대블록)에 따라 설정 |
| **익스텐트(Extent)** | 연속된 블록의 모음 |
| **세그먼트(Segment)** | 테이블·인덱스 같은 논리적 저장 단위 (익스텐트의 집합) |
| **테이블스페이스** | 세그먼트들의 논리적 저장 공간 |

#### PCTFREE와 블록 체이닝

- **PCTFREE**: 블록 내 UPDATE를 위해 예약하는 빈 공간 비율
- **블록 체이닝(Migration)**: UPDATE로 행 크기가 늘어나 현재 블록에 저장 불가 → 다른 블록에 분산 저장 → I/O 증가

```
[블록] | 기존 데이터 | ← PCTFREE 예약 공간 |
UPDATE 시 행이 커지면 → 체이닝 방지를 위해 PCTFREE를 넉넉히 설정
```

> **핵심**: PCTFREE를 적절히 설정하지 않으면 블록 체이닝 발생 → 성능 저하.

### 1.6 메모리 구조 (SGA: System Global Area)

모든 서버 프로세스와 백그라운드 프로세스가 공유하는 메모리 영역.

| 구성 요소 | 역할 |
|------|------|
| **DB 버퍼 캐시** | 디스크에서 읽은 데이터 블록을 메모리에 캐싱 → I/O 감소 |
| **공유 풀(Shared Pool)** | SQL 파싱 결과(실행 계획)·데이터 딕셔너리 캐싱 → 소프트 파싱 지원 |
| **로그 버퍼** | Redo 로그 데이터를 로그 파일에 기록하기 전 임시 저장 |

### 1.7 백그라운드 프로세스

| 프로세스 | 이름 | 역할 |
|------|------|------|
| **DBWR** | Database Writer | 더티 버퍼(변경된 캐시)를 디스크 데이터 파일에 기록 |
| **LGWR** | Log Writer | 로그 버퍼의 Redo 내용을 Redo 로그 파일에 기록 (커밋 시 반드시 수행) |
| **PMON** | Process Monitor | 실패한 사용자 프로세스 정리, 락 해제 |
| **SMON** | System Monitor | 인스턴스 복구(시작 시), 임시 세그먼트 정리 |

---

## 2. 데이터 액세스

### 2.0 옵티마이저와 SQL 파싱

#### 옵티마이저(Optimizer)

SQL 실행 계획을 수립하는 핵심 엔진.

| 유형 | 설명 |
|------|------|
| **규칙 기반(RBO)** | 사전 정의된 규칙(인덱스 유무 등)에 따라 실행 계획 결정 |
| **비용 기반(CBO)** | 데이터 통계·분포도 분석, 최저 비용 경로 선택 → 현재 표준 |

#### 하드 파싱 vs 소프트 파싱

| 구분 | 설명 | 성능 영향 |
|------|------|------|
| **하드 파싱(Hard Parsing)** | SQL 문법 검사 + 실행 계획을 매번 새로 생성 | 시스템 부하 매우 큼 |
| **소프트 파싱(Soft Parsing)** | 공유 풀(라이브러리 캐시)의 기존 실행 계획 재사용 | 부하 최소 |

```sql
-- 하드 파싱 유발 (매번 다른 SQL 문자열)
SELECT * FROM TB_EMPLOYEE WHERE emp_id = 1001;  -- 실행 계획 새로 생성
SELECT * FROM TB_EMPLOYEE WHERE emp_id = 1002;  -- 실행 계획 또 새로 생성

-- 소프트 파싱 유도 (바인딩 변수 사용)
SELECT * FROM TB_EMPLOYEE WHERE emp_id = :emp_id;  -- 실행 계획 한 번만 생성, 재사용
```

> **핵심**: 동적 SQL은 매번 하드 파싱 → 심각한 성능 저하. 바인딩 변수 사용으로 소프트 파싱 유도 필수.

#### 힌트(Hint)

옵티마이저가 잘못된 실행 계획을 선택할 때, 개발자가 **직접 실행 경로를 지정**하는 방법.

```sql
-- 인덱스 사용 강제
SELECT /*+ INDEX(e idx_emp_dept) */ * FROM TB_EMPLOYEE e WHERE dept_id = 10;
-- 풀 테이블 스캔 강제
SELECT /*+ FULL(e) */ * FROM TB_EMPLOYEE e;
-- 해시 조인 강제
SELECT /*+ USE_HASH(e d) */ * FROM TB_EMPLOYEE e JOIN TB_DEPT d ON e.dept_id = d.dept_id;
```

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

### 2.4 스토어드 프로시저 (Stored Procedure)

일련의 처리 로직을 DB 내부에 미리 컴파일하여 저장하는 객체.

| 장점 | 설명 |
|------|------|
| 파싱 부하 최소화 | 한 번 컴파일 후 재사용 → 소프트 파싱 |
| 네트워크 트래픽 감소 | 다수 SQL을 한 번의 호출로 처리 |
| 보안 향상 | 테이블 직접 접근 대신 프로시저를 통해 제어 |
| 재사용성 | 여러 애플리케이션에서 공유 가능 |

#### 설계 원칙: 높은 응집도, 낮은 결합도

- **높은 응집도**: 하나의 프로시저는 하나의 업무 기능만 담당
- **낮은 결합도**: 다른 프로시저나 객체에 대한 의존성 최소화

```sql
CREATE OR REPLACE PROCEDURE sp_update_salary (
  p_emp_id    IN NUMBER,
  p_increase  IN NUMBER
) AS
BEGIN
  UPDATE TB_EMPLOYEE SET salary = salary + p_increase WHERE emp_id = p_emp_id;
  COMMIT;
END;
```

### 2.5 트리거 (Trigger)

특정 DML(INSERT/UPDATE/DELETE) 이벤트가 발생하면 자동으로 실행되는 객체.

| 특징 | 설명 |
|------|------|
| 자동 실행 | 이벤트 발생 시 명시적 호출 없이 수행 |
| 업무 규칙 강제 | 복잡한 제약조건 자동 적용 |
| 감사 추적 | 변경 이력 자동 기록 |

```sql
CREATE OR REPLACE TRIGGER trg_salary_audit
AFTER UPDATE OF salary ON TB_EMPLOYEE
FOR EACH ROW
BEGIN
  INSERT INTO TB_SALARY_AUDIT(emp_id, old_salary, new_salary, change_dt)
  VALUES (:OLD.emp_id, :OLD.salary, :NEW.salary, SYSDATE);
END;
```

> **⚠️ 트리거 주의**: 트리거가 또 다른 트리거를 발동하는 **연쇄 발동(Cascading Trigger)** 발생 가능 → 예상치 못한 성능 저하·무한 루프 위험. 남용 금지.

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

#### 비관적 vs 낙관적 동시성 제어

| 구분 | 설명 | 방법 |
|------|------|------|
| **비관적 동시성 제어** | 다른 트랜잭션이 동시 수정한다고 가정 → 조회 시점부터 락 | `SELECT FOR UPDATE` |
| **낙관적 동시성 제어** | 동시 수정이 드물다고 가정 → 업데이트 시점에만 충돌 확인 | 버전 컬럼 비교 |

#### 락 에스컬레이션 (Lock Escalation)

행(Row) 단위 락이 과다하게 누적되면 시스템 관리 오버헤드 증가 → 자동으로 페이지 또는 테이블 수준으로 락 범위 확대.

| 장점 | 단점 |
|------|------|
| 시스템 락 관리 부하 감소 | 동시성 저하 (더 넓은 범위 차단) |

> **교착상태(Deadlock)**: 두 트랜잭션이 서로의 잠금을 기다려 무한 대기. 예방: 락 유지 시간 최소화, NOWAIT 옵션, 시퀀스 객체 활용.

### 3.4 격리 수준(Isolation Level)

| 격리 수준 | Dirty Read | Non-repeatable Read | Phantom Read |
|------|:---:|:---:|:---:|
| READ UNCOMMITTED | 발생 | 발생 | 발생 |
| READ COMMITTED | 없음 | 발생 | 발생 |
| REPEATABLE READ | 없음 | 없음 | 발생 |
| SERIALIZABLE | 없음 | 없음 | 없음 |

### 3.5 분산 트랜잭션 (2-Phase Commit)

네트워크로 분산된 노드 간 트랜잭션에서 **모든 노드가 완벽히 성공하거나 롤백**되도록 보장.

| 단계 | 과정 |
|------|------|
| **1단계: 준비(Prepare)** | 코디네이터가 각 참여 노드에 "커밋 가능?" 질문 → 모든 노드 "OK" 응답 대기 |
| **2단계: 커밋(Commit)** | 모든 노드가 OK → 코디네이터가 커밋 지시. 하나라도 NO → 전체 롤백 |

```
[코디네이터] ──PREPARE──→ [노드A] [노드B]
              ←──ACK(OK)──
              ──COMMIT──→  [노드A] [노드B]
```

> **핵심**: 분산 DB의 병행 투명성을 구현하는 핵심 기술. 글로벌 일관성 보장.

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

| 구분 | 설명 | 기록 시점 |
|------|------|------|
| **REDO 로그** | 커밋된 변경사항 재적용 (장애 후 Roll Forward 복구) | 변경 발생 시 로그 버퍼 → LGWR가 Redo 로그 파일에 기록 |
| **UNDO 로그** | 미완료 트랜잭션 취소(Rollback), 읽기 일관성 제공 (구버전 데이터 제공) | 변경 전 데이터 보관 |

#### Redo 로그 파일

- **순환 덮어쓰기**: Redo 로그 파일은 순환 방식으로 재사용
- **아카이브 모드**: 다 찬 Redo 로그 파일을 아카이브 보관 → 특정 시점 복구 가능
- **비아카이브 모드**: 아카이브 없이 순환 → 마지막 백업 시점까지만 복구 가능

```
[DB 버퍼 캐시] --변경--> [로그 버퍼] --LGWR--> [Redo 로그 파일]
                                              --아카이브--> [Archive Log]
장애 발생 → SMON이 Redo 로그 적용(Roll Forward) → 미완료 트랜잭션 Undo(Rollback)
```

---

## 출제 포인트

1. **DB 시작 3단계**: 인스턴스 기동(SGA+프로세스) → 마운트(컨트롤 파일 점검) → 오픈(자동 복구 후 사용자 접속)
2. **데이터 딕셔너리**: 메타데이터 저장소, 읽기 전용, DBMS가 자동 관리
3. **PCTFREE**: UPDATE 확장 대비 블록 내 예약 공간 → 블록 체이닝 방지
4. **SGA 3요소**: DB 버퍼 캐시(데이터 캐싱) + 공유 풀(실행 계획 캐싱) + 로그 버퍼(Redo 임시 저장)
5. **백그라운드 프로세스**: DBWR(더티 버퍼→디스크), LGWR(로그 버퍼→파일), PMON(프로세스 정리), SMON(시스템 복구)
6. **하드 파싱 vs 소프트 파싱**: 매번 실행 계획 생성 vs 캐시 재사용 — 바인딩 변수로 소프트 파싱 유도
7. **힌트(Hint)**: 옵티마이저 실행 경로를 개발자가 직접 지정 `/*+ INDEX(...) */`
8. **스토어드 프로시저**: 높은 응집도·낮은 결합도, 파싱 부하 최소화·보안 향상
9. **트리거 주의**: 연쇄 발동(Cascading) 위험 — 남용 금지
10. **ACID 속성**: 원자성·일관성·격리성·지속성
11. **비관적 동시성**: SELECT FOR UPDATE, 낙관적 동시성: 버전 컬럼 비교
12. **락 에스컬레이션**: 행→페이지→테이블로 락 범위 상향, 동시성 저하
13. **교착상태**: 서로의 락 대기 → NOWAIT 옵션·시퀀스 활용으로 예방
14. **격리 수준 4가지**: READ UNCOMMITTED < READ COMMITTED < REPEATABLE READ < SERIALIZABLE
15. **2-Phase Commit**: 준비(Prepare) → 커밋(Commit). 분산 DB 글로벌 일관성 보장
16. **REDO 로그**: 커밋 변경 재적용(Roll Forward), LGWR가 기록, 아카이브 모드로 특정 시점 복구
17. **UNDO 로그**: 미완료 트랜잭션 롤백 + 읽기 일관성(구버전 데이터) 제공
18. **백업 유형**: 전체·증분·차등·트랜잭션 로그
19. **RTO vs RPO**: 복구 시간 목표 vs 복구 지점 목표
20. **NoSQL 4유형**: Key-Value·Document·Column-Family·Graph
