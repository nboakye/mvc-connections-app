const {v4: uuidv4} = require('uuid');

const connections = [
    {
        id: '1',
        title: 'Anyone want to learn piano?',
        category: 'learn',
        details: 'I\'m fairly good at piano and would like to teach anyone who is willing to learn. ' +
        'We can meet at cone and use the piano there for quick lessons for everyone. Obviously,' +
        ' nothing too professional.',
        date: '2021-09-17',
        start: '05:15',
        end: '06:30',
        host: 'Jayden Whitley',
        image: 'https://cdn.pixabay.com/photo/2018/06/29/01/47/piano-3505109_960_720.jpg',
        location: 'Cone Center Lobby',
        postedTime: new Date().toString()
    },
    {
        id: '2',
        title: 'Let\'s learn violin',
        category: 'learn',
        details: 'I just started learning piano and I would like to practice it with someone else who is learning.',
        date: '2021-10-18',
        start: '01:00',
        end: '03:00',
        host: 'Fredrick Juarez',
        image: 'https://cdn.pixabay.com/photo/2014/06/21/20/09/violin-374096_960_720.jpg',
        location: 'Belk Theather Room 101',
        postedTime: new Date().toString()
    },
    {
        id: '3',
        title: 'Singing Practice',
        category: 'learn',
        details: 'I would like to meet up with other singers so we can practice and learn from each other',
        date: '2021-10-21',
        start: '07:00',
        end: '08:30',
        host: 'Chester Vang',
        image: 'https://cdn.pixabay.com/photo/2017/11/12/08/43/audio-2941753_960_720.jpg',
        location: 'Robinson Hall Room B42',
        postedTime: new Date().toString()
    },
    {
        id: '4',
        title: 'Yooo, listening party for CLB?',
        category: 'listenrecord',
        details: 'Listening to all the tracks on Drake new albumm Certified Lover Boy',
        date: '2021-10-16',
        start: '05:15',
        end: '08:00',
        host: 'Mariella Barr',
        image: 'https://pbs.twimg.com/media/E-C8higWQAUIH07?format=jpg&name=small',
        location: 'Student Union Room 205',
        postedTime: new Date().toString()
    },
    {
        id: '5',
        title: 'Anyone wanna listen to Kanye West?',
        category: 'listenrecord',
        details: 'Just an listening party for Kanye West music',
        date: '2021-10-16',
        start: '03:30',
        end: '06:00',
        host: 'Aleena Reid',
        image: 'https://cdn.pixabay.com/photo/2016/09/04/23/31/music-1645561_960_720.jpg',
        location: 'Student Union Room 210',
        postedTime: new Date().toString()
    },
    {
        id: '6',
        title: 'Get together and record a song?',
        category: 'listenrecord',
        details: 'I would like to record a song. I\'ve rented out a studio at the university so anyone who can help produce songs ' +
        'come and we can make something happen!',
        date: '2021-10-15',
        start: '01:00',
        end: '06:30',
        host: 'Safiyah Suarez',
        image: 'https://cdn.pixabay.com/photo/2015/12/27/05/48/turntable-1109588_960_720.jpg',
        location: 'Robinson Hall Studio',
        postedTime: new Date().toString()
    }
];

exports.findAll = () => connections;

exports.findById = id => {
    return connections.find(connection => connection.id === id);
} 

exports.add = (connection) => {
    connection.id = uuidv4();
    connection.postedTime = new Date().toString();
    connections.push(connection);
};

exports.updateById = (id, newInfo) => {
    let connection = connections.find(connection => connection.id === id);
    if (connection) {
        connection.title = newInfo.title;
        connection.category = newInfo.category;
        connection.details = newInfo.details;
        connection.date = newInfo.date;
        connection.start = newInfo.start;
        connection.end = newInfo.end;
        connection.host = newInfo.host;
        connection.image = newInfo.image;
        connection.location = newInfo.location;
        return true;
    }
    else {
        return false;
    }
}

exports.deleteById = id => {
    let connectionI = connections.findIndex(connection => connection.id === id);
    if (connectionI !== -1) {
        connections.splice(connectionI, 1);
        return true;
    }
    else {
        return false;
    }
}