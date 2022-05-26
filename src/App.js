import { Outlet, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';

export default function App() {
  return (
    <>
      {/* <h1>Seabook!</h1> */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container px-4 px-lg-5">
          <Link className="navbar-brand" to="/">Seabook</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                  <li className="nav-item"><Link className="nav-link active" to="/">Home</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/stabilimenti">Stabilimenti</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/expenses">Gestione</Link></li>
              </ul>
          </div>
          {/* <Link to="/stabilimenti">Stabilimenti</Link>
          <Link to="/expenses">Expenses</Link> */}
        </div>
      </nav>
      <Outlet />
      <footer class="py-5 bg-dark">
          <div class="container"><p class="m-0 text-center text-white">Copyright &copy; Seabook 2021</p></div>
      </footer>
    </>
  );
}

// <!-- Navigation-->
// <nav class="navbar navbar-expand-lg navbar-light bg-light">
// <div class="container px-4 px-lg-5">
//     <a class="navbar-brand" href="#!">Start Bootstrap</a>
//     <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
//     <div class="collapse navbar-collapse" id="navbarSupportedContent">
//         <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
//             <li class="nav-item"><a class="nav-link active" aria-current="page" href="#!">Home</a></li>
//             <li class="nav-item"><a class="nav-link" href="#!">About</a></li>
//             <li class="nav-item dropdown">
//                 <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Shop</a>
//                 <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
//                     <li><a class="dropdown-item" href="#!">All Products</a></li>
//                     <li><hr class="dropdown-divider" /></li>
//                     <li><a class="dropdown-item" href="#!">Popular Items</a></li>
//                     <li><a class="dropdown-item" href="#!">New Arrivals</a></li>
//                 </ul>
//             </li>
//         </ul>
//         <form class="d-flex">
//             <button class="btn btn-outline-dark" type="submit">
//                 <i class="bi-cart-fill me-1"></i>
//                 Cart
//                 <span class="badge bg-dark text-white ms-1 rounded-pill">0</span>
//             </button>
//         </form>
//     </div>
// </div>
// </nav>


/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/


