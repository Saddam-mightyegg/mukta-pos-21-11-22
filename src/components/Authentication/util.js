import Cookies from "universal-cookie";
import { Wordpress } from "../functions/Woocommerce";

const TOKEN_KEY = "token";

export const login = () => {
  localStorage.setItem(TOKEN_KEY, "TestLogin");
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isLogin = async () => {
  var status = false;

  const cookies = new Cookies();
  const access_token = cookies.get("token");
  // if (access_token) {
  var data = {
    jwt: access_token,
  };
  await Wordpress.validateJwth(data).then(
    async (res) => {
      console.log(res);

      status = true;
    },
    (error) => {
      console.log(error.response);
    }
  );

  // }
  //alert(status)
  return status;
};
