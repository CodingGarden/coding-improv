for file in *.wav; do
  ffmpeg -i $file -af aecho=1.0:0.7:50:0.5 -y reverb/$file
done