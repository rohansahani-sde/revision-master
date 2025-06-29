const express = require('express')

const cors = require('cors')

const PORT = 8000;


const app = express();
// const lessson = require('./lesson.json')
// const lessson = require('./array1.json')
const lessson = require('./recursion.json')

app.use(express.json());
app.use(cors());

app.listen(PORT , ()=> {
    console.log(`Server is running on port ${PORT}`);
})

app.get('/', (req, res) =>{
    const html = `
    <ul>
    ${lessson.map((lessson) => {
        return ` <li> <a href=${lessson.practice_que} target="_blank" > ${lessson.topic} </a> </li>`
    }).join("")
}
</ul>
    `
    res.send(html)
})

app.get('/api', (req, res) =>{
    res.json(lessson)
})

