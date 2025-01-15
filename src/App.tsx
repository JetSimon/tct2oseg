import { useState } from 'react'
import './App.css'
import { loadCode1 } from './utils.js';
import CodePicker from './components/CodePicker'
import { getOseg } from './getOseg.js';
import Candidate from './Candidate.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let code1: Record<string, any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const code2sAsOseg: any[] = [];

function App() {

  const [numberOfCode2, setNumberOfCode2] = useState(1);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  function download() {
    try {
        const oseg = getOseg(code1, code2sAsOseg[0]);

        for(let i = 1; i < code2sAsOseg.length; i++) {
          const temp = code2sAsOseg[i];
          oseg.scenarioSides.push(temp.scenarioSides[0]);
        }

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(oseg, null, 4)));
        element.setAttribute('download', "data.json");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    catch(e){
      alert("Error in conversion:" + e);
      console.error(e);
    }
  }

  function onCode1Picked(file: File | null) {

    if(file == null) {
      return;
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const raw = e.target?.result;
      if(code1 == null && raw != null) {
        code1 = loadCode1(raw);
        if(code1) {
          setCandidates(code1.candidate_json.map((x: { fields: { first_name: string; last_name: string; }; pk: number; }) => {
            const can : Candidate = {
              fullName: x.fields.first_name + " " + x.fields.last_name,
              pk: Number(x.pk)
            }
            return can;
          }));
        }
      }
    }
    reader.readAsText(file);
  }

  return (
    <div>
      <h1>tct2oseg</h1>
      <h2>1. Import your code 1 file</h2>
      <p>Note: the code 1 file you import CANNOT use JSON.parse(). One that is made with NCT ModMan or Jet's Code 1 tool should be compatible.</p>
      <p>If you are still getting errors, try removing everything except the election_json part and the candidate_json part.</p>
      
      <label>Code 1: </label>
      <input type="file" onChange={(e) => onCode1Picked(e.target.files && e.target.files.length > 0 ? e.target.files[0] : null)}></input>

      <h2>2. Import code 2 files</h2>
      
      <p>Please only add one code 2 per playable candidate (ex: if you have both Simpson/Burns and Simpson/Smithers where Simpson is a playable candidate, only upload one of them)</p>
      <p>Any code 2 that is able to be read by Jet's Code 2 tool will be compatible.</p>
      
      <div>
      {
        [...Array(numberOfCode2)].map((_e, i) => {
          return <CodePicker candidates={candidates} key={i} label="Code 2" onCode2Ready={(x) => code2sAsOseg.push(x)}></CodePicker>
        })
      }
      </div>

      <button onClick={() => setNumberOfCode2((x) => x + 1)}>Add another Code 2</button>

      <h2>3. Download OSEG Version</h2>

      <button onClick={download}>Convert and Download</button>

      <h2>4. What you will still need</h2>

      <p>You will still need to get a logic.js file (blank ones are available in the OSEG editor), a blank style.css file, and most importantly if you do not have a map SVG you will need to find one and make sure that the paths in the map SVG line up with the abbreviations in the OSEG data.json.</p><p>This is very similar to TCT and if you know how to do a custom map in TCT you should be ok. If the mod you are trying to convert has a map in an existing TCT base scenario, the one already in the OSEG editor should work.</p>
      <p>You will also need to assign the running mates to the candidates in the OSEG editor. But they should all be defined.</p>
    </div>
  )
}

export default App
