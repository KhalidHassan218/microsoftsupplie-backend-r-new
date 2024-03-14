// require("dotenv").config()
// const express = require("express");
// const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
// const cors = require('cors');


// const app = express();
// app.use(cors())
// app.use(express.json())
// const calculateOrderAmount = (price) => {
//     return price * 100;
// };
// app.post("/create-payment-intent", async (req, res) => {
//   const { items , price  } = req.body;

//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: calculateOrderAmount(price),
//     currency: "eur",
//     automatic_payment_methods: {
//       enabled: true,
//     },
//     items,
//   });

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });



// app.get('/', (req, res) => {
    
//     res.send("welcome to microsoftsupplier website")
    
    
    
// })



// const PORT = process.env.PORT || 4242

// app.listen(PORT, () => console.log(`Node server listening on port ${PORT}`));


 
require("dotenv").config();
const express = require("express");
const stripe = require("stripe")("sk_test_51Na06XDvCe1ScO91dDsIfQdnq9oEMkZ60igWraJFBVS7hIglJPfixy5LtasIT2lDzold4pQO7TYWjVUErPmFMvFC007Keokkxl");
const cors = require("cors");
const bodyParser = require("body-parser");
const sendEmail = require("./Utils/sendEmail");
const { v4: uuidv4 } = require("uuid");
YOUR_DOMAIN="https://microsoftsupplier.com"
const app = express();
app.use(cors());
app.use(express.static('public'));

app.use(express.json());
app.use(bodyParser.json());

const calculateOrderAmount = (price) => {
    console.log(price);
  return price * 100;
};



app.get("/", (req, res) => {
  res.send("welcome to microsoftsupplier website");
});

app.post('/create-checkout-session', async (req, res) => {
const cart  = req.body.cart;
const useremail  = req.body.useremail;

const lineItems = cart?.map((product) => {
  const priceCopy = product?.parseFloat(priceWVat).toFixed(2)
console.log(priceCopy);

  return {
    price_data: {
      currency: "eur", // Adjust the currency based on your requirements
      product_data: {
        name: product.name,
        images: [product.imageUrl], // Assuming you have an imageUrl property in your product objects
      },
      unit_amount:  priceCopy * 100 // Convert price to cents
    },
    quantity: product.calculatequantity || 1, // You might have a quantity property in your product objects
  };
});


  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    customer_email:useremail,
    success_url:`${YOUR_DOMAIN}/success` ,
    cancel_url:`${YOUR_DOMAIN}?canceled=true` ,
  });

  res.status(200).send(session.url);
});



app.post("/api/sendemail", async (req, res) => {
  const { email , companyName, messages } = req.body;
try {
  const send_to = process.env.EMAIL_USER   ;
    const sent_from = process.env.EMAIL_USER      ;
    const reply_to = email;
    const subject = `Asking reagarding buying `;
    const message = `
    <p>Dear MicrosoftSupplier team </p>
    <p>Please click on reply to contact me regarding the GigaSupplier Plan:</p>
    <h5>My Email Address: </h5>
    <p>${email}</p>
    <h5>Company Name : </h5>
    <p>${companyName}</p>
    <p>${messages}</p>
       
    `;

await sendEmail(subject, message, send_to, sent_from, reply_to);
res.status(200).json({ success: true, message: "Email Sent" });
} catch (error) {
  res.status(500).json(error.message);
}
})

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => console.log(`Node server listening on port ${PORT}`));
