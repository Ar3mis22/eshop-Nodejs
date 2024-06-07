const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');
const cors = require('cors')

const app = express();

app.use(cors())
app.options('*',cors())


const productRouter = require('./routers/productRoutes');
const categoryRouter = require('./routers/categoryRoutes');
const userRouter = require('./routers/userRoutes');

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

// Mount routers (consider adding a common prefix for API endpoints)
app.use('/product', productRouter);
app.use('/category',categoryRouter);
app.use('/user', userRouter);

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'eshop'
})
.then(() => console.log('Database connection established.'))
.catch(err => console.error(err));


//connect to server
app.listen(3000, () => console.log('Server listening on port 3000'));
