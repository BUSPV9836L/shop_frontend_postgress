import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import String from "../../string";
import { useLocation, useNavigate } from "react-router";
import moment from "moment";
import { useAlert } from "../../CustomHooks/useAlert";
import { DANGER, PRIMARY, SUCCESS } from "../../component/Alert";

const Purchase = () => {
  const { Alert } = useAlert();
  const [product, setProduct] = useState([
    {
      id: 0,
      name: "",
      brand: "",
      category: "",
      price: "",
      quantity_available: "",
      supplier_name: ""
    },
  ]);
  const navigate=useNavigate()
  const [idFromValid, setIsFromValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState([])
  const createPurchase = async () => {
    let json = product.map((e) => {
      return {
        name: e.name,
        brand: e.brand,
        category: e.category,
        price: e.price,
        quantity_available: e.quantity_available,
        user_id: sessionStorage.getItem("userid"),
        supplier_name: e.supplier_name
      };
    });
    setLoading(true);
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(`${String.BASE_URL}/purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(json),
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        Alert(SUCCESS, "Record Saved Succesfully!");
        navigate("/"+String.Purchase_List)
      } else {
        Alert(PRIMARY, data.message);
      }
    } catch (error) {
      Alert(DANGER,"Some Error Occured");
    } finally {
      setProduct([
        {
          id: 0,
          name: "",
          brand: "",
          category: "",
          price: "",
          quantity_available: "",
        },
      ]);

      setLoading(false)
    }
  };
  const getAllSupplier = async () => {
    setLoading(true)
    const url = new URL(`${String.BASE_URL}/suppliers`);
    url.searchParams.append("user_id", sessionStorage.getItem("userid"));
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        setSupplier(data);
      } else {
        Alert(PRIMARY, data.message);
      }
    } catch (error) {
      Alert(DANGER,"Some Error Occured");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllSupplier()
  }, []);
  const addIteamInPurchasePopUp = () => {
    const addIteam = () => {
      return (
        <div>
          <div className=" mb-3 text-end">
            <button
              className=" btn "
              onClick={createPurchase}
              disabled={!idFromValid}
            >
              Save
            </button>
          </div>
          <div style={{ width: "100%", overflowX: "scroll" }}>
            <table className=" table " style={{ width: "1200px" }}>
              <thead>
                <tr>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  ></th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    No.
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Supplier
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Product Name
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Brand
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    MRP
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    style={{
                      background: "var(--main-bg-color",
                      color: "white",
                      textAlign: "left",
                    }}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {product?.map((event, index) => (
                  <tr key={event?.id} >
                    <td style={{ borderRight: "2px solid gray", cursor: "pointer" }}>
                      {index === product.length - 1 && (
                        <span
                          onClick={() => {
                            if (!event.isControldisabled) {
                              handelAddNew();
                            }
                          }}
                          style={{
                            fontSize: "20px",
                            fontWeight: "bolder",
                            cursor: !event.isControldisabled ? "pointer" : "",
                          }}
                          aria-hidden="true"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="var(--main-bg-color)"
                            class="bi bi-plus-circle"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                          </svg>
                        </span>
                      )}
                    </td>
                    <td>{index + 1}</td>
                    <td>
                      <select
                        type="text"
                        name="supplier_name"
                        value={product && product[index]?.supplier_name}
                        id="name"
                        className="form-control"
                        onChange={(e) => handelChange(e, event?.id)}
                      >
                        <option value="" selected disabled>Select Supplier</option>
                        {supplier.map(e => {
                          return <option>{e?.supplier_name}</option>
                        })}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={product && product[index]?.name}
                        id="name"
                        className="form-control"
                        onChange={(e) => handelChange(e, event?.id)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="brand"
                        value={product && product[index]?.brand}
                        onChange={(e) => handelChange(e, event?.id)}
                        id="brand"
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="category"
                        value={product && product[index]?.category}
                        onChange={(e) => handelChange(e, event?.id)}
                        id="category"
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        onChange={(e) => {
                          let number = e.target.value;
                          if (isNaN(number) || number < 0) {
                            return;
                          } else if (/^0/.test(number)) {
                            number = number.replace(/^0/, "");
                          } else {
                            handelChange(e, event?.id);
                          }
                        }}
                        type="text"
                        name="price"
                        value={product && product[index]?.price}
                        id="price"
                        className="form-control"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={product && product[index]?.quantity_available}
                        name="quantity_available"
                        id="quantity_available"
                        className="form-control"
                        onChange={(e) => {
                          let number = e.target.value;
                          if (isNaN(number) || number < 0 || number % 1 !== 0) {
                            return;
                          } else {
                            handelChange(e, event?.id);
                          }
                        }}
                      />
                    </td>
                    <td>
                      <span
                        onClick={() => {
                          if (!event.isControldisabled) {
                            handelDelete(event?.id);
                          }
                        }}
                        style={{
                          fontSize: "20px",
                          fontWeight: "bolder",
                          cursor: !event.isControldisabled ? "pointer" : "",
                        }}
                        aria-hidden="true"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="var(--main-bg-color)"
                          class="bi bi-x-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };
    const handelAddNew = () => {
      setIsFromValid(false);
      const insertNew = {
        id: Math.random() * 100,
        name: "",
        brand: "",
        category: "",
        price: "",
        quantity_available: "",
        quantity: "",
        total_price: "",
      };
      setProduct((prev) => {
        return [...prev, insertNew];
      });
    };
    const handelDelete = (id) => {
      if (product.length == 1) return;
      let afterDeletProduct = product?.filter((e) => e?.id !== id);
      setProduct((prev) => {
        return afterDeletProduct;
      });
    };
    const handelChange = (e, id) => {
      const { name, value } = e.target;
      let res = product.map((e) => {
        if (e?.id == id) {
          return {
            ...e,
            [name]: value,
          };
        } else {
          return e;
        }
      });
      checkIsFormValid(name, value);
      setProduct(res);
    };
    const checkIsFormValid = (name, value) => {
      console.log(product);
      product?.map((e) => {
        if (
          (name == "name" ? value : e.name) &&
          (name == "category" ? value : e.category) &&
          (name == "brand" ? value : e.brand) &&
          (name == "price" ? value : e.price) &&
          (name == "quantity_available" ? value : e.quantity_available) &&
          (name == "supplier_name" ? value : e.supplier_name)
        ) {
          setIsFromValid(true);
        } else {
          setIsFromValid(false);
        }
      });
    };
    return (
      addIteam()
    );
  };

  return (
    <div>
      <h4 className="heading-text mb-3">Create Purchase</h4>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <div style={{ marginRight: "20px" }}>
        {addIteamInPurchasePopUp()}
      </div>
    </div>
  );
};

export default Purchase;
