import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChapterReader from "./pages/ChapterReader";

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:book/:chapter' element={<ChapterReader />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
