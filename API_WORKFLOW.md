# AI-Powered B2B Outbound Sales Platform — API Workflow

This document outlines the core workflows of the platform's API as of March 20, 2026. The platform integrates Google Maps, AI Enrichment, and modern CRM capabilities for outbound sales.

---

## 1. Core Workflow Overview

The platform operates across four primary stages: **Discovery**, **Enrichment**, **Management**, and **Outreach**.

```mermaid
graph TD
    %% Define Stage 1: Discovery
    subgraph "Discovery (Lead Generation)"
        A[Search Leads] --> B{Source?}
        B -- "Google Maps" --> C[mapsService.searchLeads]
        B -- "CSV Import" --> D[leadsController.importLeads]
        C & D --> E[(Database: leads Table)]
    end

    %% Define Stage 2: Enrichment
    subgraph "Enrichment (Decision Maker Lookup)"
        E --> F[linkedinController.findAndSaveDecisionMakers]
        F --> G[searchService: Google Search via Serper]
        G --> H[linkedinService: GPT-4o Extraction]
        H --> I[(Database: contacts Table)]
    end

    %% Define Stage 3: Management
    subgraph "CRM Management"
        I --> J[dealsController: Pipeline Management]
        I --> K[activityRoutes: Call/Meeting Logs]
        J & K --> L[(Database: deals / activities / stats)]
    end

    %% Define Stage 4: Outreach
    subgraph "AI Outreach (Automation)"
        I --> M[aiController: generateAndSaveMessage]
        M --> N[outreachController: Send Initial Message]
        N --> O[worker.js: Automatic Follow-ups]
        O --> P[(Database: messages / followups / logs)]
    end
```

---

## 2. API Endpoint Breakdown

### 📍 Leads Discovery (`/api/leads`)
Handles the ingestion of raw business data.
- `POST /api/leads/search`: Uses the **Google Places API** to find businesses (e.g., "IT companies in Delhi").
- `POST /api/leads/import`: Imports leads from external sources (e.g., CSV).
- `GET /api/leads`: Retrieves all enriched leads for the main table.

### 🧠 LinkedIn Enrichment (`/api/linkedin`)
The "Smart Search" layer that finds real humans behind the businesses.
- `POST /api/linkedin/find`: 
    1. Triggers a live Google search via **Serper.dev**.
    2. Sends search snippets to **GPT-4o**.
    3. Saves real LinkedIn URLs and Founder names to the `contacts` table.

### ✉️ AI Message Engine (`/api/ai`)
Generates personalized outreach content.
- `POST /api/ai/generate`: Analyzes contact data (role, company name) and uses GPT-4o to write a custom LinkedIn/Email message.
- `GET /api/ai/contact/:id`: Fetches previously generated message variations.

### 📑 Pipeline & Stats (`/api/deals` & `/api/stats`)
- `/api/deals`: Manages deal stages (Prospect, Negotiation, Won, Lost).
- `/api/stats`: Real-time calculation of Conversion Rates and Pipeline Value.

---

## 3. Automation Worker Flow

The system includes a **background worker** (`worker.js`) that handles post-outreach automation.

```mermaid
sequenceDiagram
    participant Worker as Background Worker
    participant DB as Postgres Database
    participant Email as Email/Outreach Service

    Worker->>DB: Scan for 'Pending' Follow-ups
    activate DB
    DB-->>Worker: List of scheduled messages
    deactivate DB

    loop For each due message
        Worker->>Email: Send personalized follow-up
        Email-->>Worker: Confirmation
        Worker->>DB: Update status to 'Sent'
    end
```

---

## 4. Key Integration Dependencies

| Service | Used for... | Key / Configuration |
| :--- | :--- | :--- |
| **OpenAI GPT-4o / gpt-4o-mini** | Name extraction & Outreach generation | `OPENAI_API_KEY` |
| **Serper.dev** | Real Google search for LinkedIn profiles | `SERPER_API_KEY` |
| **Google Places** | Finding business locations & websites | `GOOGLE_PLACES_API_KEY` |
| **PostgreSQL** | Persistent storage for all CRM data | `DB_NAME`, `DB_HOST`, etc. |
| **Node.js / Express** | Core API framework | `PORT=5000` |
