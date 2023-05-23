const axios = require('axios');

export async function getEcoCashRate(amount: number) {
  try {
    const response = await axios.post("https://api.cassavaecocash.co.za/v3/calculate/", {
        data: {
            type: "calculation_requests",
            id: null,
            attributes: {
                receive: false,
                amount: 5000
            },
            relationships: {
                receiving_country: {
                    data: {
                        type: "countries",
                        id: "203"
                    }
                },
                sending_country: {
                    data: {
                        type: "countries",
                        id: "204"
                    }
                },
                sending_currency: {
                    data: {
                        type: "currencies",
                        id: "181"
                    }
                },
                receiving_currency: {
                    data: {
                        type: "currencies",
                        id: "153"
                    }
                },
                product: {
                    data: {
                        type: "products",
                        id: "41"
                    }
                }
            }
        }
    }, {
        headers: {
            "accept": "application/vnd.api+json",
            "accept-language": "en-GB,en;q=0.5",
            "app-id": "ce187113-8dcf-48da-b9b2-c06a8c0406df",
            "content-type": "application/vnd.api+json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1"
        },
        referrer: "https://www.cassavaecocash.co.za/",
        referrerPolicy: "strict-origin-when-cross-origin",
        mode: "cors"
    });

    console.log(response.data.data);
    
    return response.data.data.attributes;
  } catch (error) {
    console.error(error);
  }
}

export async function getMamaMoneyRate() {
  const url = 'https://api.mamamoney.co.za/mamamoney/mama/api/v1/doAPICall/offline';
  const headers = {
    'authority': 'api.mamamoney.co.za',
    'accept': 'application/json',
    'accept-language': 'en-US,en;q=0.6',
    'content-type': 'application/json',
    'origin': 'https://www.mamamoney.co.za',
    'referer': 'https://www.mamamoney.co.za/',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'sec-gpc': '1',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
    'user-agent-app': 'WebsiteRequest',
    'x-device-id': 'mamamoney.co.za',
  };
  const data = {
    action: 'get_send_quote',
    amount: 5000,
    institution: 'SOM_DAHABSHIIL',
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(response.data);
    console.log('root', response.data['response-object'].quote);
    return response.data['response-object'].quote
  } catch (error) {
    console.error(error.message);
  }
}