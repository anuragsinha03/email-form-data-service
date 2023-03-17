import express, { response } from 'express';
import nodemailer from 'nodemailer'
import cors from 'cors'
import bodyParser from 'body-parser';
import multer from 'multer'
import * as fs from 'fs'

const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const AUTH_PATH = '/api/email/';
const PORT = process.env.PORT || 5000

app.post(`${AUTH_PATH}contactus`, (req, res) => {
    const{ name, email, phone, message } = req.body;
    console.log(req.body)

    const mailoptions = {
    from: email,
    to: 'swevexhr@gmail.com',
    subject: 'New contact submission!',
    html:  `
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Message: ${message}</p>
        `,
    };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'swevexformsubmission@gmail.com',
      pass: 'nmwxvqotfzvlzbfx',
    },
  });


try {
      transporter.sendMail(mailoptions);
      res.status(200).json({"success" : true})
} catch (error) {
    res.status(400).json({error})
}

});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})
const upload = multer({storage: storage})


app.post(`${AUTH_PATH}careersapply`, upload.single('resume'), (req, res) => {
    const{ name, email, phone, jobRole } = req.body;
    const resumeData = {
                data: fs.readFileSync('uploads/' + req.file.filename),
                contentType: req.file.mimetype
            }
    const mailoptions = {
    from: email,
    to: 'swevexhr@gmail.com',
    subject: 'New career submission!',
    attachments: [
    {
      filename: req.file.filename,
      path: `data:${resumeData.contentType};base64,${resumeData.data.toString('base64')}`
    }  
  ],
    html:  `
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Job Role: ${jobRole}</p>

        `,
    };


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'swevexformsubmission@gmail.com',
      pass: 'nmwxvqotfzvlzbfx',
    },
  });


try {
      transporter.sendMail(mailoptions);
      res.status(200).json({"success" : true})
} catch (error) {
    res.status(400).json({error})
}

  fs.unlink(`uploads/${req.file.filename}`, (err)=>{
        if(err) console.log(err);
    })
});

app.listen(PORT, () => {
    console.log("SERVER IS RUNNING OK")
})