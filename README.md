# Moving Average Calculator

The Moving Average Calculator is a tool that computes the moving average of time-series data over a user-specified number of days. This application allows users to select an instrument from a dataset and input the number of days for the moving average calculation. It then outputs the average values for the selected period, helping to smooth out short-term fluctuations and highlight longer-term trends in the data



## 🛠 Tech Stack

- **Backend**: Python, Flask
- **Frontend**: React, Vite
- **Package Managers**:
  - `pip` for backend dependencies
  - `npm` or `yarn` for frontend dependencies

## Coding Choices
- **Backend**: Flask is used for its simplicity and ease of use in building RESTful APIs. It allows for quick development and is lightweight.
- **Frontend**: React with Vite is chosen for its fast development experience and modern features. Vite provides a great development server and build tool, making it easy to work with React.
- **Data Sorting and Cleaning**: Created a separate function to handle data sorting and cleaning. This function is responsible for preparing the dataset for later analysis and visualization.
- **Moving Average Calculation**: Implemented a function to calculate the moving average of the dataset. The rolling window function from pandas is used to compute the average for a moving window of prices.
- **API endpoints**: Created two enpoints, for both the calculation of the moving average, and to get the amount of instruments in the giving dataset
- **Visualization**: Used recharts for data visualization. It provides a simple way to create interactive charts and graphs, making it easy to visualize the moving average data.
---


## ⚙️ Prerequisites

- Python 3.12.4
- Node.js v18.18.0
- npm or yarn

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Dyrwing/Moving-Average-Calculator.git
cd Moving-Average-Calculator
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
```
Activate the virtual environment:

- On Windows:
```bash
venv\Scripts\activate
```
- On macOS/Linux:
```bash
source venv/bin/activate
```

Install required dependencies:
```bash
pip install -r requirements.txt
```
Run the Flask server:
```bash
python server.py
```
The server should start on http://localhost:5000 by default.


### 3. Frontend Setup

Navigate to the my-app directory in another terminal:
```bash
cd my-app
```
Install dependencies:
```bash
npm install
```
or if you use yarn:
```bash
yarn
```
Start the development server:
```bash
npm run dev
```
or with yarn:
```bash
yarn dev
```
The Vite development server should start on http://localhost:5173 by default. You can access the frontend application in your web browser.

## Development
To work on this project, you'll need to run both the backend and frontend servers simultaneously.

Start the backend server in one terminal following the backend setup instructions.
Start the frontend development server in another terminal following the frontend setup instructions.

