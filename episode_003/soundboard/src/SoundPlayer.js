const SoundPlayer = ({
  emoji,
  playSound,
}) => {
  return (
    <div className="sound-button" onClick={playSound}>
      <span className="sound-emoji">{emoji}</span>
    </div>
  );
};


export default SoundPlayer;
