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
    return response;
  } catch (error) {
    console.error(error);
  }
}
