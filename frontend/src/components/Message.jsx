import { Alert } from "react-bootstrap";

const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProp = {
  variant: "info",
};
export default Message;
