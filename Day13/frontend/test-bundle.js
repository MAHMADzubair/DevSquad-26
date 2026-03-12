import fs from 'fs';

fetch("https://frontend-iota-flax-77qqm7aoj8.vercel.app/assets/index-CrgIkngf.js")
  .then(res => res.text())
  .then(text => {
    const matches = text.match(/.{0,50}backend-mocha.{0,50}/g);
    fs.writeFileSync('out-bundle.json', JSON.stringify(matches, null, 2));
  }).catch(console.error);
