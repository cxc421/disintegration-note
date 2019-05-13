import React, { useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.form`
  background: white;
  position: relative;
  max-width: 730px;
  width: 100%;
  height: 160px;
  padding: 36px 32px 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h2`
  padding: 0;
  margin: 0;
  font-family: 'Caesar Dressing', cursive;
  font-size: 24px;
  line-height: 29px;
  text-align: center;
  font-weight: 400;
`;

const InputWrapper = styled.div`
  border-bottom: solid 1px black;
  /* background: pink; */
  height: 36px;
`;

const Input = styled.input`
  outline: none;
  border: none;
  font-size: 32px;
  font-family: 'Homemade Apple', cursive;
  text-align: center;
  margin-top: -20px;
  background: transparent;
  width: 100%;
  padding: 0;
  color: ${prop => (prop.isProcessing ? 'red' : 'black')};
  pointer-events: ${prop => (prop.isProcessing ? 'none' : 'auto')};
`;

const TextInput = ({ names, setNames, onSubmit, isProcessing }) => {
  const inputRef = useRef();

  function onKeyDown(e) {
    e.nativeEvent.stopImmediatePropagation();
  }

  function onTextInputSubmit(e) {
    e.preventDefault();
    onSubmit();
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }

  return (
    <Wrapper onSubmit={onTextInputSubmit}>
      <Title>— Write Down the Name to Disintegrate it —</Title>
      <InputWrapper>
        <Input
          type="text"
          ref={inputRef}
          value={names}
          isProcessing={isProcessing}
          onKeyDown={onKeyDown}
          onChange={e => {
            setNames(e.target.value);
          }}
        />
      </InputWrapper>
    </Wrapper>
  );
};

export default TextInput;
