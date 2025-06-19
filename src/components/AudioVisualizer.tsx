import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState
} from 'react';
import { useAudioStore } from '@/store/useAudioStore';
import '@/styles/AudioVisualizer.css';

export const AudioVisualizer = forwardRef(function AudioVisualizer(
  { audio }: { audio: ArrayBuffer | null },
  ref
) {
  const useAnimationLoop = useAudioStore(state => state.useAnimationLoop);
  const useCanvas = useAudioStore(state => state.useCanvas);

  const [ctx, canvas, setCanvas] = useCanvas({ autoResize: true });
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [, setSourceNode] =
    useState<MediaElementAudioSourceNode | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Crea un Blob URL para audio y lo asigna al <audio>
  useEffect(() => {
    if (!audio) return;

    const blob = new Blob([audio], { type: 'audio/mpeg' }); // o el tipo correcto
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);

    return () => {
      if (url) URL.revokeObjectURL(url);
      setAudioUrl(null);
    };
  }, [audio]);

  // Inicializa AudioContext y conecta el audio element para análisis
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;

    const context = new AudioContext();
    setAudioContext(context);

    const source = context.createMediaElementSource(audioRef.current);
    const analyserNode = context.createAnalyser();
    analyserNode.fftSize = 2048;

    source.connect(analyserNode);
    analyserNode.connect(context.destination);

    setAnalyser(analyserNode);
    setSourceNode(source);

    return () => {
      analyserNode.disconnect();
      source.disconnect();
      context.close();
      setAudioContext(null);
      setAnalyser(null);
      setSourceNode(null);
    };
  }, [audioUrl]);

  useImperativeHandle(ref, () => ({
    async play() {
      if (!audioRef.current) return;
      if (audioContext?.state === 'suspended') {
        await audioContext.resume();
      }
      await audioRef.current.play();
    },
    pause() {
      audioRef.current?.pause();
    },
    stop() {
      if (!audioRef.current) return;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    },
    again() {
      if (!audioRef.current) return;
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }));

  useAnimationLoop(() => {
    if (!ctx || !canvas || !analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;

    for (let i = 0; i < bufferLength; i++) {
      const sample = dataArray[i] / 256;
      const height = canvas.height * sample;
      const x = i * barWidth + barWidth / 2;
      const y = canvas.height - height;

      ctx.fillStyle = `rgb(${sample * 126 + 100},50,50)`;
      ctx.fillRect(x, y, barWidth, height);
    }
  });

  return (
    <>
      <canvas className='am-canvas' ref={setCanvas} />
      <audio ref={audioRef} src={audioUrl ?? undefined} preload='auto' />
    </>
  );
});
