function getOseg(data, oseg) {
    console.log("data is " + data)
    oseg["candidates"] = data.candidate_json.map((candidate) => {

      let issues = [];
      if(oseg["DELETE_can_issues"] && oseg["DELETE_can_issues"][candidate.pk])
      {
        issues = oseg["DELETE_can_issues"][candidate.pk]

      }

      return {
        id : candidate.pk,
        firstName: candidate.fields.first_name,
        lastName: candidate.fields.last_name,
        party: candidate.fields.party,
        homeState: candidate.fields.state,
        color: candidate.fields.color_hex,
        issueScores : issues,
        description: candidate.fields.description_as_running_mate !== "n/a" ? candidate.fields.description_as_running_mate: candidate.fields.description,
        imageUrl : candidate.fields.image_url,
        runningMateIds: [],
        startingGlobalMultiplier : 1.0
      }});

    oseg.music = [];
    oseg.credits = "by Dan Bryan, converted by Jet"
    oseg.theme.advisorImage = data.election_json[0].fields.advisor_url;
    oseg.scenarioName = data.election_json[0].fields.display_year;
    oseg.scenarioDescription = data.election_json[0].fields.summary;
    oseg.scenarioImageUrl = data.election_json[0].fields.image_url;

    delete oseg["DELETE_can_issues"]
    return oseg;
  }

  export {getOseg};