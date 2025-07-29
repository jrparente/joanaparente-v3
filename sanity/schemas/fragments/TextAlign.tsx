import React from "react";

export const TextAlign = (props: any) => {
  return (
    <div style={{ textAlign: props.value || "left", width: "100%" }}>
      {props.children}
    </div>
  );
};
