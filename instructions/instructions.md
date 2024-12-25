# Product Requirements Document (PRD)

## Project Title
**Swap Progress Dashboard**

## Version
1.1

## Last Updated
2024-12-25

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Objectives](#objectives)
3. [Technology Stack](#technology-stack)
4. [File Structure](#file-structure)
5. [Core Functionalities](#core-functionalities)
    - [1. Project Setup](#1-project-setup)
    - [2. File Upload](#2-file-upload)
    - [3. Data Validation and Storage](#3-data-validation-and-storage)
    - [4. Data Display](#4-data-display)
    - [5. Search Functionality](#5-search-functionality)
    - [6. Visualization Cards](#6-visualization-cards)
6. [Documentation](#documentation)
    - [PostgreSQL Connection](#postgresql-connection)
    - [API Endpoints](#api-endpoints)
    - [Component Documentation](#component-documentation)
7. [Non-Functional Requirements](#non-functional-requirements)
8. [Appendices](#appendices)

---

## Project Overview

**Swap Progress Dashboard** is a web-based application designed to visualize data through charts, maps, and tables. The primary goal is to enable efficient tracking and management of large, ongoing projects. Users will upload Excel or CSV files adhering to a predefined template to the "pmis" website, which is managed by another division within the organization. The scheduler in "pmis" will then transfer this data to the Swap Progress Dashboard for visualization. The visualizations will maintain their state upon page refreshes and update automatically when new data is received. As the "pmis" integration is not yet ready, the current focus is to implement an upload area within the Swap Progress Dashboard.

## Objectives

- **Data Visualization:** Provide clear and consistent visual representations of project data using charts, maps, and tables.
- **Data Integrity:** Ensure that uploaded data conforms to the predefined template and is accurately stored in PostgreSQL.
- **User-Friendly Interface:** Develop an intuitive UI for uploading files, filtering data, and navigating through visualizations.
- **Scalability:** Design the system to handle large datasets and accommodate future feature expansions.
- **Maintainability:** Organize the project structure to facilitate easy maintenance and updates by the development team.

## Technology Stack

- **Frontend Framework:** Next.js 14
- **Styling:** Tailwind CSS, shadcn/ui
- **Icons:** Lucid Icons
- **Database:** PostgreSQL
- **ORM:** Prisma (optional)
- **State Management:** React hooks (consider Zustand or Redux for future scalability)
- **Other Tools:** PostCSS

## File Structure

An organized and minimalistic file structure ensures ease of navigation and scalability. Below is the proposed structure for the Swap Progress Dashboard project:

```
swap-progress/
├── README.md
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── favicon.ico
│   ├── fonts/
│   ├── components/
│   │   ├── UI/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   └── Upload.tsx
│   │   ├── Charts/
│   │   │   ├── BarChart.tsx
│   │   │   ├── MapChart.tsx
│   │   │   └── MatrixTable.tsx
│   │   └── SiteData/
│   │       └── SiteTable.tsx
│   ├── hooks/
│   │   └── useToast.ts
│   └── lib/
│       ├── db.ts
│       └── utils.ts
├── pages/
│   ├── api/
│   │   ├── upload.ts
│   │   └── data/
│   │       └── [fetch].ts
│   └── _app.tsx
├── styles/
│   └── tailwind.css
├── public/
│   └── assets/
│       └── icons/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── package-lock.json
```

### Directory Breakdown

#### 1. Root Directory
- **README.md**: Project documentation and setup instructions
- **package.json**: NPM package configuration and dependencies
- **package-lock.json**: Locked versions of dependencies
- **tsconfig.json**: TypeScript configuration
- **next.config.mjs**: Next.js configuration file
- **tailwind.config.ts**: Tailwind CSS configuration
- **postcss.config.mjs**: PostCSS configuration

#### 2. App Directory (`app/`)
Main application directory containing layout, global styles, fonts, and core components.

- **layout.tsx**: Root layout component defining the overall page structure
- **page.tsx**: Main dashboard page component
- **globals.css**: Global styles and Tailwind CSS imports
- **favicon.ico**: Site favicon

##### Components (`app/components/`)
Organized into subdirectories based on functionality:

###### UI Components (`app/components/UI/`)
Reusable UI components:
- **Button.tsx**: Reusable button component with various styles
- **Card.tsx**: Container component for dashboard sections
- **SearchBar.tsx**: Search input component with filtering functionality
- **Dropdown.tsx**: Reusable dropdown/select component
- **Upload.tsx**: File upload component with drag-and-drop support

###### Charts (`app/components/Charts/`)
Data visualization components:
- **BarChart.tsx**: Bar chart component for metrics visualization
- **MapChart.tsx**: Map component for geographical data display
- **MatrixTable.tsx**: Matrix visualization component for planning data

###### Site Data (`app/components/SiteData/`)
- **SiteTable.tsx**: Component for displaying and managing site-specific data

##### Hooks (`app/hooks/`)
Custom React hooks for reusable logic:
- **useToast.ts**: Hook for managing toast notifications
- **useAuth.ts**: Authentication state management
- **useFilter.ts**: Data filtering logic
- **useUpload.ts**: File upload state management

##### Library (`app/lib/`)
Utility functions and helpers:
- **db.ts**: Database connection and query utilities
- **utils.ts**: General utility functions
- **types.ts**: TypeScript type definitions
- **constants.ts**: Application constants

##### Fonts (`app/fonts/`)
Custom font files and configurations

#### 3. Pages Directory (`pages/`)
API routes and special Next.js pages:

##### API Routes (`pages/api/`)
- **upload.ts**: File upload endpoint handler
- **data/[fetch].ts**: Dynamic API route for data fetching
- **auth/**: Authentication-related API endpoints

#### 4. Styles Directory (`styles/`)
CSS and styling configurations:
- **tailwind.css**: Tailwind CSS entry point and custom styles

#### 5. Public Directory (`public/`)
Static assets and resources:
- **assets/**: Static files like images and icons
  - **icons/**: SVG and other icon files
  - **images/**: Static images used in the application

#### 6. Prisma Directory (`prisma/`)
Database schema and migrations:
- **schema.prisma**: Database schema definition
- **migrations/**: Database migration files
  - **YYYYMMDDHHMMSS_migration_name.sql**: Individual migration files

### File Details and Responsibilities

#### Core Application Files
1. **layout.tsx**
   ```typescript
   // Root layout component
   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <html lang="en">
         <body>{children}</body>
       </html>
     )
   }
   ```

2. **page.tsx**
   ```typescript
   // Main dashboard page
   export default function Dashboard() {
     return (
       <main>
         <FilterCard />
         <VisualizationCards />
         <SiteDataTable />
       </main>
     )
   }
   ```

#### Configuration Files
1. **next.config.mjs**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     experimental: {
       serverActions: true,
     },
   }
   
   export default nextConfig
   ```

2. **tailwind.config.ts**
   ```typescript
   import type { Config } from 'tailwindcss'

   const config: Config = {
     content: [
       './pages/**/*.{js,ts,jsx,tsx,mdx}',
       './components/**/*.{js,ts,jsx,tsx,mdx}',
       './app/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   export default config
   ```

3. **prisma/schema.prisma**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   model Site {
     id        String   @id
     name      String
     cluster   String
     latitude  Float
     longitude Float
     // Additional fields...
   }
   ```

### Directory Usage Guidelines

1. **Component Organization**
   - Place reusable UI components in `components/UI/`
   - Keep data visualization components in `components/Charts/`
   - Maintain data-specific components in `components/SiteData/`

2. **State Management**
   - Use custom hooks in `hooks/` for shared state logic
   - Keep complex state management solutions organized in `lib/`

3. **API Routes**
   - Organize API endpoints by feature in `pages/api/`
   - Use dynamic routes for flexible data fetching

4. **Static Assets**
   - Store all static files in appropriate subdirectories of `public/`
   - Maintain clear organization of assets by type

5. **Database Management**
   - Keep database schema in `prisma/schema.prisma`
   - Maintain migrations in `prisma/migrations/`

### File Naming Conventions

1. **Components**
   - Use PascalCase for component files (e.g., `Button.tsx`)
   - Include `.tsx` extension for TypeScript React files

2. **Utilities and Hooks**
   - Use camelCase for utility files (e.g., `utils.ts`)
   - Prefix hooks with `use` (e.g., `useToast.ts`)

3. **Configuration Files**
   - Use lowercase with appropriate extensions
   - Follow standard naming conventions for config files

### Version Control Considerations

1. **.gitignore**
   ```
   node_modules/
   .next/
   .env
   .env.*
   !.env.example
   ```

2. **Environment Variables**
   - Keep `.env.example` in version control
   - Document required environment variables

## Core Functionalities

### 1. Project Setup

**Tasks:**
- Install and configure Tailwind CSS, shadcn/ui, Lucid Icons, and PostgreSQL client libraries.
- Set up PostgreSQL connection using Prisma (optional) or another ORM.

**Deliverables:**
- A working Next.js project scaffold connected to PostgreSQL.
- Basic configurations for Tailwind CSS and shadcn/ui.

### 2. File Upload

**Description:**
Implement a feature that allows users to upload Excel or CSV files through the Swap Progress Dashboard.

**Components:**
- **Upload Button (`components/UI/Button.tsx`):** A reusable button component for triggering file uploads.
- **Upload Area (`components/UI/Upload.tsx`):** Interface for selecting and uploading files.

**Functional Steps:**
1. **User Action:** User selects a file using the upload interface.
2. **System Response:**
   - The file is sent to the backend via the `/api/upload` API endpoint.
   - The backend validates the file format and headers.
   - Valid data is stored in PostgreSQL.
3. **Feedback:** Confirmation message "File uploaded successfully" is displayed to the user upon successful upload.

**Example Workflow:**
- **User Action:** Clicks the "Upload" button and selects an Excel file.
- **System Response:** Validates the file and stores data in the database.
- **Feedback:** Displays "File uploaded successfully" upon successful upload.

### 3. Data Validation and Storage

**Description:**
Ensure that the uploaded files adhere to the predefined template and all required headers are present before storing the data in PostgreSQL.

**Functional Steps:**
1. **Parse the Uploaded File:**
   - Extract headers from row 2 of the Excel/CSV file.
   - Extract data starting from row 3.
2. **Validate Headers:**
   - Compare extracted headers with the predefined template.
   - Ensure all required columns are present.
3. **Store Data:**
   - If headers match, proceed to store data in the PostgreSQL database.
   - If headers do not match, return an error message to the user specifying the missing or incorrect headers.

### 4. Data Display

**Description:**
Display the uploaded data in a tabular format on the dashboard, ensuring synchronization between the frontend and the PostgreSQL database.

**Components:**
- **SiteTable (`components/SiteData/SiteTable.tsx`):** Displays data in a table with pagination and sorting.
- **SearchBar (`components/UI/SearchBar.tsx`):** Enables users to search and filter data within the table.

**Functional Steps:**
1. **Data Fetching:**
   - Fetch data from PostgreSQL via the `/api/data/fetch` endpoint.
2. **Rendering:**
   - Render the data in the `SiteTable` component.
3. **Synchronization:**
   - Ensure data consistency between the frontend and the database by implementing real-time updates or periodic fetching.

### 5. Search Functionality

**Description:**
Provide a search bar to allow users to navigate and filter data within the table efficiently.

**Components:**
- **SearchBar (`components/UI/SearchBar.tsx`):** Input field for entering search queries.

**Functional Steps:**
1. **User Interaction:** User enters a search term in the search bar.
2. **Data Filtering:**
   - The table filters data based on the search query.
   - Display only the rows that match the search criteria.
3. **Dynamic Updates:** As the user types, the table updates in real-time to reflect the filtered data.

### 6. Visualization Cards

#### 6.1. Card Filter

**Components:**
- **Filter Component (`components/UI/Filter.tsx`):** Contains dropdowns for various filters.

**Filters Include:**
- Province
- City
- MC Cluster
- Scope of Work
- NC Cluster
- Scope Category
- RAN Scope

**Functional Steps:**
1. **User Selection:** User selects filter options from the dropdowns.
2. **Interrelated Filters:** Selecting one filter may affect the options available in others.
3. **Data Update:** Apply the filters to update the displayed data and visualizations accordingly.

#### 6.2. Card BarChart

**Description:**
Displays various survey and operational metrics over time.

**Metrics Displayed:**
- Survey BF
- Survey AF
- MOS BF
- MOS AF
- Cutover BF
- Cutover AF
- Dismantle BF
- Dismantle AF

**Axes:**
- **Y-Axis:** Metrics listed above.
- **X-Axis:** Dates, grouped by month-year.

**Functional Steps:**
1. **Data Fetching:** Fetch relevant data based on applied filters.
2. **Data Grouping:** Group data by month and year.
3. **Rendering:** Render the bar chart with the grouped data.

#### 6.3. Card Map

**Description:**
Visualizes project sites on a map based on their geographical coordinates.

**Features:**
- Display site locations using latitude and longitude.
- Cluster nearby sites for better readability.

**Functional Steps:**
1. **Data Retrieval:** Retrieve site coordinates (`lat`, `long`) from the database.
2. **Map Rendering:** Plot points on the map using a mapping library.
3. **Clustering:** Implement clustering to group nearby sites for improved map readability.

#### 6.4. Card Matrix

**Description:**
Displays a matrix table showing project zones and monthly planning data.

**Structure:**
- **Columns:** Zone, M1 to M12 (representing planning months)
- **Rows:** East and West zones, further divided into MC Clusters
- **Details:** Option to view weekly details (e.g., W1, W53)

**Functional Steps:**
1. **Data Fetching:** Fetch planning data from the database.
2. **Data Organization:** Organize data into the matrix structure based on zones and months.
3. **Rendering:** Render the matrix table with expandable rows for weekly details.

#### 6.5. Card Site Data

**Description:**
Displays detailed information about each project site.

**Components:**
- **SiteTable (`components/SiteData/SiteTable.tsx`):** Table with site-specific details.

**Columns:**
- Site ID
- Site Name
- MC Cluster

**Functional Steps:**
1. **Data Fetching:** Fetch detailed site data from the database.
2. **Rendering:** Render data in a table format.
3. **Interactivity:** Allow sorting and filtering within the table.

## Documentation

### PostgreSQL Connection

**Description:**
Establishing a secure and efficient connection between the Next.js application and the PostgreSQL database.

**Steps:**

1. **Install PostgreSQL Client:**
   Ensure that the `pg` package is installed in your project:
   ```bash
   npm install pg
   ```

2. **Configuration:**
   Create a configuration file (`lib/db.ts`) to manage the database connection.

3. **Environment Variables:**
   Store sensitive information like database credentials in environment variables (`.env`):
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/swap_progress
   ```

4. **Connection Handling:**
   Utilize connection pooling to manage multiple database connections efficiently.

**Example Configuration:**

```typescript
// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
```

### API Endpoints

**Description:**
Define the serverless functions that handle various backend operations such as file uploads and data fetching.

#### 1. Upload Endpoint (`/api/upload`)

**Method:** `POST`

**Description:**
Handles the uploading of Excel or CSV files, validates the data, and stores it in PostgreSQL.

**Request:**
- **Headers:** `Content-Type: multipart/form-data`
- **Body:** File data (Excel or CSV)

**Response:**
- **Success (200):**
  ```json
  {
    "message": "File uploaded successfully",
    "dataCount": 150
  }
  ```
- **Failure (400):**
  ```json
  {
    "error": "Invalid file format. Missing headers: [scope_category, ran_scope]"
  }
  ```

#### 2. Data Fetching Endpoint (`/api/data/fetch`)

**Method:** `GET`

**Description:**
Retrieves data from PostgreSQL based on optional query parameters for filtering.

**Request:**
- **Query Parameters:** `province`, `city`, `mcCluster`, `scopeOfWork`, `ncCluster`, `scopeCategory`, `ranScope`

**Example Request:**
```http
GET /api/data/fetch?province=BANTEN&city=PANDEGLANG HTTP/1.1
```

**Response:**
```json
{
  "data": [
    {
      "siteId": "11PDG0001",
      "siteName": "UJUNG_JAYA_PDG_EP",
      "mcCluster": "MC-PANDEGLANG"
    }
  ],
  "columns": [
    { "Header": "Site ID", "accessor": "siteId" },
    { "Header": "Site Name", "accessor": "siteName" },
    { "Header": "MC Cluster", "accessor": "mcCluster" }
  ]
}
```

### Component Documentation

Detailed information about each reusable component within the application, including their props and usage.

## Non-Functional Requirements

- **Performance:** The application should load within 3 seconds and handle large datasets without significant lag.
- **Scalability:** Design should accommodate future additions of new visualizations and data sources.
- **Security:** Implement proper validation and sanitization of uploaded files to prevent security vulnerabilities. Use HTTPS for secure data transmission.
- **Usability:** Intuitive UI/UX design to ensure ease of use for all users.
- **Reliability:** Ensure high availability and minimal downtime. Implement error handling and logging mechanisms.
- **Maintainability:** Code should be well-documented and follow best practices to facilitate future maintenance and updates.

## Appendices

### A. Example File Template

Provide a sample Excel or CSV file template that users must follow when uploading data. This ensures consistency and ease of data validation.

**Header Row:** Located at row 2.

**Headers:**

```
system_key	SBOQ.project_type	program_name	project_name	wbs_status	vendor_name	vendor_code	year	scope_of_work	site_category	ran_score	unique_id	site_id	site_name	new_site_id	new_site_name	long	lat	site_type	existing_configuration	rf_config	sales_area	kecamatan	dati_ii	province	mc_cluster	region	region_circle	caf_approved	program_report	program	site_program	site_status	rfc_bf	cutover_bf	cutover_ff	cutover_af	taskmove_date	wh_destination	taskmove_id	area_spider	congestion	survey_ff	survey_af	caf_status	caf_submitted	ic_000010_ff	ic_000010_af	mos_af	mos_bf	mos_ff	ic_000040_af	ic_000040_bf	ic_000040_ff	imp_integ_af	imp_integ_bf	imp_integ_ff	rfs_af	rfs_ff	rfs_bf	issue_category	mw_scope	nano_cluster	pln_upg_scope	po_number	project	region_wise	remarks	scope_category	ran_scope	shelter_type	site_address	site_dismantle_af	site_dismantle_bf	site_dismantle_ff	site_purpose	site_trm_type	status_congest	status_congest_ran	strenghtening_scope	summary_scope	twr_owner	twr_type	imp_ttp	tx_vendor	wh_inbound_af	wh_inbound_bf	wh_inbound_ff	wh_inbound_swap_af	highlevel_issue	network_header	budget_year	rfc_approved	rfc_submitted	hotnews_bf	hotnews_ff	hotnews_af	endorse_bf	endorse_ff	endorse_af	ready_for_acpt_date	hotnews_req	hn_status	atp_endorse_obstacle	final_acceptance_status	ne_atp	fatp_status	pic_obstacle_fatp	pac_accepted_af	pac_accepted_bf	pac_accepted_ff	delay_kk_no	kk_submit	dc_bf	dc_af	delay_status	kk_obstacle	pac_obstacle	pac_status	fac_number	fac_obstacle	fac_status	fac_bf	fac_ff	fac_af	pac_submit	pac_number	hybrid_optimization_ff	hybrid_optimization_af	cluster_acceptance_forecast	cluster_optim_forecast	cluster_acceptance_bf	cluster_acceptance_ff	cluster_acceptance_af	cluster_optimization_bf	cluster_optimization_ff	cluster_optimization_af	cx_post_mr_af	cx_post_mr_ff	post_cxcust_mr_af	post_mr_remarks	donor_site_id1	ps_scope	sequence_update	vendor_dismantle_ran	vendor_dismantle_ps	dc_ff	site_severity	site_result_updated	area	Existing_Site_condition	site_blocking	cme_issue	pwr_cons_bfr	pwr_cons_afr	pwr_cons_status	NAV_existing	NAV_1Day	NAV_7Days	NAV_30Days	Churn_bfr	Churn_afr	Churn_status	Churn_sts_num	RRU_qty_inbound	BBU_qty_inbound	WH_Outbond_ff	WH_Outbond_af	RRU_qty_outbound	BBU_qty_outbound	Hygienes_issues	RET_status	power_status	exal_configuration	Exal_Door_Open	Exal_Main_Failure	Exal_rectifier_failure	Exal_genset_running	Exal_genset_Fail	Exal_Low_Fuel	Exal_high_temperature	Exal_battery_Position	Ant_type_sec1	Ant_type_sec2	Ant_type_sec3	Ant_category	Ant_tilting_mec	Filter_low_band	Azimuth_sector	Mec_tilting	Ret_sect1	Ret_sect2	Ret_sect3	cx_acceptance_status	cx_remark	cx_submitted	cx_approved	swap_time	downtime_actual
```

**Example Data:**

| site_id   | site_name          | mc_cluster        | province | city      | scope_of_work    |
|-----------|-------------------|-------------------|----------|-----------|-----------------|
| 11PDG0001 | UJUNG_JAYA_PDG_EP | MC-PANDEGLANG    | BANTEN   | PANDEGLANG| Dismantle Fusion |
| 11PDG0002 | TAMAN_JAYA_MT     | MC-PANDEGLANG    | BANTEN   | PANDEGLANG| Dismantle Fusion |

**Notes:**
- **Header Row:** Located at row 2.
- **Data Rows:** Start from row 3 onward.
- **Mandatory Fields:** Ensure all headers are present and correctly named to avoid validation errors during upload.

### B. User Roles and Permissions

Define different user roles (if applicable) and their permissions within the application.

- **Admin:**
  - Upload files
  - Manage users
  - Access all data and visualizations

- **Viewer:**
  - View data and visualizations
  - Use filters and search functionalities

**Note:** Future enhancements may include additional roles and more granular permissions based on organizational needs.

### C. Glossary

- **PMIS:** Project Management Information System
- **MC Cluster:** Managed Cluster
- **NC Cluster:** Network Cluster
- **RAN Scope:** Radio Access Network Scope
- **BF:** Before
- **AF:** After
- **FF:** Final
- **MOS:** Method of Operation and Maintenance
- **WBS:** Work Breakdown Structure
- **RFS:** Ready for Service
- **MW:** Medium Wave
- **PO:** Purchase Order
- **RRU:** Remote Radio Unit
- **BBU:** Baseband Unit
- **CME:** Customer Management Equipment
- **ATP:** Acceptance Test Procedure
- **FATP:** Final Acceptance Test Procedure
- **PAC:** Project Acceptance Certificate
- **CX:** Customer Experience
- **NAV:** Network Availability
- **TTP:** Technical Testing Procedure
- **TWR:** Tower

## Revision Details

### Incorporation of Excel Header and Data Rows

To ensure clarity and alignment with the developers implementing the project, the PRD has been revised to include detailed information about the Excel file structure, including the header row location and example data. This addition provides the necessary context for data validation and processing within the application.

**Key Additions:**

1. **File Structure Appendix (Appendix A):**
   - Detailed headers as provided by the user.
   - Example data rows to illustrate the expected data format.

2. **File Upload and Data Validation:**
   - Explicit mention that headers are located in row 2.
   - Emphasis on matching headers with the predefined template.
   - Example responses for successful and failed uploads, reflecting real-world scenarios based on the provided data.

3. **API Endpoint Documentation:**
   - Enhanced descriptions to include handling of header rows.
   - Clarified expectations for data parsing and validation processes.

4. **Component Documentation:**
   - Highlighted the role of the `Upload` component in handling the specific file structure.

These revisions ensure that developers have a comprehensive understanding of the data requirements and can implement the functionalities accurately.

## Conclusion

This PRD outlines the necessary components, functionalities, and structure required to develop the Swap Progress Dashboard effectively. By adhering to this document, the development team can ensure that the project meets its objectives, maintains high standards of quality, and provides a robust tool for visualizing and managing large-scale projects.