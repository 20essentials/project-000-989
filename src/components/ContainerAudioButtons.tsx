// ContainerAudioButtons.tsx
import '@/styles/ContainerAudioButtons.css'

export function ContainerAudioButtons({
  onPlay,
  onStop,
  onAgain
}: {
  onPlay: () => void;
  onStop: () => void;
  onAgain: () => void;
}) {
  return (
    <div className="radio-input">
      <label className="label">
        <div className="back-side"></div>
        <input
          type="radio"
          id="value-1"
          name="value-radio"
          value="value-1"
          onChange={onPlay}
        />
        <span className="text">play</span>
        <span className="bottom-line"></span>
      </label>

      <label className="label">
        <div className="back-side"></div>
        <input
          type="radio"
          id="value-2"
          name="value-radio"
          value="value-2"
          onChange={onStop}
        />
        <span className="text">stop</span>
        <span className="bottom-line"></span>
      </label>

      <label className="label" style={{ display: 'none'}}>
        <div className="back-side"></div>
        <input
          type="radio"
          id="value-3"
          name="value-radio"
          value="value-3"
          onChange={onAgain}
        />
        <span className="text">again</span>
        <span className="bottom-line"></span>
      </label>
    </div>
  );
}
