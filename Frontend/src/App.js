import './App.css';
import ClientRouter from './clientRouter/ClientRouters';
import { Toaster } from "react-hot-toast";

<link
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  rel="stylesheet"
/>

function App() {
  return (
    <div className="App">
      <div>
        <Toaster position="top-right" />
      </div>
      <ClientRouter />
    </div>
  );
}

export default App;