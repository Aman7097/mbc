import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import Login from "../pages/login";
import Signup from "../pages/signup";
import NewChat from "../pages/chat/new-chat";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="/" element={<App />}>
        <Route index element={<NewChat />} />
      </Route>
    </>
  )
);

export default router;
