import { cname } from "../../utils/cname";

const CartContainer = (props) => {
    return (
      <div
        {...props}
        className={cname(
          "w-full bg-white border rounded-xl flex py-4 shadow-sm",
          props.className
        )}
      />
    );
  };
  
  export default CartContainer;
  