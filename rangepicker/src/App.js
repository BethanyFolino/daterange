import React from 'react';
import './App.css';
import DatePicker from './DatePicker/DatePicker';

function onChange(timestamp) {
  console.log(timestamp);
}

function App() {
  return (
    <div className="App">
      <h2>Welcome to Date Range Picker!</h2>
      <h4>To use, click on the left date box below.</h4>
      <DatePicker onChange={onChange}/>
    </div>
  );
}

export default App;
