import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import './css/styles.css';
import './index.css';
import App from "./App";
import Mappa from "./Mappa";
import Expenses from "./routes/expenses";
// import Invoices from "./routes/invoices";
import Stabilimenti from "./routes/stabilimenti"
// import Invoice from "./routes/invoice";

// const rootElement = document.getElementById("root");
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
// root.render(<App tab="home" />);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="expenses" element={<Expenses />} />
        <Route path="stabilimenti" element={<Stabilimenti />}>
          <Route
            index
            element={
              <main style={{ padding: "1rem" }}>
                <p>Select a stabilimento</p>
              </main>
            }
          />
          <Route path=":stabilimentoId" element={<Mappa />} />
        </Route>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>
);

/*import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();*/


// npm install react-router-dom@6
// npm install react react-dom