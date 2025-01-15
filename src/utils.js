function loadCode1(code1Text) {
    let campaignTrail_temp = {};
    let e = campaignTrail_temp;
    let nct_stuff = { themes : {} };
    let jet_data = {};
    let RecReading = "";
    let quotes = [];
    let customquote = "";
    let corrr = "";

    try {
        eval(code1Text);
        return campaignTrail_temp;
    }
    catch(e) {
        console.error(e)
        return null;
    }
}

export { loadCode1 }