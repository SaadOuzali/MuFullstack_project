import { Stack } from "@mui/material";
import Stripe from "react-stripe-checkout";
import request from "../../components/axios";
import { toast } from "react-toastify";
import { useContext, useMemo } from "react";
import { Shoppigncartcontexte } from "./contexte/CartShoppingContexte";
import { AxiosError } from "axios";

export default function Payment() {
  const { cartItems, TotalPrice, initialState, setCartItems } =
    useContext(Shoppigncartcontexte);
  
  const productid = useMemo(() => {
    return cartItems.map((prd) => {
      return { product_id: prd.id,quantity:prd.quantity };
    });
  }, [cartItems]);
  console.log("payement", productid);
  const handletocken = async (token) => {
    try {
      const data = await request.post("/v1/orders/", {
        token: token.id,
        cart_total_price: TotalPrice,
        order_items: productid,
      });
      console.log(data);
      if (data.status === 200) {
        localStorage.removeItem("cartshopping");
        setCartItems(initialState());
        toast.success("order created successfully");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response.status === 500) {
          toast.error(
            error.response.data?.message ?? "Couldn't create product"
          );
        }
      }
    }
  };
  const tokenhandler = (token) => {
    handletocken(100, token);
  };

  return (
    <Stack>
      <Stripe
        stripeKey="pk_test_51ORxDnGNELl2suuZYmOZaJywBzM3stNrsquEo2MPlGrjPbSZBke2uvkTT1qj0NMJC00y0agZ33iZCAxjQwvy0TZv00GGIzK7de"
        token={tokenhandler}
      />
    </Stack>
  );
}
