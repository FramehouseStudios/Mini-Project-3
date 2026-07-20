# Mini-Project #3: Database & Backend API Integration

## Completed Submission

Submitted by Joshua Ojeda. This repository now includes a complete backend MVC product API using SQLite and startup seeding from Fake Store API.

Quick commands:

    npm install
    npm start
    npm test

Review helpers:

- [Submission summary](SUBMISSION.md)
- [Requirements and design notes](docs/REQUIREMENTS.md)
- [API reference](docs/API_REFERENCE.md)
- [Postman collection](docs/postman_collection.json)
- [Presentation script](docs/PRESENTATION_SCRIPT.md)

Main endpoint: GET /api/products

---

## Overview

This project is designed to consolidate the material learned in **Modules 8 and 9** regarding the use of databases. The primary goal is to create a real-time database that functions by fetching data externally via an API.

Unlike previous projects, a front-end interface is not strictly required; functionality should be demonstrated via backend tools.

## Timeframe & Workload

- **Duration:** You should aim for **8–10 hours** of work.
- **Deadline:** This project is assigned at the end of **Module 9**.
- **Planning:** Spending more than 10 hours suggests over-complication, while significantly less may indicate a lack of depth in showcasing required skills.

## Technical Requirements

Your application must adhere to the following technical specifications:

- **Architecture:** The project must follow the **MVC (Model-View-Controller)** model.
- **Data Integration:** Include a start-up routine that initially fetches data from an external API and populates your database.

- **Database Structure:** Your database structure should reflect the structure of the data returned from the external API.
- **Functionality:** All **CRUD (Create, Read, Update, Delete)** operations must be included.
- **Demonstration:** As a front-end is not required, you must demonstrate your application's functionality using **Postman** or **Swagger**.

## Project Process

1. **Design Phase:** Before writing code, you must document the functionality, user capabilities, and visual layout (if applicable). You must include design and requirements specifications.
2. **Implementation:** Build the application aiming for the 8-10 hour window.

## Project Options

Choose **one** of the following paths for your application content:

### Option 1: Project Continuation

Continue building out the project you have been working on for the previous Mini-Projects (#1 and #2). Extend its backend capabilities to meet the technical requirements above.

### Option 2: Real-World Application

Find a person, company, or website that desperately needs a new or modernized website/backend. Offer to build it for them.

> [!NOTE] 
> This option may take more time and planning, but offers meaningful learning in client communication, requirements gathering, and professional delivery.

## Presentation Guidelines

You will give a **5–10 minute presentation** to trainers and students. You must demonstrate what the application does, how it works, and the code used to implement it.

**Be prepared to answer the following questions:**

1. What was your requirements gathering and design process? Was it useful/successful? 
2. Give a high-level overview of your application and its features. 
3. Where does the data come from (which external API)? 
4. How is this data inserted into your database? 
5. How is the data structured (into tables or collections)? 
6. How is the application code structured (MVC model)? 
7. Does your application cover all 4 CRUD operations? How? 
8. How might using a database instead of an external API directly benefit an application? 
9. How might you extend the features of your application in the future? 

## Grading Criteria

| Score | Criteria |
| --- | --- |
| **10** | **Excellent:** Fully functional, original application that meets all objectives, uses well-structured code, and includes strong evidence of design/requirements planning. |
| **8/9** | **Great:** Mostly functional application covering main objectives, with tidy code and clear evidence of planning. |
| **7** | **Satisfactory:** Minimal planning/design; application includes core features with some attempts at well-structured code. |
| **≤ 6** | **Needs Improvement:** Reliance on code copied from elsewhere, important features incomplete, mostly messy/unstructured code, and no design process. |

---

### Grading Components breakdown:

- **Evidence of design/requirements:** Figma, hand-drawn diagrams, or bulleted lists created prior to coding.
- **Functionality:** Original application covering required objectives with good usability.
- **Coding:** Code is tidy, logical, well-structured, and avoids repetition.

---