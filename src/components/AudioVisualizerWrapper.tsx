import { useRef, useEffect, useState } from 'react';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { ContainerAudioButtons } from '@/components/ContainerAudioButtons';

export function AudioVisualizerWrapper() {
  const [audioBuffer, setAudioBuffer] = useState<ArrayBuffer | null>(null);
  const visualizerRef = useRef<{ play: () => void; stop: () => void; again: () => void }>(null);

  useEffect(() => {
    const fetchAudioAsBuffer = async () => {
      try {
        // https://20essentials.github.io/axol-soundtrack/songs/n1.mp3
        // const response = await fetch('/assets/axol-get-up-again.mp3');
        const response = await fetch('https://20essentials.github.io/axol-soundtrack/songs/n1.mp3');
        const arrayBuffer = await response.arrayBuffer();
        setAudioBuffer(arrayBuffer);
      } catch (error) {
        console.error('Error al cargar el audio:', error);
      }
    };

    fetchAudioAsBuffer();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        setAudioBuffer(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Audio -mp3- Visualizer</h1>
      <input
        className="file-input"
        id="audio-upload"
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
      />
      <label htmlFor="audio-upload" className="upload-label">
        Upload Audio
      </label>

      <ContainerAudioButtons
        onPlay={() => visualizerRef.current?.play()}
        onStop={() => visualizerRef.current?.stop()}
        onAgain={() => visualizerRef.current?.again()}
      />

      <AudioVisualizer ref={visualizerRef} audio={audioBuffer} />
    </div>
  );
}