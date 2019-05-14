import React, { useState, memo } from 'react';
import styled, { css as _css } from 'styled-components';
import { NavigateBefore } from 'styled-icons/material/NavigateBefore';
import { NavigateNext } from 'styled-icons/material/NavigateNext';
import { useLazyImage } from '../util-hooks';
import DisImg from './DisImg';

const BoxWrapper = styled.div`
  position: absolute;
  width: 540px;
  height: 393px;
  margin: auto;
  background: white;
  left: 0;
  right: 0;
  transition: transform 0.4s;
  transform: ${prop => prop.transform};
  z-index: 100;
  top: 50%;
  margin-top: -197px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Name = styled.p`
  padding: 0;
  margin: 0;
  font-size: 24px;
  line-height: 51px;
  font-family: 'Homemade Apple', cursive;
  text-align: center;
  margin-bottom: 8px;
`;

const arrowCss = _css`
  position: absolute;
  color: white;
  width: 48px;
  top: 144px;
  opacity: ${prop => (prop.showOuter ? 1 : 0)};
  visibility: ${prop => (prop.showOuter ? 'visible' : 'hidden')};
  cursor: pointer;
  transition: transform 0.3s, opacity 0.4s;
`;

const LeftArrowIcon = styled(NavigateBefore)`
  ${arrowCss}
  left: 0;
  transform: translateX(-100%) scale(1);

  &:hover {
    transform: translateX(-100%) scale(1.5);
  }
`;

const RightArrowIcon = styled(NavigateNext)`
  ${arrowCss}
  right: 0;
  transform: translateX(100%) scale(1);

  &:hover {
    transform: translateX(100%) scale(1.5);
  }
`;

const ImgArea = styled.div`
  position: absolute;
  transition: all 0.4s;
  ${prop => {
    if (prop.showOuter) {
      return `
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 67px;
      `;
    } else {
      return `
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-shadow: 0px 4px 40px rgba(255,255,255,0.5);
      `;
    }
  }}
`;

const BlackDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0;
  top: 0;
  left: 0;
  transition: opacity 1s;
`;

const SliderBox = ({
  text,
  showOuter,
  transform,
  img,
  img_s,
  onClickPrevIcon,
  onClickNextIcon,
  isDelete,
  onDeleteComplete
}) => {
  const [alreadyDelete, setAlreadyDelete] = useState(false);
  const imgSrc = useLazyImage({ imgSmall: img_s, imgBig: img });
  const blackDivStyle = {
    opacity: alreadyDelete ? 1 : 0
  };
  const nameStyle = {
    color: alreadyDelete ? 'red' : 'black',
    textDecoration: alreadyDelete ? 'line-through' : 'none'
  };

  function onAnimationEnd() {
    setAlreadyDelete(true);
    onDeleteComplete();
  }

  return (
    <BoxWrapper transform={transform}>
      <ImgArea showOuter={showOuter}>
        <DisImg
          imgSrc={imgSrc}
          isDelete={isDelete}
          onAnimationEnd={onAnimationEnd}
        />
        <BlackDiv style={blackDivStyle} />
      </ImgArea>
      <Name style={nameStyle}>{text}</Name>
      <LeftArrowIcon showOuter={showOuter} onClick={onClickPrevIcon} />
      <RightArrowIcon showOuter={showOuter} onClick={onClickNextIcon} />
    </BoxWrapper>
  );
};

export default memo(SliderBox);
