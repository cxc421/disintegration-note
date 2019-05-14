import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import SliderBox from './SliderBox';
import { usePrevious } from '../util-hooks';

import sImg1 from '../assets/slider_1.jpg';
import sImg1_s from '../assets/slider_1_small.jpg';
import sImg2 from '../assets/slider_2.jpg';
import sImg2_s from '../assets/slider_2_small.jpg';
import sImg3 from '../assets/slider_3.jpg';
import sImg3_s from '../assets/slider_3_small.jpg';
import sImg4 from '../assets/slider_4.jpg';
import sImg4_s from '../assets/slider_4_small.jpg';
import sImg5 from '../assets/slider_5.jpg';
import sImg5_s from '../assets/slider_5_small.jpg';

const Wrapper = styled.div`
  flex-grow: 1;
  /* background: rgba(255, 0, 0, 0.1); */
  /* height: 100%; */
  width: 100%;
  margin-top: 40px;
  margin-bottom: 80px;
  position: relative;
  perspective: 1000px;
  transform-style: preserve-3d;
`;

const slider = [
  {
    img: sImg1,
    img_s: sImg1_s,
    text: 'Depression'
  },
  {
    img: sImg2,
    img_s: sImg2_s,
    text: 'Angry'
  },
  {
    img: sImg3,
    img_s: sImg3_s,
    text: 'Lust'
  },
  {
    img: sImg4,
    img_s: sImg4_s,
    text: 'Violence'
  },
  {
    img: sImg5,
    img_s: sImg5_s,
    text: 'Pressure'
  }
];

function useLeftRightKeyboard(showIdx, changeBox, isProcessing) {
  useEffect(() => {
    function onKeyDown(e) {
      if (isProcessing) return;

      if (e.keyCode === 39) {
        changeBox(showIdx + 1);
      } else if (e.keyCode === 37) {
        changeBox(showIdx - 1);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showIdx, changeBox, isProcessing]);
}

const defaultDeleteArr = slider.map(() => false);

function Slider({ names, isProcessing, onProcessComplete, onProcessError }) {
  const [showIdx, setShowIdx] = useState(0);
  const [nameArr, setNameArr] = useState([]);
  const [nameIdx, setNameIdx] = useState(-1);
  const [deleteArr, setDeleteArr] = useState(defaultDeleteArr);
  const prevNameIdx = usePrevious(nameIdx);

  useLeftRightKeyboard(showIdx, changeBox, isProcessing);

  useEffect(() => {
    if (isProcessing) {
      // console.log('Effect - A');
      const nameArr = names.split(' ').filter(name => name.length > 0);
      if (nameArr.length > 0) {
        let haveError = nameArr.find(
          name => -1 === slider.findIndex(obj => obj.text === name)
        );
        if (haveError) {
          setNameIdx(-1);
          onProcessError();
          return;
        }

        setNameArr(nameArr);
        setNameIdx(0);
        console.log({ nameArr });
      } else {
        // console.log('complete');
        setNameIdx(-1);
        onProcessError();
      }
    }
  }, [isProcessing, names, onProcessComplete, onProcessError]);

  useEffect(() => {
    if (isProcessing && nameIdx >= 0 && nameIdx !== prevNameIdx) {
      // console.log('Effect - B');
      const name = nameArr[nameIdx];
      if (!name) {
        // console.log('complete');
        setNameIdx(-1);
        onProcessComplete();
      }

      const boxIdx = slider.findIndex(
        (box, idx) => box.text === name && !deleteArr[idx]
      );
      if (boxIdx === -1) {
        // console.log('not found: ' + name);
        setNameIdx(nameIdx + 1);
      } else {
        // console.log('found: ' + name);
        const newDeleteArr = deleteArr.slice();
        newDeleteArr[boxIdx] = true;
        setDeleteArr(newDeleteArr);
        changeBox(boxIdx);
      }
    }
  }, [
    isProcessing,
    nameIdx,
    nameArr,
    onProcessComplete,
    deleteArr,
    prevNameIdx
  ]);

  function changeBox(newIdx) {
    if (newIdx < 0) {
      newIdx = slider.length - 1;
    } else if (newIdx > slider.length - 1) {
      newIdx = 0;
    }
    setShowIdx(newIdx);
  }

  function onDeleteComplete(idx) {
    // console.log('Delete complete - ' + idx);
    setNameIdx(nameIdx + 1);
  }

  return (
    <Wrapper>
      {slider.map((obj, idx) => {
        const showOuter = idx === showIdx;
        let transform = 'none';
        if (showOuter) {
          transform = `translate3d(0,0,0)`;
        } else {
          let isLeft = idx < showIdx;
          let diff = Math.abs(showIdx - idx);
          if (diff > slider.length / 2) {
            isLeft = !isLeft;
            diff = slider.length - diff;
          }
          transform = `translate3d(${isLeft ? '-84%' : '84%'}, 0, ${-436 *
            diff}px)`;
        }

        return (
          <SliderBox
            key={idx}
            {...obj}
            showOuter={showOuter}
            transform={transform}
            onClickPrevIcon={() => {
              if (!isProcessing) {
                changeBox(idx - 1);
              }
            }}
            onClickNextIcon={() => {
              if (!isProcessing) {
                changeBox(idx + 1);
              }
            }}
            isDelete={deleteArr[idx]}
            onDeleteComplete={() => onDeleteComplete(idx)}
          />
        );
      })}
    </Wrapper>
  );
}

export default React.memo(Slider);
