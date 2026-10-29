﻿# Department 03: Data Architecture, DBA & Storage (डेटा वास्तुकला एवं डेटाबेस प्रशासन विभाग)

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/universal_rules.md)

---

## 🗄️ 1. विभाग का मिशन एवं कार्यक्षेत्र (Mission & Department Scope)

डेटा वास्तुकला एवं डेटाबेस प्रशासन विभाग (Data Architecture & DBA Dept) एप्लिकेशन के संपूर्ण डेटा जीवनचक्र, डेटा मॉडल, भंडारण (Storage), रिलेशनल एवं नो-एसक्यूएल डेटाबेस, स्कीमा माइग्रेशन, इंडेक्सिंग रणनीति और क्वेरी प्रदर्शन के अनुकूलन का संरक्षक है।

---

## 📐 2. रिलेशनल स्कीमा डिज़ाइन एवं अखंडता मानक (Relational Schema & Integrity Standards)

### 2.1 डेटा अखंडता एवं फॉरेन कीज़ (Data Integrity & Constraints)
- प्रत्येक तालिका में एक स्पष्ट प्राथमिक कुंजी (`PRIMARY KEY`, उदा. `BIGINT GENERATED ALWAYS AS IDENTITY` या `UUID v7`) होना अनिवार्य है।
- संदर्भ अखंडता (Referential Integrity): सभी संबंधों पर स्पष्ट `FOREIGN KEY` बाधाएं और उपयुक्त कैस्केड नीतियां (`ON DELETE RESTRICT` डिफ़ॉल्ट रूप में, आवश्यकतानुसार `CASCADE`) लागू होनी चाहिए।
- स्तंभ डेटा प्रकार शुद्धता:
  - वित्तीय डेटा के लिए कभी भी `FLOAT` या `DOUBLE` का उपयोग न करें; सदैव `DECIMAL(14, 4)` या `NUMERIC` का उपयोग करें।
  - समय और तिथियों के लिए टाइमज़ोन-जागरूक `TIMESTAMPTZ` का अनिवार्य उपयोग करें।
  - टेक्स्ट डेटा के लिए आवश्यकतानुसार `VARCHAR(n)` या `TEXT` (चेक कंस्ट्रेंट के साथ)।

---

## ⚡ 3. इंडेक्सिंग रणनीति एवं क्वेरी ऑप्टिमाइजेशन (Indexing & Performance Strategy)

### 3.1 इंडेक्स डिज़ाइन नियम (Indexing Guidelines)
- **चयनात्मकता नियम (Selectivity First):** कम्पोजिट इंडेक्स (`Composite Index`) बनाते समय सबसे अधिक चयनात्मक (high cardinality) कॉलम को प्रथम स्थान पर रखें।
- **कवरिंग इंडेक्स (Covering Indexes):** जहाँ संभव हो, बार-बार पूछे जाने वाले कॉलमों को `INCLUDE` क्लॉज के साथ जोड़ें ताकि इंडेक्स-ओनली स्कैन प्राप्त हो सके।
- **अनावश्यक इंडेक्स निषेध:** अप्रयुक्त या डुप्लीकेट इंडेक्स न बनाएं, क्योंकि वे `INSERT`, `UPDATE`, और `DELETE` के प्रदर्शन को घटाते हैं।
- **EXPLAIN ANALYZE अनिवार्य ऑडिट:** किसी भी जटिल क्वेरी को प्रोडक्शन में भेजने से पहले `EXPLAIN ANALYZE` चलाकर सीक्वेंशियल स्कैन (Seq Scan) से बचें।

```sql
-- उदाहरण: कुशल इंडेक्सिंग एवं टाइमस्टैम्प पार्टीशनिंग
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    order_status VARCHAR(20) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- यूजर और दिनांक के आधार पर कम्पोजिट इंडेक्स
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);

-- एक्टिव ऑर्डर्स के लिए पार्शियल इंडेक्स (Partial Index)
CREATE INDEX idx_orders_active ON orders(order_id) WHERE order_status IN ('PENDING', 'PROCESSING');
```

---

## 🔄 4. ज़ीरो-डाउनटाइम डेटाबेस माइग्रेशन मानक (Zero-Downtime Migration Protocol)

- **अनुक्रमिक आगे/पीछे संगतता (Expand and Contract Pattern):**
  1. **Phase 1 (Expand):** नया कॉलम नलेबल (`NULL`) या डिफ़ॉल्ट मान के साथ जोड़ें। नया कोड नए और पुराने दोनों कॉलम्स को सपोर्ट करे।
  2. **Phase 2 (Backfill):** बैकग्राउंड बैच जॉब द्वारा पुराने रिकॉर्ड्स में नया डेटा भरें।
  3. **Phase 3 (Contract):** कॉलम पर `NOT NULL` कंस्ट्रेंट लगाएं और पुराने अप्रयुक्त कॉलम को सुरक्षित रूप से ड्रॉप करें।
- माइग्रेशन फाइलों में हमेशा `UP` (Apply) और `DOWN` (Rollback) स्क्रिप्ट्स स्पष्ट रूप से मौजूद होनी चाहिए।
- टेबल को लॉक करने वाले भारी `ALTER TABLE` ऑपरेशन्स पर सख्त नियंत्रण।

---

## 🧑‍💼 5. विभागीय पद एवं समर्पित सब-एजेंट्स (Departmental Roles & Subagents)

विभागीय कार्य-विभाजन और उद्यम विशेषज्ञता (Specialization of Labor) सुनिश्चित करने के लिए 4 समर्पित पद (Enterprise Job Roles) और उनके अनुरूप सब-एजेंट्स परिभाषित हैं:

### 5.1 Relational Database Administrator (Database Administrator)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Database Administrator`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - सामान्यीकृत रिलेशनल स्कीमा (3NF/BCNF) मॉडलिंग और डेटाबेस इंजन कॉन्फ़िगरेशन।
  - फॉरेन कीज़, चेक बाधाएं और इनवेरिएंट्स द्वारा सख्त संदर्भित अखंडता (Referential Integrity) सुनिश्चित करना।
  - डेटाबेस कनेक्शन पूलिंग और ट्रांज़ैक्शनल आइसोलेशन लेवल्स का प्रबंधन करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Database Administrator",
  "Prompt": "Design normalized relational schemas (3NF/BCNF), establish foreign key constraints, enforce data integrity invariants, and oversee database engine configuration."
}
```

### 5.2 NoSQL & Vector DB Specialist (Vector Database Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Vector Database Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - NoSQL डॉक्यूमेंट, की-वैल्यू और वाइड-कॉलम डेटाबेस आर्किटेक्चर तैयार करना।
  - वेक्टर डेटाबेस (pgvector, Pinecone, Milvus) में HNSW और IVFFlat इंडेक्स संरचनाओं का अनुकूलन।
  - असंरचित डेटा एम्बेडिंग्स पाइपलाइन्स और हाइब्रिड सर्च क्वेरी पैटर्न का प्रबंधन।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Vector Database Specialist",
  "Prompt": "Design NoSQL and vector storage architectures, optimize HNSW/IVFFlat index structures for pgvector and vector databases, and manage unstructured embedding pipelines."
}
```

### 5.3 Data Migration & Pipeline Engineer (Data Migration Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Data Migration Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - Expand-and-Contract पैटर्न द्वारा ज़ीरो-डाउनटाइम डेटाबेस माइग्रेशन निष्पादित करना।
  - सुरक्षित बैकफ़िलिंग और रोलबैक सुरक्षा के साथ प्रतिवर्ती (Reversible) माइग्रेशन स्क्रिप्ट्स तैयार करना।
  - डेटा माइग्रेशन के दौरान डेटा समता (Data Parity) और समकालिकता सत्यापन सुनिश्चित करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Data Migration Specialist",
  "Prompt": "Implement zero-downtime expand-and-contract database migrations, author reversible migration scripts with atomic rollback safeguards, and validate data parity."
}
```

### 5.4 Database Performance & Indexing Tuner (Query Performance Tuner)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Query Performance Tuner`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - धीमी क्वेरीज का EXPLAIN ANALYZE द्वारा गहन प्रोफाइलिंग और बॉटलनेक पहचान।
  - कम्पोजिट, पार्शियल और कवरिंग इंडेक्सिंग रणनीतियों द्वारा टेबल स्कैन समाप्त करना।
  - N+1 क्वेरी पैटर्न्स का पूर्ण उन्मूलन और डेटाबेस I/O थ्रूपुट का अनुकूलन।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Query Performance Tuner",
  "Prompt": "Analyze slow queries using EXPLAIN ANALYZE, design optimal composite and partial indexes, eliminate N+1 query patterns, and tune connection pooling parameters."
}
```


---

## 🚦 6. विभाग हैंडऑफ एवं सत्यापन गेट्स (Department Handoff Gates)

1. **Gate 3-A (N+1 क्वेरी रोकथाम):** ORM कोड में सभी संबंध फेचिंग में ईगर लोडिंग (`include` / `select_related`) प्रमाणित होनी चाहिए।
2. **Gate 3-B (माइग्रेशन सुरक्षा):** माइग्रेशन स्क्रिप्ट्स का परीक्षण स्थानीय डेटाबेस में सफलतापूर्वक हो चुका हो।
3. **अगले विभाग को हैंडऑफ:** डेटा मॉडल स्वीकृत होने पर कार्य आधिकारिक रूप से **Dept 06: Backend & API Engineering** को सौंपा जाएगा।
