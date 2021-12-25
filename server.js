const app = require('./app');

const PORT = 3000;

/* Start server */
app.listen(PORT, (req,res) => {
    console.log(`App on port ${PORT}`);
});