import React, { useState } from 'react';
import Layout from './components/Layout';
import TextInput from './components/TextInput';
import Slider from './components/Slider';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [names, setNames] = useState('');

  const onTextInputSubmit = () => {
    setIsProcessing(true);
  };

  const onProcessComplete = () => {
    console.log('on-process-complete');
    setNames('');
    setIsProcessing(false);
  };

  return (
    <Layout>
      <Slider
        isProcessing={isProcessing}
        names={names}
        onProcessComplete={onProcessComplete}
      />
      <TextInput
        names={names}
        setNames={setNames}
        isProcessing={isProcessing}
        onSubmit={onTextInputSubmit}
      />
    </Layout>
  );
}

export default App;
