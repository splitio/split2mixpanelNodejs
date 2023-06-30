const axios = require('axios').default;
const base64js = require('base64-js')
const { URLSearchParams } = require('url');

exports.handler = async(event) => {
    // console.log(event);
    const encodedMixpanelToken = event["queryStringParameters"].m;
    const mixpanelSecret = Buffer.from(base64js.toByteArray(encodedMixpanelToken)).toString().trim();

    const body = JSON.parse(event.body);
    let events = [];
    for (const impression of body) {
        let event = {
            event: '$experiment_started',
            properties: {
                "Experiment name": impression.split,
                "Variant name": impression.treatment,
                "$source": 'Split',
                split: impression.split,
                distinct_id: impression.key,
                token: mixpanelSecret,
                time: Math.trunc(parseInt(impression.time) / 1000),
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

    let counter = 0;
    let batchSize = 200;
    while(counter < events.length) {
        
        const batch = events.slice(counter, counter+batchSize < events.length ? counter + batchSize : events.length);
        counter = counter + batchSize;
        
        const encodedParams = new URLSearchParams();
        const mixpanelBody = JSON.stringify(batch);
        encodedParams.set('data', mixpanelBody);
    
        await axios.post('http://api.mixpanel.com/track?verbose=1', encodedParams, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'text/plain'
                }
            })
            .then(function(response) {
                console.log('track success');
                console.log(response.data);
            })
            .catch(function(error) {
                console.log(error);
            });
    
    }
    console.log('sent ' + events.length + ' events to MixPanel');
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

