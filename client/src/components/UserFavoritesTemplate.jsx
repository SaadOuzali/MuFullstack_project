import { useEffect, useState } from "react";
// import table_1 from "./table_1.png";
// import { mainAxiosInstance } from "../config/api";
import request from "./axios";
const UserFavoritesTemplate = () => {
  const [customer, setCustomer] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await request.get("/v1/customers/profile"); //mainAxiosInstance
        console.log("RESPONSE: ", response);
        const responseData = response.data.data[0];
        console.log("RESPONSE FETCHING CUSTOMER: ", responseData);
        setCustomer(responseData);
      } catch (e) {
        console.log("ERROR UGH FETCHING Customer", e.message);
      }
    };
    fetchCustomer();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await request.get("/v1/products/"); //mainAxiosInstance
        console.log("RESPONSE: ", response);
        const responseData = response.data.data;
        console.log("RESPONSE FETCHING PRODUCTS: ", responseData);
        setProducts(responseData);
      } catch (e) {
        console.log("ERROR FETCHING Products", e.message);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <div>
        <div className="container" style={{ marginTop: "10%" }}>
          <div className="row">
            <div className="col-md-12 ps-4 d-flex gap-5">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="custom-icon-size"
                >
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              </div>
              <div className="d-flex flex-column justify-content-end">
                <h1 className="fw-bold">My Favorite Products</h1>
                <h5 className="fw-bold">
                  {customer.first_name} {customer.last_name}
                </h5>
              </div>
            </div>
            <div
              className="row mx-auto my-auto gap-2 mt-5 justify-content-evenly"
              style={{ width: "90%", height: "100%" }}
            >
              {products.map((product) => (
                <div
                  className="card col-md-4 mb-3"
                  style={{ width: "18rem" }}
                  key={product.id}
                >
                  <img
                    src={product.product_img}
                    className="card-img-top pt-5 pb-3"
                    alt="table_1"
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-start">
                      <h5 className="card-title fw-bold">
                        {product.product_name}
                      </h5>
                    </div>
                    <div className="d-flex">
                      <p className="col-8 d-flex justify-content-start">
                        {product.sku}
                      </p>
                      <p className="col-4 d-flex justify-content-end">
                        {product.price}
                      </p>
                    </div>
                    <div className="d-flex flex-row justify-content-between">
                      <div className="d-flex flex-column justify-content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="favorite-icon-size"
                        >
                          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                      </div>
                      <button
                        className="btn btn-outline-secondary style_button_product d-flex justify-content-start fw-bold"
                        style={{ borderRadius: "10px" }}
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFavoritesTemplate;
