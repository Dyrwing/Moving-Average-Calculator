from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import json
from datetime import datetime
import pandas as pd


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Function to sort and clean the data


def sort_clean_data(df):
    start_length = len(df)
    # Convert the 'date' column to datetime, invalid parsing will return NaT
    df['date'] = pd.to_datetime(df['date'], errors='coerce')

    # Remove rows where 'date' is NaT (invalid dates)
    df_cleaned_dates = df.dropna(subset=['date'])

    # Converts the datetime objects to a string in the 'YYYY-MM-DD' format.
    df_cleaned_dates['date'] = df_cleaned_dates['date'].dt.strftime('%Y-%m-%d')
    dates_length = len(df_cleaned_dates)

    # calculating lower- and upperbound for cleaning data
    std_dev = df['price'].std()
    mean = df['price'].mean()
    lowerBound = mean - 2 * std_dev
    upperBound = mean + 2 * std_dev

    # Remove rows where 'price' is outside the bounds
    df_cleaned_prices = df_cleaned_dates[(
        df_cleaned_dates['price'] >= lowerBound) & (df_cleaned_dates['price'] <= upperBound)]

    end_length = len(df_cleaned_prices)
    # Inform the user about the number of rows removed
    print(
        f"Removed {start_length - dates_length} rows due to invalid dates, and {dates_length - end_length} rows due to invalid prices.")

    # Sort the DataFrame by 'date'
    df_sorted = df_cleaned_prices.sort_values(by='date')

    return df_sorted


def calculate_moving_average(df, period):
    # calculating moving average, as the average price, in the last 'period' days
    df['MA'] = round(df['price'].rolling(window=period).mean(), 2)
    # Remove rows with NaN values in the 'MA' column
    df = df.dropna(subset=['MA'])

    return df


@app.route("/calculate", methods=["POST"])
def calculate():
    try:
        print("Received request")
        req_data = request.json
        instrument = req_data.get("instrument")
        period = req_data.get("period")

        # Load instruments dynamically from the JSON file
        with open("input_data.json") as f:
            d = json.load(f)
        valid_instruments = [key.replace("Inst", "")
                             for key in d.keys() if key.startswith("Inst")]

        if instrument not in valid_instruments:
            return jsonify({"error": f"Invalid instrument. Valid options are: {', '.join(valid_instruments)}"}), 400

        # Get the data for the selected instrument
        data = d['Inst' + instrument]
        print(f"Selected instrument: {instrument}")
        # Turn into dataframe
        df = pd.DataFrame(data)

        formatted_data = sort_clean_data(df)
        print("Data cleaned and sorted")
        # Validate period (it must be less than the number of rows in the DataFrame)
        num_rows = len(formatted_data)

        if period == None:
            return jsonify({"error": f"Please enter a period. It must be less than {num_rows}, and above 1."}), 400

        if period >= num_rows or period < 1:
            print(
                f"Invalid period. It must be less than {num_rows}, and above 1.")
            return jsonify({"error": f"Invalid period. It must be less than {num_rows}, and above 1."}), 400

        moving_averages = calculate_moving_average(formatted_data, period)

        # Convert DataFrame to JSON
        result = moving_averages.to_dict(orient="records")

        return jsonify({"moving_averages": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Define a route in the Flask app to handle GET requests to "/instruments"
@app.route("/instruments", methods=["GET"])
def get_instruments():
    try:
        print("Received request for instruments")
        # Open and read the JSON file containing instrument data
        with open("input_data.json") as f:
            data = json.load(f)
        # Extract all keys that start with "Inst", remove "Inst" prefix, and store them in a list
        instruments = [key.replace("Inst", "")
                       for key in data.keys() if key.startswith("Inst")]

        return jsonify({"instruments": instruments})
    # Handle exceptions that may occur during file reading or JSON parsing
    except FileNotFoundError:
        return jsonify({"error": "Input data file not found"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
