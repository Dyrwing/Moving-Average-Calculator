import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [instrument, setInstrument] = useState("1");
  const [instruments, setInstruments] = useState([]);
  const [period, setPeriod] = useState("");
  const [movingAverages, setMovingAverages] = useState([]);

  // Fetch instruments from the backend
  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/instruments");

        if (!response.ok) {
          // Handle HTTP errors (e.g., 400, 500)
          const errorData = await response.json();

          throw new Error(errorData.error || "Something went wrong with the request.");
        }
        const data = await response.json();


        setInstruments(data.instruments);
        setInstrument(data.instruments[0]); // Set the first instrument as default

      } catch (error) {

        console.error("Error fetching instruments", error);
        alert("Failed to load instruments", error);
      }
    };

    fetchInstruments();
  }, []);

  const fetchMovingAverage = async () => {
    try {
      console.log("Fetching moving average...");
      // fetch moving averages from the backend
      const response = await fetch("http://127.0.0.1:5000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instrument, period: parseInt(period) }),
      });

      // Check if response is unsuccessful
      if (!response.ok) {
        // Handle HTTP errors (e.g., 400, 500)
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong with the request.");
      }

      const data = await response.json();

      // Ensure the data is mapped correctly for Recharts
      const formattedData = data.moving_averages.map((item) => ({
        date: item.date, // Use actual date from backend
        MovingAverage: item.MA, // Use the "MA" field returned from backend
      }));
      console.log("Formatted data:", formattedData);

      if (data.error) {
        // If there's an error in the data response (e.g., from the backend)
        alert(data.error);
      } else {

        setMovingAverages(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(error);

    }
  };

  const CustomTooltip = ({ payload, label }) => {
    if (payload && payload.length) {

      const { date, MovingAverage } = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '5px',
          padding: '10px',
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
          color: '#333',
          fontSize: '14px',
          fontWeight: 'bold',
        }}>
          <p>{`Date: ${date}`}</p>
          <p>{`MA: ${MovingAverage}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Moving Average Calculator</h1>
      <div className='inputForm'>

        <label>Choose Instrument:</label>
        <select value={instrument} onChange={(e) => setInstrument(e.target.value)}>
          {instruments.map((inst) => (
            <option key={inst} value={inst}>
              Instrument {inst}
            </option>
          ))}
        </select>

        <label>Enter Moving Average Period:</label>
        <input
          type="number"
          value={period}
          placeholder='period...'
          onChange={(e) => setPeriod(e.target.value)}
        />
      </div>


      <br />
      <button onClick={fetchMovingAverage}>Calculate</button>

      <h2>Results:</h2>
      {movingAverages.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={movingAverages}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              domain={[
                Math.min(...movingAverages.map((item) => item.MovingAverage)) - 5, // Adding some margin below the min value
                Math.max(...movingAverages.map((item) => item.MovingAverage)) + 5  // Adding some margin above the max value
              ]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="MovingAverage" stroke="#fb264e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}

    </div>
  );
}

export default App
