import React, { useState } from 'react';
import Layout from './components/Layout';
import TextInput from './components/TextInput';
import Slider from './components/Slider';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [names, setNames] = useState('');
  const [haveError, setHaveError] = useState(false);

  const onTextInputSubmit = () => {
    setIsProcessing(true);
  };

  const onProcessComplete = () => {
    setNames('');
    setIsProcessing(false);
  };

  const onProcessError = () => {
    setHaveError(true);
  };

  function onSetNames(newName) {
    if (isProcessing) return;
    setNames(newName);
  }

  function clearError() {
    setHaveError(false);
    setIsProcessing(false);
  }

  return (
    <Layout>
      <Slider
        isProcessing={isProcessing}
        names={names}
        onProcessComplete={onProcessComplete}
        onProcessError={onProcessError}
      />
      <TextInput
        haveError={haveError}
        names={names}
        setNames={onSetNames}
        isProcessing={isProcessing}
        onSubmit={onTextInputSubmit}
        clearError={clearError}
      />
    </Layout>
  );
}

export default App;
