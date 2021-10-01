const axios = require('axios').default;
const base64js = require('base64-js')

exports.handler = async(event) => {

    const encodedMixpanelToken = event["queryStringParameters"].m;
    const mixpanelSecret = Buffer.from(base64js.toByteArray(encodedMixpanelToken));

    const body = JSON.parse(event.body);
    let events = [];
    for (const impression of body) {
        let event = {
            event: 'experiment_started',
            properties: {
                "Experiment name": impression.split,
                "Variant name": impression.treatment,
                "$source": 'Split',
                split: impression.split,
                distinct_id: impression.key,
                token: mixpanelSecret,
                time: parseInt(impression.time) / 1000,
                treatment: impression.treatment,
                label: impression.label,
                environmentId: impression.environmentId,
                environmentName: impression.environmentName,
                sdk: impression.sd,
                sdkVersion: impression.sdkVersion,
                splitVersionNumber: impression.splitVersionNumber
            }
        }
        events.push(event);
    }
    const mixpanelBody = JSON.stringify(events);
    const encodedBody = base64js.fromByteArray(mixpanelBody);
    const postBody = "data=" + encodedBody;
    
    await axios.post('http://api.mixpanel.com/track/', postBody, {headers: {'Content-Type': 'application.json'}})
        .then(function(response) {
            console.log('sent ' + events.length + ' events to MixPanel');
        })
        .catch(function(error) {
            console.log(error);            
        });

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

