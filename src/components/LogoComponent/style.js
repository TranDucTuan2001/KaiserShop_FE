import styled from "styled-components";
export const WrapperAnimateStyle = styled.img`
  height: 79px;
`;

export const WrapperTextHeader = styled.span`
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  text-align: left;
  cursor: pointer;
  text-shadow: -2px -2px 0 #ff8600,
    /* Đỏ phía trên bên trái */ 2px -2px 0 #ff8600,
    /* Đỏ phía trên bên phải */ -2px 2px 0 #0000ff,
    /* Xanh phía dưới bên trái */ 2px 2px 0 #0000ff,
    /* Xanh phía dưới bên phải */ -2px 0px 0 #ff8600,
    /* Đỏ bên trái */ 2px 0px 0 #ff8600, /* Đỏ bên phải */ 0px -2px 0 #ff8600,
    /* Đỏ phía trên */ 0px 2px 0 #0000ff; /* Xanh phía dưới */
`;
