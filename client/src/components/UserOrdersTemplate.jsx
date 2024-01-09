import { useCallback, useEffect, useState } from "react";
// import table_1 from "./table_1.png";
// import { mainAxiosInstance } from "../config/api";
import { toast } from "react-toastify";
import request from "./axios";

const UserOrdersTemplate = () => {
  const [customer, setCustomer] = useState({});
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await request.get("/v1/customers/profile"); //mainAxiosInstance
        console.log("hello! ", response);
        const responseData = response.data.data[0];
        console.log("Fetched customer: ", responseData);
        setCustomer(responseData);
      } catch (error) {
        console.error("ERROR UGH fetching Customer data: ", error.message);
      }
    };
    fetchCustomer();
  }, []);

  // useEffect(() => {
  //   const fetchOrder = async () => {
  //     try {
  //       const response = await mainAxiosInstance.get("/v1/orders");
  //       toast.success(response.data.message);
  //       console.log("hiiiii all orders", response);
  //     } catch (error) {
  //       console.log("error fetching order", error.message);
  //     }
  //   };
  //   fetchOrder();
  // }, []);

  useEffect(() => {
    //orders of that customer
    const fetchOrders = async () => {
      try {
        const response = await request.get("/v1/orders/myorders"); //mainAxiosInstance
        if (response.data.status === 404) {
          console.log(response.data.message);
          toast.success(response.data.message || "Orders not found");
        } else {
          console.log("Fetched customer orders: ", response.data);
          toast.success(response.data.message || "Orders found successfully");
          console.log(response.data.data);
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("ERROR UGH fetching Order data: ", error.message);
        toast.error(error.message || "Error fetching Orders data");
      }
    };
    fetchOrders();
  }, []);

  const formatDate = useCallback((dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <>
      <div>
        <div>
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
                    <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
                  </svg>
                </div>
                <div className="d-flex flex-column justify-content-end">
                  <h1 className="fw-bold">My Orders</h1>
                  <h5 className="fw-bold">
                    {customer.first_name} {customer.last_name}
                  </h5>
                </div>
              </div>
              <div
                className="row mx-auto my-auto gap-2 mt-5 justify-content-evenly"
                style={{ width: "90%", height: "100%" }}
              >
                {orders.map((order) => (
                  <div
                    className="card col-md-4 mb-3"
                    style={{ width: "18rem" }}
                    key={order.id}
                  >
                    {/* <img
                      src={table_1}
                      className="card-img-top pt-3 pb-1"
                      alt="table_1"
                    /> */}
                    <div className="card-body">
                      <div className="d-flex justify-content-start">
                        <h5 className="card-title fw-bold">
                          {order.cart_total_price} dhs
                        </h5>
                      </div>
                      <div className="d-flex">
                        <p className="col-8 d-flex justify-content-start">
                          {formatDate(order.order_date)}
                        </p>
                        <p className="col-4 d-flex justify-content-end">
                          {order.status}
                        </p>
                      </div>
                      <div className="d-flex flex-row justify-content-between">
                        {/* <button
                          className="btn btn-outline-secondary style_button_product d-flex justify-content-start fw-bold"
                          style={{ borderRadius: "10px" }}
                        >
                          View Order
                        </button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserOrdersTemplate;
