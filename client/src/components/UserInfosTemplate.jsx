import { useEffect, useState } from "react";
import "../styles/profile_style.css";
// import axios from "axios";
// import { mainAxiosInstance } from "../config/api";
import { toast } from "react-toastify";
import request from "./axios";

const UserInfosTemplate = () => {
  const [customer, setCustomer] = useState({});
  const [inputData, setInputData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    console.log("hello! ");
    const fetchCustomer = async () => {
      try {
        const response = await request.get("/v1/customers/profile"); //mainAxiosInstance
        console.log("hello! ", response);
        const responseData = response.data.data[0];
        console.log("Fetched customer: ", responseData);
        setCustomer(responseData);
        setInputData({ ...responseData });
      } catch (error) {
        console.error("ERROR UGH fetching Customer data: ", error.message);
      }
    };
    fetchCustomer();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateUrl = `/v1/customers/profile/update`;
    try {
      const response = await request.patch(updateUrl, inputData); //mainAxiosInstance
      toast.success("Updated successfully");
      console.log("updated response", response.data);
    } catch (e) {
      console.log("ERROR UGH updating customer data: ", e.message);
      toast.error("ERROR updating customer data");
    }
  };

  return (
    <>
      <div className="container" style={{ marginTop: "10%" }}>
        <div className="row">
          <div className="col-md-12 ps-4 mb-4 d-flex gap-5">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="custom-icon-size"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="d-flex flex-column justify-content-end">
              <h1 className="fw-bold">My Account</h1>
              <h5 className="fw-bold">
                {customer.first_name} {customer.last_name}
              </h5>
            </div>
          </div>
          <div className="col-md-12 row gap-3 m-auto">
            <form className="w-100" onSubmit={handleSubmit}>
              <div className="row justify-content-center mt-5">
                <div className="col-md-6 mb-3">
                  <label htmlFor="">First Name:</label>
                  <input
                    type="text"
                    className="form-control input-form-profile"
                    name="first_name"
                    // placeholder={customer.first_name}
                    value={inputData.first_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="">Last Name: </label>
                  <input
                    type="text"
                    className="form-control input-form-profile"
                    name="last_name"
                    value={inputData.last_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="">Email Address: </label>
                  <input
                    type="text"
                    className="form-control input-form-profile"
                    name="email"
                    value={inputData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="">Password: </label>
                  <input
                    type="text"
                    className="form-control input-form-profile"
                    name="password"
                    value={inputData.password}
                    onChange={handleInputChange}
                  />
                </div>
                {/* <div className="col-md-6 mb-3">
                  <label htmlFor="">Location: </label>
                  <input
                    type="text"
                    className="form-control input-form-profile"
                    placeholder="Location"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="">Phone Number: </label>
                  <input
                    type="text"
                    className="form-control input-form-profile"
                    placeholder="Phone Number"
                  />
                </div> */}
              </div>
              <div className="text-center mt-5">
                <button className="black_button_profile fw-bold w-25">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserInfosTemplate;
