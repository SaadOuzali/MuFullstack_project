import React, { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import request from "../../components/axios";
import "./categories_styles.css";
import { Shoppigncartcontexte } from "./contexte/CartShoppingContexte";

export const categorieContexte = createContext({ categorie: null });

export default function Categorie() {
  const [categorie, setCategorie] = useState({});
  const [products, setProducts] = useState([]);
  const { slug } = useParams();
  const { Slug } = useParams();
  const { setAnchorEl } = useContext(Shoppigncartcontexte);

  const loc = useLocation();
  console.log("hnaaaaaaaa fcategorie", categorie);

  // to fetch subcategorie
  useEffect(() => {
    if (setAnchorEl) setAnchorEl(null);
    const fetchCategories = async () => {
      try {
        const data = await request.get(`/v1/categories/${slug}`);
        // console.log("dial data",data);
        // console.log("hnaaaaaaaa fcategorie",data);
        if (data.status === 200) {
          let responseData = data.data;

          setCategorie(responseData.data);
        }
      } catch (error) {
        console.error("ERROR UGH fetching Categories data: ", error.message);
      }
    };
    fetchCategories();
  }, [slug]);

  // to fetch all products
  useEffect(() => {
    if (loc.pathname.endsWith("/products")) {
      console.log("slug", Slug);
      // console.log("gggggg",slug);
      const getProducts = async (Slug) => {
        try {
          const data = await request.get(`/v1/products/${Slug}`);
          if (data.status === 200) {
            console.log("hna fdila product", data.data);
            setProducts(data.data.data);
          }
        } catch (error) {
          console.log("hnnna fl error", error);
        }
      };
      getProducts(Slug);
    }
  }, [loc.pathname]);

  return (
    <categorieContexte.Provider value={{ categorie, products }}>
      <div className="style_category_header">
        <h1 className="p-5">{categorie?.categorie?.category_name}</h1>
      </div>
      <Outlet />
    </categorieContexte.Provider>
  );
}
