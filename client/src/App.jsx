import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import './App.css'
import AdminLogin from "./components/AdminLogin";
import Dashboard from "./components/Dashboard";
import usercontext from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Pagination from "./components/Pagination";
import AddProduct from "./components/productcomponent/CreateProductModal";
import AllProducts from "./components/productcomponent/ProductList";
import EditProduct from "./components/productcomponent/EditProduct";
import Navbar from "./components/user/Navbar";
import Home from "./components/user/Home";
import User from "./components/users/User";

import Barchart from "./statistics/Barchart";
import PieChart from "./statistics/PieChart";
import Orders from "./orders/Orders";
import SingleOrder from "./orders/SingleOrder";
import App_Front from "./Stor_Front/App_Front";
import Registre from "./Stor_Front/componenet/Register";
import CartShoppingprovider from "./Stor_Front/componenet/contexte/CartShoppingContexte";
import Parent from "./Stor_Front/componenet/Parent";
import { ColorModeContext, useMode } from "./Stor_Front/them";
import Child from "./Stor_Front/componenet/Child";
import ProductList from "./components/productcomponent/ProductList";
import CategoryTemplate from "./Stor_Front/componenet/CategoryTemplate";
// import "bootstrap/dist/css/bootstrap.css";
import SubCategoryTemplate from "./Stor_Front/componenet/SubCategoryTemplate";
import Categorie from "./Stor_Front/componenet/Categorie";
import Subcategory from "./components/Subcategory/Subcategory";
import CreateNewSubcategory from "./components/Subcategory/CreateNewSubcategory";
import Payment from "./Stor_Front/componenet/Payment";
import ProductTemplate from "./Stor_Front/componenet/ProductTemplate";
import LoginTemplate from "./Stor_Front/componenet/customer/LoginTemplate";
import SignupTemplate from "./Stor_Front/componenet/customer/SignupTemplate";
import CustomerInfosTemplate from "./Stor_Front/componenet/customer/CustomerInfosTemplate";
import VerifyEmail from "./Stor_Front/componenet/customer/VerifyEmail";
import PrivateRouteCustomer from "./Stor_Front/componenet/customer/PrivateRouteCustomer";
import UserInfosTemplate from "./components/UserInfosTemplate";
import UserFavoritesTemplate from "./components/UserFavoritesTemplate";
import UserOrdersTemplate from "./components/UserOrdersTemplate";
import Loading from "./components/Loading";
import PageNotFound from "./components/NotFoundPage";

// import Home from './components/Home'
function App() {
  const [theme, colorMode] = useMode();

  const [userdata, setUserdata] = useState({ Data: null, isConnected: false });
console.log("hna flappp");
console.log("hna flappp",userdata);
console.log("hna flappp",);

  return (
    <usercontext.Provider value={{ userdata, setUserdata }}>
      <ColorModeContext.Provider value={{ theme, colorMode }}>
        <CartShoppingprovider>
          <BrowserRouter>
            <Routes>
              {/* <--- User Routes */}
              <Route element={<PrivateRoute />}>
                {/* 
              Outlet = My Nested Route
              (ex: route: /
                --> Outlet = Home
                --> Result = (
                  <Box sx={{ display: "flex" }}>
                    <CssBaseline />

                    <Bar open={open} setOpen={setOpen} />

                    <AsideBar open={open} setOpen={setOpen} theme={theme} />

                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <DrawerHeader theme={theme} />
                      <Home />
                    </Box>
                  </Box>
                )
                
                )
            */}

                <Route path="/" element={<Home />} />
                <Route path="users" element={<User />} />
                <Route
                  path="create/subcategory"
                  element={<CreateNewSubcategory />}
                />
                <Route path="subcategory" element={<Subcategory />} />
                <Route path="orders" element={<Orders />} />
                <Route path="singleorder/:id" element={<SingleOrder />} />
                <Route path="product" element={<ProductList />} />
                <Route path="barchart" element={<Barchart />} />
                <Route path="piechart" element={<PieChart />} />
                <Route path="product/edit" element={<EditProduct />} />
              </Route>

              {/* <Route path='/dasboard' element={<Dashboard/>} /> */}
              <Route path="/users/login" element={<AdminLogin />} />
              {/* <Route path='/pagination' element={<Pagination/>} /> */}
              <Route path="/pagination" element={<Pagination />}>
                <Route path="add" element={<AddProduct />} />
              </Route>
              {/* </--- User Routes */}


              {/* <--- Customer Routes */}
              <Route path="/landing_page" element={<App_Front />} />
              <Route path="/registre" element={<Registre />} />
              {/* <Route path="/drawer" element={<Drawer />} /> */}
              {/* <Route path="/payment" element={<Payment/>} /> */}
              <Route path="/home" element={<Parent />}>
                <Route path="customer" element={<PrivateRouteCustomer />}>
                  <Route path="profile" element={<UserInfosTemplate />} />
                  <Route path="payment" element={<Payment />} />
                </Route>
                <Route index element={<Child />} />
                <Route path="login" element={<LoginTemplate />} />

                <Route path="validate_account" element={<VerifyEmail />} />
                <Route path="signup" element={<SignupTemplate />} />
                {/* <Route path="payment" element={<Payment/>} /> */}
                <Route path=":slug" element={<Categorie />}>
                  <Route index element={<CategoryTemplate />} />
                  <Route path=":single" element={<ProductTemplate />} />
                  <Route
                    path=":Slug/products"
                    element={<SubCategoryTemplate />}
                  />
                </Route>

                <Route
                  path="profile/information"
                  element={<UserInfosTemplate />}
                />
                <Route
                  path="profile/favorites"
                  element={<UserFavoritesTemplate />}
                />
                <Route path="profile/orders" element={<UserOrdersTemplate />} />
                <Route path="loading" element={<Loading />} />
                <Route path="pagenotfound" element={<PageNotFound />} />
              </Route>
              {/* </--- Customer Routes */}

            </Routes>
          </BrowserRouter>
        </CartShoppingprovider>
      </ColorModeContext.Provider>
    </usercontext.Provider>
  );
}

export default App;
