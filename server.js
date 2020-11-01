const { dhis2 } = require('./dhis2');
const { constants } = require('./constants/DE');
const { EVENTS } = require('./data.js');
const fs = require('fs');

const run = async () => {

    for (let index = 0; index < EVENTS.length; index++) {
        const date = new Date();
        try {
            // Get event for uid
            const event = await dhis2.get(`/events/${EVENTS[index]}.json`);
            // Check if not already classed

            const contentClassification = event.data.dataValues.filter(e => e.dataElement === constants.CLASSIFICATION_DE);

            if (contentClassification && contentClassification.length === 0) { // NON CLASSE

                let resultTest = event.data.dataValues.filter(e => e.dataElement === constants.PCR_RESULTAT_DE); // PCR
                let resultTraitement = {};
                if (resultTest && resultTest.length > 0) {
                    resultTraitement = traitement(resultTest[0]);
                } else {
                    resultTest = event.data.dataValues.filter(e => e.dataElement === constants.TDR_RESULTAT_DE); // TDR
                    resultTraitement = traitement(resultTest[0]);
                }

                if (resultTraitement) {
                    event.data.dataValues.push(resultTraitement);
                    await dhis2.put(`/events/${EVENTS[index]}`, JSON.stringify(event.data));

                    fs.writeFile(`./logs/logs_${date.getFullYear()}${date.getMonth()}${date.getDate()}.log`, `${EVENTS[index]} OK\n`, { flag: 'a+' }, err => { })

                } else {
                    fs.writeFile(`./logs/logs_${date.getFullYear()}${date.getMonth()}${date.getDate()}.log`, `${EVENTS[index]} NOT OK\n`, { flag: 'a+' }, err => { })
                }

            } else {
                fs.writeFile(`./logs/logs_${date.getFullYear()}${date.getMonth()}${date.getDate()}.log`, `${EVENTS[index]} ALREADY CLASSED\n`, { flag: 'a+' }, err => { })
            }
        } catch (error) {
            fs.writeFile(`./logs/logs_${date.getFullYear()}${date.getMonth()}${date.getDate()}.log` `${EVENTS[index]} NOT OK\n`, { flag: 'a+' }, err => { })
            console.log(error)
        }

    }


    console.log("END");
    process.exit(0)
}

run();

const traitement = (result) => {

    let classification = ''
    if (result) {

        if (result.value === constants.PCR_NEGATIF || result.value === constants.TDR_NEGATIF) {
            classification = constants.NON_CAS;
        } else if (result.value === constants.PCR_POSITIF || result.value === constants.TDR_POSITIF) {
            classification = constants.CONFIRME_LABORATOIRE;
        }

        return {
            created: "2020-10-28T15:15:32.379",
            value: classification,
            dataElement: constants.CLASSIFICATION_DE,
            providedElsewhere: false,
            storedBy: 'didate'
        }

    }
    return null;
}

