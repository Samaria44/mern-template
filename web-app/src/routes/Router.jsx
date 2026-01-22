import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import { Login } from "../pages/auth/Login";
import { NotFound } from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import withAuthRedirect from "./withAuthRedirect";
import { Settings } from "../pages/Settings";
import { Users } from "../pages/User";
import { Project } from "../pages/Project";
import { Department } from "../pages/Department";
import Permission from "../pages/Permission";
import { useAuth } from "../contexts/authContext";
import Locations from "../pages/Location";
import Store from "../pages/Store";
import ProductDetail from "../pages/ProductDetail";

function hasPermission(entity, permissions) {
  if (permissions[entity]) {
    const { create, read, update, delete: del } = permissions[entity];
    return create || read || update || del;
  }
  return false;
}

export default function Router() {
  const AuthRequiredLogin = withAuthRedirect(Login);

  const { permissions } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthRequiredLogin />} />
        <Route path="/store" element={<Store />} />
        <Route path="/product/:code" element={<ProductDetail />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          {hasPermission("user", permissions) && (
            <Route path="/users" element={<Users />} />
          )}
          {hasPermission("project", permissions) && (
            <Route path="/projects" element={<Project />} />
          )}
          {/* {<Route path="/entities" element={<Entity />} />} */}
          {hasPermission("permission", permissions) && (
            <Route path="/permissions" element={<Permission />} />
          )}
          {hasPermission("department", permissions) && (
            <Route path="/departments" element={<Department />} />
          )}
          {hasPermission("location", permissions) && (
            <Route path="/location" element={<Locations />} />
          )}
          {hasPermission("store", permissions) && (
            <>
              {/* <Route path="/store" element={<Store />} />
              <Route path="/product/:code" element={<ProductDetail />} /> */}
            </>
          )}
         
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
