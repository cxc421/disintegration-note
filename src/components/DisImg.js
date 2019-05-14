import React, { createRef, PureComponent } from 'react';
import styled from 'styled-components';
import Chance from 'chance';
import './DisImg.css';

const chance = new Chance();

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  /* background: black; */
`;

const TopImg = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-size: cover;
  background-position: center center;
  background-image: url(${prop => prop.src});
`;

function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
  offsetY = typeof offsetY === 'number' ? offsetY : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r, // new prop. width
    nh = ih * r, // new prop. height
    cx,
    cy,
    cw,
    ch,
    ar = 1;

  // decide which gap to fill
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

class DisImg extends PureComponent {
  canvasCount = 35;
  wrapperRef = createRef();

  createBlankImageData(imageData) {
    const imageDataArray = [];
    for (let i = 0; i < this.canvasCount; i++) {
      let arr = new Uint8ClampedArray(imageData.data);
      for (let j = 0; j < arr.length; j++) {
        arr[j] = 0;
      }
      imageDataArray.push(arr);
    }
    return imageDataArray;
  }

  weightedRandomDistrib(peak) {
    var prob = [],
      seq = [];
    for (let i = 0; i < this.canvasCount; i++) {
      prob.push(Math.pow(this.canvasCount - Math.abs(peak - i), 3));
      seq.push(i);
    }
    return chance.weighted(seq, prob);
  }

  newCanvasFromImageData(imageDataArray, w, h) {
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var tempCtx = canvas.getContext('2d');
    tempCtx.putImageData(new ImageData(imageDataArray, w, h), 0, 0);

    return canvas;
  }

  imgOnload(img) {
    const container = this.wrapperRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.style.position = 'absolute';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    drawImageProp(ctx, img, 0, 0, canvas.width, canvas.height, 0.5, 0.5);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelArr = imageData.data;
    const imageDataArray = this.createBlankImageData(imageData);

    // console.log(imageDataArray[0]);
    // console.log(pixelArr);
    //put pixel info to imageDataArray (Weighted Distributed)
    for (let i = 0; i < pixelArr.length; i += 4) {
      //find the highest probability canvas the pixel should be in
      let p = Math.floor((i / pixelArr.length) * this.canvasCount);
      for (let k = 0; k < 1; k++) {
        let a = imageDataArray[this.weightedRandomDistrib(p)];
        a[i] = pixelArr[i];
        a[i + 1] = pixelArr[i + 1];
        a[i + 2] = pixelArr[i + 2];
        a[i + 3] = pixelArr[i + 3];
      }
    }

    //create canvas for each imageData and append to target element
    const canvasList = [];
    for (let i = 0; i < this.canvasCount; i++) {
      let c = this.newCanvasFromImageData(
        imageDataArray[i],
        canvas.width,
        canvas.height
      );
      c.style.position = 'absolute';
      container.prepend(c);
      canvasList.push(c);
    }
    const topImg = container.querySelector('div');
    const topImgDuration = 3500 / 2;
    topImg.style.webkitAnimation = `fadeOut ${topImgDuration}ms ease 0s 1 both`;
    topImg.addEventListener('animationend', function() {
      container.removeChild(this);
    });

    canvasList.forEach((c, index) => {
      c.classList.add('blurDis');
      setTimeout(() => {
        const sx = 0;
        const sy = -150;
        const angle = 0;
        const duration = 35 + 35 * index;

        c.style.WebkitTransition = `transform ${duration}ms cubic-bezier(0.755, 0.05, 0.855, 0.06)`;
        c.style.transform = `rotate(${angle}deg) translate(${sx}px, ${sy}px)`;

        c.style.webkitAnimation = `fadeOut ${duration}ms cubic-bezier(0.755, 0.05, 0.855, 0.06) 0s 1 both`;
      }, 35 * index);

      c.addEventListener('animationend', e => {
        if (e.animationName === 'fadeOut') {
          container.removeChild(c);
          if (index === canvasList.length - 1) {
            setTimeout(() => {
              this.props.onAnimationEnd();
            }, 100);
          }
        }
      });
    });
  }

  startAnimate() {
    const img = new Image();
    img.onload = () => this.imgOnload(img);
    img.src = this.props.imgSrc;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isDelete !== this.props.isDelete && this.props.isDelete) {
      setTimeout(() => {
        this.startAnimate();
      }, 400);
    }
  }

  render() {
    const { imgSrc } = this.props;

    return (
      <Wrapper ref={this.wrapperRef}>
        <TopImg src={imgSrc} />
      </Wrapper>
    );
  }
}

DisImg.defaultProps = {
  imgSrc: '',
  isDelete: false,
  onAnimationEnd: k => k
};

export default DisImg;
