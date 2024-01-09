import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect, useState } from "react";
// import "./categories_style.css";
import SofaImage from "./sofa_1.png";
// import TableImage from "./table_2.png";
// import WallArtImage from "./wall_art.png";
import "./categories_styles.css";
import axios from "axios";
import request from "../../components/axios";
import { Link, Outlet, useParams } from "react-router-dom";
import { categorieContexte } from "./Categorie";

const CategoryTemplate = () => {
  // const [categories, setCategories] = useState({});
  const { slug } = useParams();
  const { categorie, products } = useContext(categorieContexte);
  console.log("dila category", categorie);
  console.log("dila products", products);

  // useEffect(() => {
  //   console.log("Slug Rendering");
  // }, [])

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const data = await request.get(
  //         `/v1/categories/${slug}`
  //       );
  //       // console.log("dial data",data);
  //       if(data.status === 200){
  //       let responseData = data.data;

  //       setCategories(responseData.data );
  //     }
  //     } catch (error) {
  //       console.error("ERROR UGH fetching Categories data: ", error.message);
  //     }
  //   };
  //   fetchCategories();
  // }, [slug]);

  const renderCorrespondingId = (order) => {
    switch (order) {
      case 0:
        return "columnSubOneToHover";

      case 1:
        return "columnSubTwoToHover";

      case 2:
        return "columnSubThreeToHover";

      default:
        return "columnSubTwoToHover";
    }
  };

  return (
    <>
      <div className="text-center" style={{ height: "100vh" }}>
        <div className="row" style={{ height: "100%" }}>
          {categorie?.subcategorie?.map((category, index) => (
            <div
              key={index}
              className="col-md-4 col-sm-4 col-12 columnsToHover"
              id={renderCorrespondingId(index)}
            >
              <div
                className="container ms-3 d-flex flex-column align-items-start "
                style={{ marginTop: 100, height: "100%" }}
              >
                <div style={{ height: "30%" }}>
                  <h1 className="h1_header" style={{ fontSize: 60 }}>
                    0{index + 1}
                  </h1>
                </div>
                <div>
                  <h3 className="fw-bold m-0">{category.subcategory_name}</h3>
                </div>
                <div>
                  <p>wanna view products of {category.subcategory_name}? </p>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/home/${categorie.categorie.slug}/${category.slug}/products`}
                  >
                    <button
                      // style={style_button}
                      type="button"
                      className="fw-bold btn btn-sm btn-outline-secondary mb-3 style_button"
                    >
                      View Products
                    </button>
                  </Link>
                </div>
                <div className="image mt-5">
                  <img src={SofaImage} alt="sofa_image" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryTemplate;
