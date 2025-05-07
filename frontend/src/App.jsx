import { useState } from 'react';
import Routing from './router/Routing';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="layout">
      <Routing />
    </div> )
}

export default App
