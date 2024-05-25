import React from "react";

const CommentComponent = (props) => {
  const { dataHref, width} = props;
  return (
    <div style={{margin:'15px 0 0 -15px'}}>
      <div
        className="fb-comments"
        data-href={dataHref}
        data-width={width}
        data-numposts="5"
      ></div>
    </div>
  );
};

export default CommentComponent;
