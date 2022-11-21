import axios from "axios";
import Oauth from "oauth-1.0a";
import CryptoJS from "crypto-js";
import jQuery from "jquery";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM
const ck = "ck_9100d06f517baf77e77072015d534543583c7f91";
const cs = "cs_1d7146738bdc2d79f847ab431c82dcaf64b5d24f";

// const ck = "ck_5e0fbce09dd5fdc632d0a6bd035d3abaf4dad9fd";
// const cs = "cs_e4b548fd2a715fdc17bf994856a8a90591c2f15b";
// const baseURL = "http://15.207.154.98/wp-json";
const baseURL = "https://www.muktaofficial.com/wp-json";

// const baseURL = "http://localhost/Mukta/wp-json";

// const PROXY = "https://cors-anywhere.herokuapp.com/";

const WooCommerce = new WooCommerceRestApi({
  // url: PROXY+ 'http://15.207.154.98', // Your store URL
  url: "https://www.muktaofficial.com", // Your store URL
  // url: 'http://localhost/Mukta', // Your store URL

  consumerKey: ck, // Your consumer key
  consumerSecret: cs, // Your consumer secret
  version: "wc/v3", // WooCommerce WP REST API version
});
var username = "Sarah";
var password = "HV4Z4s15yOSh@1bG5*(4B1PK";
const prefix = "/wc/v3/";

//https://example.com/wp-json/wp/v2/users

export const Wordpress = {
  prefix: "wp-json/wp/v2",
  validateJwth: (data) => {
    return makePostRequest("/aam/v2/jwt/validate", data);
  },
  authenticate: (data) => {
    data["issueJWT"] = true;
    username = data["username"];
    password = data["password"];

    return makePostRequest("/aam/v2/authenticate", data);
  },
  logout: (data) => {
    return makePostRequest("/aam/v2/jwt/revoke", data);
  },
};

export const Woocommerce = {
  getProducts: (page) => {
    return makeRequest(prefix + "products", page);
  },
  getProductByID: (id) => {
    return makeRequest(prefix + "products/" + id);
  },
  getCategoriesList: () => {
    return makeRequest(prefix + "products/categories", {
      per_page: 100,
    });
  },

  getPaymentGateway: () => {
    return makeRequest(prefix + "payment_gateways");
  },

  getCustomerList: (data) => {
    return makeRequest(prefix + "customers", data);
  },

  getCountryList: () => {
    // return makeRequestGeneral("https://restcountries.eu/rest/v2/all");
    return makeRequest(prefix + "data/countries");
  },

  getStateList: () => {
    // return makeRequestGeneral("https://restcountries.eu/rest/v2/all");
    return makeRequest(prefix + "data/countries/bd");
  },

  postOrder: (data) => {
    // return makeRequestGeneral("https://restcountries.eu/rest/v2/all");
    return makePostRequest(prefix + "orders", data);
  },

  postCustomer: (data) => {
    return makePostRequest(prefix + "customers", data);
  },
  getSpecificCustomer: (id) => {
    return makeRequest(prefix + "customers/" + id);
  },

  updateOrder: (id, data) => {
    return makePutRequest("orders/" + id, data);
  },

  getAllData: () => {
    return makeRequest(prefix + "data");
  },

  getProductVariation: (id, array) => {
    return makeRequest(prefix + "products/" + id + "/variations", array);
  },

  postOrderNote: (id, data) => {
    return makePostRequest(prefix + "orders/" + id + "/notes", data);
  },
  getOrderHistory: (data) => {
    return makeRequest(prefix + "orders", data);
  },

  getTaxList: () => {
    return makeRequest(prefix + "taxes");
  },

  getSumoList: (data) => {
    return makeRequest(prefix + "coupons", data);
  },
  changePosStatus: (id, data) => {},
};

function makeRequest(endpoint, data, method = "GET") {
  const oauth = getOauth();

  const requestData = {
    url: baseURL + endpoint,
    method,
    data: data,
  };

  const requestHTTP =
    requestData.url + "?" + jQuery.param(oauth.authorize(requestData));

  return axios.get(requestHTTP);
}
function makePutRequest(endpoint, data, method = "PUT") {
  // const oauth = getOauth();

  // const requestData = {
  //   url: baseURL + endpoint,
  //   method,
  //   data: data
  // };

  // const requestHTTP =
  //   requestData.url + "?" + jQuery.param(oauth.authorize(requestData));

  return WooCommerce.put(endpoint, data);

  //  return axios.put(requestHTTP);
}

function makePostRequest(endpoint, data, method = "POST") {
  // const oauth = getOauth();
  console.log(data);

  const requestData = {
    url: baseURL + endpoint,
    method,
    data: data,
  };

  // const requestHTTP =
  //   requestData.url + "?" + jQuery.param(oauth.authorize(requestData));

  const requestHTTP = requestData.url;
  return axios({
    method: "post",
    url: requestHTTP,
    data: data,
    auth: {
      username: username,
      password: password, // Bad password
    },
  });

  //return axios.post(requestHTTP, data);

  //return axios.post(requestHTTP,data);

  // WooCommerce.post("orders",data)
  // .then((response) => {
  //   console.log(response.data);
  // })
  // .catch((error) => {
  //   console.log(error);
  // });
}

function makeRequestGeneral(endpoint, method = "GET") {
  const requestData = {
    url: endpoint,
    method,
  };

  const requestHTTP = requestData.url;

  return axios.get(requestHTTP);
}

function getOauth() {
  return Oauth({
    consumer: {
      key: ck,
      secret: cs,
    },
    signature_method: "HMAC-SHA1",
    hash_function: function (base_string, key) {
      return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(base_string, key));
    },
  });
}
