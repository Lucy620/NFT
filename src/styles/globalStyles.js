/* eslint-disable */
import styled from "styled-components";

// Used for wrapping a page component
export const Screen = styled.div`
  background-color: var(--white);
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? "pink" : "none")};
  width: 100%;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
`;

export const leftBox = styled.div` 
  width: 500px;
  height: 400px;
`;

export const rightBox = styled.div`
  position: absolute;
  margin-top: 30px;
  left: 600px;
  width: 500px;
  height: 400px; 
`;
export const flex_container = styled.div`
  display: flex;
  display: -webkit-flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;   
`;

export const TextTitle = styled.p`
  color: black;
  font-size: 20px;
  font-weight: 500;
  color:rgba(0,0,0,0.8)
`;

export const TextSubTitle = styled.p`
  color: black;
  font-size: 16px;
  font-weight: 500;
`;

export const TextDescription = styled.p`
  color: black;
  font-size: 14px;
  font-weight: 600;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;

export const Input = styled.input`
	padding: 0.5em;
	color: palevioletred;
	background: papayawhip;
	border: none;
	border-bottom: 2px solid black;
	border-radius: 3px;
	width: 500px;
	margin-bottom: 20px;
`;

export const img = styled.img`
  max-width: 100%;
  max-height: 100%;

`;