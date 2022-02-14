import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

const mailOptions = {
  from: process.env.USER,
  to: process.env.EMAIL_RECEIEVER,
  subject: "Dont't forget to code!",
  text: "Yo bro don't forget to write some code! ;) ",
}

transporter.verify((err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Server is ready to take our messages')
  }
})

const start = async () => {
  while (true) {
    const now = new Date().toLocaleString("en-US", { timeZone: 'Europe/Istanbul' })
    let millisTill10 =
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0, 0) -
      now

    if (millisTill10 < 0) {
      millisTill10 += 86400000 // it's after 10pm, try 10pm tomorrow.
    }

    const newReminder = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          transporter.sendMail(mailOptions, (err) => {
            if (err) {
              console.error(err)
            } else {
              console.log(
                'Email sent successfully!',
                new Date().toLocaleDateString('en-US')
              )
            }
          })
          resolve()
        }, millisTill10)
      })
    }
    await newReminder()
  }
}

start()
