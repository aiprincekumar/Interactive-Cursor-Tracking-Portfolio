# Department 13: SRE, Backup & Disaster Recovery (SRE एवं बैकअप विभाग)

> **Navigation Links:**
> - **Master Navigator:** [`master_rules_navigator.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/master_rules_navigator.md)
> - **Foundation Rules:** [`foundation_and_special_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/foundation_and_special_rules.md)
> - **Active Working Memory:** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md)
> - **Universal Canonical Rules:** [`universal_rules.md`](file:///C:/Users/Atul%20Verma/.gemini/config/rules/universal_rules.md)

---

## 💾 1. विभाग का मिशन एवं कार्यक्षेत्र (Mission & Department Scope)

साइट विश्वसनीयता इंजीनियरिंग (SRE), बैकअप एवं डिजास्टर रिकवरी विभाग (SRE & Backup Ops Dept) डेवलपर परिवेश, प्रोजेक्ट्स, AI कॉन्फ़िगरेशन, बैकअप्स, रिस्टोर प्रक्रियाओं, और रियल-टाइम मेमोरी समकालिकता का सर्वोच्च संरक्षक है।

यह विभाग सुनिश्चित करता है कि सिस्टम में शून्य डेटा हानि (Zero Data Loss), तत्काल रिकवरी क्षमता और निरंतर स्टेट प्रिजर्वेशन उपलब्ध रहे।

---

## 🛡️ 2. एंटी ग्रेविटी दोहरी सब-फ़ोल्डर बैकअप वास्तुकला (Rule 5 Compliance)

डेस्कटॉप पर मुख्य बैकअप कंटेनर `C:\Users\Atul Verma\Desktop\Antigravity Backup\` के अंदर 2 समर्पित सब-फ़ोल्डर्स कार्य करते हैं:

```
C:\Users\Atul Verma\Desktop\Antigravity Backup\
  ├── PREREQUISITES_FRESH_OS.md       (फ्रेश OS सेटअप आवश्यकताएं)
  ├── Manual_Backup\                  (स्थायी अनिश्चितकालीन सुरक्षा)
  │     ├── backup_manual.bat         (1-क्लिक मैनुअल बैकअप रनर)
  │     ├── backup_manual.ps1
  │     └── Manual_Backup_YYYY-MM-DD_HH-mm-ss\
  └── Daily_Backup\                   (10-दिवसीय FIFO रोटेशन)
        ├── backup_daily.bat          (1-क्लिक ऑटो बैकअप रनर)
        ├── backup_daily.ps1
        └── Daily_Backup_YYYY-MM-DD_HH-mm-ss\
```

### 2.1 बैकअप की 100% एकरूपता मानक (Identical Backup Interior)
प्रत्येक बैकअप स्नैपशॉट के अंदर निम्नलिखित घटक 100% समान रूप से संरक्षित रहते हैं:
1. `memory.md` (ग्लोबल स्टेट - रूट में)
2. `rules/` (सभी विभागीय व सार्वभौमिक नियम)
3. `config/` (कोर सेटिंग्स व `scripts/` ऑटोमेशन टूल्स)
4. `skills/` (सभी 71+ कस्टम व इंस्टॉल्ड स्किल्स)
5. `plugins/` (प्लगइन्स - बिना नोड मॉड्यूल्स के)
6. `mcp/` (सभी MCP सर्वर स्कीमाज़)
7. `sidecars/` (ऑटोमेशन साइडकार्स)
8. `backup_manifest.json` (मेटाडेटा)
9. `PREREQUISITES_FRESH_OS.md`
10. `RESTORE_INSTRUCTIONS.md`
11. `restore.bat` एवं `restore.ps1` (1-क्लिक स्वचालित रिस्टोर रनर)

### 2.2 10-दिवसीय दैनिक बैकअप अवधारण नीति (10-Day FIFO Retention)
- `Daily_Backup/` में अधिकतम 10 दिन के बैकअप्स रहेंगे।
- 11वां बैकअप बनते ही सबसे पुराना दैनिक बैकअप रिकॉर्ड (`Daily_Backup_*`) स्वतः FIFO प्रूनिंग द्वारा स्थायी रूप से हटा दिया जाएगा।
- `Manual_Backup/` अनिश्चित काल तक सुरक्षित रहेगा।

---

## 🧠 3. रियल-टाइम मेमोरी समकालिकता मानक (Rule 23 Compliance)

- **सतत स्टेज-दर-स्टेज मेमोरी सिंक:** किसी भी बड़े टास्क, फीचर या आर्किटेक्चरल बदलाव के पूरा होने पर [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) को रियल-टाइम में अपडेट करना अनिवार्य है।
- **ज़ीरो-स्कैन स्टेट प्रिजर्वेशन:** सिस्टम में जुड़े नए टूल्स, प्रोजेक्ट्स और बैकअप्स को तुरंत मेमोरी में दर्ज किया जाएगा ताकि भविष्य के सेशन्स को किसी भी डायरेक्टरी स्कैन की आवश्यकता न पड़े।
- **समर्पित सब-एजेंट:** इस कार्य की निगरानी के लिए समर्पित `memory_sync_sentinel` उत्तरदायी है।

---

## 🔤 4. अनिवार्य UTF-8 with BOM एन्कोडिंग मानक (Zero Mojibake)

- सभी बैकअप दस्तावेज़ (`RESTORE_INSTRUCTIONS.md`, `PREREQUISITES_FRESH_OS.md`) और स्क्रिप्ट्स अनिवार्य रूप से **UTF-8 with BOM (`0xEF, 0xBB, 0xBF`)** में सहेजे जाएंगे ताकि विंडोज कंसोल में हिंदी अक्षरों का कोई विरूपण (Mojibake) न हो।

---

## 🧑‍💼 5. विभागीय पद एवं समर्पित सब-एजेंट्स (Departmental Roles & Subagents)

विभागीय कार्य-विभाजन और उद्यम विशेषज्ञता (Specialization of Labor) सुनिश्चित करने के लिए 5 समर्पित पद (Enterprise Job Roles) और उनके अनुरूप सब-एजेंट्स परिभाषित हैं:

### 5.1 Antigravity Backup Specialist (Antigravity Backup Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Antigravity Backup Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - Rule 5 दोहरी सब-फ़ोल्डर संरचना (`Manual_Backup/`, `Daily_Backup/`) का प्रबंधन।
  - `Daily_Backup/` पर सख्त 10-दिवसीय FIFO रोटेशन व स्वतः प्रूनिंग का संचालन।
  - 1-क्लिक रिस्टोर स्क्रिप्ट्स (`restore.bat`/`.ps1`) और UTF-8 with BOM एन्कोडिंग मानक का प्रवर्तन।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Antigravity Backup Specialist",
  "Prompt": "Execute Rule 5 dual-folder backup architecture, manage strict 10-day FIFO pruning on Daily_Backup, generate 1-click restore scripts, and enforce UTF-8 with BOM encoding."
}
```

### 5.2 Site Reliability Engineer & Health Monitor (Site Reliability Engineer)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Site Reliability Engineer`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - सर्विस लेवल ऑब्जेक्टिव्स (SLO) और एरर बजट्स की निगरानी एवं प्रबंधन।
  - स्वचालित सिंथेटिक हेल्थ प्रोब्स और 99.99% अपटाइम उपलब्धता वास्तुकला।
  - सिस्टम क्रैश होने पर स्वचालित सेल्फ-हीलिंग और अलर्टिंग तंत्र का संचालन।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Site Reliability Engineer",
  "Prompt": "Define and track SLI/SLO metrics, manage error budgets, implement automated synthetic health probes, and architect self-healing infrastructure components."
}
```

### 5.3 Disaster Recovery & Rollback Specialist (Disaster Recovery Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Disaster Recovery Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - RTO < 15m और RPO < 1m सीमाओं को पूरा करने वाले डिज़ास्टर रिकवरी प्लेबुक्स का निर्माण।
  - स्वचालित स्नैपशॉट रिस्टोर प्रक्रियाओं और बैकअप अखंडता का नियमित परीक्षण।
  - ब्लू-ग्रीन आर्किटेक्चर द्वारा तत्काल रोलबैक तत्परता सुनिश्चित करना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Disaster Recovery Specialist",
  "Prompt": "Design disaster recovery playbooks meeting RTO < 15m and RPO < 1m thresholds, test automated snapshot restore procedures, and validate blue-green instant rollback readiness."
}
```

### 5.4 Global Working Memory Sentinel (Memory Sentinel)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `Memory Sentinel`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - Rule 23 के तहत [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) के साथ निरंतर और चरणबद्ध समकालिकता।
  - समानानांतर सब-एजेंट्स के आउटपुट्स का एटॉमिक एकत्रीकरण (Atomic Aggregation)।
  - पर्यावरण टोपोलॉजी और ज़ीरो-स्कैन स्टेट की अखंडता को अक्षुण्ण बनाए रखना।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "Memory Sentinel",
  "Prompt": "Enforce continuous stage-by-stage synchronization of memory.md, aggregate parallel subagent outputs atomically, and preserve zero-scan state integrity per Rule 23."
}
```

### 5.5 Cloud FinOps & Cost Optimization Specialist (FinOps Cost Specialist)
- **समर्पित सब-एजेंट रोल (Subagent Role):** `FinOps Cost Specialist`
- **उद्देश्य एवं कार्यक्षेत्र (Scope & Responsibilities):**
  - क्लाउड कंप्यूट, सर्वरलेस और स्टोरेज इन्फ्रास्ट्रक्चर खर्च का ऑडिट व राइट-साइज़िंग (Right-Sizing)।
  - LLM API टोकन बजट्स, प्रॉम्प्ट कैशिंग (Prompt Caching) रणनीतियाँ और मॉडल टियर रूटिंग ऑप्टिमाइजेशन।
  - अनपेक्षित कॉस्ट स्पाइक्स, वेस्टेज और लीकेज की रोकथाम हेतु बजट अलर्ट्स और स्वचालित सीमाएं लागू करना।
  - प्रति-अनुरोध/प्रति-फीचर यूनिट इकोनॉमिक्स ट्रैकिंग और लागत पूर्वानुमान (Cost Forecasting)।
- **मानकीकृत सब-एजेंट आमंत्रण (Invocation Directive):**
```json
{
  "TypeName": "self",
  "Role": "FinOps Cost Specialist",
  "Prompt": "Conduct cloud infrastructure right-sizing, manage LLM token budgets and prompt caching economics, prevent compute wastage, and enforce FinOps cost optimization governance."
}
```


---

## 🚦 6. विभाग हैंडऑफ एवं सत्यापन गेट्स (Department Handoff Gates)

1. **Gate 13-A (बैकअप पूर्णता):** बैकअप मैनिफेस्ट के सभी 11 घटक सत्यापित हों।
2. **Gate 13-B (मेमोरी सिंक):** [`memory.md`](file:///C:/Users/Atul%20Verma/.gemini/memory.md) वर्तमान सिस्टम स्टेट से 100% सुसंगत हो।
3. **सिस्टम पूर्णता:** SRE सत्यापन के बाद सिस्टम का विकास चक्र सफलतापूर्वक संपन्न माना जाएगा।
