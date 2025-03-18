import React from "react";
import { SignIn } from "@clerk/clerk-react";
import './SignIn.css'

const Signin = () => {
  return (
    <div className="box1">
      <SignIn
      />
    </div>
  );
};

export default Signin;