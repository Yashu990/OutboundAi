# 🚀 Hybrid Outreach Workflow (Google Maps + Chrome Extension)

This workflow combines manual lead gathering with automated AI outreach to save costs and maintain high lead quality.

## 📊 Process Flowchart

```mermaid
flowchart TD
    subgraph "Manual Discovery (Cost: $0)"
        A[Open Google Maps] --> B[Search Niche: 'Real Estate in Dubai']
        B --> C[Scroll results to load entries]
        C --> D[Run Chrome Extension Scraper<br/>'Instant Data Scraper']
        D --> E[Export Results to CSV]
    end

    subgraph "CRM Integration"
        E --> F[Upload CSV to OutboundAI CRM]
        F --> G[(PostgreSQL Database)]
    end

    subgraph "Automated Enrichment (API Power)"
        G --> H[CRM Scans for CEO/Founder LinkedIn]
        H --> I[OpenAI Generation<br/>Personalized Outreach Message]
    end

    subgraph "Execution"
        I --> J[Send LinkedIn Message / Email]
        J --> K[Automated Follow-up Worker]
        K --> L{Conversion}
    end

    %% Styling
    style A fill:#ea4335,color:white
    style D fill:#fbbc05,color:black
    style F fill:#4f46e5,color:white
    style I fill:#10a37f,color:white
    style L fill:#22c55e,color:white
```

---

## 🛠️ Step-by-Step Guide

### 1. The Scraping Phase
*   **Search**: Go to [Google Maps](https://www.google.com/maps) and search for your target audience.
*   **Scrape**: Use a Chrome extension like **Instant Data Scraper** or **Outscraper Extension**. 
*   **Format**: Download the results as a **CSV** file.

### 2. The Import Phase
*   Inside your **OutboundAI Dashboard**, navigate to the **Leads** section.
*   Click the **Import CSV** button (to be implemented).
*   Map the columns: `Name`, `Website`, `Phone`, `Address`.

### 3. The AI Phase
*   The CRM will automatically take those leads.
*   It uses your **OpenAI API Key** to read the business details.
*   It writes a custom message like: *"Hi [Name], I saw your high rating for [Business] in Noida and loved your website..."*

### 4. The Outreach Phase
*   Review the generated message.
*   Click **Send**.
*   The **Follow-up Worker** takes over if they don't reply within 3 days.

---

## 💎 Why this is better?
1.  **Zero Scraper Cost**: You don't pay per search.
2.  **Highly Visual**: You see the business before importing it.
3.  **Human Verified**: You filter out "closed" or "badly rated" businesses manually during the scroll.
