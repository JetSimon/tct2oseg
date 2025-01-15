import { useState } from "react";
import {loadDataFromFile} from '../TCTData.js';
import Candidate from "../Candidate.js";

interface CodePickerProps {
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCode2Ready: ((code2: Record<string, any>) => void);
    candidates : Candidate[];
}

function CodePicker(props: CodePickerProps) {

    const { label, onCode2Ready, candidates } = props;

    const [candidatePk, setCandidatePk] = useState(-1);

    const [doneReading, setDoneReading] = useState(false);

    function processCode2(file: File | null) {

        if (file == null) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            console.log(e.target?.result);
            const code2 = e.target?.result;
            if (code2 != null) {
                try {
                    const tct = loadDataFromFile(code2);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onCode2Ready(tct.exportToOseg(candidatePk) as Record<string, any>);
                    setDoneReading(true);
                }
                catch(e) {
                    console.error(e);
                }
            }
        };

        reader.readAsText(file);
    }

    if(candidates.length == 0) {
        return <div>Upload a Code 1 first</div>
    }

    if (doneReading) {
        return <div>
            {candidates.filter(x => x.pk == candidatePk)[0].fullName} code 2 uploaded
        </div>;
    }

    return (
        <div>
            <label>Candidate this Code 2: </label>
            <select value={candidatePk} onChange={(e) => setCandidatePk(Number(e.target.value))}>
                <option value={-1}>Not Selected</option>
                {candidates.map((x) => <option key={x.pk} value={x.pk}>{x.fullName}</option>)}
            </select>
            <br></br>
            <label>{label}: </label>
            <input disabled={candidatePk == -1} type="file" onChange={(e) => processCode2(e.target.files != null && e.target.files.length > 0 ? e.target.files[0] : null)}></input>
        </div>
    );
}

export default CodePicker;