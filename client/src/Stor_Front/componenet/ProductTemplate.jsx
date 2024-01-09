// import "bootstrap/dist/css/bootstrap.min.css";
import SofaImage from "./sofa_1.png";
import "./categories_styles.css";
import { useParams } from "react-router-dom";
import { categorieContexte } from "./Categorie";
import { useContext, useEffect, useState } from "react";
import request from "../../components/axios";
import { AxiosError } from "axios";
import formatCurrency from "../formatCurrency";

const ProductTemplate = () => {
  const { single } = useParams();
  const [prd, setPrd] = useState(null);
  const { categorie, products } = useContext(categorieContexte);
  console.log("hna fproducts single", prd);

  useEffect(() => {
    const fetchproduct = async () => {
      try {
        const findproduct = await request.get(
          `/v1/products/single-product/${single}`
        );
        console.log("hhhhhhhhhh", findproduct.data.data);
        if (findproduct.status === 200) {
          setPrd(findproduct.data.data);
        }
        console.log("hna fproduct", findproduct);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error);
        }
      }
    };
    fetchproduct();
  }, []);

  console.log(prd);
  return (
    <>
      {!prd ? null : (
        <div className="text-center" style={{ height: "100vh" }}>
          <div className="row " style={{ height: "100%" }}>
            <div className="col-md-6 " style={{ backgroundColor: "#dae2ed" }}>
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ margin: "auto", height: "100%" }}
              >
                <img src={prd.product_img} alt="sofa_image" />
              </div>
            </div>
            <div className="col-md-6 ">
              <div
                className="d-flex justify-content-start align-items-start"
                style={{ margin: "auto", height: "100%" }}
              >
                <div className="ms-5 mt-5">
                  <div className="d-flex justify-content-start">
                    <h2 style={{ fontWeight: "700" }}>{prd.product_name} </h2>
                  </div>
                  <div className="pt-1 mb-5 d-flex justify-content-start">
                    <h5 style={{ fontWeight: "700", color: "#858484" }}>
                      {formatCurrency(prd.price)}
                    </h5>
                  </div>
                  <div className="mt-5 d-flex justify-content-start">
                    <p className="text-start" style={{ fontWeight: "500" }}></p>
                  </div>
                  <div className="d-flex justify-content-start">
                    <p
                      className="text-start"
                      style={{ fontWeight: "300", color: "#858484" }}
                    >
                      {prd.long_description}
                    </p>
                  </div>
                  <div className="mt-5 d-flex justify-content-start">
                    <button className="style_button_product btn btn-outline-secondary">
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTemplate;
