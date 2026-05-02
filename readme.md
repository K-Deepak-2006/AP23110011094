# CampusAlert: Integrated Notification & Logging Platform

CampusAlert is a straightforward notification system built for today's educational settings. It offers real-time updates on placements, academic results, and campus events through a user-friendly interface. The project also has a specialized logging middleware to ensure quality data tracking across the system.

## Features

### 1. Intelligent Notification System
- **Real-Time Feed**: Instantly view and filter campus-wide alerts.
- **Priority Inbox**: A custom scoring system ranks notifications based on their type (Placement, Result, Event) and their freshness. This way, you never miss an important update.
- **Visual Clarity**: Updated with a light theme featuring glassmorphism, soft shadows, and clear typography for better readability.
- **Read Management**: Tracks viewed notifications and keeps them persistent across sessions using browser storage.

### 2. Robust Logging Middleware
- **Structured Logging**: Pre-bound stack context (Frontend/Backend) for consistent data.
- **Strict Validation**: Enforces length limits (5-48 characters) and allowed package names to keep logs clean and easy to search.
- **Bearer Security**: Every log entry and API request is secured with JWT authentication.

## Tech Stack
- **Frontend**: React.js with Material UI (MUI).
- **Styling**: Modern CSS with glassmorphic effects.
- **State Management**: React Context API with persistent hooks.
- **Backend Communication**: RESTful API integration with Bearer Token auth.

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone & Install
```bash
# Enter the frontend directory
cd notification_app_fe

# Install dependencies
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `notification_app_fe` directory and add your access token:
```env
REACT_APP_API_TOKEN=your_jwt_token_here
```

### 3. Run the Application
```bash
npm start
```
The application will be available at `http://localhost:3000`.

## Logging Constraints
To keep the system reliable, all logs must follow these rules:
- **Message Length**: Between 5 and 48 characters.
- **Valid Packages (Frontend)**: `api`, `component`, `hook`, `page`, `state`, `style`, `auth`, `config`, `middleware`, `utils`.
- **Valid Packages (Backend)**: `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`, `auth`, `config`, `middleware`, `utils`.
- **Valid Levels**: `debug`, `info`, `warn`, `error`, `fatal`.

## Project Structure
- `/notification_app_fe`: The main React application.
- `/logging_middleware`: Special logic for structured log validation.

## Technical Implementation

### API Architecture
The platform's communication layer is centralized in `src/api/notifications.js`. This setup ensures that endpoint URLs and authentication logic are not scattered across UI components.
- **Secure Token Management**: Access tokens are stored in a `.env` file and added during build time, which prevents hardcoded credentials.
- **Request Wrapper**: All outgoing calls automatically include the required `Authorization: Bearer` header.
- **Error Handling**: The API layer detects HTTP failures (like 401s or 400s) and turns them into user-friendly error messages while logging the raw details to the evaluation server for debugging.

### Smart Prioritization Heuristic
The "Priority Inbox" uses a weighted scoring system (located in `src/utils/priority.js`) to make sure users see the most important items.

**The Formula:** `Score = (TypeWeight * 10) + RecencyScore`

1. **Type Weighting**:
   - **Placement (Weight: 3)**: Career-critical updates are the top priority.
   - **Result (Weight: 2)**: Important academic milestones.
   - **Event (Weight: 1)**: Informational campus updates.

2. **Recency Decay**:
   - Uses an exponential decay function: `e^(-ageHours / 24)`.
   - This gives a "half-life" of about 24 hours, meaning notifications lose their priority score as they age.

3. **Hierarchical Consistency**:
   - The `Weight * 10` multiplier ensures that category hierarchy is maintained. Even an old Placement notification will still rank higher than a brand-new Event, keeping high-priority alerts at the forefront.
