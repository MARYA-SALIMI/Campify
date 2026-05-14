const path = require('path');
const app = require(path.join(__dirname, '..', 'index'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda calisiyor`));
