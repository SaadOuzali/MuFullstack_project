import { useContext, useEffect } from "react";
import { Customercontexte } from "../Parent";
import { Outlet, useNavigate } from "react-router-dom";
import request from "../../../components/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export default function PrivateRouteCustomer() {
  const { customer, setCustomer } = useContext(Customercontexte);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const data = await request.post("/v1/customers/token");
        if (data.status === 200) {
          setCustomer((prev) => {
            return {
              ...prev,
              customerData: data.data.data,
              iscustConnected: true,
            };
          });
        }
        console.log(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response.status === 401) {
            toast.error("your session expired login again");
            navigate("/home/login");
          }
          console.log(error.response);
        }
      }
    };
    if(!customer.iscustConnected){
      verifyToken();
    }
  }, []);

  return !customer.iscustConnected ? (
    ""
  ) : (
    <>
      <Outlet />
    </>
  );
}
