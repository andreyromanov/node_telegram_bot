const kb = require('./keyboard-buttons')

module.exports = {
    home:[
        [kb.home.delivery, kb.home.payments],
        [kb.home.website]
    ],
    delivery:[
        [kb.delivery.np, kb.delivery.idostavka],
        [kb.back]
    ],
    payments:[]
}