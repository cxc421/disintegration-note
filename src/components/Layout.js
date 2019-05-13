import React from 'react';
import styled from 'styled-components';
import { useLazyImage } from '../util-hooks';
import bgSmallSrc from '../assets/bg_small.jpg';
import bgBigSrc from '../assets/bg.jpg';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  overflow: hidden;
`;

const CenterBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: auto;
  max-width: 1280px;
  width: 100%;
  height: 100%;
  position: relative;
  /* background: rgba(255, 255, 255, 0.2); */
  padding: 0 20px;
  padding-top: 40px;
`;

const Title = styled.h1`
  padding: 0;
  margin: 0;
  font-family: 'Caesar Dressing', cursive;
  font-size: 72px;
  color: white;
  line-height: 88px;
  flex-shrink: 0;
`;

const Layout = ({ children }) => {
  const imgSrc = useLazyImage({ imgSmall: bgSmallSrc, imgBig: bgBigSrc });
  const wrapperStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(${imgSrc})`
  };

  return (
    <Wrapper style={wrapperStyle}>
      <CenterBlock>
        <Title>Disintegration Note</Title>
        {children}
      </CenterBlock>
    </Wrapper>
  );
};

export default Layout;
