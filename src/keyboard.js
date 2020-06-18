
module.exports = {
    home:[
        [
            {
                text: 'Кабінет',
                callback_data: 'cabinet'
            }
        ],
        [
            {
                text: 'Інформація',
                callback_data: 'info'
            },
            {
                text: 'Оператор',
                callback_data: 'operator'
            }
        ],
        [
            {
                text: 'ua-tao.com',
                url: 'https://ua-tao.com'
            }
        ]
    ],
    info:[
        [
            {
                text: 'Доставка',
                callback_data: 'delivery'
            },
            {
                text: 'Оплата',
                callback_data: 'payment'
            }
        ],
        [
            {
                text: 'Назад',
                callback_data: 'home'
            }
        ]
    ],
    delivery:[
        [
            {
                text: 'NOVA',
                callback_data: 'delivery_nova'
            },
            {
                text: 'Idostavka',
                callback_data: 'idostavka'
            }
        ],
        [
            {
                text: 'Назад',
                callback_data: 'home'
            }
        ]
    ],
    delivery_back:[
        [
            {
                text: 'Назад',
                callback_data: 'delivery'
            }
        ]
    ],
    payment:[
        [
            {
                text: 'Назад',
                callback_data: 'home'
            }
        ]
    ],
    cabinet:[
        [
            {
                text: 'Назад',
                callback_data: 'home'
            }
        ]
    ],
    operator:[
    [
        {
            text: 'Назад',
            callback_data: 'home'
        }
    ]
],
}