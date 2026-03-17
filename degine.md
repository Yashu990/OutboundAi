# 🧠 PROJECT BUILD INSTRUCTION (STEP 6 - OUTREACH + FOLLOW-UP SYSTEM)

You are a senior backend engineer.

Your task is to build a **complete outreach system** with:

* Email sending
* Message tracking
* Follow-up automation

⚠️ IMPORTANT RULES:

* Keep system scalable
* Track all messages
* Avoid spam behavior
* Use queue system for sending

---

# 🎯 GOAL

For each generated message:

👉 Send email
👉 Track status
👉 Automatically send follow-ups

---

# 🛠️ TECH

* Node.js (Express)
* Nodemailer OR SendGrid (recommended)
* BullMQ + Redis (for queue)
* PostgreSQL

---

# 📦 FEATURES

## 1. EMAIL SENDING

Use:

* SendGrid API (best)
  OR
* Nodemailer (Gmail SMTP for testing)

---

# 🔌 EMAIL API

## POST /api/outreach/send

Body:
{
"contactId": 1
}

Flow:

* Fetch contact + message
* Send email
* Save status in DB

---

# 🗄️ DATABASE UPDATE

## outreach_logs

* id (PK)
* contact_id (FK)
* message_id (FK)
* status (sent, failed)
* sent_at

---

# 🔁 FOLLOW-UP SYSTEM

Create:

## followups table

* id
* contact_id
* message_id
* scheduled_at
* status (pending, sent)

---

# ⚙️ LOGIC

After first email:

Auto create follow-ups:

* Day 3
* Day 7
* Day 14

---

# ⏱️ QUEUE SYSTEM

Use:
👉 BullMQ + Redis

Queue jobs:

* Send email
* Send follow-up

---

# 🧠 WORKER

Create worker:

* Check scheduled followups
* Send message
* Update status

---

# 🔗 FRONTEND UPDATE

Add button:

👉 “Send Message”

Show:

* Sent status
* Follow-up status

---

# 🧪 TESTING

* Send test email
* Check DB logs
* Check follow-ups trigger

---

# ⚠️ ANTI-SPAM RULES

* Limit emails/day
* Add delay between sends
* Use proper email formatting

---

# 📌 OUTPUT FORMAT

Provide:

1. Email service code
2. Queue setup (BullMQ)
3. Worker code
4. API routes
5. DB schema
6. Frontend integration

---


