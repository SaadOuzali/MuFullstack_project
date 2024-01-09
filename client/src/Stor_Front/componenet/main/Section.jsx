import {
  Box,
  Button,
  Container,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import formatCurrency from "../../formatCurrency";
import { Shoppigncartcontexte } from "../contexte/CartShoppingContexte";
import request from "../../../components/axios";
import { AxiosError } from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styleSwiper.css";

export default function Section({ theme }) {
  const [swiperRef, setSwiperRef] = useState(null);
  let appendNumber = 4;
  let prependNumber = 1;
  const [data, setData] = useState([]);
  const [value, setValue] = useState(4);
  const shopCtx = useContext(Shoppigncartcontexte);

  if (!shopCtx) throw new Error("Shop context is required");

  const {
    getCartItemsQuantity,
    increaseProductToCart,
    decreaseItemInCart,
    removeItemInCart,
  } = shopCtx;

  const prepend2 = () => {
    swiperRef.prependSlide([
      '<div class="swiper-slide">Slide ' + --prependNumber + "</div>",
      '<div class="swiper-slide">Slide ' + --prependNumber + "</div>",
    ]);
  };

  const prepend = () => {
    swiperRef.prependSlide(
      '<div class="swiper-slide">Slide ' + --prependNumber + "</div>"
    );
  };

  const append = () => {
    swiperRef.appendSlide(
      '<div class="swiper-slide">Slide ' + ++appendNumber + "</div>"
    );
  };

  const append2 = () => {
    swiperRef.appendSlide([
      '<div class="swiper-slide">Slide ' + ++appendNumber + "</div>",
      '<div class="swiper-slide">Slide ' + ++appendNumber + "</div>",
    ]);
  };

  useEffect(() => {
    const fetchproducts = async () => {
      try {
        const data = await request.get("/v1/products/");
        console.log(data.data.data);
        if (data.status === 200) {
          setData(data.data.data);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error);
        }
      }
    };
    fetchproducts();
  }, []);

  return (
    <Container>
      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        // justifyContent={"space-between"}
        gap={4}
      >
        {data.length === 0 ? null : (
          //  data.map((item, index) => {
          //     return (
          //       <Card
          //         sx={{
          //           maxWidth: 250,
          //           ":hover ": { scale: "1.15", transition: "0.15s" },
          //         }}
          //       >
          //         <CardMedia
          //           sx={{ height: 250,width:250 }}
          //           image={item?.product_img}
          //           title="green iguana"
          //         />
          //         <CardContent
          //           sx={{
          //             display: "flex",
          //             alignItems: "center",
          //             bgcolor: theme.palette.bg1.main,
          //             height: 180,
          //           }}
          //         >
          //           <Stack
          //             width={300}
          //             alignItems={"center"}
          //             justifyContent={"space-between"}
          //           >
          //             <Typography
          //               gutterBottom
          //               variant="h6"
          //               color={theme.palette.text.primary}
          //               component="div"
          //             >
          //               {item.short_description}
          //             </Typography>
          //             <Typography
          //               gutterBottom
          //               variant="h6"
          //               fontWeight={"bold"}
          //               component="div"
          //               color={theme.palette.text.primary}
          //             >
          //               {formatCurrency(item.price)}
          //             </Typography>
          //             <Rating
          //               readOnly
          //               sx={{ marginBottom: 2 }}
          //               name="simple-controlled"
          //               // bgcolor={theme.palette.text.primary}
          //               value={value}
          //               onChange={(event, newValue) => {
          //                 setValue(newValue);
          //               }}
          //             />
          //             {getCartItemsQuantity(item?.id) === 0 ? (
          //               <Button
          //                 size="small"
          //                 variant="outlined"
          //                 sx={{ textTransform: "capitalize" }}
          //                 onClick={() =>
          //                   increaseProductToCart(
          //                     item.id,
          //                     item.product_img,
          //                     item.price,
          //                     item.product_name
          //                   )
          //                 }
          //               >
          //                 <AddShoppingCartIcon fontSize="small" />
          //                 Add to Cart
          //               </Button>
          //             ) : (
          //               <>
          //                 <Box>
          //                   <Button
          //                     size="small"
          //                     variant="contained"
          //                     onClick={() =>
          //                       increaseProductToCart(
          //                         item.id,
          //                         item.product_img,
          //                         item.price,
          //                         item.product_name
          //                       )
          //                     }
          //                   >
          //                     +
          //                   </Button>
          //                   <Button> {getCartItemsQuantity(item.id)} </Button>
          //                   <Button
          //                     variant="contained"
          //                     size="small"
          //                     onClick={() => decreaseItemInCart(item.id)}
          //                   >
          //                     -
          //                   </Button>
          //                 </Box>

          //                 <Button
          //                   variant="contained"
          //                   size="small"
          //                   sx={{ marginTop: "5px" }}
          //                   onClick={() => removeItemInCart(item.id)}
          //                 >
          //                   Remove
          //                 </Button>
          //               </>
          //             )}
          //           </Stack>
          //         </CardContent>
          //       </Card>
          //     );
          //   })

          <Swiper
            id="products-swiper"
            style={{ margin: "20 0" }}
            onSwiper={setSwiperRef}
            slidesPerView={3}
            centeredSlides={true}
            spaceBetween={30}
            pagination={{
              type: "fraction",
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {data.map((item) => {
              return (
                <SwiperSlide key={item.id}>
                  <Stack width={"100%"}>
                    <img src={item.product_img} />
                    <Stack
                      // width={"100%"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        color={theme.palette.text.primary}
                        component="div"
                      >
                        {item.short_description}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="h6"
                        fontWeight={"bold"}
                        component="div"
                        color={theme.palette.text.primary}
                      >
                        {formatCurrency(item.price)}
                      </Typography>
                      <Rating
                        readOnly
                        sx={{ marginBottom: 2 }}
                        name="simple-controlled"
                        // bgcolor={theme.palette.text.primary}
                        value={value}
                        onChange={(event, newValue) => {
                          setValue(newValue);
                        }}
                      />
                      {getCartItemsQuantity(item?.id) === 0 ? (
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: "capitalize" }}
                          onClick={() =>
                            increaseProductToCart(
                              item.id,
                              item.product_img,
                              item.price,
                              item.product_name,
                              item._id
                            )
                          }
                          startIcon={<AddShoppingCartIcon fontSize="small" />}
                        >
                          Add to Cart
                        </Button>
                      ) : (
                        <>
                          <Box>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() =>
                                increaseProductToCart(
                                  item.id,
                                  item.product_img,
                                  item.price,
                                  item.product_name,
                                  item._id
                                )
                              }
                            >
                              +
                            </Button>
                            <Button> {getCartItemsQuantity(item.id)} </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => decreaseItemInCart(item.id)}
                            >
                              -
                            </Button>
                          </Box>

                          <Button
                            variant="contained"
                            size="small"
                            sx={{ marginTop: "5px" }}
                            onClick={() => removeItemInCart(item.id)}
                          >
                            Remove
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Stack>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </Stack>
    </Container>
  );
}
