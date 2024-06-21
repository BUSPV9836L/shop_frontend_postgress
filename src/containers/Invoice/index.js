import { useEffect, useState } from "react";
import String from "../../string";
import { useNavigate } from "react-router";

const Invoice = () => {
  const [stockOption, setStockOption] = useState([]);
  const [isCreatingSale, setIsCreatingSale] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idFromValid, setIsFromValid] = useState(false);
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
        alert(data.message);
      }
    } catch (error) {
      alert("Server Error!");
    } finally {
      setIsLoading(false);
    }
  };

  const createNewInvoice = async () => {
    setIsLoading(true);
    setIsCreatingSale(true);
    let json = product.map((e) => ({
      ...e,
      name: e?.name.split(",")[0],
      user_id: sessionStorage.getItem("userid"),
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
        navigate("/" + String.InvoiceReceipt, {
          state: product,
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server Error!");
    } finally {
      setIsLoading(false);
      setIsCreatingSale(false);
    }
  };

  useEffect(() => {
    getAllStocks();
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
      checkIsFormValid(name, value);
      setProduct(res);
    }
  };

  const checkIsFormValid = (name, value) => {
    product.map((e) => {
      if (
        (name === "price" ? value : e.price) &&
        (name === "quantity" ? value : e.quantity)
      ) {
        setIsFromValid(true);
      } else {
        setIsFromValid(false);
      }
    });
  };

  const handelAddNew = () => {
    if (product.length === stockOption.length) {
      alert("Max row reached!");
      return;
    }
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
    setProduct((prev) => [...prev, insertNew]);
  };

  const handelDelete = (id) => {
    if (product.length === 1) return;
    let afterDeleteProduct = product.filter((e) => e?.id !== id);
    setProduct(afterDeleteProduct);
  };

  const createInvoice = () => {
    return (
      <div className="invoice-container">
        <table className="table table-striped">
          <thead style={{textWrap:"nowrap"}}>
            <tr >
              <th style={{background:"var(--main-bg-color" ,color:"white" }} scope="col"></th>
              <th style={{background:"var(--main-bg-color" ,color:"white"}} scope="col">No.</th>
              <th style={{background:"var(--main-bg-color" ,color:"white"}} scope="col">Product Name</th>
              <th style={{background:"var(--main-bg-color" ,color:"white"}} scope="col">Brand</th>
              <th style={{background:"var(--main-bg-color" ,color:"white"}} scope="col">Category</th>
              <th style={{background:"var(--main-bg-color" ,color:"white"}} scope="col">MRP</th>
              <th style={{background:"var(--main-bg-color" ,color:"white"}} scope="col">Sale Rate</th>
              <th style={{background:"var(--main-bg-color" ,color:"white"}} scope="col">Available Quantity</th>
              <th style={{background:"var(--main-bg-color" ,color:"white"}} scope="col">Quantity</th>
              <th style={{background:"var(--main-bg-color" ,color:"white"}} scope="col">Total Price</th>
              <th style={{background:"var(--main-bg-color" ,color:"white"}} scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {product.map((event, index) => (
              <tr key={event?.id}>
                <td>
                  {index === product.length - 1 && (
                    <span
                      onClick={handelAddNew}
                      className="add-icon"
                      aria-hidden="true"
                    >
                      &#43;
                    </span>
                  )}
                </td>
                <td>{index + 1}</td>
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
                        alert(
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
                <td>
                  <span
                    onClick={() => handelDelete(event?.id)}
                    className="delete-icon"
                    aria-hidden="true"
                  >
                    &times;
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
      <h4 className="heading-text mb-3">Invoice</h4>
      {isLoading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <div className="text-end" style={{ marginRight: "20px" }}>
        <button
          onClick={createNewInvoice}
          className="btn mb-3  btn-primary"
          disabled={!idFromValid}
        >
          Create Sale
        </button>
        {createInvoice()}
      </div>
    </div>
  );
};

export default Invoice;
