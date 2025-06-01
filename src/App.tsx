import { useRoutes } from "react-router-dom";
import { routes } from "./routes/routes";
import { Suspense } from "react";
// import Login from "./Log/Login";



// import Register from "./Log/Register";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {useRoutes(routes)}
    </Suspense>
    
  );
}


export default App;
