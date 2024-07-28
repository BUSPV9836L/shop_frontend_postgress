import { useEffect, useState } from "react";
import String from "../../string";
import { useNavigate } from "react-router";
import { useAlert } from "../../CustomHooks/useAlert";
import { DANGER, PRIMARY, SUCCESS } from "../../component/Alert";

const Invoice = () => {
  const { Alert } = useAlert();
  const [stockOption, setStockOption] = useState([]);
  const [isCreatingSale, setIsCreatingSale] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idFromValid, setIsFromValid] = useState(false);
  const [inovieNo, setInvoiceNo] = useState(null);
  const navigate = useNavigate();
  const [product, setProduct] = useState([
    {
      id: 0,
      name: "",
      brand: "",
      category: "",
      price: "",
      quantity_available: "",
      quantity: "",
      total_price: "",
      mrp: "",
      customer_name: "",
      phone_no: "",
    },
  ]);

  const getAllStocks = async () => {
    setIsLoading(true);
    const url = new URL(`${String.BASE_URL}/stocks`);
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
        setStockOption(data);
      } else {
        Alert(PRIMARY, data.message);
      }
    } catch (error) {
      Alert(DANGER,"Some Error Occured");
    } finally {
      setIsLoading(false);
    }
  };
  const generateInvoice = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(`${String.BASE_URL}/generateinvoiceno`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        setInvoiceNo(data.invoice_no);
      } else {
        Alert(PRIMARY, data.message);
      }
    } catch (error) {
      Alert(DANGER,"Some Error Occured");
    } finally {
      setIsLoading(false);
    }
  };
  const createNewInvoice = async () => {
    console.log(product, "fjdsfjh");
    setIsLoading(true);
    setIsCreatingSale(true);
    let json = product.map((e) => ({
      ...e,
      name: e?.name.split(",")[0],
      user_id: sessionStorage.getItem("userid"),
      invoice_no: inovieNo,
    }));
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(`${String.BASE_URL}/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(json),
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        Alert(SUCCESS, "Record saved succesfully!");
      } else {
        Alert(PRIMARY, data.message);
      }
    } catch (error) {
      Alert(DANGER,"Some Error Occured");
    } finally {
      setIsLoading(false);
      setIsCreatingSale(false);
      navigate("/"+String.Sales)
    }
  };

  useEffect(() => {
    getAllStocks();
    generateInvoice();
  }, []);

  const handelChange = (e, id) => {
    const { name, value } = e.target;
    if (name === "name") {
      const selectProduct = stockOption.filter(
        (e) =>
          value?.split(",")[0] === e.name && value?.split(",")[1] === e?.brand
      )[0];
      let res = product.map((e) =>
        e?.id === id
          ? {
            id: id,
            name: value,
            brand: selectProduct?.brand,
            category: selectProduct?.category,
            price: selectProduct?.price,
            quantity_available: selectProduct?.quantity_available,
            quantity: "",
            total_price: "",
            mrp: selectProduct?.price,
            phone_no: e.phone_no,
            customer_name: e.customer_name,
          }
          : e
      );
      setProduct(res);
    } else if (name === "quantity" || name === "price") {
      let res = product.map((e) =>
        e?.id === id
          ? {
            ...e,
            [name]: value,
            total_price:
              ((name === "quantity" ? value : e.quantity) || 0) *
              ((name === "price" ? value : e.price) || 0),
          }
          : e
      );
      setProduct(res);
    } else {
      let res = product.map((e) =>
        e?.id === id
          ? {
            ...e,
            [name]: value,
          }
          : e
      );
      setProduct(res);
    }
    checkIsFormValid(name, value);
  };

  const checkIsFormValid = (name, value) => {
    product.map((e) => {
      if (
        (name === "price" ? value : e.price) &&
        (name === "quantity" ? value : e.quantity) &&
        e.customer_name !== "" &&
        e.phone_no !== ""
      ) {
        setIsFromValid(true);
      } else {
        setIsFromValid(false);
      }
    });
  };

  const handelAddNew = () => {
    if (product.length >= stockOption.length) {
      Alert(PRIMARY, "Max row reached!");
      return;
    }

    setIsFromValid(false);
    const insertNew = {
      id: Math.random() * 100,
      invoice_no: inovieNo,
      name: "",
      brand: "",
      category: "",
      price: "",
      quantity_available: "",
      quantity: "",
      total_price: "",
      phone_no: "",
      customer_name: "",
    };
    setProduct((prev) => [...prev, insertNew]);
  };

  const handelDelete = (id) => {
    if (product.length === 1) return;
    let afterDeleteProduct = product.filter((e) => e?.id !== id);
    setProduct(afterDeleteProduct);
  };

  const createInvoice = () => {
    return (
      <div
        className="invoice-container"
        style={{ width: "100%", overflowX: "scroll" }}
      >
        <table
          className="table table-striped"
          style={{ width: "1400px", overflowX: "scroll" }}
        >
          <thead style={{ textWrap: "nowrap" }}>
            <tr>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",
                }}
                scope="col"
              ></th>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",

                }}
                scope="col"
              >
                No.
              </th>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",
                  width: "200px",
                }}
                scope="col"
              >
                Invoice No.
              </th>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",
                  width: "200px",
                }}
                scope="col"
              >
                Customers Name
              </th>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",
                  width: "200px",
                }}
                scope="col"
              >
                Phone No.
              </th>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",
                  width: "200px",
                }}
                scope="col"
              >
                Product Name
              </th>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",
                  width: "200px",
                }}
                scope="col"
              >
                Brand
              </th>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",
                  width: "200px",
                }}
                scope="col"
              >
                Category
              </th>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",
                  width: "200px",
                }}
                scope="col"
              >
                MRP
              </th>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",
                  width: "200px",
                }}
                scope="col"
              >
                Sale Rate
              </th>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",
                  width: "200px",
                }}
                scope="col"
              >
                Available Quantity
              </th>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",
                  width: "200px",
                }}
                scope="col"
              >
                Quantity
              </th>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",
                  width: "200px",
                }}
                scope="col"
              >
                Total Price
              </th>
              <th
                style={{
                  background: "var(--main-bg-color",
                  color: "white",
                  textAlign: "left",
                }}
                scope="col"
              ></th>
            </tr>
          </thead>
          <tbody>
            {product.map((event, index) => (
              <tr key={event?.id}>
                <td style={{ borderRight: "2px solid gray", cursor: "pointer" }}>
                  {index === product.length - 1 && (
                    <span
                      onClick={handelAddNew}
                      className="add-icon"
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
                  <input
                    disabled
                    type="text"
                    name="invoice_no"
                    value={inovieNo}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="customer_name"
                    value={product && product[index]?.customer_name}
                    className="form-control"
                    onChange={(e) => handelChange(e, event?.id)}
                  />
                </td>
                <td>
                  <input
                    type="phone"
                    name="phone_no"
                    value={product && product[index]?.phone_no}
                    className="form-control"
                    onChange={(e) => handelChange(e, event?.id)}
                  />
                </td>
                <td>
                  <select
                    name="name"
                    value={product && product[index]?.name}
                    className="form-control"
                    onChange={(e) => handelChange(e, event?.id)}
                  >
                    <option value={0}>Select</option>
                    {stockOption.map((e) => (
                      <option key={e.id} value={e?.name + "," + e?.brand}>
                        {e?.name + ", " + e?.brand}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    disabled
                    type="text"
                    name="brand"
                    value={product && product[index]?.brand}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    disabled
                    type="text"
                    name="category"
                    value={product && product[index]?.category}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    disabled
                    type="text"
                    name="price"
                    value={product && product[index]?.mrp}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="price"
                    value={product && product[index]?.price}
                    className="form-control"
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
                  />
                </td>
                <td>
                  <input
                    disabled
                    type="text"
                    value={product && product[index]?.quantity_available}
                    name="quantity_available"
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={product && product[index]?.quantity}
                    name="quantity"
                    className="form-control"
                    onChange={(e) => {
                      let number = e.target.value;
                      if (isNaN(number) || number < 0 || number % 1 !== 0) {
                        return;
                      } else if (
                        number > (product && product[index]?.quantity_available)
                      ) {
                        Alert(PRIMARY,
                          "Quantity cannot be greater than available quantity!"
                        );
                        return;
                      } else {
                        handelChange(e, event?.id);
                      }
                    }}
                  />
                </td>
                <td>
                  <input
                    disabled
                    type="text"
                    value={product && product[index]?.total_price}
                    name="total_price"
                    className="form-control"
                  />
                </td>
                <td style={{ borderLeft: "2px solid gray", cursor: "pointer" }}>
                  <span
                    onClick={() => handelDelete(event?.id)}
                    className="delete-icon"
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
    );
  };

  return (
    <div>
      <h4 className="heading-text mb-3"> Create Sale</h4>
      {isLoading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <div className="text-end" style={{ marginRight: "20px" }}>
        <button
          onClick={createNewInvoice}
          className="btn mb-3"
          disabled={!idFromValid}
        >
          Save
        </button>
        {createInvoice()}
      </div>
    </div>
  );
};

export default Invoice;
