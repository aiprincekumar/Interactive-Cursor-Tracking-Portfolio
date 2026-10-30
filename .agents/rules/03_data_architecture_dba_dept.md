# Department 03: Data Architecture, DBA & Storage

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/archive/universal_rules.md) (Archived canonical reference)

---

## 🗄️ 1. Mission & Department Scope

The Data Architecture, DBA & Storage Department (Dept 03) oversees the complete data lifecycle, data models, persistence layers, relational and NoSQL databases, schema migration pipelines, indexing strategies, and query performance optimization across the application landscape.

---

## 📐 2. Relational Schema & Integrity Standards

### 2.1 Data Integrity & Constraints
- Every table must have an explicit primary key (`PRIMARY KEY`, e.g., `BIGINT GENERATED ALWAYS AS IDENTITY` or `UUID v7`).
- Referential Integrity: Enforce explicit `FOREIGN KEY` constraints on all relationships with appropriate deletion policies (`ON DELETE RESTRICT` by default, `CASCADE` where domain logic dictates).
- Column Type Precision:
  - Financial data: Never use `FLOAT` or `DOUBLE`; strictly use `DECIMAL(14, 4)` or `NUMERIC`.
  - Timestamps: Strictly use timezone-aware `TIMESTAMPTZ`.
  - Textual data: Use bounded `VARCHAR(n)` or `TEXT` with domain check constraints.

---

## ⚡ 3. Indexing & Performance Strategy

### 3.1 Indexing Guidelines
- **Selectivity First:** When constructing composite indexes, position the column with the highest cardinality first.
- **Covering Indexes:** Where appropriate, append frequently queried columns using `INCLUDE` clauses to facilitate index-only scans.
- **Index Hygiene:** Avoid creating redundant or unused indexes, as they introduce substantial write overhead during `INSERT`, `UPDATE`, and `DELETE`.
- **Mandatory EXPLAIN ANALYZE Audit:** Benchmark complex queries using `EXPLAIN ANALYZE` prior to production release to eliminate unexpected sequential table scans.

```sql
-- Example: Performant indexing and timestamp partitioning
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    order_status VARCHAR(20) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Composite index ordered by user and creation recency
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);

-- Partial index targeting active lifecycle states
CREATE INDEX idx_orders_active ON orders(order_id) WHERE order_status IN ('PENDING', 'PROCESSING');
```

---

## 🔄 4. Zero-Downtime Migration Protocol

- **Expand and Contract Pattern:**
  1. **Phase 1 (Expand):** Add the new column as nullable or with a default value. Application code supports both legacy and new schema paths.
  2. **Phase 2 (Backfill):** Populate historical records via an asynchronous background batch job.
  3. **Phase 3 (Contract):** Enforce `NOT NULL` constraints on the new column and safely drop the deprecated column.
- Every migration must provide paired `UP` (Apply) and `DOWN` (Rollback) executable scripts.
- Prohibit long-running exclusive locks during peak operational windows.

---

## 🧑‍💼 5. Departmental Roles & Dedicated Subagents

To enforce specialization of labor and enterprise rigor, 4 dedicated enterprise job roles and their corresponding subagent archetypes are established:

### 5.1 Relational Database Administrator (Database Administrator)
- **Dedicated Subagent Role:** `Database Administrator`
- **Scope & Responsibilities:**
  - Architect normalized relational schemas (3NF/BCNF) and tune database engine parameters.
  - Enforce referential integrity via foreign key constraints, check constraints, and table invariants.
  - Manage database connection pooling and configure transactional isolation levels.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Database Administrator",
  "Prompt": "Design normalized relational schemas (3NF/BCNF), establish foreign key constraints, enforce data integrity invariants, and oversee database engine configuration."
}
```

### 5.2 NoSQL & Vector DB Specialist (Vector Database Specialist)
- **Dedicated Subagent Role:** `Vector Database Specialist`
- **Scope & Responsibilities:**
  - Design NoSQL document, key-value, and wide-column storage architectures.
  - Optimize HNSW and IVFFlat index structures for vector storage (pgvector, Pinecone, Milvus).
  - Manage unstructured embedding pipelines and hybrid search query execution.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Vector Database Specialist",
  "Prompt": "Design NoSQL and vector storage architectures, optimize HNSW/IVFFlat index structures for pgvector and vector databases, and manage unstructured embedding pipelines."
}
```

### 5.3 Data Migration & Pipeline Engineer (Data Migration Specialist)
- **Dedicated Subagent Role:** `Data Migration Specialist`
- **Scope & Responsibilities:**
  - Execute zero-downtime database migrations via the Expand-and-Contract paradigm.
  - Author reversible migration scripts equipped with atomic rollback safeguards.
  - Verify data parity and consistency across operational databases during migrations.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Data Migration Specialist",
  "Prompt": "Implement zero-downtime expand-and-contract database migrations, author reversible migration scripts with atomic rollback safeguards, and validate data parity."
}
```

### 5.4 Database Performance & Indexing Tuner (Query Performance Tuner)
- **Dedicated Subagent Role:** `Query Performance Tuner`
- **Scope & Responsibilities:**
  - Profile slow queries using `EXPLAIN ANALYZE` to identify execution bottlenecks.
  - Formulate optimal composite, partial, and covering index strategies.
  - Eliminate N+1 query patterns and optimize database I/O throughput.
- **Standard Subagent Invocation Directive:**
```json
{
  "TypeName": "self",
  "Role": "Query Performance Tuner",
  "Prompt": "Analyze slow queries using EXPLAIN ANALYZE, design optimal composite and partial indexes, eliminate N+1 query patterns, and tune connection pooling parameters."
}
```

---

## 🚦 6. Department Handoff & Verification Gates

1. **Gate 3-A (N+1 Query Prevention):** ORM relationships must enforce eager loading (`include` / `select_related`) in all query paths.
2. **Gate 3-B (Migration Verification):** Migration scripts must be verified against local database instances before staging deployment.
3. **Downstream Handoff:** Upon schema approval, ownership transfers officially to **Dept 06: Backend & API Engineering**.
