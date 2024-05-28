import React, { Fragment, useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes/index";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { updateUser as updateUserAction } from "../src/redux/slides/userSlide";
import { resetUser as resetUserAction } from "../src/redux/slides/userSlide";
import * as UserService from "../src/services/UserService";
import LoadingComponent from "./components/LoadingComponent/LoadingComponent";
const App = () => {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDecoded = useCallback(() => {
    let storageData =
      user?.access_token || localStorage.getItem("access_token");
    let decoded = {};

    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  }, [user?.access_token]);
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      let storageRefreshToken = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storageRefreshToken);

      const decodedRefreshToken = jwtDecode(refreshToken);
      if (decoded?.exp < currentTime.getTime() / 1000) {
        if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
          const data = await UserService.refreshToken(refreshToken);
          config.headers["token"] = `Bearer ${data?.access_token}`;
        } else {
          dispatch(resetUserAction());
        }
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleGetDetailUser = useCallback(
    async (id, token) => {
      if (id && token) {
        let storageRefreshToken = localStorage.getItem("refresh_token");
        const refreshToken = JSON.parse(storageRefreshToken);
        const res = await UserService.getDetailsUser(id, token);
        dispatch(
          updateUserAction({
            ...res?.data,
            access_token: token,
            refreshToken: refreshToken,
          })
        );
      } else {
        console.error("Missing id or token");
      }
    },
    [dispatch]
  );
  useEffect(() => {
    setIsLoading(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData);
    }
    setIsLoading(false);
  }, [handleDecoded, handleGetDetailUser]);
  return (
    <div>
      <LoadingComponent isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const Layout = route.isShowHeader ? DefaultComponent : Fragment;
              const isCheckAuth =
                !route.isPrivate || (user.isAdmin && route.isPrivate);
              if (isCheckAuth) {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                );
              }
              return null;
            })}
            {/* <Route path="*" /> */}
          </Routes>
        </Router>
      </LoadingComponent>
    </div>
  );
};

export default App;
