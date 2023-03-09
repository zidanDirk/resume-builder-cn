import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Resume from "./components/Resume";

const App = () => {
  //👇🏻 设置生成的结果
  // 由 Home 组件生成，Resume 组件消费
  const [result, setResult] = useState({});
  return (
      <div>
          <BrowserRouter>
              <Routes>
                  <Route path='/' element={<Home setResult={setResult} />} />
                  <Route path='/resume' element={<Resume result={result} />} />
              </Routes>
          </BrowserRouter>
      </div>
  );
};

export default App;

