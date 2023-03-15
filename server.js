import express, { response } from 'express';
import nodemailer from 'nodemailer'
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.json())

const AUTH_PATH = '/api/email/';
const PORT = process.env.PORT || 5000

app.post(`${AUTH_PATH}contactus`, (req, res) => {
    const{ name, email, phone, message } = req.body;
    console.log(email)

      const mailoptions = {
    from: email,
    to: 'pratikrajgupta23@gmail.com',
    subject: 'New contact submission!',
    html:  `
            <h1> YOUR MESSAGE IS:</h1>
            <p>${message}</p>
            <p>Email received from : ${email} </p>
        `,
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'anuragsinhadeveloper@gmail.com',
      pass: 'jfsticcyypysyzte',
    },
  });


try {
      transporter.sendMail(mailoptions);
      res.status(200).json({"success" : true})
} catch (error) {
    res.status(400).json({error})
}

});
    

app.listen(PORT, () => {
    console.log("SERVER IS RUNNING OK")
})