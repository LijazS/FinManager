
# FinAgent - AI-Powered Financial Assistant

An intelligent full-stack financial management platform that replaces traditional static expense forms with conversational AI. Built to showcase modern web development skills combining FastAPI backends, React frontends, LangGraph AI agents, and real-time data visualization.

![FinAgent Dashboard](docs/images/Dashboard.jpg)

## 🎯 Project Overview

FinAgent transforms expense tracking into natural conversations. Users chat with an AI agent that extracts financial data, stores transactions, generates personalized spending insights, and visualizes patterns through interactive dashboards.

## 🚀 Technical Skills Demonstrated

### Backend Engineering
- **FastAPI Framework**: Built RESTful APIs with async request handling, Pydantic validation, and structured error responses.
- **SQLAlchemy ORM**: Designed relational database schema for users, transactions, and expense categories with proper foreign key relationships.
- **JWT Authentication**: Implemented secure user authentication with token-based access control.
- **Database Management**: PostgreSQL/MongoDB integration for structured transaction data.

### AI & Agent Engineering  
- **LangGraph Workflows**: Engineered stateful conversational agents that maintain context across multi-turn expense logging sessions.
- **Tool Calling**: Implemented structured LLM function calling to parse natural language ("I spent $10 on coffee") into validated database transactions.
- **Insight Generation**: Built AI-powered spending analysis that identifies patterns, unusual expenses, and budget recommendations.
- **LLM Integration**: Connected Claude/OpenAI APIs with prompt engineering for financial data extraction and conversational responses.

### Frontend Development
- **React + Vite**: Built responsive SPA with component-based architecture and React hooks for state management.
- **Tailwind CSS**: Designed modern dark-theme UI with utility-first styling for rapid development.
- **Real-time Visualization**: Integrated Recharts for interactive spending graphs and dashboard analytics.
- **Form Handling**: Created authentication flows with controlled components and validation.

### DevOps & Deployment
- **Docker Containerization**: Containerized both frontend and backend services with multi-stage builds for production optimization.
- **AWS Deployment**: Deployed application on AWS EC2 with proper networking and security group configuration.
- **Environment Management**: Configured separate development and production environments with environment variables.

## 🏗️ Architecture

Frontend (React + Vite + Tailwind)
↓
FastAPI Backend
├── JWT Auth Middleware
├── LangGraph Agent Engine
├── Database Layer (SQLAlchemy)
└── LLM Integration (Claude/OpenAI)
↓
PostgreSQL Database

text

## ✨ Key Features

- **Conversational Expense Logging**: Natural language input replaces manual forms - "I got tea for 15" automatically creates transactions.
- **AI-Powered Insights**: Real-time spending analysis with personalized recommendations based on category patterns.
- **Interactive Dashboard**: Visual spending breakdowns by category with daily/monthly/yearly views.
- **Smart Categorization**: AI automatically categorizes expenses (Groceries, Food, Transport, Entertainment).
- **Secure Authentication**: JWT-based user authentication with protected routes.

## 📊 Application Screenshots

### Dashboard & AI Insights
The main dashboard displays real-time spending totals, AI-generated insights, and budget suggestions.
![Dashboard](docs/images/Dashboard.jpg)

### Secure Authentication
Secure login and signup pages with JWT-based session management.

| Login Page | Signup Page |
| :---: | :---: |
| ![Sign In](docs/images/signin.jpg) | ![Sign Up](docs/images/signup.jpg) |

## 🛠️ Tech Stack

**Backend**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- Pydantic (Data validation)
- LangGraph (AI agent workflows)
- PostgreSQL/MongoDB (Database)

**Frontend**
- React 18 with Vite
- Tailwind CSS
- Recharts (Data visualization)
- React Router (Navigation)

**AI/ML**
- LangChain/LangGraph (Agent framework)
- Claude/OpenAI APIs (LLM integration)
- Custom prompt engineering for financial data extraction

**DevOps**
- Docker (Containerization)
- AWS EC2 (Hosting)
- JWT (Authentication)

## 🎓 Learning Outcomes

This project demonstrates proficiency in:
- Building production-ready REST APIs with FastAPI.
- Designing stateful AI agents with context awareness.
- Integrating LLMs into real-world applications with structured outputs.
- Creating responsive, modern UIs with React and Tailwind.
- Database design and ORM usage for financial applications.
- Containerizing and deploying full-stack applications.
- Implementing secure authentication flows.

## 📝 Skills Showcase

**Problem Solving**: Replaced tedious form-filling with natural conversations while maintaining data accuracy through LLM validation.

**System Design**: Architected a multi-layered application separating concerns (Auth → API → Agent → Database).

**AI Engineering**: Built agents that handle incomplete inputs by asking follow-up questions until all required transaction fields are collected.

**Full-Stack Development**: Connected React frontend to FastAPI backend with proper API design, error handling, and state management.

---
