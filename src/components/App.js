import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/style.css";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { FormControl, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faThLarge,
  faAlignJustify,
} from "@fortawesome/free-solid-svg-icons";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ProductsList from "./products_list";

import Cart from "./Product/cart";
import { Woocommerce, Wordpress } from "./functions/Woocommerce";

import ProductsGrid from "./products_grid";
import CustomerModal2 from "./Customer/customerModal2";

import { Typeahead } from "react-bootstrap-typeahead"; // ES2015

import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";
import { PaymentSuccessModal } from "./Product/paymentSuccessModal";
import { Reciept } from "./Product/reciept";
import { PaymentModal } from "./Product/paymentModal";
import SalesHistory from "./Sales/salesHistory";

import Cookies from "universal-cookie";
import Spinner from "react-bootstrap/Spinner";
import ScannerModal from "./Barcode/scannerModal";
import TestingComponent from "./Barcode/TestingComponent";
import BarcodeReader from "react-barcode-reader";

import { CSSTransition, TransitionGroup } from "react-transition-group";

const cookies = new Cookies();

var cartobj = [];
var product_type = [];
var prices_list = [];
var customer_id = 0;
var percent = 0;
var page = {
  category: "",
  search: "",
  page: 1,
};
var selectedCustomer = [];
var loadingForProduct = false;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.myRef1 = React.createRef();
  }
  state = {
    products: [],
    list_type: "list",
    categories: [],
    cartobj: [],
    total_price: [],
    qty: [],
    origianl_amount: 0,
    discount: 0,
    fees: 0,
    discountstatus: false,
    feesstatus: false,
    discount_type: null,
    changes: 0,
    payment_type: 1,
    payAmount: 0,
    total_pages: 0,
    showPaymentModal: false,
    paymentSuccess: false,
    loadingForProduct: true,
    mounted: false,
    selectedCustomer: [],
    product_type: [],
    selected_page: 1,
    orderNote: "",
    successForAdding: false,
    loading: false,
    showScannerModal: false,
    customer_name: "No customer is selected",
    barcoderesult: null,
    paying: false,
    percent: 0,
    error_block: [],
    error_message: "",
    tax: 0,
    taxpercent: 0,
    allAmount: {
      1: 0,
      2: 0,
      3: 0,
    },

    allAmount1: {
      1: 0,
      2: 0,
      3: 0,
    },
    current_money_mode: 1,
    editOrder: false,
    order_date: "",
    couponliststatus: false,
    couponliststatus1: false,
    totalcoupon: 0,
    coupon: [],
    coupon1: [],
    discount1: 0,
    total1: 0,
    customer_id1: 0,
    tax1: 0,
    origianl_amount1: 0,
    cartobj1: [],
    product_type1: "",
    qty1: 0,
    total_price1: 0,
    fees1: 0,
    discountstatus1: false,
    feesstatus1: false,
    order_id1: 0,
    editOrder1: false,
    order_date1: 0,
    order_id: 0,
    billing: [],
  };

  addToTheCart = async (
    e,
    selected,
    variation_id = "",
    scannerstatus = false
  ) => {
    var product = [];

    var index = e;
    if (scannerstatus) {
      product = this.state.products[0];
    } else {
      product = this.state.products[index];
    }
    if (variation_id) {
      product["selected_variation_id"] = variation_id;
    }
    cartobj.push(product);

    var length = cartobj.length;
    var amount = 0;
    var qty = this.state.qty;
    qty[length - 1] = 1;
    const returnedTarget = Object.assign({}, selected);

    product_type[length - 1] = returnedTarget;

    console.log("nnnnnn");
    console.log(product_type);

    var prices = cartobj.map((item, idx) =>
      item.price ? item.price * qty[idx] : 0
    );

    prices_list = prices.slice();
    var total = prices_list.map(
      (item, idx) => (amount = parseInt(amount) + parseInt(item))
    );

    await this.setState({
      cartobj: cartobj,
      total: amount.toFixed(2),
      total_price: prices,
      qty: qty,
      origianl_amount: amount.toFixed(2),
      product_type: product_type,
      successForAdding: false,
    });

    await this.discounUpdate();

    //await this.couponCalculation();

    await this.finalCalculation();

    // console.log(product_type)
  };

  removeFromTheCart = async (e) => {
    //alert("hi")
    var qty = this.state.qty;

    var i = parseInt(e.target.getAttribute("data-index"));

    // cartobj = cartobj.splice(i, 1);
    cartobj = cartobj.filter((item, idx) => idx != i);

    qty = qty.filter((item, idx) => idx != i);

    product_type = product_type.filter((item, idx) => idx != i);

    var amount = 0;

    var prices = cartobj.map((item, idx) =>
      item.price ? item.price * qty[idx] : 0
    );

    prices_list = prices.slice();

    var total = prices_list.map(
      (item, idx) => (amount = parseInt(amount) + parseInt(item))
    );

    //console.log(qty);

    await this.setState({
      cartobj: cartobj,

      total: amount.toFixed(2),
      origianl_amount: amount.toFixed(2),
      total_price: prices,
      qty: qty,
      product_type: product_type,
    });

    await this.finalCalculation();
  };

  productView = async (e) => {
    // console.log(e.target)

    await this.setState({
      list_type: e.target.value == 1 ? "list" : "grid",
      mounted: false,
    });

    await this.setState({
      mounted: true,
    });
  };

  productCategories() {
    Woocommerce.getCategoriesList().then((res) => {
      this.setState({
        categories: res.data,
      });
    });
  }

  getPaymentGateway() {
    Woocommerce.getPaymentGateway().then((res) => {});
  }

  changeMoney = async (e) => {
    var total = parseFloat(this.state.total);

    var changes = parseFloat(e.target.value);

    // var amount = total - changes ;
    var tochanges = this.state.allAmount;
    tochanges[this.state.current_money_mode] = e.target.value;

    var totale = parseFloat(
      Object.values(tochanges).reduce(
        (a, b) => parseFloat(a ? a : 0) + parseFloat(b ? b : 0)
      )
    );

    var amount = total - totale;
    console.log(amount);
    //   alert(amount);
    await this.setState({
      changes: parseFloat(amount),
      payAmount: e.target.value,
      allAmount: tochanges,
    });
  };
  handlePaymentModeChange = (e) => {
    //  console.log(e.target)

    var value = e.target.value;
    var total = this.state.total;

    this.setState({
      payment_type: value,
      payAmount: value == 1 ? 0 : total,
      // changes: 0,
      current_money_mode: value,
    });
  };

  handleSumoCode = (e) => {
    this.setState({
      couponcode: e.target.value,
    });
  };

  removeCoupon = async (e) => {
    var coupon22 = this.state.coupon;
    const index = e.target.getAttribute("id");
    console.log(e.target.getAttribute("id"));
    coupon22.splice(index, 1);
    console.log(coupon22);

    await this.setState({
      coupon: coupon22,
    });

    this.couponCalculation();
    this.finalCalculation();
  };

  handleSumoCodeSubmit = async (e) => {
    if (this.state.cartobj.length > 0) {
      var coupon22 = this.state.coupon;

      if (e.length > 0) {
        coupon22.push(e[0]);
      }

      await this.setState({
        coupon: coupon22,
      });
      this.couponCalculation();
      this.finalCalculation();
    } else {
      alert("The cart is empty");
    }
  };

  handleOrderNote = (e) => {
    this.setState({
      orderNote: e.target.value,
    });
  };

  handleClearNote = (e) => {
    this.setState({
      orderNote: "",
    });
  };

  postOrderNote(id) {
    const data = {
      note: this.state.orderNote,
    };

    Woocommerce.postOrderNote(id, data);
    // .then(res =>{

    //    }
    //  );
  }

  getLineItem() {
    var line_item = [];

    var product = this.state.cartobj;
    var qty = this.state.qty;
    var total_price = this.state.total_price;

    var discount = parseInt(this.state.percent);
    var prices = product.map((item, idx) => {
      line_item[idx] = {};
      line_item[idx]["product_id"] = item.id;
      line_item[idx]["quantity"] = qty[idx];
      line_item[idx]["total"] = String(
        total_price[idx] - (total_price[idx] * discount) / 100
      );
      if (item.selected_variation_id) {
        line_item[idx]["variation_id"] = item.selected_variation_id;
      }
    });

    return line_item;
  }

  postOrder = async (e) => {
    if (this.state.customer_name === "No customer is selected") {
      alert("Please select customer");
    } else {
      await this.setState({
        paying: true,
        error_block: [],
        error_message: "",
      });
      var line_items = await this.getLineItem();
      console.log("check line item");
      console.log(line_items);

      var couponline = this.state.coupon.map((attr, x) => {
        // console.log(attr)
        return { code: attr.code };
      });

      const data = {
        payment_method: "cod",
        payment_method_title: "Cash on delivery",
        set_paid: true,
        customer_id: customer_id,
        status: "pos-sale",
        currency: "BDT",
        total: this.state.total,
        line_items: line_items,
        discount_total: String(-this.state.discount),
        total_tax: this.state.tax,
        // billing: this.state.selectedCustomer.billing,
        shipping: this.state.selectedCustomer.billing,
        coupon_lines: couponline,
        // shipping_lines: [
        //   {
        //     method_id: "flat_rate",
        //     method_title: "Flat Rate",
        //     total: "10.00"
        //   }
        // ]
      };
      //console.log(data)

      if (this.state.editOrder) {
        await Woocommerce.updateOrder(this.state.order_id, data).then(
          (res) => {
            console.log(res.data);
            this.setState({
              showPaymentModal: false,
              paymentSuccess: true,
              // paying: false
            });

            if (this.state.orderNote != "") {
              this.postOrderNote(res.data.id);
            }
          },
          (error) => {
            var response = "Check your network connection";
            var error_block = [];
            console.log(error.response);
            if (error.response) {
              response = error.response.data.message;
            }

            if (error.response && error.response.data) {
              error_block = error.response.data.data.params;
            }

            this.setState({
              //  username_error: true,
              //  error_message: response,
              error_block: error_block,
              error_message: response,
            });

            //console.log(error.response)
          }
        );
      } else {
        await Woocommerce.postOrder(data).then(
          (res) => {
            console.log(res.data.number);
            this.setState({
              showPaymentModal: false,
              paymentSuccess: true,
              // paying: false
              order_id: res.data.id,
              number: res.data.number,
            });

            if (this.state.orderNote != "") {
              this.postOrderNote(res.data.id);
            }
          },
          (error) => {
            var response = "Check your network connection";
            var error_block = [];
            console.log(error.response);
            if (error.response) {
              response = error.response.data.message;
            }

            if (error.response && error.response.data) {
              error_block = error.response.data.data.params;
            }

            this.setState({
              //  username_error: true,
              //  error_message: response,
              error_block: error_block,
              error_message: response,
            });

            //console.log(error.response)
          }
        );
      }

      this.setState({
        paying: false,
      });
    }
    // {
    //   product_id: 1660,
    //   quantity: 2,
    //   variation_id: 2820,

    // }
  };

  getFilteredCategory = (e) => {
    // var category_id = e.target.value;
    if (e.length > 0) {
      var category_id = e[0].id;

      //console.log(category_id);

      // var page = {
      //   "category": category_id,
      // }
      page["category"] = category_id;
      page["page"] = 1;

      this.getProducts();
    } else {
      this.reset();
    }
  };

  OnScan = (e) => {
    e.preventDefault();

    this.getProducts();
  };

  getFilteredProduct = (e) => {
    var search = e.target.value;

    // var page = {
    //   "search": search,
    // }

    page["search"] = search;
    page["page"] = 1;
    // page["sku"] = "PCF-005B"
  };

  getProducts = async () => {
    // var page = {
    //   "page": e,
    //   //'category':'84'
    // }

    await this.setState({
      loadingForProduct: true,
      products: [],
    });

    await Woocommerce.getProducts(page).then(async (res) => {
      // console.log(res.data);
      //console.log(res.headers)
      // alert(total_pages);
      await this.setState({
        products: res.data,
        isLoaded: true,
        total_pages: res.headers["x-wp-totalpages"],
        loadingForProduct: false,
        mounted: true,
      });
    });
  };

  restartCart = () => {
    this.setState({
      cartobj: [],
      total_price: [],
      qty: [],
      origianl_amount: 0,
      discount: 0,
      fees: 0,
      discountstatus: false,
      feesstatus: false,
      couponliststatus: false,
      discount_type: null,
      changes: 0,
      payment_type: 1,
      payAmount: 0,
      // total_pages: 0,
      showPaymentModal: false,
      paymentSuccess: false,
      total: 0,
      selectedCustomer: [],
      product_type: [],
      selected_page: 1,
      customer_name: "No customer is selected",
      tax: 0,
      allAmount: {
        1: 0,
        2: 0,
        3: 0,
      },

      allAmount1: {
        1: 0,
        2: 0,
        3: 0,
      },
      current_money_mode: 1,
    });
    customer_id = "";
    selectedCustomer = [];
    product_type = [];

    cartobj = [];
    prices_list = [];
  };

  closePaymentSuccessmodal = () => {
    this.setState({
      paymentSuccess: false,
    });
  };

  taxSection = () => {
    Woocommerce.getTaxList().then((res) => {
      // alert( res.data[0].rate)
      var num = res.data[0].rate;
      this.setState({
        taxpercent: parseFloat(num).toFixed(2),
      });
    });
  };

  getSumoList = () => {
    Woocommerce.getSumoList().then(async (res) => {
      console.log("coupon list");
      console.log(res);
      await this.setState({
        // coupon: res.data,
        couponliststatus: true,
      });

      //  this.couponCalculation();

      console.log(this.state.coupon);
    });
  };

  componentDidMount = async () => {
    // this.getTheCode("");
    // var page = {
    //   "page": 1
    // }
    // page["search"] = "aries-test";
    await this.taxSection();
    await this.getProducts(page);

    await this.productCategories();
    await this.getPaymentGateway();
    await this.getSumoList();

    // this.postOrder();
    //this.postCustomer();

    //console.log("Check the string to number")
    //console.log( ("MUK-ZIB1234").match(/\d/g).join(""));
  };
  reset = () => {
    var newPage = {
      page: 1,
    };
    page = newPage;
    this.getProducts();
  };
  getTheCode = async (code) => {
    var statusForCode = true;
    //alert(code)
    // code = "MUPCT-007|3029";
    // code = "MUPCD-003B|2813";
    //  code = "MUZC-LEB|2335";
    // code = "MUKPCB-001W|2603";

    if (code) {
      // if(code[0].toUpperCase() === "M" && code[1].toUpperCase() ==="U" && code[2].toUpperCase() ==="K" ){
      if (code[0].toUpperCase() === "M" && code[1].toUpperCase() === "U") {
        //statusForCode = false;

        var product_id = code.match(/\d/g).join("");
        var mu = code.toUpperCase().split("MU");

        var slicedElement = code.slice(2);
        // console.log("The slice element is "+slicedElement );
        mu = mu.filter(function (el) {
          return el;
        });

        var code1 = slicedElement.split("|");
        code1 = code1.filter(function (el) {
          return el;
        });

        var sku = code1[0];

        //alert(sku)
        page["sku"] = sku;
        await this.getProducts();
        var product_length = this.state.products;
        if (product_length.length > 0) {
          if (code1.length > 1) {
            var variationlist = {
              color: "red",
            };
            var variation_id = code1[1];
            var arraytoincllude = [];
            arraytoincllude.push(variation_id);
            var product_id = this.state.products[0]["id"];

            var listtoparse = await this.getAllVariation(
              product_id,
              variation_id
            );
            // console.log("listtoparse")
            if (listtoparse.length > 0) {
              var data = {};

              variationlist = listtoparse[0].attributes.map((attr, x) => {
                // console.log(attr)

                data[attr.name] = attr.option;
              });
            } else {
              statusForCode = false;
              alert(
                "No such variation " +
                  variation_id +
                  " were found with sku " +
                  sku
              );
            }

            //   console.log(data)
          }
        } else {
          alert("No product with SKU " + sku + " were found");
          statusForCode = false;
        }
      } else {
        alert("The code does not match the format");
        statusForCode = false;
      }
    }

    if (statusForCode) {
      this.addToTheCart(this.state.products[0], data, variation_id, true);
    }
  };

  getAllVariation = async (product_id, id) => {
    //  var product_id = this.state.products[0]["id"];
    var lookup = {
      include: id,
    };
    var data = {};
    console.log("tttttttttt");
    console.log(product_id);
    await Woocommerce.getProductVariation(product_id, lookup).then((res) => {
      data = res.data;
      // console.log(color_option)
    });

    return data;
  };

  listCategoriesList(InputGroup) {
    return (
      <Form.Control as="select" size="md" onChange={this.getFilteredCategory}>
        <option href="#" value="">
          All categories
        </option>

        {this.state.categories.map((item, idx) => (
          <option href="#" value={item.id}>
            {item.name}
          </option>
        ))}
      </Form.Control>
    );
  }
  //  sendEditOrderData = async(element) =>{
  //   console.log("element");
  //   console.log(element)
  //    var toreplacecarto = [];
  //    var qty = [];
  //    var type = [];
  //    var returnedTarget = {};
  //    var total_price = [];
  //    await element.line_items.map( (item,idx) => {
  //      console.log("itemmm");
  //      console.log(item)
  //      var e = {};
  //      e = item;
  //      e["selected_variation_id"] = item.variation_id;
  //      e["price"] = item.subtotal/item.quantity;
  //      toreplacecarto.push(e);
  //      qty.push(item.quantity);
  //      type.push(returnedTarget);
  //      total_price.push(item.subtotal);

  //  //     var listtoparse =  this.getAllVariation(item.product_id,item.variation_id);
  //  //     console.log("listtoparse")
  //  //     console.log(listtoparse)
  //  //      if(listtoparse.length> 0 ){
  //  //        var data = {}

  //  //        var variationlist =    listtoparse[0].attributes.map(async (attr,x) => {
  //  //    // console.log(attr)

  //  //    data[attr.name] = attr.option

  //  //   })

  //  //    returnedTarget =  Object.assign({}, variationlist);

  //  // }
  //  // type.push(returnedTarget);
  //  // console.log("push")
  //  // console.log(type)

  //    })

  //    var fees = 0;
  //    var discount = 0;

  //    var total_product =  total_price.reduce(function(a, b){
  //      return parseInt(a) + parseInt(b);
  //  }, 0);
  //  // alert(total_product)

  //  var withoutextra =  parseInt(element.total) - parseInt(element.total_tax);
  //  if(withoutextra > total_product){
  //    fees = withoutextra - total_product
  //  }

  //  if(withoutextra <total_product){
  //    discount = total_product - withoutextra;
  //  }

  //    // console.log("discount")
  //    // console.log(discount)
  //    // console.log("fees")
  //    // console.log(type)

  //    Woocommerce.getSpecificCustomer(element.customer_id).then(res =>{

  //      this.setState({
  //        customer_name: res.data.username,
  //        selectedCustomer: res.data
  //      })
  //      })

  //      customer_id = element.customer_id;
  //     await this.setState({
  //      // discount: element.discount_total,
  //           discount: (- discount),

  //      "total": element.total,
  //      "customer_id": element.customer_id,
  //      tax: element.total_tax,
  //      origianl_amount : parseInt(element.discount_total) + parseInt(element.total) - parseInt(element.total_tax),
  //      cartobj: toreplacecarto,
  //      product_type: type,
  //      qty: qty,
  //      total_price: total_price,
  //      fees: fees,
  //      discountstatus: discount? true: false,
  //      feesstatus: fees? true:false,
  //      order_id: element.id ,
  //      editOrder:true,
  //      order_date: element.date_paid

  //     })

  //     cartobj = toreplacecarto;

  //    // if(variation_id){
  //    //  product["selected_variation_id"] = variation_id;
  //    // }
  //    // cartobj.push(product);
  //    //  //console.log("new product")
  //    // //sconsole.log(cartobj)
  //    // var length = cartobj.length;
  //    // var amount = 0;
  //    // var qty = this.state.qty;
  //    // qty[length-1] = 1;

  //   }

  sendEditOrderData = async (element) => {
    console.log("element");
    console.log(element);
    var toreplacecarto = [];
    var qty = [];
    var type = [];
    var returnedTarget = {};
    var total_price = [];
    await element.line_items.map((item, idx) => {
      console.log("itemmm");
      console.log(item);
      var e = {};
      e = item;
      e["selected_variation_id"] = item.variation_id;
      e["price"] = item.subtotal / item.quantity;
      toreplacecarto.push(e);
      qty.push(item.quantity);
      type.push(returnedTarget);
      total_price.push(item.subtotal);

      //     var listtoparse =  this.getAllVariation(item.product_id,item.variation_id);
      //     console.log("listtoparse")
      //     console.log(listtoparse)
      //      if(listtoparse.length> 0 ){
      //        var data = {}

      //        var variationlist =    listtoparse[0].attributes.map(async (attr,x) => {
      //    // console.log(attr)

      //    data[attr.name] = attr.option

      //   })

      //    returnedTarget =  Object.assign({}, variationlist);

      // }
      // type.push(returnedTarget);
      // console.log("push")
      // console.log(type)
    });

    var fees = 0;
    var discount = 0;

    var total_product = total_price.reduce(function (a, b) {
      return parseInt(a) + parseInt(b);
    }, 0);
    // alert(total_product)

    var withoutextra = parseInt(element.total) - parseInt(element.total_tax);
    if (withoutextra > total_product) {
      fees = withoutextra - total_product;
    }

    if (withoutextra < total_product) {
      discount = total_product - withoutextra;
    }

    // console.log("discount")
    // console.log(discount)
    // console.log("fees")
    // console.log(type)

    Woocommerce.getSpecificCustomer(element.customer_id).then((res) => {
      this.setState({
        customer_name1: res.data.first_name + " " + res.data.last_name,
        selectedCustomer1: res.data,
      });
    });

    customer_id = element.customer_id;
    await this.setState({
      // discount: element.discount_total,
      discount1: discount,

      total1: element.total,
      customer_id1: element.customer_id,
      tax1: element.total_tax,
      origianl_amount1:
        parseInt(element.discount_total) +
        parseInt(element.total) -
        parseInt(element.total_tax),
      cartobj1: toreplacecarto,
      product_type1: type,
      qty1: qty,
      total_price1: total_price,
      fees1: fees,
      discountstatus1: discount ? true : false,
      feesstatus1: fees ? true : false,
      order_id1: element.id,
      editOrder1: true,
      order_date1: element.date_paid,
      coupon1: element.coupon_lines,
      couponliststatus1: true,
    });

    //cartobj = toreplacecarto;

    // if(variation_id){
    //  product["selected_variation_id"] = variation_id;
    // }
    // cartobj.push(product);
    //  //console.log("new product")
    // //sconsole.log(cartobj)
    // var length = cartobj.length;
    // var amount = 0;
    // var qty = this.state.qty;
    // qty[length-1] = 1;
  };

  listPagination() {
    var total_pages = 10;
    var loopobj = [];

    for (var i = this.state.total_pages; i > 0; i--) {
      loopobj.push(i);
    }
    return (
      <Pagination className="flex-wrap">
        <Pagination.First />
        <Pagination.Prev />

        {loopobj.map((item, idx) => (
          <Pagination.Item
            active={parseInt(this.state.selected_page) === idx + 1}
            index={idx + 1}
            onClick={this.paginateChange}
          >
            {idx + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next />
        <Pagination.Last />
      </Pagination>
    );
  }

  changeQty = async (e) => {
    var counting_number = e.target.value;
    var index = e.target.getAttribute("data-index");
    var qty = this.state.qty;
    qty[index] = e.target.value;
    var amount = 0;
    var prices_list_element = prices_list.slice();
    var price = prices_list_element[index];
    var total_price = this.state.total_price;
    total_price[index] = parseInt(price) * parseInt(counting_number);

    // console.log(e.target.getAttribute("data-index"))
    //  console.log(prices_list)
    //  console.log(total_price)
    var total = total_price.map(
      (item, idx) => (amount = parseFloat(amount) + parseFloat(item))
    );

    await this.setState({
      qty: qty,
      total_price: total_price,
      total: amount ? parseFloat(amount) : 0,
      origianl_amount: amount ? parseFloat(amount) : 0,
    });

    await this.discounUpdate();

    await this.finalCalculation();
  };

  discounUpdate = async () => {
    if (this.state.discount_type === "(%)") {
      var discount_amount =
        (percent / 100) * parseFloat(this.state.origianl_amount);

      await this.setState({
        discount: discount_amount ? -discount_amount.toFixed() : 0,
      });
    }

    //  if(this.state.taxpercent!= "0"){
    //   var discount_amount  = (this.state.taxpercent/100) *parseFloat(this.state.origianl_amount);

    //   await this.setState({
    //     tax:  discount_amount?+(discount_amount.toFixed(2)): 0,

    //  })

    //  }
  };

  finalCalculation = () => {
    var total = this.state.origianl_amount;

    var finalamount =
      parseFloat(total) +
      parseFloat(this.state.discount) +
      parseFloat(this.state.fees) +
      parseFloat(this.state.totalcoupon);
    // console.log(finalamount);
    var tax = (this.state.taxpercent / 100) * parseFloat(finalamount);
    finalamount = finalamount + tax;

    finalamount = finalamount;
    this.setState({
      total: finalamount.toFixed(),
      tax: tax.toFixed(),
    });
  };

  discountCalculation = async (e, type) => {
    // var type = e.target.getAttribute("type");
    // var type = type;

    var value = e;
    //  console.log(value);
    percent = type === "discount" ? value : 0;

    var total = this.state.origianl_amount;
    var discount = 0;
    var amount = value ? parseFloat(value) : 0;

    if (type === "discount") {
      amount = (value / 100) * total;
    }

    // var finalamount = total -amount;

    // finalamount = (finalamount <=0? total: finalamount) ;

    await this.setState({
      discount: -amount.toFixed(2),
      discountstatus: true,
      discount_type: type === "discount" ? "(%)" : "(Taka)",
      percent: percent,
    });
    await this.finalCalculation();
  };

  couponCalculation = async () => {
    // var type = e.target.getAttribute("type");
    // var type = type;
    //  console.log(value);
    var amount = 0;
    if (this.state.coupon.length > 0) {
      var prices = this.state.coupon.map(
        (item, idx) => (amount = amount + parseFloat(item.amount))
      );
    }

    this.setState({
      totalcoupon: -amount,
    });

    // var finalamount = total -amount;

    // finalamount = (finalamount <=0? total: finalamount) ;

    // await this.finalCalculation();
  };

  feesCalculation = async (e) => {
    var value = parseInt(e);

    // var total = parseInt(this.state.origianl_amount);
    var discount = 0;
    var amount = value ? value : 0;

    // var finalamount = total +amount;

    // finalamount = (finalamount <=0? total: finalamount) ;

    await this.setState({
      fees: amount.toFixed(2),
      feesstatus: true,
    });

    await this.finalCalculation();
  };
  removeAdditionalFees = async (e) => {
    var type = e.target.getAttribute("type");

    var status = type + "status";
    var amount = type;

    await this.setState({
      [status]: false,
      [amount]: 0,
    });

    await this.finalCalculation();
  };

  customerSelection = (e, id) => {
    console.log(e);

    customer_id = id;

    // if(e[0]b  ){
    //     customer_id = e[0]["id"];
    //   customer_name = e[0]["username"];
    //   // selectedCustomer = e;

    // }

    Woocommerce.getSpecificCustomer(customer_id).then((res) => {
      this.setState({
        selectedCustomer: res.data,
        billing: res.data.billing,
      });
    });

    this.setState({
      customer_name: e,
    });
  };

  paginateChange = (e) => {
    var page_number = e.target.getAttribute("index");

    page["page"] = page_number;

    this.setState({
      selected_page: page_number,
    });
    this.getProducts();
  };

  handlePaymentClose = () => {
    this.setState({
      showPaymentModal: false,
    });
  };

  handlePaymentOpen = () => {
    this.setState({
      showPaymentModal: true,
    });
  };

  scannerModalClose = () => {
    this.setState({
      showScannerModal: false,
    });
  };

  scannerModalOpen = () => {
    this.setState({
      showScannerModal: true,
    });
  };

  signOut = () => {
    var data = {
      jwt: cookies.get("token"),
    };
    this.setState({
      loading: true,
    });
    Wordpress.logout(data).then(
      (res) => {
        cookies.remove("token");
        this.props.history.push("/");
      },
      (error) => {
        this.setState({
          loading: false,
        });
      }
    );
  };

  handleScan = (data) => {
    console.log(data);

    this.setState({
      barcoderesult: data,
    });
  };

  handleScanButtonLongPressed = () => {
    //alert("complete")
  };
  handleError = (err) => {
    console.error(err);
  };

  checkBarCode = (e) => {
    //  console.log(e)
  };

  openthePaymentModal = () => {
    this.setState({
      paymentSuccess: true,
    });
  };

  render() {
    return (
      <div className="container-fluid">
        <ScannerModal
          show={this.state.showScannerModal}
          handleClose={this.scannerModalClose}
          getTheCode={this.getTheCode}
        />
        <BarcodeReader
          onError={this.handleError}
          onScan={this.getTheCode}
          onScanButtonLongPressed={this.handleScanButtonLongPressed}
          onReceive={this.handleScanButtonLongPressed}
        />
        <div className="row search-row">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-6">
                <form onSubmit={this.OnScan}>
                  <InputGroup>
                    <InputGroup.Prepend className="search_icon_wrap">
                      <InputGroup.Text>
                        <FontAwesomeIcon
                          icon={faSearch}
                          className="search_icon"
                        />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="Search product by typing"
                      aria-label="search"
                      className="search_bar"
                      onChange={this.getFilteredProduct}
                      value={this.state.barcoderesult}
                    />
                    <InputGroup.Append>
                      <Button className="search_btn" onClick={this.OnScan}>
                        Product
                      </Button>
                      <Button
                        className="search_btn"
                        onClick={this.scannerModalOpen}
                      >
                        Scan
                      </Button>
                      <Button className="search_btn" onClick={this.reset}>
                        Reset
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </form>
              </div>

              <div className="col-md-3">
                {
                  // this.listCategoriesList(InputGroup)
                }
                <Typeahead
                  clearButton
                  id="selections-example"
                  labelKey="name"
                  onChange={this.getFilteredCategory}
                  options={this.state.categories}
                  placeholder="Choose a category..."
                />
              </div>

              <div className="col-md-3">
                <ToggleButtonGroup
                  type="radio"
                  name="options"
                  defaultValue={1}
                  onClick={this.productView}
                >
                  <ToggleButton value={1} className="grid_icon_wrap">
                    <FontAwesomeIcon icon={faAlignJustify} />
                  </ToggleButton>
                  <ToggleButton value={2} className="grid_icon_wrap">
                    <FontAwesomeIcon icon={faThLarge} />
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <Form.Row>
              {/* <Col md = {6}>
      <Form.Group controlId="formGridEmail">

      {
                  // <input className = "form-control" value = {this.state.customer_name}/>
                   //   <Typeahead
                   //    id = "customer_id"
                   //    labelKey ={(option) => `${option["username"]}`}
                   //    name = "username"
                   //    options={this.state.userlist}
                   //    placeholder="Choose a customer..."
                   //     onChange = {this.customerSelection}
                   //     onSubmit = {this.customerOnSubmit}

                   //    selected = {this.state.selectedCustomer}
                   // /> 

                 }

                 </Form.Group>
               </Col> */}
              <Col md={8}>
                <Form.Group controlId="formGridEmail">
                  <CustomerModal2
                    customerSelection={this.customerSelection}
                    customer_name={this.state.customer_name}
                    billing={this.state.billing}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <SalesHistory
                  sendEditOrderData={this.sendEditOrderData}
                  cartobj={this.state.cartobj1}
                  total={this.state.total1}
                  total_price={this.state.total_price1}
                  qty={this.state.qty1}
                  discount={this.state.discount1}
                  original_amount={this.state.origianl_amount1}
                  discountstatus={this.state.discountstatus1}
                  feesstatus={this.state.feesstatus1}
                  fees={this.state.fees1}
                  discount_type={this.state.discount_type1}
                  changes={this.state.changes1}
                  payment_type={this.state.payment_type1}
                  payAmount={this.state.payAmount1}
                  showPaymentModal={this.state.showPaymentModal1}
                  ref={this.myRef}
                  customer_name={this.state.customer_name1}
                  product_type={this.state.product_type1}
                  paying={this.state.paying1}
                  error_block={this.state.error_block1}
                  error_message={this.state.error_message1}
                  tax={this.state.tax1}
                  taxpercent={this.state.taxpercent}
                  current_money_mode={this.state.current_money_mode1}
                  allAmount={this.state.allAmount1}
                  order_date={this.state.order_date1}
                  couponliststatus={this.state.couponliststatus1}
                  coupon={this.state.coupon1}
                  billing={this.state.billing}
                  order_id={this.state.order_id}
                  vat={this.state.tax}
                />
              </Col>
              <Col md={2}>
                <PaymentSuccessModal
                  myRef={this.myRef}
                  taxpercent={this.state.taxpercent}
                  paymentSuccess={this.state.paymentSuccess}
                  closePaymentSuccessmodal={this.closePaymentSuccessmodal}
                  restartCart={this.restartCart}
                  cartobj={this.state.cartobj}
                  qty={this.state.qty}
                  product_type={this.state.product_type}
                  total_price={this.state.total}
                  discount={this.state.discount}
                  fees={this.state.fees}
                  original_amount={this.state.origianl_amount}
                  customer_name={this.state.customer_name}
                  vat={this.state.tax}
                  openTheModal={this.openthePaymentModal}
                  allAmount={this.state.allAmount}
                  changes={this.state.changes}
                  order_id={this.state.order_id}
                  billing={this.state.billing}
                  couponliststatus={this.state.couponliststatus}
                  coupon={this.state.coupon}
                  number={this.state.number}
                />
              </Col>
            </Form.Row>
          </div>

          <Form.Group controlId="formGridEmail">
            <Button variant="primary active" onClick={this.signOut}>
              {this.state.loading ? (
                <>
                  Signing out ...
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                </>
              ) : (
                "Sign Out"
              )}
            </Button>
          </Form.Group>
        </div>

        <div className="row main_wrap content_list">
          <div className="col-md-8 col-sm-12 product_section">
            {this.state.loadingForProduct && (
              <div className="loading  d-flex justify-content-center">
                <div class="spinner-grow text-primary mr-1 " role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <div class="spinner-grow text-primary mr-1" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <div class="spinner-grow text-primary mr-1" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            )}

            <CSSTransition
              timeout={600}
              classNames="item"
              in={this.state.mounted}
            >
              {this.state.list_type === "list" ? (
                <ProductsList
                  addToTheCart={this.addToTheCart}
                  products={this.state.products}
                  successForAdding={this.state.successForAdding}
                />
              ) : (
                <ProductsGrid
                  addToTheCart={this.addToTheCart}
                  products={this.state.products}
                  successForAdding={this.state.successForAdding}
                />
              )}
            </CSSTransition>

            {!this.state.loadingForProduct && this.listPagination()}
          </div>
          <div className="col-md-4 col-sm-12 cart-block">
            <div className="cart ">
              <Cart
                cartobj={this.state.cartobj}
                removeFromTheCart={this.removeFromTheCart}
                total={this.state.total}
                total_price={this.state.total_price}
                qty={this.state.qty}
                changeQty={this.changeQty}
                discountCalculation={this.discountCalculation}
                discount={this.state.discount}
                original_amount={this.state.origianl_amount}
                discountstatus={this.state.discountstatus}
                feesstatus={this.state.feesstatus}
                feesCalculation={this.feesCalculation}
                fees={this.state.fees}
                removeAdditionalFees={this.removeAdditionalFees}
                discount_type={this.state.discount_type}
                changeMoney={this.changeMoney}
                changes={this.state.changes}
                handlePaymentModeChange={this.handlePaymentModeChange}
                payment_type={this.state.payment_type}
                payAmount={this.state.payAmount}
                postOrder={this.postOrder}
                handlePaymentClose={this.handlePaymentClose}
                showPaymentModal={this.state.showPaymentModal}
                handlePaymentOpen={this.handlePaymentOpen}
                myRef={this.myRef}
                customer_name={this.state.customer_name}
                product_type={this.state.product_type}
                handleOrderNote={this.handleOrderNote}
                handleClearNote={this.handleClearNote}
                orderNote={this.state.orderNote}
                percent={this.state.percent}
                tax={this.state.tax}
                taxpercent={this.state.taxpercent}
                couponliststatus={this.state.couponliststatus}
                coupon={this.state.coupon}
                totalcoupon={this.state.totalcoupon}
                handleSumoCode={this.handleSumoCode}
                handleSumoCodeSubmit={this.handleSumoCodeSubmit}
                removeCoupon={this.removeCoupon}
              />
            </div>

            <PaymentModal
              cartobj={this.state.cartobj}
              removeFromTheCart={this.removeFromTheCart}
              total={this.state.total}
              total_price={this.state.total_price}
              qty={this.state.qty}
              changeQty={this.changeQty}
              discountCalculation={this.discountCalculation}
              discount={this.state.discount}
              original_amount={this.state.origianl_amount}
              discountstatus={this.state.discountstatus}
              feesstatus={this.state.feesstatus}
              feesCalculation={this.feesCalculation}
              fees={this.state.fees}
              removeAdditionalFees={this.removeAdditionalFees}
              discount_type={this.state.discount_type}
              changeMoney={this.changeMoney}
              changes={this.state.changes}
              handlePaymentModeChange={this.handlePaymentModeChange}
              payment_type={this.state.payment_type}
              payAmount={this.state.payAmount}
              postOrder={this.postOrder}
              handleClose={this.handlePaymentClose}
              showPaymentModal={this.state.showPaymentModal}
              handleShow={this.handlePaymentOpen}
              ref={this.myRef}
              customer_name={this.state.customer_name}
              product_type={this.state.product_type}
              paying={this.state.paying}
              error_block={this.state.error_block}
              error_message={this.state.error_message}
              tax={this.state.tax}
              taxpercent={this.state.taxpercent}
              current_money_mode={this.state.current_money_mode}
              allAmount={this.state.allAmount}
              couponliststatus={this.state.couponliststatus}
              coupon={this.state.coupon}
            />
          </div>
        </div>
        {
          // <a onClick = {this.restartCart}>ssssssssss</a>
        }
      </div>
    );
  }
}

export default App;
