import requests
import json
import pandas as pd
import talib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# print("Hi!")
# Retrieve the data from the Hydradx API
def get_data():

  url = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"

  # json query to get first 100 daily price data for LINK token from Uniswap v2 subgraph
  query = """query{ tokenDayDatas(where: {token: "0x514910771af9ca656af840dff83e8264ecf986ca"}, 
            first: 200) {
            priceUSD
            }
         }
        """
            
  #headers
  headers = {
           "Content-Type": "application/json",
            "Accept": "application/json"
          }

  # Send the request and parse the response
  try:
    response = requests.post(url, json={'query': query}, headers=headers)
    if response.status_code == 200:
      data = response.json()
      # Convert the data to a Pandas DataFrame
      data_df = pd.DataFrame(data['data']['tokenDayDatas'])
      data_df = data_df.astype(float)
      
      # Calculate 7-day moving average
      data_df['MA_7'] = data_df['priceUSD'].rolling(window=7, min_periods=7).mean()

      # Calculate 14-day relative strength index (RSI)
      delta = data_df['priceUSD'].diff()
      gain = delta.where(delta > 0, 0)
      loss = -delta.where(delta < 0, 0)
      average_gain = gain.rolling(window=14).mean()
      average_loss = loss.rolling(window=14).mean()
      rs = average_gain / average_loss
      data_df['RSI_14'] = 100 - (100 / (1 + rs))

      # 20-day moving average
      data_df['MA_20'] = data_df['priceUSD'].rolling(window=20, min_periods=7).mean()

      # 50-day moving average
      data_df['MA_50'] = data_df['priceUSD'].rolling(window=50, min_periods=7).mean()

      # Bollinger Bands
      data_df['upper_band'], data_df['middle_band'], data_df['lower_band'] = talib.BBANDS(data_df['priceUSD'], matype=talib.MA_Type.T3)

      # MACD
      data_df['macd'], data_df['macd_signal'], data_df['macd_hist'] = talib.MACD(data_df['priceUSD'], fastperiod=12, slowperiod=26, signalperiod=9)

      # Convert the data to a JSON string and print
      print(data_df.to_json())

      # Return data_df with last 100 values only
      return data_df.tail(100)
    else:
      print("An error occurred:", response.status_code)
  except requests.exceptions.RequestException as e:
    print("An error occurred:", e)

print(get_data())

@app.route('/update-chart', methods=['GET'])
def update_chart():
  # Get the data from the Hydradx API
  data_df = get_data()
  
  # Convert the data to a JSON string
  data_json = data_df.to_json()

  # Send the data back as a response
  return data_json

# Run the Flask app
app.run(port=3000)