# User Management & Analytics 

This project is a dynamic and analytics dashboard built using React.js, Redux, TypeScript, and API integration with Redux Thunk. It includes features for user management and analytics visualization.

## Link: **https://user-management-and-analytics.vercel.app**

## Instructions to Run the Project

1. **Clone the Repository**
   ```bash
   gh repo clone Rishi00786/custom-mail-server
   ```
   Alternatively, download the ZIP file from GitHub and extract it.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   Launch the application in development mode:
   ```bash
   npm run dev
   ```

## Features Implemented

### 1. User Management Dashboard
- **Login Page**: Authenticate users using a mock API.
- **Dashboard**: Fetch and display users in a table with actions (view details, delete).
- **Search and Filter**: Filter users by name or email.
- **Pagination**: Paginate the user list (5 users per page).

### 2. Analytics Dashboard
- **Overview Cards**: Display summary metrics such as:
  - Total Users: Count of all fetched users.
  - Active Users: Mock calculation based on a field like "status".
  - Deleted Users: Track the count of deleted users during the session.
- **Charts Section**: Includes the following visualizations:
  - User Registration Trend: A line chart showing user registrations over the past 6 months (mock data).
  - Active vs Inactive Users: A pie chart comparing active and inactive users.
  - Users by Region: A bar chart or map displaying user distribution by regions (mock region data).
- **Filters for Analytics**:
  - Filter by date range and region.
- **Responsive Design**: Fully responsive and mobile-friendly.

### 3. Technical Implementation
- **API Mocking**: Static JSON files or mock APIs used for analytics data.
- **State Management**: Managed using Redux with dedicated slices for users and analytics data.
- **TypeScript**: Strong typing for chart data structures, Redux actions, reducers, selectors, and component props.
- **Charting Library**: Utilized libraries like Chart.js, Recharts, or ApexCharts for visualizations.

---

Enjoy exploring the dynamic dashboard!
